import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomSafeArea from '../../components/safeArea';

export default function ProfileScreen() {
  const router = useRouter();

  const menuItems = [
    { id: '1', title: 'My Profile', icon: 'person-outline', route: '/editProfile' },
    { id: '2', title: 'Skills & Interests', icon: 'ribbon-outline', route: '/skills' },
    { id: '3', title: 'Saved Opportunities', icon: 'bookmark-outline', route: '/saved' },
    { id: '4', title: 'Application History', icon: 'document-text-outline', route: '/applications' },
    { id: '5', title: 'Settings', icon: 'settings-outline', route: '/settings' },
    { id: '6', title: 'Help & Support', icon: 'help-circle-outline', route: '/support' },
  ];

  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* User Info Header */}
        <View style={styles.headerRow}>
          <View style={styles.userInfoContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.nameText}>Favour Ekeohuru</Text>
              <Text style={styles.subtext}>Graduate  •  Lagos, Nigeria</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.bellButton}
            onPress={() => router.push('/notifications')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications" size={22} color="#16A34A" />
          </TouchableOpacity>
        </View>

        {/* Level / Career Badge Card */}
        <View style={styles.badgeCard}>
          <View style={styles.badgeTopRow}>
            <View style={styles.badgeTitleRow}>
              <Ionicons name="diamond-outline" size={18} color="#16A34A" />
              <Text style={styles.badgeTitle}>Career Explorer</Text>
            </View>
            <Text style={styles.levelText}>Level 2</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={styles.progressBarFill} />
          </View>
        </View>

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
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   paddingHorizontal: 20,
  //   paddingVertical: 16,
  // },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
    marginBottom: 20,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
  },
  nameText: {
    fontFamily: 'bold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 2,
  },
  subtext: {
    fontFamily: 'regular',
    fontSize: 13,
    color: '#D97706', // Muted orange-gold accent as shown in design
  },
  bellButton: {
    padding: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
  },
  badgeCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
    fontFamily: 'semiBold',
    fontSize: 14,
    color: '#16A34A',
  },
  levelText: {
    fontFamily: 'semiBold',
    fontSize: 13,
    color: '#4B5563',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '65%',
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 3,
  },
  menuContainer: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuIcon: {
    width: 24,
  },
  menuTitle: {
    fontFamily: 'regular',
    fontSize: 15,
    color: '#1F2937',
  },
});