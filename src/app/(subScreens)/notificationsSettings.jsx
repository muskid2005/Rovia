import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getRequest } from '../../api/getRequests';
import { putRequest } from '../../api/putRequests';
import CustomModal from '../../components/customModal';
import CustomSafeArea from '../../components/safeArea';

export default function NotificationSettingsScreen() {
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState(null);

  // Custom Feedback Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const showCustomModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  // Fetch Notification Settings
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function fetchSettings() {
        setLoading(true);
        try {
          const response = await getRequest('/notifications/settings');
          const data = response?.data?.preferences || response?.preferences || response?.data || response || [];
          if (isMounted) {
            setPreferences(Array.isArray(data) ? data : []);
          }
        } catch (error) {
          console.error('Failed to fetch notification settings:', error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Could not load notification preferences.';
          showCustomModal('Error', errorMessage);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }

      fetchSettings();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  // Toggle Preference & Save via PUT /notifications/settings
  const handleToggle = async (channel, type, currentEnabled) => {
    const key = `${channel}-${type}`;
    setUpdatingKey(key);

    // Optimistically update UI
    const updatedPreferences = preferences.map((item) =>
      item.channel === channel && item.type === type
        ? { ...item, enabled: !currentEnabled }
        : item
    );
    setPreferences(updatedPreferences);

    try {
      const payload = {
        preferences: updatedPreferences.map((item) => ({
          channel: item.channel,
          type: item.type,
          enabled: item.enabled,
        })),
      };

      await putRequest('/notifications/settings', payload);
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      // Revert on error
      setPreferences(preferences);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Could not update preference.';
      showCustomModal('Error', errorMessage);
    } finally {
      setUpdatingKey(null);
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
          <Text style={styles.headerTitle}>Notification Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.subtitleText}>
          Manage how and when you receive alerts across channels and notification types.
        </Text>

        {/* Loading State */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#16A34A" />
          </View>
        ) : preferences.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notification preferences found.</Text>
          </View>
        ) : (
          <View style={styles.card}>
            {preferences.map((item, index) => {
              const itemKey = `${item.channel}-${item.type}`;
              const isUpdating = updatingKey === itemKey;

              return (
                <View
                  key={index}
                  style={[
                    styles.rowItem,
                    index === preferences.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <View style={styles.labelContainer}>
                    <Text style={styles.rowTitle}>{item.type}</Text>
                    <Text style={styles.rowSubtitle}>Channel: {item.channel}</Text>
                  </View>

                  {isUpdating ? (
                    <ActivityIndicator size="small" color="#16A34A" />
                  ) : (
                    <Switch
                      value={!!item.enabled}
                      onValueChange={() => handleToggle(item.channel, item.type, item.enabled)}
                      trackColor={{ false: '#E5E7EB', true: '#86EFAC' }}
                      thumbColor={item.enabled ? '#16A34A' : '#9CA3AF'}
                    />
                  )}
                </View>
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
    padding: 16,
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
    marginBottom: 20,
    lineHeight: 20,
  },
  loaderContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  labelContainer: {
    flex: 1,
    marginRight: 12,
  },
  rowTitle: {
    fontSize: 15,
    fontFamily: 'semiBold',
    color: '#111827',
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  rowSubtitle: {
    fontSize: 12,
    fontFamily: 'regular',
    color: '#6B7280',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#9CA3AF',
  },
});