import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text
} from 'react-native';
import { postRequest } from '../../api/postRequests';
import CustomModal from '../../components/customModal';
import CustomSafeArea from '../../components/safeArea';
import { useAuthStore } from '.././../store/useAuthStore';

export default function SettingsScreen() {
    const [warn, setWarn] = useState(false)
    const [loading, setLoading] = useState(false)

    async function onLogout() {
    setLoading(true);
    try {
        const response = await postRequest('/auth/logout');
        console.log('Logout response:', response);

        // Clear session/tokens from auth store
        useAuthStore.getState().clearSession();
        // Redirect to login screen
        router.replace('/login');
    } catch (error) {
        console.error('Logout failed:', error?.response?.data || error?.message || error);
        
        // Fallback: clear store and redirect anyway so user isn't trapped
        useAuthStore.getState().logout();
        router.replace('/login');
    } finally {
        setLoading(false);
    }
    }


  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Title */}
        <Text style={styles.headerTitle}>Settings</Text>

       
          <>
            {/* Account Section */}
            <Text style={styles.sectionHeader}>Account</Text>

            <Pressable style={styles.settingItem} onPress={() => router.push("/(subScreens)/profile/profileUpdateFile")}>
              <Text style={styles.settingItemText}>Edit Profile</Text>
              <Feather name="chevron-right" size={18} color="#16A34A" />
            </Pressable>

            <Pressable style={styles.settingItem} >
              <Text style={styles.settingItemText}>Change Password</Text>
              <Feather name="chevron-right" size={18} color="#16A34A" />
            </Pressable>

            <Pressable style={styles.settingItem} onPress={() => router.push('/(subScreens)/privacy')}>
              <Text style={styles.settingItemText}>Privacy & Security</Text>
              <Feather name="chevron-right" size={18} color="#16A34A" />
            </Pressable>

            {/* Preferences Section */}
            <Text style={styles.sectionHeader}>Preferences</Text>

            <Pressable style={styles.settingItem} onPress={() => router.push('/(subScreens)/notificationsSettings')}>
              <Text style={styles.settingItemText}>Notifications</Text>
              <Feather name="chevron-right" size={18} color="#16A34A" />
            </Pressable>

            <Pressable style={styles.settingItem} >
              <Text style={styles.settingItemText}>Language & Region</Text>
              <Feather name="chevron-right" size={18} color="#16A34A" />
            </Pressable>

            <Pressable style={styles.settingItem}>
              <Text style={styles.settingItemText}>Accessibility</Text>
              <Feather name="chevron-right" size={18} color="#16A34A" />
            </Pressable>
          </>
        

        <CustomModal 
        visible={warn}
        title={"LOGOUT"}
        message={"Are you sure you want to logout?"}
        onClose={() => setWarn(false)}
        primaryButtonText = {loading? <ActivityIndicator size="small" color="#ffffff" /> :'Yes'}
        onPrimaryAction ={() => onLogout()}
        secondaryButtonText = 'No'
        onSecondaryAction ={() => setWarn(false)}
        />

        <Pressable style={styles.logout} onPress={()=> setWarn(true)}>
            <Text style={{fontFamily: "bold", fontSize: 16, color: "#b00505ee"}}>LOGOUT</Text>
        </Pressable>

      </ScrollView>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
    logout: {
        marginTop: 80, alignSelf: "center",
        paddingHorizontal: 40,
        paddingVertical: 12, borderWidth: 2,
        borderRadius: 12, borderColor: "#b00505ee"
    },
  scrollContent: {
    // 
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingItemText: {
    fontSize: 15,
    fontFamily: 'semiBold',
    color: '#111827',
  },
  // Skeleton Styles
  skeletonContainer: {
    gap: 8,
  },
  skeletonSectionHeader: {
    width: '30%',
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 4,
  },
  skeletonCard: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
});