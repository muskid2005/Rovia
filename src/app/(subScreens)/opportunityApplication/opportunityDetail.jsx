import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import CustomSafeArea from '../../../components/safeArea';

export default function OpportunityDetailsScreen() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSaved, setIsSaved] = useState(false);

  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#16A34A" />
        </TouchableOpacity>

        {/* Banner Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/400x200' }}
            style={styles.bannerImage}
          />
        </View>

        {/* Match Badge */}
        <View style={styles.badgeRow}>
          <View style={styles.matchBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#16A34A" style={styles.matchIcon} />
            <Text style={styles.matchText}>Strong Match</Text>
          </View>
        </View>

        {/* Title and Company */}
        <Text style={styles.jobTitle}>Management Trainee Programme</Text>
        
        <View style={styles.infoRow}>
          <Feather name="briefcase" size={14} color="#6B7280" style={styles.infoIcon} />
          <Text style={styles.infoText}>Dangote Group</Text>
        </View>

        <View style={styles.infoRow}>
          <Feather name="map-pin" size={14} color="#16A34A" style={styles.infoIcon} />
          <Text style={styles.infoText}>Lagos, Nigeria</Text>
          <Text style={styles.dotSeparator}>·</Text>
          <Text style={styles.infoText}>Full-time</Text>
        </View>

        <View style={styles.infoRow}>
          <Feather name="award" size={14} color="#6B7280" style={styles.infoIcon} />
          <Text style={styles.infoText}>Graduate</Text>
          <Text style={styles.dotSeparator}>·</Text>
          <Text style={styles.infoText}>0 – 2 years</Text>
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

        {/* Section Content */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>About the role</Text>
          <Text style={styles.sectionBody}>
            The Management Trainee Programme is designed to develop future leaders through structured learning, hands-on experience and mentorship across various business units.
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.applyButton} onPress={()=> router.push("apply1")}>
          <Text style={styles.applyButtonText}>Apply now</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={() => setIsSaved(!isSaved)}
        >
          <Feather name="bookmark" size={18} color="#16A34A" style={{ marginRight: 6 }} />
          <Text style={styles.saveButtonText}>{isSaved ? 'Saved' : 'Save'}</Text>
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
    marginBottom: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  badgeRow: {
    marginBottom: 8,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  matchIcon: {
    marginRight: 4,
  },
  matchText: {
    fontSize: 12,
    fontFamily: 'semibold',
    color: '#16A34A',
  },
  jobTitle: {
    fontSize: 22,
    fontFamily: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoIcon: {
    marginRight: 6,
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
    marginTop: 16,
    marginBottom: 20,
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
    fontFamily: 'regular',
    color: '#6B7280',
  },
  activeTabText: {
    fontFamily: 'bold',
    color: '#16A34A',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#4B5563',
    lineHeight: 22,
  },
  applyButton: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'semiBold',
  },
  saveButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#16A34A',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#16A34A',
    fontSize: 15,
    fontFamily: 'semiBold',
  },
});
