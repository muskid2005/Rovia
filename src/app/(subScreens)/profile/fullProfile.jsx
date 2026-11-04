import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getRequest } from '../../../api/getRequests';
import CustomModal from '../../../components/customModal';
import CustomSafeArea from '../../../components/safeArea';

export default function profileUpdateFileScreen() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Custom Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const showCustomModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function fetchProfileDetails() {
        setLoading(true);
        try {
          const response = await getRequest('/profile');
          const data = response?.data || response;
          if (isMounted) {
            setProfileData(data);
          }
        } catch (error) {
          console.error('Failed to fetch profile details:', error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Could not load profile details.';
          showCustomModal('Error', errorMessage);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }

      fetchProfileDetails();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  if (loading) {
    return (
      <CustomSafeArea>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#16A34A" />
        </View>
      </CustomSafeArea>
    );
  }

  const profile = profileData?.profile || {};
  const user = profile.user || {};
  const completion = profileData?.completion || {};
  const educationList = profileData?.education || [];
  const experienceList = profileData?.experiences || [];
  const skillsList = profileData?.skills || [];
  const careerGoals = profileData?.careerGoals || [];
  const certifications = profileData?.certifications || [];

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';

  console.log(careerGoals)
  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header / Back */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="chevron-left" size={24} color="#16A34A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile Details</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{fullName}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userHeadline}>
              {profile.headline || 'No headline added yet'}
            </Text>
            <Text style={styles.userLocation}>
              {profile.location && profile.country
                ? `${profile.location}, ${profile.country}`
                : profile.country || profile.location || 'Location not specified'}
            </Text>
          </View>
        </View>

        {/* Completion Status Card */}
        <View style={styles.completionCard}>
          <View style={styles.completionTopRow}>
            <Text style={styles.cardSectionTitle}>Profile Completion</Text>
            <Text style={styles.completionPercentage}>{completion.percentage || 0}%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${completion.percentage || 0}%` }]} />
          </View>
          {completion.missingSteps && completion.missingSteps.length > 0 && (
            <View style={styles.missingStepsContainer}>
              <Text style={styles.missingStepsTitle}>Missing Steps:</Text>
              {completion.missingSteps.map((step, idx) => (
                <Text key={idx} style={styles.missingStepText}>• {step}</Text>
              ))}
            </View>
          )}
        </View>

        {/* Biography Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Biography</Text>
          <Text style={styles.sectionBody}>
            {profile.biography || 'No biography provided yet.'}
          </Text>
        </View>

        {/* Career Goals */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Career Goals</Text>
          {careerGoals.length > 0 ? (
            careerGoals.map((goal, idx) => (
              <View key={goal.id || idx} style={styles.subItemBox}>
                <Text style={styles.subItemTitle}>{goal.targetRole || 'Target Role'}</Text>
                <Text style={styles.subItemSubtitle}>
                  {goal.targetIndustry ? `Industry: ${goal.targetIndustry}` : ''}
                  {goal.targetIndustry && goal.targetLocation ? ' • ' : ''}
                  {goal.targetLocation ? `Location: ${goal.targetLocation}` : ''}
                </Text>
                <View style={styles.badgeRow}>
                  {goal.goalType && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{goal.goalType}</Text>
                    </View>
                  )}
                  {goal.priority && (
                    <View style={[styles.badge, goal.priority === 'HIGH' ? styles.highPriority : styles.medPriority]}>
                      <Text style={[styles.badgeText, goal.priority === 'HIGH' ? styles.highPriorityText : styles.medPriorityText]}>
                        {goal.priority} Priority
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No career goals added.</Text>
          )}
        </View>

        {/* Education */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Education</Text>
          {educationList.length > 0 ? (
            educationList.map((edu, idx) => (
              <View key={idx} style={styles.subItemBox}>
                <Text style={styles.subItemTitle}>{edu.degree || 'Degree'} in {edu.fieldOfStudy || 'Field'}</Text>
                <Text style={styles.subItemSubtitle}>{edu.institution || 'Institution'}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No educational background added.</Text>
          )}
        </View>

        {/* Experiences */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Experience</Text>
          {experienceList.length > 0 ? (
            experienceList.map((exp, idx) => (
              <View key={idx} style={styles.subItemBox}>
                <Text style={styles.subItemTitle}>{exp.title || 'Role'} at {exp.company || 'Company'}</Text>
                <Text style={styles.subItemSubtitle}>{exp.description || 'No description provided.'}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No experience added.</Text>
          )}
        </View>

        {/* Skills */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Skills</Text>
          {skillsList.length > 0 ? (
            <View style={styles.skillsContainer}>
              {skillsList.map((skill, idx) => (
                <View key={idx} style={styles.skillPill}>
                  <Text style={styles.skillText}>{skill.name || skill}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No skills added.</Text>
          )}
        </View>

        {/* Certifications */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Certifications</Text>
          {certifications.length > 0 ? (
            certifications.map((cert, idx) => (
              <Text key={idx} style={styles.sectionBody}>• {cert.name || JSON.stringify(cert)}</Text>
            ))
          ) : (
            <Text style={styles.emptyText}>No certifications added.</Text>
          )}
        </View>

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
    badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  badge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'medium',
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
  scrollContent: {
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'semiBold',
    color: '#111827',
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    marginBottom: 16,
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontFamily: 'semiBold',
    color: '#374151',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'semiBold',
    color: '#111827',
  },
  userEmail: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#6B7280',
    marginBottom: 2,
  },
  userHeadline: {
    fontSize: 13,
    fontFamily: 'medium',
    color: '#16A34A',
    marginBottom: 2,
  },
  userLocation: {
    fontSize: 12,
    fontFamily: 'regular',
    color: '#9CA3AF',
  },
  completionCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginBottom: 16,
  },
  completionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardSectionTitle: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: '#166534',
  },
  completionPercentage: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: '#16A34A',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#DCFCE7',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#16A34A',
  },
  missingStepsContainer: {
    marginTop: 4,
  },
  missingStepsTitle: {
    fontSize: 12,
    fontFamily: 'semiBold',
    color: '#991B1B',
    marginBottom: 4,
  },
  missingStepText: {
    fontSize: 12,
    fontFamily: 'regular',
    color: '#7F1D1D',
    lineHeight: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 15,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#4B5563',
    lineHeight: 20,
  },
  subItemBox: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 8,
  },
  subItemTitle: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: '#111827',
  },
  subItemSubtitle: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#6B7280',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  skillText: {
    fontSize: 13,
    fontFamily: 'medium',
    color: '#374151',
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});