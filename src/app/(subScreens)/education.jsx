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

export default function EducationScreen() {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [institution, setInstitution] = useState('');
  const [qualification, setQualification] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [country, setCountry] = useState('');

  // Custom Feedback Modal States
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const showFeedback = (title, message) => {
    setFeedbackTitle(title);
    setFeedbackMessage(message);
    setFeedbackVisible(true);
  };

  // Fetch Education Records
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function fetchEducation() {
        setLoading(true);
        try {
          const response = await getRequest('/profile/education');
          const data = response?.data?.education || response?.data || response || [];
          if (isMounted) {
            setEducationList(Array.isArray(data) ? data : []);
          }
        } catch (error) {
          console.error('Failed to fetch education:', error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Could not load education records.';
          showFeedback('Error', errorMessage);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }

      fetchEducation();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  const handleOpenAddModal = () => {
    setEditingId(null);
    setInstitution('');
    setQualification('');
    setFieldOfStudy('');
    setStartDate('');
    setEndDate('');
    setCountry('');
    setModalVisible(true);
  };

  const handleOpenEditModal = (edu) => {
    setEditingId(edu.id);
    setInstitution(edu.institution || '');
    setQualification(edu.qualification || '');
    setFieldOfStudy(edu.fieldOfStudy || '');
    setStartDate(edu.startDate ? edu.startDate.split('T')[0] : '');
    setEndDate(edu.endDate ? edu.endDate.split('T')[0] : '');
    setCountry(edu.country || '');
    setModalVisible(true);
  };

  const handleSaveEducation = async () => {
    if (!institution.trim() || !qualification.trim()) {
      showFeedback('Validation Error', 'Institution and qualification are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        institution,
        qualification,
        fieldOfStudy,
        startDate: startDate || null,
        endDate: endDate || null,
        country,
      };

      if (editingId) {
        // PUT /profile/education/{id}
        await putRequest(`/profile/education/${editingId}`, payload);
        showFeedback('Success', 'Education record updated successfully!');
      } else {
        // POST /profile/education
        await postRequest('/profile/education', payload);
        showFeedback('Success', 'Education record added successfully!');
      }

      setModalVisible(false);

      // Refresh list
      const response = await getRequest('/profile/education');
      const data = response?.data?.education || response?.data || response || [];
      setEducationList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to save education:', error?.response?.data || error?.message || error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Could not save education record.';
      showFeedback('Error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEducation = async (id) => {
    try {
      await deleteRequest(`/profile/education/${id}`);
      setEducationList((prev) => prev.filter((item) => item.id !== id));
      showFeedback('Success', 'Education record deleted successfully.');
    } catch (error) {
      console.error('Failed to delete education:', error?.response?.data || error?.message || error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Could not delete education record.';
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
          <Text style={styles.headerTitle}>Education</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleOpenAddModal}>
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitleText}>
          Add your educational background to complete your profile readiness.
        </Text>

        {/* Loading Skeletons */}
        {loading ? (
          [1, 2, 3].map((_, index) => (
            <View key={index} style={styles.skeletonCard} />
          ))
        ) : educationList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No education records added yet.</Text>
            <TouchableOpacity style={styles.emptyAddButton} onPress={handleOpenAddModal}>
              <Text style={styles.emptyAddButtonText}>Add Your Education</Text>
            </TouchableOpacity>
          </View>
        ) : (
          educationList.map((edu) => (
            <View key={edu.id} style={styles.eduCard}>
              <View style={styles.eduHeaderRow}>
                <Text style={styles.qualificationText}>{edu.qualification}</Text>
                <View style={styles.actionRow}>
                  <TouchableOpacity onPress={() => handleOpenEditModal(edu)} style={styles.iconButton}>
                    <Feather name="edit-2" size={16} color="#16A34A" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteEducation(edu.id)} style={styles.iconButton}>
                    <Feather name="trash-2" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.institutionText}>{edu.institution}</Text>

              {edu.fieldOfStudy && (
                <View style={styles.detailsRow}>
                  <Text style={styles.detailLabel}>Field:</Text>
                  <Text style={styles.detailValue}>{edu.fieldOfStudy}</Text>
                </View>
              )}

              {edu.startDate && (
                <View style={styles.detailsRow}>
                  <Text style={styles.detailLabel}>Period:</Text>
                  <Text style={styles.detailValue}>
                    {edu.startDate.split('T')[0]} - {edu.endDate ? edu.endDate.split('T')[0] : 'Present'}
                  </Text>
                </View>
              )}

              {edu.country && (
                <View style={styles.detailsRow}>
                  <Text style={styles.detailLabel}>Country:</Text>
                  <Text style={styles.detailValue}>{edu.country}</Text>
                </View>
              )}
            </View>
          ))
        )}

      </ScrollView>

      {/* Add / Edit Education Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit Education' : 'Add Education'}</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
              <Text style={styles.inputLabel}>Institution *</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="e.g. University of Lagos"
                placeholderTextColor="#9CA3AF"
                value={institution}
                onChangeText={setInstitution}
              />

              <Text style={styles.inputLabel}>Qualification / Degree *</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="e.g. B.Sc Computer Science"
                placeholderTextColor="#9CA3AF"
                value={qualification}
                onChangeText={setQualification}
              />

              <Text style={styles.inputLabel}>Field of Study</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="e.g. Computer Science"
                placeholderTextColor="#9CA3AF"
                value={fieldOfStudy}
                onChangeText={setFieldOfStudy}
              />

              <Text style={styles.inputLabel}>Start Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="e.g. 2018-09-01"
                placeholderTextColor="#9CA3AF"
                value={startDate}
                onChangeText={setStartDate}
              />

              <Text style={styles.inputLabel}>End Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="e.g. 2022-06-30"
                placeholderTextColor="#9CA3AF"
                value={endDate}
                onChangeText={setEndDate}
              />

              <Text style={styles.inputLabel}>Country</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="e.g. Nigeria"
                placeholderTextColor="#9CA3AF"
                value={country}
                onChangeText={setCountry}
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
                onPress={handleSaveEducation}
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
  eduCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  eduHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  qualificationText: {
    fontSize: 16,
    fontFamily: 'semiBold',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  institutionText: {
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
    width: 60,
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