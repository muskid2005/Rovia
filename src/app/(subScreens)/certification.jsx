import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { deleteRequest } from '../../api/deleteRequests';
import { getRequest } from '../../api/getRequests';
import { postRequest } from '../../api/postRequests';
import { putRequest } from '../../api/putRequests';
import CustomModal from '../../components/customModal';
import CustomSafeArea from '../../components/safeArea';

export default function CertificationsScreen() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');

  // Custom Feedback Modal States
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const showFeedback = (title, message) => {
    setFeedbackTitle(title);
    setFeedbackMessage(message);
    setFeedbackVisible(true);
  };

  // Fetch Certifications
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function fetchCertifications() {
        setLoading(true);
        try {
          const response = await getRequest('/profile/certifications');
          const data = response?.data?.certifications || response?.data || response || [];
          if (isMounted) {
            setCertifications(Array.isArray(data) ? data : []);
          }
        } catch (error) {
          console.error('Failed to fetch certifications:', error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Could not load certifications.';
          showFeedback('Error', errorMessage);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }

      fetchCertifications();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  const handleOpenAddModal = () => {
    setEditingId(null);
    setName('');
    setIssuer('');
    setIssueDate('');
    setExpiryDate('');
    setCredentialId('');
    setCredentialUrl('');
    setModalVisible(true);
  };

  const handleOpenEditModal = (cert) => {
    setEditingId(cert.id);
    setName(cert.name || '');
    setIssuer(cert.issuer || '');
    setIssueDate(cert.issueDate ? cert.issueDate.split('T')[0] : '');
    setExpiryDate(cert.expiryDate ? cert.expiryDate.split('T')[0] : '');
    setCredentialId(cert.credentialId || '');
    setCredentialUrl(cert.credentialUrl || '');
    setModalVisible(true);
  };

  const handleSaveCertification = async () => {
    if (!name.trim() || !issuer.trim()) {
      showFeedback('Validation Error', 'Certification name and issuer are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        issuer,
        issueDate: issueDate || null,
        expiryDate: expiryDate || null,
        credentialId,
        credentialUrl,
      };

      if (editingId) {
        // PUT /profile/certifications/{id}[cite: 9]
        await putRequest(`/profile/certifications/${editingId}`, payload);
        showFeedback('Success', 'Certification updated successfully!');
      } else {
        // POST /profile/certifications[cite: 8]
        await postRequest('/profile/certifications', payload);
        showFeedback('Success', 'Certification added successfully!');
      }

      setModalVisible(false);

      // Refresh list
      const response = await getRequest('/profile/certifications');
      const data = response?.data?.certifications || response?.data || response || [];
      setCertifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to save certification:', error?.response?.data || error?.message || error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Could not save certification.';
      showFeedback('Error', `${errorMessage} \n ensure you've filled all form scroll to check`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCertification = async (id) => {
    try {
      await deleteRequest(`/profile/certifications/${id}`);
      setCertifications((prev) => prev.filter((item) => item.id !== id));
      showFeedback('Success', 'Certification deleted successfully.');
    } catch (error) {
      console.error('Failed to delete certification:', error?.response?.data || error?.message || error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Could not delete certification.';
      showFeedback('Error', errorMessage);
    }
  };

  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="chevron-left" size={24} color="#16A34A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Certifications</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleOpenAddModal}>
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitleText}>
          Add your professional certifications to strengthen your profile credentials.
        </Text>

        {/* Loading Skeletons */}
        {loading ? (
          [1, 2, 3].map((_, index) => (
            <View key={index} style={styles.skeletonCard} />
          ))
        ) : certifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No certifications added yet.</Text>
            <TouchableOpacity style={styles.emptyAddButton} onPress={handleOpenAddModal}>
              <Text style={styles.emptyAddButtonText}>Add Your First Certification</Text>
            </TouchableOpacity>
          </View>
        ) : (
          certifications.map((cert) => (
            <View key={cert.id} style={styles.certCard}>
              <View style={styles.certHeaderRow}>
                <Text style={styles.certName}>{cert.name}</Text>
                <View style={styles.actionRow}>
                  <TouchableOpacity onPress={() => handleOpenEditModal(cert)} style={styles.iconButton}>
                    <Feather name="edit-2" size={16} color="#16A34A" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteCertification(cert.id)} style={styles.iconButton}>
                    <Feather name="trash-2" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.issuerText}>{cert.issuer}</Text>

              {cert.issueDate && (
                <View style={styles.detailsRow}>
                  <Text style={styles.detailLabel}>Issued:</Text>
                  <Text style={styles.detailValue}>{cert.issueDate.split('T')[0]}</Text>
                </View>
              )}

              {cert.credentialId && (
                <View style={styles.detailsRow}>
                  <Text style={styles.detailLabel}>ID:</Text>
                  <Text style={styles.detailValue}>{cert.credentialId}</Text>
                </View>
              )}
            </View>
          ))
        )}

      </ScrollView>

      {/* Add / Edit Certification Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit Certification' : 'Add Certification'}</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
              <Text style={styles.inputLabel}>Certification Name *</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="e.g. AWS Certified Solutions Architect"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.inputLabel}>Issuer *</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="e.g. Amazon Web Services"
                placeholderTextColor="#9CA3AF"
                value={issuer}
                onChangeText={setIssuer}
              />

              <Text style={styles.inputLabel}>Issue Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="e.g. 2024-01-15"
                placeholderTextColor="#9CA3AF"
                value={issueDate}
                onChangeText={setIssueDate}
              />

              <Text style={styles.inputLabel}>Expiry Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="e.g. 2027-01-15"
                placeholderTextColor="#9CA3AF"
                value={expiryDate}
                onChangeText={setExpiryDate}
              />

              <Text style={styles.inputLabel}>Credential ID</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="e.g. AWS-SAA-2024-12345"
                placeholderTextColor="#9CA3AF"
                value={credentialId}
                onChangeText={setCredentialId}
              />

              <Text style={styles.inputLabel}>Credential URL</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="e.g. https://aws.amazon.com/verification"
                placeholderTextColor="#9CA3AF"
                value={credentialUrl}
                onChangeText={setCredentialUrl}
              />
            </ScrollView>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
                disabled={submitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveModalButton, submitting && styles.disabledButton]}
                onPress={handleSaveCertification}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveModalButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reusable Custom Modal */}
      <CustomModal
        visible={feedbackVisible}
        title={feedbackTitle}
        message={feedbackMessage}
        onClose={() => setFeedbackVisible(false)}
      />
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'semiBold',
    color: '#111827',
  },
  backButton: {
    padding: 4,
  },
  addButton: {
    backgroundColor: '#16A34A',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitleText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  certCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  certHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  certName: {
    fontSize: 16,
    fontFamily: 'semiBold',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  issuerText: {
    fontSize: 13,
    fontFamily: 'semiBold',
    color: '#16A34A',
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'semiBold',
    color: '#4B5563',
    width: 50,
  },
  detailValue: {
    fontSize: 12,
    fontFamily: 'regular',
    color: '#6B7280',
    flex: 1,
  },
  skeletonCard: {
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  emptyAddButton: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyAddButtonText: {
    color: '#FFFFFF',
    fontFamily: 'semiBold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 380,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: 'semiBold',
    color: '#374151',
    marginBottom: 6,
  },
  inputBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'regular',
    color: '#111827',
    marginBottom: 14,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4B5563',
    fontFamily: 'semiBold',
    fontSize: 15,
  },
  saveModalButton: {
    flex: 1,
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveModalButtonText: {
    color: '#FFFFFF',
    fontFamily: 'semiBold',
    fontSize: 15,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
});