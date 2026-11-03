import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import CustomSafeArea from '../../components/safeArea';

export default function NotificationsScreen() {
  const router = useRouter();

  const notifications = [
    {
      id: '1',
      title: 'Your application status has been updated',
      subtitle: 'Management Trainee Programme  •  2h ago',
      icon: 'alert-circle-outline',
      iconColor: '#EF4444',
      iconBg: '#FEE2E2',
    },
    {
      id: '2',
      title: 'New opportunity matches your profile',
      subtitle: 'Data Analyst (Graduate Program)  •  4h ago',
      icon: 'star-outline',
      iconColor: '#D97706',
      iconBg: '#FEF3C7',
    },
    {
      id: '3',
      title: 'Reminder: Interview tomorrow',
      subtitle: 'Access Bank  •  1d ago',
      icon: 'calendar-outline',
      iconColor: '#0284C7',
      iconBg: '#E0F2FE',
    },
    {
      id: '4',
      title: 'A new discussion is live',
      subtitle: 'Career Growth  •  1d ago',
      icon: 'diamond-outline',
      iconColor: '#16A34A',
      iconBg: '#F0FDF4',
    },
    {
      id: '5',
      title: 'Your profile is 70% complete',
      subtitle: 'Complete it to get better matches  •  1d ago',
      icon: 'checkmark-circle-outline',
      iconColor: '#D97706',
      iconBg: '#FEF3C7',
      isWarning: true,
    },
  ];

  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header Row */}
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.placeholderIcon} />
        </View>

        {/* Notification Cards List */}
        <View style={styles.listContainer}>
          {notifications.map((item) => (
            <View key={item.id} style={styles.notificationCard}>
              <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon} size={20} color={item.iconColor} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={[styles.notificationSubtitle, item.isWarning && styles.warningText]}>
                  {item.subtitle}
                </Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  headerTitle: {
    fontFamily: 'bold',
    fontSize: 20,
    color: '#111827',
  },
  placeholderIcon: {
    width: 36,
  },
  listContainer: {
    gap: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 14,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontFamily: 'semiBold',
    fontSize: 14,
    color: '#111827',
    marginBottom: 4,
  },
  notificationSubtitle: {
    fontFamily: 'regular',
    fontSize: 12,
    color: '#6B7280',
  },
  warningText: {
    color: '#D97706',
    fontFamily: 'semiBold',
  },
});