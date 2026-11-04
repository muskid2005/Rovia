

import { Feather, Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { getRequest } from '../../api/getRequests';
import CustomModal from '../../components/customModal';
import CustomSafeArea from '../../components/safeArea';

export default function ProfileScreen() {
  const router = useRouter();

  // Profile Data & Loading States
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

  // Fetch Profile automatically when screen loads or gains focus
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function fetchProfile() {
        setLoading(true);
        try {
          const response = await getRequest('/profile');
          const data = response?.data || response;
          
          if (isMounted) {
            setProfileData(data);
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Could not fetch profile details.';
          showCustomModal('Error', errorMessage);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }

      fetchProfile();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  // Helper to extract initials for avatar (e.g. "Favour Ekeohuru" -> "FE")
  const getInitials = (name) => {
    if (!name) return 'Fm';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // const menuItems = [
  //   { id: '1', title: 'My Profile', icon: 'person-outline', route: '/(subScreens)/profile/fullProfile' },
  //   { id: '2', title: 'Skills & Interests', icon: 'ribbon-outline', route: '/(subScreens)/opportunityApplication/skill' },
  //   { id: '3', title: 'Saved Opportunities', icon: 'bookmark-outline', route: '/(subScreens)/savedOpportunities' },
  //   // { id: '4', title: 'Application History', icon: 'document-text-outline', route: '/applications' },
  //   { id: '5', title: 'Settings', icon: 'settings-outline', route: '/setting' },
  //   { id: '3', title: 'Career Goals', icon: 'flag-outline', route: '/(subScreens)/profile/careerGoals' },
  //   { id: '4', title: 'Education', icon: 'school-outline', route: '/(subScreens)/profile/education' },
  //   // { id: '6', title: 'Help & Support', icon: 'help-circle-outline', route: '/support' },
  // ];

   const menuItems = [
    { id: '1', title: 'My Profile', icon: 'person-outline', route: '/(subScreens)/profile/fullProfile' },
    { id: '2', title: 'Skills & Interests', icon: 'ribbon-outline', route: '/(subScreens)/opportunityApplication/skill' },
    { id: '3', title: 'Career Goals', icon: 'flag-outline', route: '/(subScreens)/career' },
    { id: '4', title: 'Education', icon: 'school-outline', route: '/(subScreens)/education' },
    { id: '5', title: 'Experience', icon: 'briefcase-outline', route: '/(subScreens)/experience' },
    { id: '6', title: 'Certifications', icon: 'medal-outline', route: '/(subScreens)/certification' },
    { id: '7', title: 'Saved Opportunities', icon: 'bookmark-outline', route: '/(subScreens)/savedOpportunities' },
    // { id: '8', title: 'Application History', icon: 'document-text-outline', route: '/applications' },
    { id: '9', title: 'Settings', icon: 'settings-outline', route: '/setting' },
    // { id: '10', title: 'Help & Support', icon: 'help-circle-outline', route: '/support' },
  ];

  // Optional: Extract dynamic user details or fallback to default UI

  const firstName = profileData?.profile.user.firstName || profileData?.name || '';
  const lastName = profileData?.profile.user.lastName || profileData?.name || '';
  const displayLocation = profileData?.profile.location || '--';
  const career = profileData?.profile.careerLevel || '--';
  const percentage = profileData?.completion.percentage || '--';

  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* User Info Header */}
        <View style={styles.headerRow}>
          <View style={styles.userInfoContainer}>
            <View style={styles.avatar}>
              <Text style={{ fontFamily: 'semiBold', fontSize: 24 }}>
                {getInitials(`${firstName} ${lastName}`)}
              </Text>
            </View>
            <View>
              <Text style={styles.nameText}>{firstName} {lastName}</Text>
              <Text style={styles.subtext}>{career}  •  {displayLocation}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.bellButton}
            onPress={() => router.push('/(subScreens)/notification')}
            activeOpacity={0.7}
          >
            <Feather name="bell" size={22} color="#16A34A" />
          </TouchableOpacity>
        </View>

        {/* Level / Career Badge Card */}
        <View style={styles.badgeCard}>
          <View style={styles.badgeTopRow}>
            <View style={styles.badgeTitleRow}>
              <Feather name="user" size={18} color="#16A34A" />
              <Text style={styles.badgeTitle}>Profile Completion</Text>
            </View>
            <Text style={styles.levelText}>{percentage}%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
          </View>
        </View>

        {/* Loading Indicator for Data (if needed) */}
        {loading && (
          <View style={styles.inlineLoader}>
            <ActivityIndicator size="small" color="#16A34A" />
          </View>
        )}

        {/* Menu Items List */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => {
                if (item.route) router.push(item.route);
              }}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon} size={20} color="#16A34A" style={styles.menuIcon} />
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#16A34A" />
            </TouchableOpacity>
          ))}
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
  container: {
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 18,
    fontFamily: 'semiBold',
    color: '#111827',
  },
  subtext: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#6B7280',
    marginTop: 2,
  },
  bellButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  badgeCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  badgeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeTitle: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: '#166534',
  },
  levelText: {
    fontSize: 12,
    fontFamily: 'semiBold',
    color: '#16A34A',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#DCFCE7',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '0%',
    height: '100%',
    backgroundColor: '#16A34A',
  },
  menuContainer: {
    gap: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    marginRight: 4,
  },
  menuTitle: {
    fontSize: 15,
    fontFamily: 'medium',
    color: '#111827',
  },
  inlineLoader: {
    marginBottom: 12,
    alignItems: 'center',
  },
});