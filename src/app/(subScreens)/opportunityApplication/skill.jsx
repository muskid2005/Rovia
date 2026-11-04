import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { deleteRequest } from '../../../api/deleteRequests';
import { getRequest } from '../../../api/getRequests';
import { postRequest } from '../../../api/postRequests';
import CustomModal from '../../../components/customModal';
import CustomSafeArea from '../../../components/safeArea';

export default function SkillsScreen() {
  const [catalogSkills, setCatalogSkills] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Custom Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const showCustomModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  // Fetch Master Catalog & User's Skills
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function fetchData() {
        setLoading(true);
        try {
          const [catalogRes, mySkillsRes] = await Promise.all([
            getRequest('/skills'),
            getRequest('/skills/my-skills'),
          ]);

          const catalogData = catalogRes?.data?.skills || catalogRes?.data || catalogRes || [];
          const userSkillsData = mySkillsRes?.data?.skills || mySkillsRes?.data || mySkillsRes || [];

          if (isMounted) {
            setCatalogSkills(Array.isArray(catalogData) ? catalogData : []);
            setMySkills(Array.isArray(userSkillsData) ? userSkillsData : []);
          }
        } catch (error) {
          console.error('Failed to fetch skills data:', error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Could not load skills catalog.';
          showCustomModal('Error', errorMessage);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }

      fetchData();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  // Check if a catalog skill is already added by the user
  const getUserSkillRecord = (skillId) => {
    return mySkills.find(
      (item) => item.skillId === skillId || item.id === skillId || item.skill?.id === skillId
    );
  };

  // Toggle skill (Add or Remove)
    const handleToggleSkill = async (skill) => {
        const existingRecord = getUserSkillRecord(skill.id);

        setActionLoadingId(skill.id);
        try {
          if (existingRecord) {
            // Remove skill: DELETE /skills/my-skills/{skillId}
            const targetId = existingRecord.skillId || existingRecord.id;
            await deleteRequest(`/skills/my-skills/${targetId}`);
            setMySkills((prev) => prev.filter((item) => (item.skillId || item.id) !== targetId));
          } else {
            // Add skill: POST /skills/my-skills matching backend schema
            const payload = {
              name: skill.name,
              category: skill.category || 'General',
              proficiency: 'INTERMEDIATE', // Default or select state
              evidence: 'Added via mobile app',
            };
            const response = await postRequest('/skills/my-skills', payload);
            const addedItem = response?.data || response;
            setMySkills((prev) => [...prev, addedItem]);
          }
        } catch (error) {
          console.error('Failed to update skill:', error?.response?.data || error?.message || error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Could not update your skills.';
          showCustomModal('Error', errorMessage);
        } finally {
          setActionLoadingId(null);
        }
      };
  const filteredCatalog = catalogSkills.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="chevron-left" size={24} color="#16A34A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Skills & Interests</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.subtitleText}>
          Select your professional skills to improve your readiness score for opportunities.
        </Text>

        {/* Search Input */}
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search skills..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Loading Skeletons */}
        {loading ? (
          <View style={styles.skeletonContainer}>
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <View key={index} style={styles.skeletonChip} />
            ))}
          </View>
        ) : filteredCatalog.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No skills found.</Text>
          </View>
        ) : (
          <View style={styles.skillsGrid}>
            {filteredCatalog.map((skill) => {
              const isSelected = !!getUserSkillRecord(skill.id);
              const isUpdating = actionLoadingId === skill.id;

              return (
                <TouchableOpacity
                  key={skill.id}
                  style={[styles.skillChip, isSelected && styles.selectedChip]}
                  activeOpacity={0.8}
                  onPress={() => handleToggleSkill(skill)}
                  disabled={isUpdating}
                >
                  <Text style={[styles.skillChipText, isSelected && styles.selectedChipText]}>
                    {skill.name}
                  </Text>
                  {isUpdating ? (
                    <ActivityIndicator size="small" color={isSelected ? '#FFFFFF' : '#16A34A'} />
                  ) : (
                    <Ionicons
                      name={isSelected ? 'checkmark-circle' : 'add-circle-outline'}
                      size={18}
                      color={isSelected ? '#FFFFFF' : '#16A34A'}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

      </ScrollView>

      {/* Reusable Custom Modal */}
      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
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
  subtitleText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'regular',
    color: '#111827',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },
  selectedChip: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  skillChipText: {
    fontSize: 13,
    fontFamily: 'medium',
    color: '#374151',
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skeletonChip: {
    width: '30%',
    height: 40,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#6B7280',
  },
});