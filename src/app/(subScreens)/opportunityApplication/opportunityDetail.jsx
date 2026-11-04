

import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { deleteRequest } from '../../../api/deleteRequests';
import { getRequest } from '../../../api/getRequests';
import { postRequest } from '../../../api/postRequests';
import CustomSafeArea from '../../../components/safeArea';

export default function OpportunityDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false); // <--- Added saving state
  const [applying, setApplying] = useState(false);

  async function saveOpportunity(id) {
    try {
      const response = await postRequest(`/opportunities/${id}/save`);
      return response;
    } catch (error) {
      if (error?.response?.status === 409) {
        console.log('Opportunity already saved');
        return true;
      }
      console.error('Failed to save opportunity:', error?.response?.data || error?.message || error);
      throw error;
    }
  }

  async function unsaveOpportunity(id) {
    try {
      const response = await deleteRequest(`/opportunities/${id}/save`);
      return response;
    } catch (error) {
      console.error('Failed to unsave opportunity:', error?.response?.data || error?.message || error);
      throw error;
    }
  }

  const handleToggleSave = async () => {
    if (saving) return;

    const previousState = isSaved;
    setIsSaved(!previousState); // Optimistic UI update
    setSaving(true);

    try {
      if (!previousState) {
        await saveOpportunity(id);
      } else {
        await unsaveOpportunity(id);
      }
    } catch (error) {
      setIsSaved(previousState); // Revert state on error
      Alert.alert("Error", "Could not update saved status. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Fetch opportunity details on load
  useEffect(() => {
    let isMounted = true;

    async function fetchOpportunityDetails() {
      if (!id) return;
      setLoading(true);
      try {
        const response = await getRequest(`/opportunities/${id}`);
        const data = response?.data || response;
        if (isMounted) {
          setOpportunity(data);
          setIsSaved(data?.isSaved || false);
        }
      } catch (error) {
        console.error("Failed to fetch opportunity details:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchOpportunityDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Helper function to call POST /applications
  async function applyForOpportunity(opportunityId) {
    const defaultApplicationData = {
      applicationDate: new Date().toISOString(), 
      source: "FOUND_IN_ROVIA",
      notes: "Applied via Rovia App",
    };

    try {
      const payload = {
        opportunityId,
        ...defaultApplicationData,
      };

      console.log("SENDING PAYLOAD:", payload);
      const response = await postRequest("/applications", payload);
      return response;
    } catch (error) {
      console.error("Failed to submit application:", error?.response?.data || error?.message || error);
      throw error;
    }
  }

  // Handle Button Press Action
  const handleApply = async () => {
    if (!id) {
      Alert.alert("Error", "Opportunity ID is missing.");
      return;
    }

    setApplying(true);
    try {
      await applyForOpportunity(id);
      Alert.alert("Success", "Your application was submitted successfully!");
    } catch (error) {
      Alert.alert(
        "Application Failed", 
        error?.response?.data?.message || "Could not submit application. Please try again."
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <CustomSafeArea>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Back Button Skeleton */}
          <View style={styles.skeletonBackButton} />

          {/* Badge Row Skeleton */}
          <View style={styles.skeletonBadgeRow}>
            <View style={styles.skeletonBadge} />
            <View style={styles.skeletonStatusBadge} />
          </View>

          {/* Title & Organization Skeletons */}
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonInfoRow}>
            <View style={styles.skeletonIcon} />
            <View style={styles.skeletonTextMedium} />
          </View>
          <View style={styles.skeletonInfoRow}>
            <View style={styles.skeletonIcon} />
            <View style={styles.skeletonTextLong} />
          </View>
          <View style={styles.skeletonInfoRow}>
            <View style={styles.skeletonIcon} />
            <View style={styles.skeletonTextShort} />
          </View>

          {/* Tabs Skeleton */}
          <View style={styles.skeletonTabsRow}>
            <View style={styles.skeletonTab} />
            <View style={styles.skeletonTab} />
            <View style={styles.skeletonTab} />
          </View>

          {/* Content Section Skeletons */}
          <View style={styles.skeletonSectionContainer}>
            <View style={styles.skeletonSectionTitle} />
            <View style={styles.skeletonLineLong} />
            <View style={styles.skeletonLineLong} />
            <View style={styles.skeletonLineShort} />
          </View>

          {/* Action Buttons Skeletons */}
          <View style={styles.skeletonApplyButton} />
          <View style={styles.skeletonSaveButton} />
        </ScrollView>
      </CustomSafeArea>
    );
  }

  if (!opportunity) {
    return (
      <CustomSafeArea>
        <View style={styles.loaderContainer}>
          <Text style={styles.loaderText}>Opportunity not found.</Text>
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
        
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#16A34A" />
        </TouchableOpacity>

        {/* Match / Trust Badge */}
        <View style={styles.badgeRow}>
          <View style={styles.matchBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#16A34A" style={styles.matchIcon} />
            <Text style={styles.matchText}>{opportunity.trustLabel ? opportunity.trustLabel.replace('_', ' ') : 'Verified'}</Text>
          </View>
          {opportunity.status && (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{opportunity.status.replace('_', ' ')}</Text>
            </View>
          )}
        </View>

        {/* Title and Organisation */}
        <Text style={styles.jobTitle}>{opportunity.title}</Text>
        
        <View style={styles.infoRow}>
          <Feather name="briefcase" size={14} color="#6B7280" style={styles.infoIcon} />
          <Text style={styles.infoText}>{opportunity.organisation}</Text>
        </View>

        <View style={styles.infoRow}>
          <Feather name="map-pin" size={14} color="#16A34A" style={styles.infoIcon} />
          <Text style={styles.infoText}>{opportunity.location}{opportunity.country ? `, ${opportunity.country}` : ''}</Text>
          {opportunity.workMode && (
            <>
              <Text style={styles.dotSeparator}>·</Text>
              <Text style={styles.infoText}>{opportunity.workMode}</Text>
            </>
          )}
        </View>

        <View style={styles.infoRow}>
          <Feather name="award" size={14} color="#6B7280" style={styles.infoIcon} />
          <Text style={styles.infoText}>{opportunity.type ? opportunity.type.replace('_', ' ') : 'Opportunity'}</Text>
          {opportunity.careerLevel && (
            <>
              <Text style={styles.dotSeparator}>·</Text>
              <Text style={styles.infoText}>{opportunity.careerLevel.replace('_', ' ')}</Text>
            </>
          )}
        </View>

        {/* Tabs: Overview / Requirements / Benefits */}
        <View style={styles.tabsRow}>
          {['Overview', 'Requirements', 'Benefits'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabItem, isActive && styles.activeTabItem]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Dynamic Section Content based on Tabs */}
        {activeTab === 'Overview' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>About the role</Text>
            <Text style={styles.sectionBody}>
              {opportunity.description || 'No description provided for this opportunity.'}
            </Text>

            {opportunity.aiMatchExplanation && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Why it's a match</Text>
                <Text style={styles.sectionBody}>
                  {opportunity.aiMatchExplanation}
                </Text>
              </>
            )}

            {opportunity.deadline && (
              <View style={styles.deadlineBox}>
                <Feather name="clock" size={14} color="#D97706" style={{ marginRight: 6 }} />
                <Text style={styles.deadlineText}>Application Deadline: {opportunity.deadline}</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'Requirements' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Eligibility & Requirements</Text>
            {opportunity.requirements && opportunity.requirements.length > 0 ? (
              opportunity.requirements.map((req, index) => (
                <View key={req.id || index} style={styles.requirementItem}>
                  <Feather name="check-circle" size={14} color="#16A34A" style={{ marginRight: 8, marginTop: 2 }} />
                  <Text style={styles.requirementText}>{req.description}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.sectionBody}>No specific requirements listed.</Text>
            )}
          </View>
        )}

        {activeTab === 'Benefits' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Package & Benefits</Text>
            <Text style={styles.sectionBody}>
              {opportunity.industry === 'Education' ? 'Fully funded scholarship benefits including tuition, stipend, and travel allowances.' : 'Competitive industry compensation, professional mentorship, and career growth pathways.'}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <TouchableOpacity 
          style={[styles.applyButton, applying && { opacity: 0.7 }]} 
          onPress={handleApply}
          disabled={applying}
        >
          {applying ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.applyButtonText}>Apply now</Text>
          )}
        </TouchableOpacity>

        {/* Fixed Save Button with Conditional Indicator */}
        <TouchableOpacity 
          style={[styles.saveButton, saving && { opacity: 0.7 }]} 
          onPress={handleToggleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#16A34A" />
          ) : (
            <>
              <Feather name="bookmark" size={18} color="#16A34A" style={{ marginRight: 6 }} />
              <Text style={styles.saveButtonText}>{isSaved ? 'Saved' : 'Save'}</Text>
            </>
          )}
        </TouchableOpacity>

      </ScrollView>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'regular',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonInline: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#16A34A',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontFamily: 'semiBold',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  matchIcon: {
    marginRight: 4,
  },
  matchText: {
    fontSize: 12,
    fontFamily: 'semiBold',
    color: '#16A34A',
  },
  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'semiBold',
    color: '#D97706',
  },
  jobTitle: {
    fontSize: 22,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#4B5563',
  },
  dotSeparator: {
    marginHorizontal: 6,
    color: '#9CA3AF',
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginVertical: 20,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#16A34A',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'medium',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#16A34A',
    fontFamily: 'semiBold',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#4B5563',
    lineHeight: 22,
  },
  deadlineBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  deadlineText: {
    fontSize: 13,
    fontFamily: 'medium',
    color: '#B45309',
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#4B5563',
    flex: 1,
    lineHeight: 20,
  },
  applyButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  applyButtonText: {
    fontSize: 15,
    fontFamily: 'semiBold',
    color: '#FFFFFF',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#DCFCE7',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 15,
    fontFamily: 'semiBold',
    color: '#16A34A',
  },
  // Skeleton Styles
  skeletonBackButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  skeletonBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  skeletonBadge: {
    width: 100,
    height: 22,
    backgroundColor: '#DCFCE7',
    borderRadius: 6,
  },
  skeletonStatusBadge: {
    width: 80,
    height: 22,
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
  },
  skeletonTitle: {
    width: '80%',
    height: 26,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    marginBottom: 12,
  },
  skeletonInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  skeletonIcon: {
    width: 14,
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginRight: 8,
  },
  skeletonTextMedium: {
    width: '50%',
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  skeletonTextLong: {
    width: '70%',
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  skeletonTextShort: {
    width: '30%',
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  skeletonTabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginVertical: 20,
    paddingBottom: 12,
    gap: 12,
  },
  skeletonTab: {
    flex: 1,
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  skeletonSectionContainer: {
    marginBottom: 24,
    gap: 8,
  },
  skeletonSectionTitle: {
    width: '40%',
    height: 18,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 4,
  },
  skeletonLineLong: {
    width: '100%',
    height: 14,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
  },
  skeletonLineShort: {
    width: '60%',
    height: 14,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
  },
  skeletonApplyButton: {
    height: 48,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 12,
  },
  skeletonSaveButton: {
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
});