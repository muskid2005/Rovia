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

export default function ExperienceScreen() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [type, setType] = useState('WORK');
  const [organisation, setOrganisation] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);

  // Custom Feedback Modal States
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const showFeedback = (title, message) => {
    setFeedbackTitle(title);
    setFeedbackMessage(message);
    setFeedbackVisible(true);
  };

  // Fetch Experience Records
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function fetchExperiences() {
        setLoading(true);
        try {
          const response = await getRequest('/profile/experience');
          const data = response?.data?.experiences || response?.data || response || [];
          if (isMounted) {
            setExperiences(Array.isArray(data) ? data : []);
          }
        } catch (error) {
          console.error('Failed to fetch experiences:', error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Could not load experience records.';
          showFeedback('Error', errorMessage);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }

      fetchExperiences();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  const handleOpenAddModal = () => {
    setEditingId(null);
    setType('WORK');
    setOrganisation('');
    setTitle('');
    setDescription('');
    setLocation('');
    setCountry('');
    setStartDate('');
    setEndDate('');
    setIsCurrent(false);
    setModalVisible(true);
  };

  const handleOpenEditModal = (exp) => {
    setEditingId(exp.id);
    setType(exp.type || 'WORK');
    setOrganisation(exp.organisation || '');
    setTitle(exp.title || '');
    setDescription(exp.description || '');
    setLocation(exp.location || '');
    setCountry(exp.country || '');
    setStartDate(exp.startDate ? exp.startDate.split('T')[0] : '');
    setEndDate(exp.endDate ? exp.endDate.split('T')[0] : '');
    setIsCurrent(!!exp.isCurrent);
    setModalVisible(true);
  };

  const handleSaveExperience = async () => {
    if (!title.trim() || !organisation.trim()) {
      showFeedback('Validation Error', 'Job title and organisation are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        type,
        organisation,
        title,
        description,
        location,
        country,
        startDate: startDate || null,
        endDate: isCurrent ? null : (endDate || null),
        isCurrent,
      };

      if (editingId) {
        // PUT /profile/experience/{id}[cite: 14]
        await putRequest(`/profile/experience/${editingId}`, payload);
        showFeedback('Success', 'Experience record updated successfully!');
      } else {
        // POST /profile/experience[cite: 13]
        await postRequest('/profile/experience', payload);
        showFeedback('Success', 'Experience record added successfully!');
      }

      setModalVisible(false);

      // Refresh list
      const response = await getRequest('/profile/experience');
      const data = response?.data?.experiences || response?.data || response || [];
      setExperiences(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to save experience:', error?.response?.data || error?.message || error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Could not save experience record.';
      showFeedback('Error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExperience = async (id) => {
    try {
      await deleteRequest(`/profile/experience/${id}`);
      setExperiences((prev) => prev.filter((item) => item.id !== id));
      showFeedback('Success', 'Experience record deleted successfully.');
    } catch (error) {
      console.error('Failed to delete experience:', error?.response?.data || error?.message || error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Could not delete experience record.';
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
          <Text style={styles.headerTitle}>Experience</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleOpenAddModal}>
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitleText}>
          Add your work history, internships, or projects to showcase your background.
        </Text>

        {/* Loading Skeletons */}
        {loading ? (
          [1, 2, 3].map((_, index) => (
            <View key={index} style={styles.skeletonCard} />
          ))
        ) : experiences.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No experience records added yet.</Text>
            <TouchableOpacity style={styles.emptyAddButton} onPress={handleOpenAddModal}>
              <Text style={styles.emptyAddButtonText}>Add Your Experience</Text>
            </TouchableOpacity>
          </View>
        ) : (
          experiences.map((exp) => (
            <View key={exp.id} style={styles.expCard}>
              <View style={styles.expHeaderRow}>
                <Text style={styles.titleText}>{exp.title}</Text>
                <View style={styles.actionRow}>
                  <TouchableOpacity onPress={() => handleOpenEditModal(exp)} style={styles.iconButton}>
                    <Feather name="edit-2" size={16} color="#16A34A" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteExperience(exp.id)} style={styles.iconButton}>
                    <Feather name="trash-2" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.orgText}>{exp.organisation} {exp.type ? `• ${exp.type}` : ''}</Text>

              {exp.description && (
                <Text style={styles.descText} numberOfLines={2}>
                  {exp.description}
                </Text>
              )}

              {exp.startDate && (
                <View style={styles.detailsRow}>
                  <Text style={styles.detailLabel}>Period:</Text>
                  <Text style={styles.detailValue}>
                    {exp.startDate.split('T')[0]} - {exp.isCurrent ? 'Present' : (exp.endDate ? exp.endDate.split('T')[0] : 'N/A')}
                  </Text>
                </View>
              )}

              {exp.location && (
                <View style={styles.detailsRow}>
                  <Text style={styles.detailLabel}>Location:</Text>
                  <Text style={styles.detailValue}>
                    {exp.location}{exp.country ? `, ${exp.country}` : ''}
                  </Text>
                </View>
              )}
            </View>
          ))
        )}

      </ScrollView>

      {/* Add / Edit Experience Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit Experience' : 'Add Experience'}</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
              <Text style={styles.inputLabel}>Job Title *</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="e.g. Backend Engineer"
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
              />

              <Text style={styles.inputLabel}>Organisation / Company *</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="e.g. Rovia Technologies"
                placeholderTextColor="#9CA3AF"
                value={organisation}
                onChangeText={setOrganisation}
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.inputBox, styles.textAreaBox]}
                placeholder="Built scalable APIs..."
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
              />

              <Text style={styles.inputLabel}>Location (City)</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="e.g. Lagos"
                placeholderTextColor="#9CA3AF"
                value={location}
                onChangeText={setLocation}
              />

              <Text style={styles.inputLabel}>Country</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="e.g. Nigeria"
                placeholderTextColor="#9CA3AF"
                value={country}
                onChangeText={setCountry}
              />

              <Text style={styles.inputLabel}>Start Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="e.g. 2023-01-15"
                placeholderTextColor="#9CA3AF"
                value={startDate}
                onChangeText={setStartDate}
              />

              {!isCurrent && (
                <>
                  <Text style={styles.inputLabel}>End Date (YYYY-MM-DD)</Text>
                  <TextInput
                    style={styles.inputBox}
                    placeholder="e.g. 2024-12-31"
                    placeholderTextColor="#9CA3AF"
                    value={endDate}
                    onChangeText={setEndDate}
                  />
                </>
              )}

              <TouchableOpacity 
                style={styles.checkboxRow} 
                onPress={() => setIsCurrent(!isCurrent)}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name={isCurrent ? 'checkbox' : 'square-outline'} 
                  size={20} 
                  color="#16A34A" 
                />
                <Text style={styles.checkboxLabel}>I currently work here</Text>
              </TouchableOpacity>
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
                onPress={handleSaveExperience}
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
  expCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  expHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  titleText: {
    fontSize: 16,
    fontFamily: 'semiBold',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  orgText: {
    fontSize: 13,
    fontFamily: 'semiBold',
    color: '#16A34A',
    marginBottom: 6,
  },
  descText: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#4B5563',
    marginBottom: 8,
    lineHeight: 18,
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
    height: 110,
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
  textAreaBox: {
    height: 80,
    paddingTop: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: '#374151',
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