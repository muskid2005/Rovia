import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import CustomSafeArea from '../../components/safeArea';

const CATEGORIES = ['All', 'Graduate', 'NYSC', 'Internship'];

const OPPORTUNITIES = [
  {
    id: '1',
    matchType: 'Strong Match',
    matchColor: '#16A34A',
    matchBg: '#DCFCE7',
    matchIcon: 'checkmark-circle',
    title: 'Management Trainee Programme',
    company: 'Dangote Group',
    location: 'Lagos, Nigeria · Full-time',
    tags: ['Graduate', 'Management', 'Fresh Graduate'],
    deadline: '20 Nov 2026',
    isBookmarked: false,
  },
  {
    id: '2',
    matchType: 'Good Match',
    matchColor: '#D97706',
    matchBg: '#FEF3C7',
    matchIcon: 'alert-circle',
    title: 'Customer Service Representative',
    company: 'Access Bank',
    location: 'Abuja, Nigeria · Full-time',
    tags: ['NYSC', 'Customer Service', 'Entry Level'],
    deadline: '15 Nov 2026',
    isBookmarked: false,
  },
  {
    id: '3',
    matchType: 'Needs Preparation',
    matchColor: '#D97706',
    matchBg: '#FEF3C7',
    matchIcon: 'time',
    title: 'Data Analyst (Graduate Program)',
    company: 'MTN Nigeria',
    location: 'Lagos, Nigeria · Full-time',
    tags: ['Graduate', 'Data & Analytics'],
    deadline: '30 Nov 2026',
    isBookmarked: false,
  },
];

export default function DiscoverScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [opportunities, setOpportunities] = useState(OPPORTUNITIES);

  const toggleBookmark = (id) => {
    setOpportunities((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
      )
    );
  };

  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
          <TouchableOpacity style={styles.filterIconButton}>
            <Feather name="sliders" size={20} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Categories Filter Pills */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[styles.categoryPill, isActive && styles.activeCategoryPill]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[styles.categoryText, isActive && styles.activeCategoryText]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Opportunity Cards List */}
        {opportunities.map((item) => (
          <Pressable key={item.id} style={styles.card} onPress={()=>router.push(`/opportunityDetail`)}>
            
            {/* Card Header: Match Badge & Bookmark */}
            <View style={styles.cardTopRow}>
              <View style={[styles.matchBadge, { backgroundColor: item.matchBg }]}>
                <Ionicons name={item.matchIcon} size={14} color={item.matchColor} style={styles.matchIcon} />
                <Text style={[styles.matchText, { color: item.matchColor }]}>{item.matchType}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleBookmark(item.id)}>
                <Feather 
                  name={item.isBookmarked ? "bookmark" : "bookmark"} 
                  size={20} 
                  color={item.isBookmarked ? "#16A34A" : "#6B7280"} 
                />
              </TouchableOpacity>
            </View>

            {/* Job Title & Company */}
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.companyName}>{item.company}</Text>

            {/* Location & Type */}
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={14} color="#16A34A" style={styles.locationIcon} />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>

            {/* Tags Row */}
            <View style={styles.tagsRow}>
              {item.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            {/* Deadline */}
            <Text style={styles.deadlineText}>Deadline: {item.deadline}</Text>

          </Pressable>
        ))}

      </ScrollView>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'bold',
    color: '#111827',
  },
  filterIconButton: {
    padding: 4,
  },
  categoriesContainer: {
    paddingBottom: 16,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCategoryPill: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#374151',
  },
  activeCategoryText: {
    fontFamily: 'semi-bold',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchIcon: {
    marginRight: 4,
  },
  matchText: {
    fontSize: 12,
    fontFamily: 'semiBold',
  },
  jobTitle: {
    fontSize: 16,
    fontFamily: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#4B5563',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#6B7280',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'regular',
    color: '#1D4ED8',
  },
  deadlineText: {
    fontSize: 12,
    fontFamily: 'regular',
    color: '#6B7280',
  },
});