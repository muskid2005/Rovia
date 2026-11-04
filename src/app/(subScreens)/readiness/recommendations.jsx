import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import CustomSafeArea from '../../../components/safeArea';

export default function RecommendationsScreen() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  if (loading) {
    return (
      <CustomSafeArea>
        <View style={styles.skeletonHeader} />
        <View style={styles.skeletonTabs} />
        <View style={styles.skeletonCard} />
        <View style={styles.skeletonCard} />
      </CustomSafeArea>
    );
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Back Button & Header */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Feather name="chevron-left" size={24} color="#16A34A" />
        </TouchableOpacity>

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.screenTitle}>Top Recommendations</Text>
            <Text style={styles.screenSubtitle}>Curated opportunities based on your readiness profile.</Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Feather name="sliders" size={18} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tabsRow}
        >
          {['All', 'Strong Match', 'Graduate', 'Internship'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabPill, isActive && styles.activeTabPill]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Opportunity Card 1 */}
        <TouchableOpacity style={styles.opportunityCard}>
          <View style={styles.cardTopRow}>
            <View style={styles.matchBadgeStrong}>
              <Feather name="check-circle" size={12} color="#16A34A" style={{ marginRight: 4 }} />
              <Text style={styles.matchTextStrong}>Strong Match</Text>
            </View>
            <TouchableOpacity>
              <Feather name="bookmark" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text style={styles.jobTitle}>Management Trainee Programme</Text>
          <Text style={styles.companyName}>Dangote Group</Text>

          <View style={styles.locationRow}>
            <Feather name="map-pin" size={13} color="#16A34A" style={{ marginRight: 4 }} />
            <Text style={styles.locationText}>Lagos, Nigeria</Text>
            <Text style={styles.dotSeparator}>·</Text>
            <Text style={styles.typeText}>Full-time</Text>
          </View>

          <View style={styles.tagsRow}>
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>Graduate</Text>
            </View>
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>Management</Text>
            </View>
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>Fresh Graduate</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.deadlineText}>Deadline: 20 Nov 2026</Text>
          </View>
        </TouchableOpacity>

        {/* Opportunity Card 2 */}
        <TouchableOpacity style={styles.opportunityCard}>
          <View style={styles.cardTopRow}>
            <View style={styles.matchBadgeGood}>
              <Feather name="alert-circle" size={12} color="#D97706" style={{ marginRight: 4 }} />
              <Text style={styles.matchTextGood}>Good Match</Text>
            </View>
            <TouchableOpacity>
              <Feather name="bookmark" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text style={styles.jobTitle}>Customer Service Representative</Text>
          <Text style={styles.companyName}>Access Bank</Text>

          <View style={styles.locationRow}>
            <Feather name="map-pin" size={13} color="#16A34A" style={{ marginRight: 4 }} />
            <Text style={styles.locationText}>Abuja, Nigeria</Text>
            <Text style={styles.dotSeparator}>·</Text>
            <Text style={styles.typeText}>Full-time</Text>
          </View>

          <View style={styles.tagsRow}>
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>NYSC</Text>
            </View>
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>Customer Service</Text>
            </View>
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>Entry Level</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.deadlineText}>Deadline: 15 Nov 2026</Text>
          </View>
        </TouchableOpacity>

        {/* Opportunity Card 3 */}
        <TouchableOpacity style={styles.opportunityCard}>
          <View style={styles.cardTopRow}>
            <View style={styles.matchBadgePrep}>
              <Feather name="clock" size={12} color="#D97706" style={{ marginRight: 4 }} />
              <Text style={styles.matchTextPrep}>Needs Preparation</Text>
            </View>
            <TouchableOpacity>
              <Feather name="bookmark" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text style={styles.jobTitle}>Data Analyst (Graduate Program)</Text>
          <Text style={styles.companyName}>MTN Nigeria</Text>

          <View style={styles.locationRow}>
            <Feather name="map-pin" size={13} color="#16A34A" style={{ marginRight: 4 }} />
            <Text style={styles.locationText}>Lagos, Nigeria</Text>
            <Text style={styles.dotSeparator}>·</Text>
            <Text style={styles.typeText}>Full-time</Text>
          </View>

          <View style={styles.tagsRow}>
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>Graduate</Text>
            </View>
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>Data & Analytics</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.deadlineText}>Deadline: 30 Nov 2026</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 20,
    fontFamily: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#6B7280',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  tabsRow: {
    gap: 8,
    marginBottom: 20,
    paddingBottom: 4,
  },
  tabPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  activeTabPill: {
    backgroundColor: '#16A34A',
  },
  tabText: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#4B5563',
  },
  activeTabText: {
    fontFamily: 'semiBold',
    color: '#FFFFFF',
  },
  opportunityCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    
    marginBottom: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  matchBadgeStrong: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchTextStrong: {
    fontSize: 11,
    fontFamily: 'semiBold',
    color: '#16A34A',
  },
  matchBadgeGood: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchTextGood: {
    fontSize: 11,
    fontFamily: 'semiBold',
    color: '#D97706',
  },
  matchBadgePrep: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchTextPrep: {
    fontSize: 11,
    fontFamily: 'semiBold',
    color: '#D97706',
  },
  jobTitle: {
    fontSize: 15,
    fontFamily: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  companyName: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#6B7280',
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'regular',
    color: '#4B5563',
  },
  dotSeparator: {
    marginHorizontal: 6,
    color: '#9CA3AF',
  },
  typeText: {
    fontSize: 12,
    fontFamily: 'regular',
    color: '#4B5563',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  tagPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontFamily: 'regular',
    color: '#4B5563',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  deadlineText: {
    fontSize: 12,
    fontFamily: 'regular',
    color: '#6B7280',
  },
  skeletonHeader: {
    width: '50%',
    height: 24,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 16,
  },
  skeletonTabs: {
    width: '100%',
    height: 36,
    backgroundColor: '#E5E7EB',
    borderRadius: 18,
    marginBottom: 20,
  },
  skeletonCard: {
    width: '100%',
    height: 140,
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    marginBottom: 14,
  },
});