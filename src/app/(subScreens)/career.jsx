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

export default function CareerGoalsScreen() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [goalType, setGoalType] = useState('Short-term');
  const [targetIndustry, setTargetIndustry] = useState('');
  const [targetLocation, setTargetLocation] = useState('');
  const [priority, setPriority] = useState('HIGH');
  const [status, setStatus] = useState('ACTIVE');

  // Custom Feedback Modal States
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const showFeedback = (title, message) => {
    setFeedbackTitle(title);
    setFeedbackMessage(message);
    setFeedbackVisible(true);
  };

  // Fetch Career Goals
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function fetchGoals() {
        setLoading(true);
        try {
          const response = await getRequest('/goals');
          const data = response?.data?.goals || response?.data || response || [];
          if (isMounted) {
            setGoals(Array.isArray(data) ? data : []);
          }
        } catch (error) {
          console.error('Failed to fetch career goals:', error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Could not load career goals.';
          showFeedback('Error', errorMessage);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }

      fetchGoals();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  const handleOpenAddModal = () => {
    setEditingId(null);
    setTargetRole('');
    setGoalType('Short-term');
    setTargetIndustry('');
    setTargetLocation('');
    setPriority('HIGH');
    setStatus('ACTIVE');
    setModalVisible(true);
  };

  const handleOpenEditModal = (goal) => {
    setEditingId(goal.id);
    setTargetRole(goal.targetRole || '');
    setGoalType(goal.goalType || 'Short-term');
    setTargetIndustry(goal.targetIndustry || '');
    setTargetLocation(goal.targetLocation || '');
    setPriority(goal.priority || 'HIGH');
    setStatus(goal.status || 'ACTIVE');
    setModalVisible(true);
  };

  const handleSaveGoal = async () => {
    if (!targetRole.trim()) {
      showFeedback('Validation Error', 'Target role is required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        targetRole,
        goalType,
        targetIndustry,
        targetLocation,
        priority,
        status,
      };

      if (editingId) {
        // PUT /goals/{id}
        await putRequest(`/goals/${editingId}`, payload);
        showFeedback('Success', 'Career goal updated successfully!');
      } else {
        // POST /goals
        await postRequest('/goals', payload);
        showFeedback('Success', 'Career goal added successfully!');
      }

      setModalVisible(false);

      // Refresh list
      const response = await getRequest('/goals');
      const data = response?.data?.goals || response?.data || response || [];
      setGoals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to save career goal:', error?.response?.data || error?.message || error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Could not save career goal.';
      showFeedback('Error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await deleteRequest(`/goals/${id}`);
      setGoals((prev) => prev.filter((item) => item.id !== id));
      showFeedback('Success', 'Career goal deleted successfully.');
    } catch (error) {
      console.error('Failed to delete career goal:', error?.response?.data || error?.message || error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Could not delete career goal.';
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
          <Text style={styles.headerTitle}>Career Goals</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleOpenAddModal}>
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitleText}>
          Define your target roles, industries, and locations to guide your career path.
        </Text>

        {/* Loading Skeletons */}
        {loading ? (
          [1, 2, 3].map((_, index) => (
            <View key={index} style={styles.skeletonCard} />
          ))
        ) : goals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No career goals added yet.</Text>
            <TouchableOpacity style={styles.emptyAddButton} onPress={handleOpenAddModal}>
              <Text style={styles.emptyAddButtonText}>Add Your First Goal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          goals.map((goal) => (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeaderRow}>
                <Text style={styles.goalTitle}>{goal.targetRole}</Text>
                <View style={styles.actionRow}>
                  <TouchableOpacity onPress={() => handleOpenEditModal(goal)} style={styles.iconButton}>
                    <Feather name="edit-2" size={16} color="#16A34A" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteGoal(goal.id)} style={styles.iconButton}>
                    <Feather name="trash-2" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.detailsRow}>
                <Text style={styles.detailLabel}>Industry:</Text>
                <Text style={styles.detailValue}>{goal.targetIndustry || 'N/A'}</Text>
              </View>

              <View style={styles.detailsRow}>
                <Text style={styles.detailLabel}>Location:</Text>
                <Text style={styles.detailValue}>{goal.targetLocation || 'N/A'}</Text>
              </View>

              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{goal.goalType || 'Goal'}</Text>
                </View>
                <View style={[styles.badge, goal.priority === 'HIGH' ? styles.highPriority : styles.medPriority]}>
                  <Text style={[styles.badgeText, goal.priority === 'HIGH' ? styles.highPriorityText : styles.medPriorityText]}>
                    {goal.priority} Priority
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}

      </ScrollView>

      {/* Add / Edit Goal Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit Career Goal' : 'Add Career Goal'}</Text>

            <Text style={styles.inputLabel}>Target Role *</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="e.g. Senior Backend Architect"
              placeholderTextColor="#9CA3AF"
              value={targetRole}
              onChangeText={setTargetRole}
            />

            <Text style={styles.inputLabel}>Target Industry</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="e.g. Fintech"
              placeholderTextColor="#9CA3AF"
              value={targetIndustry}
              onChangeText={setTargetIndustry}
            />

            <Text style={styles.inputLabel}>Target Location</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="e.g. Remote / London"
              placeholderTextColor="#9CA3AF"
              value={targetLocation}
              onChangeText={setTargetLocation}
            />

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
                onPress={handleSaveGoal}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveModalButtonText}>Save Goal</Text>
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
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  goalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontFamily: 'semiBold',
    color: '#111827',
    flex: 1,
    marginRight: 8,
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
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 13,
    fontFamily: 'semiBold',
    color: '#4B5563',
    width: 70,
  },
  detailValue: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#6B7280',
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  badge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'semiBold',
    color: '#374151',
  },
  highPriority: {
    backgroundColor: '#FEE2E2',
  },
  highPriorityText: {
    color: '#991B1B',
  },
  medPriority: {
    backgroundColor: '#FEF3C7',
  },
  medPriorityText: {
    color: '#92400E',
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
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
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