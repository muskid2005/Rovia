


import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getRequest } from '../../../api/getRequests';
import CustomModal from '../../../components/customModal';
import CustomSafeArea from '../../../components/safeArea';

export default function ReadinessResultScreen() {
  const { id } = useLocalSearchParams();
  const [resultData, setResultData] = useState(null);
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

  useEffect(() => {
    let isMounted = true;

    async function fetchReadinessResult() {
      if (!id) return;
      setLoading(true);
      try {
        const response = await getRequest(`/readiness/${id}`);
        const data = response?.data || response;
        if (isMounted) {
          setResultData(data);
        }
      } catch (error) {
      // Extract backend error message cleanly
            const errorMessage = 
              error?.response?.data?.message || 
              error?.message || 
              'Could not run readiness analysis.';
            
            showCustomModal('Notice', errorMessage);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchReadinessResult();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <CustomSafeArea>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Title Skeleton */}
          <View style={styles.skeletonTitle} />

          {/* Opportunity Card Skeleton */}
          <View style={styles.skeletonOpportunityCard}>
            <View style={styles.skeletonLineLong} />
            <View style={styles.skeletonLineShort} />
          </View>

          {/* Summary Banner Skeleton */}
          <View style={styles.skeletonSummaryBox} />

          {/* AI Action Plan Section Skeleton */}
          <View style={styles.skeletonSectionHeader} />
          <View style={styles.skeletonAiGuidanceBox} />

          {/* Action Items Header Skeleton */}
          <View style={styles.skeletonSectionHeader} />

          {/* Action Item Cards Skeletons */}
          {[1, 2, 3].map((_, index) => (
            <View key={index} style={styles.skeletonItemCard}>
              <View style={styles.skeletonItemHeaderRow}>
                <View style={styles.skeletonLineMedium} />
                <View style={styles.skeletonBadge} />
              </View>
              <View style={styles.skeletonLineFull} />
              <View style={styles.skeletonLineShort} />
              <View style={styles.skeletonPill} />
            </View>
          ))}
        </ScrollView>
      </CustomSafeArea>
    );
  }

  if (!resultData) {
    return (
      <CustomSafeArea>
        <View style={styles.loaderContainer}>
          <Text style={styles.errorText}>Readiness data not found.</Text>
          <TouchableOpacity style={styles.backButtonInline} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </CustomSafeArea>
    );
  }

  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Title & Opportunity Info */}
        <Text style={styles.headerTitle}>Readiness Assessment</Text>
        {resultData.opportunity && (
          <View style={styles.opportunityCard}>
            <Text style={styles.oppTitle}>{resultData.opportunity.title}</Text>
            <Text style={styles.oppOrg}>{resultData.opportunity.organisation}</Text>
          </View>
        )}

        {/* Summary Banner */}
        <View style={styles.summaryBox}>
          <Ionicons name="information-circle-outline" size={20} color="#D97706" style={{ marginRight: 8, marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryTitle}>Status: {resultData.state?.replace('_', ' ')}</Text>
            <Text style={styles.summaryText}>{resultData.summary}</Text>
          </View>
        </View>

        {/* AI Guidance Section */}
        {resultData.aiGuidance && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>AI Action Plan</Text>
            <Text style={styles.aiGuidanceText}>{resultData.aiGuidance}</Text>
          </View>
        )}

        {/* Actionable Items List */}
        <Text style={styles.sectionTitle}>Action Items ({resultData.items?.length || 0})</Text>
        {resultData.items && resultData.items.length > 0 ? (
          resultData.items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemHeaderRow}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <View style={[
                  styles.priorityBadge, 
                  item.priority === 'HIGH' ? styles.highPriority : styles.medPriority
                ]}>
                  <Text style={styles.priorityText}>{item.priority}</Text>
                </View>
              </View>
              <Text style={styles.itemDescription}>{item.description}</Text>
              
              {item.profileSection && (
                <View style={styles.sectionPill}>
                  <Feather name="folder" size={12} color="#16A34A" style={{ marginRight: 4 }} />
                  <Text style={styles.sectionPillText}>Update {item.profileSection}</Text>
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No action items needed. You are fully ready!</Text>
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
  headerTitle: {
    fontSize: 24,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 12,
  },
  opportunityCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  oppTitle: {
    fontSize: 16,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 2,
  },
  oppOrg: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#D97706',
  },
  summaryBox: {
    flexDirection: 'row',
    backgroundColor: '#fcf8f4',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e3ccb3',
  },
  summaryTitle: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: '#D97706',
    marginBottom: 2,
  },
  summaryText: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#D97706',
    lineHeight: 18,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 10,
  },
  aiGuidanceText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#374151',
    lineHeight: 22,
    backgroundColor: '#FFFFFF',
    
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemTitle: {
    fontSize: 15,
    fontFamily: 'semiBold',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  highPriority: {
    backgroundColor: '#FEE2E2',
  },
  medPriority: {
    backgroundColor: '#FEF3C7',
  },
  priorityText: {
    fontSize: 10,
    fontFamily: 'semiBold',
    color: '#991B1B',
  },
  itemDescription: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 10,
  },
  sectionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sectionPillText: {
    fontSize: 11,
    fontFamily: 'medium',
    color: '#16A34A',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 15,
    fontFamily: 'regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  backButtonInline: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontFamily: 'medium',
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#6B7280',
  },
  // Skeleton Styles
  skeletonTitle: {
    width: '60%',
    height: 28,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    marginBottom: 16,
  },
  skeletonOpportunityCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  skeletonSummaryBox: {
    height: 70,
    backgroundColor: '#fcf8f4',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e3ccb3',
  },
  skeletonSectionHeader: {
    width: '40%',
    height: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 12,
  },
  skeletonAiGuidanceBox: {
    height: 110,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  skeletonItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  skeletonItemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonLineLong: {
    width: '80%',
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  skeletonLineMedium: {
    width: '60%',
    height: 15,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  skeletonLineShort: {
    width: '40%',
    height: 13,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
  },
  skeletonLineFull: {
    width: '100%',
    height: 13,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
  },
  skeletonBadge: {
    width: 50,
    height: 20,
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
  },
  skeletonPill: {
    width: 110,
    height: 22,
    backgroundColor: '#F0FDF4',
    borderRadius: 6,
    marginTop: 4,
  },
});