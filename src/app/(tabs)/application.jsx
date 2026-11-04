

import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getRequest } from '../../api/getRequests';
import CustomSafeArea from '../../components/safeArea';

export default function ApplicationsScreen() {
  const [activeTab, setActiveTab] = useState('Active');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use focus effect so it refetches every time you open the screen
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function fetchApplications() {
        setLoading(true);
        try {
          const response = await getRequest('/applications');
          const data = response?.data || [];
          if (isMounted) {
            setApplications(data);
          }
        } catch (error) {
          console.error('Failed to fetch applications:', error?.response?.data || error?.message || error);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }

      fetchApplications();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  // Filter applications into Active and Closed based on status
  const activeApplications = applications.filter((app) => app.status === 'ACTIVE');
  const closedApplications = applications.filter((app) => app.status !== 'ACTIVE');
  const displayedApplications = activeTab === 'Active' ? activeApplications : closedApplications;

  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Title */}
        <Text style={styles.headerTitle}>Applications</Text>

        {/* Tabs: Active / Closed */}
        <View style={styles.tabToggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, activeTab === 'Active' && styles.activeToggleButton]}
            onPress={() => setActiveTab('Active')}
          >
            <Text style={[styles.toggleButtonText, activeTab === 'Active' && styles.activeToggleText]}>
              Active ({activeApplications.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleButton, activeTab === 'Closed' && styles.activeToggleButton]}
            onPress={() => setActiveTab('Closed')}
          >
            <Text style={[styles.toggleButtonText, activeTab === 'Closed' && styles.activeToggleText]}>
              Closed ({closedApplications.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Applications List / Skeletons */}
        {loading ? (
          [1, 2, 3].map((_, index) => (
            <View key={index} style={styles.skeletonCard}>
              <View style={styles.skeletonThumbnail} />
              <View style={styles.skeletonContentRow}>
                <View style={styles.skeletonLineShort} />
                <View style={styles.skeletonLineLong} />
                <View style={styles.skeletonBadge} />
              </View>
            </View>
          ))
        ) : displayedApplications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No {activeTab.toLowerCase()} applications found.</Text>
          </View>
        ) : (
          displayedApplications.map((item) => {
            const opportunityTitle = item.opportunity?.title || 'Opportunity Application';
            const companyName = item.opportunity?.organisation || 'Verified Employer';
            const stageText = item.currentStage ? item.currentStage.replace('_', ' ') : 'Submitted';
            const dateStr = item.applicationDate ? new Date(item.applicationDate).toLocaleDateString() : '';

            return (
              <TouchableOpacity 
                key={item.id} 
                style={styles.card} 
                activeOpacity={0.8}
                onPress={() => {
                  if (item.opportunityId) {
                    router.push(`/(subScreens)/opportunityApplication/opportunityDetail?id=${item.opportunityId}`);
                  }
                }}
              >
                <View style={styles.cardLeft}>
                  {/* Omitted image URL per requirement, using icon placeholder */}
                  <View style={styles.iconPlaceholder}>
                    <Feather name="briefcase" size={20} color="#16A34A" />
                  </View>
                </View>

                <View style={styles.cardRight}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.jobTitle} numberOfLines={1}>{opportunityTitle}</Text>
                    <Feather name="chevron-right" size={18} color="#9CA3AF" />
                  </View>
                  <Text style={styles.companyName} numberOfLines={1}>{companyName}</Text>
                  
                  <View style={[styles.statusBadge, styles.reviewBadge]}>
                    <Ionicons name="time-outline" size={12} color="#1D4ED8" style={styles.statusIcon} />
                    <Text style={[styles.statusText, { color: '#1D4ED8' }]}>
                      {stageText} {dateStr ? `· ${dateStr}` : ''}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
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
    fontSize: 24,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 16,
  },
  tabToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeToggleButton: {
    backgroundColor: '#16A34A',
  },
  toggleButtonText: {
    fontSize: 14,
    fontFamily: 'medium',
    color: '#4B5563',
  },
  activeToggleText: {
    color: '#FFFFFF',
    fontFamily: 'semiBold',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cardLeft: {
    marginRight: 12,
  },
  iconPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardRight: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 15,
    fontFamily: 'semiBold',
    color: '#111827',
    flex: 1,
    marginRight: 6,
  },
  companyName: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#4B5563',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  reviewBadge: {
    backgroundColor: '#EFF6FF',
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'medium',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#6B7280',
  },
  // Skeleton styles
  skeletonCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  skeletonThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  skeletonContentRow: {
    flex: 1,
    gap: 6,
  },
  skeletonLineShort: {
    width: '40%',
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  skeletonLineLong: {
    width: '70%',
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  skeletonBadge: {
    width: '30%',
    height: 18,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
  },
});