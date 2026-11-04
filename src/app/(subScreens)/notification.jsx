import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getRequest } from '../../api/getRequests';
import CustomSafeArea from '../../components/safeArea';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchNotifications() {
      setLoading(true);
      try {
        const response = await getRequest('/notifications?page=1&limit=20');
        console.log("RAW NOTIFICATIONS RESPONSE:", response);
        
        // Adjust data path safely based on what shows up in your console log
        const data = response?.data?.notifications || response?.notifications || response?.data || [];
        
        if (isMounted) {
          setNotifications(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Title */}
        <Text style={styles.headerTitle}>Notifications</Text>

        {loading ? (
          // Skeleton Loader State
          [1, 2, 3, 4, 5].map((_, index) => (
            <View key={index} style={styles.skeletonCard}>
              <View style={styles.skeletonLineShort} />
              <View style={styles.skeletonLineLong} />
            </View>
          ))
        ) : notifications.length === 0 ? (
          // Clean Empty State when backend returns an empty array
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptySubtitle}>We'll notify you when something important arrives.</Text>
          </View>
        ) : (
          notifications.map((item, index) => (
            <View key={item.id || index} style={styles.notificationItem}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationSubtitle}>{item.message || item.body}  ·  {item.timeAgo || item.createdAt}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 20,
  },
  notificationItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  notificationTitle: {
    fontSize: 15,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 4,
  },
  notificationSubtitle: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#6B7280',
  },
  // Skeleton Styles
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  skeletonLineShort: {
    width: '75%',
    height: 15,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  skeletonLineLong: {
    width: '45%',
    height: 13,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#6B7280',
    textAlign: 'center',
  },
});