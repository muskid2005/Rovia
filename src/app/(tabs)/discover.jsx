import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { getRequest } from "../../api/getRequests";
import FilterPanel from '../../components/FilterPanel';
import CustomSafeArea from '../../components/safeArea';

const CATEGORIES = ['All', 'Graduate', 'NYSC', 'Internship'];

export default function DiscoverScreen() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
const [selectedFilters, setSelectedFilters] = useState({});


  const toggleBookmark = (id) => {
    setOpportunities((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
      )
    );
  };

  const getTrustBadgeConfig = (label) => {
    switch (label) {
      case 'OFFICIALLY_VERIFIED':
        return { text: 'Officially Verified', bg: '#DCFCE7', color: '#16A34A', icon: 'checkmark-circle' };
      case 'SOURCE_VERIFIED':
        return { text: 'Source Verified', bg: '#DCFCE7', color: '#16A34A', icon: 'checkmark-circle' };
      case 'USER_REPORTED':
      default:
        return { text: 'User Reported', bg: '#FEF3C7', color: '#D97706', icon: 'alert-circle' };
    }
  };

 

async function fetchOpportunities(pageToFetch = 1, isAppending = false, filters = selectedFilters) {
    if (isAppending) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      let endpoint = `/opportunities?page=${pageToFetch}&limit=10`;

      // Search Query
      if (searchQuery && searchQuery.trim() !== '') {
        endpoint += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      // Opportunity Type
      const activeType = filters?.type || (selectedCategory !== 'All' ? selectedCategory.toUpperCase() : null);
      if (activeType && activeType.trim() !== '') {
        endpoint += `&type=${encodeURIComponent(activeType.trim())}`;
      }

      // Work Mode (REMOTE, HYBRID, ONSITE)
      if (filters?.workMode && filters.workMode.trim() !== '') {
        endpoint += `&workMode=${encodeURIComponent(filters.workMode.trim())}`;
      }

      // Country
      if ((filters?.location || filters?.country) && (filters.location || filters.country).trim() !== '') {
        const countryVal = (filters.location || filters.country).trim();
        endpoint += `&country=${encodeURIComponent(countryVal)}`;
      }

      // Career Level
      if (filters?.careerLevel) {
        endpoint += `&careerLevel=${encodeURIComponent(filters.careerLevel)}`;
      }

      // Sort
      if (filters?.sort) {
        endpoint += `&sort=${encodeURIComponent(filters.sort)}`;
      }

      const response = await getRequest(endpoint);
      console.log(opportunities)
      const fetchedData = response?.data?.opportunities || response?.opportunities || [];
      const paginationInfo = response?.data?.pagination || response?.pagination;

      if (isAppending) {
        setOpportunities((prev) => [...prev, ...fetchedData]);
      } else {
        setOpportunities(fetchedData);
      }

      if (paginationInfo) {
        setCurrentPage(paginationInfo.currentPage || pageToFetch);
        setTotalPages(paginationInfo.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch opportunities:', error?.response?.data);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;

    if (isCloseToBottom && !loading && !loadingMore && currentPage < totalPages) {
      fetchOpportunities(currentPage + 1, true);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [selectedCategory, searchQuery]);

  return (
    <CustomSafeArea>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        
        {/* Header Section */}
        {/* <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
          <TouchableOpacity style={styles.filterIconButton} onPress={()=> router.push(`/(subScreens)/filter`)}>
            <Feather name="sliders" size={20} color="#111827" />
          </TouchableOpacity>
        </View> */}

        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
          <TouchableOpacity style={styles.filterIconButton} onPress={() => setShowFilter(!showFilter)}>
            <Feather name="sliders" size={20} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Conditionally Render Filter Panel */}
        {showFilter && (
          <FilterPanel 
            onApplyFilters={(filters) => {
              setSelectedFilters(filters);
              setShowFilter(false);
              // Trigger your fetch with these filters!
              fetchOpportunities(1, false, filters);
            }} 
            onClose={() => setShowFilter(false)} 
          />
        )}

{/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search opportunities, skills, or keywords..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => fetchOpportunities(1, false)}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => {
                setSearchQuery('');
                fetchOpportunities(1, false); // Resets the list back to default
              }}
              style={styles.clearIconButton}
            >
              <Feather name="x" size={16} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Opportunity Cards List */}
        {loading ? (
          [1, 2, 3, 4, 5, 6, 7].map((_, index) => (
            <View key={index} style={styles.skeletonCard}>
              <View style={styles.skeletonLineShort} />
              <View style={styles.skeletonLineLong} />
              <View style={styles.skeletonMetaRow}>
                <View style={styles.skeletonBadge} />
                <View style={styles.skeletonBadge} />
              </View>
            </View>
          ))
        ) : opportunities.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No opportunities found.</Text>
          </View>
        ) : (
          opportunities.map((item) => (
            <Pressable 
              key={item.id} 
              style={styles.card} 
              onPress={() => router.push(`/(subScreens)/opportunityApplication/opportunityDetail?id=${item.id}`)}
            >
              <View style={styles.cardTopRow}>
                {(() => {
                  const badge = getTrustBadgeConfig(item.trustLabel);
                  return (
                    <View style={[styles.matchBadge, { backgroundColor: badge.bg }]}>
                      <Ionicons name={badge.icon} size={14} color={badge.color} style={styles.matchIcon} />
                      <Text style={[styles.matchText, { color: badge.color }]}>
                        {badge.text}
                      </Text>
                    </View>
                  );
                })()}

                {item.status && (
                  <View style={[styles.statusBadge, item.status === 'CLOSING_SOON' ? styles.closingSoonBadge : styles.activeBadge]}>
                    <Text style={[styles.statusText, item.status === 'CLOSING_SOON' ? styles.closingSoonText : styles.activeText]}>
                      {item.status.replace('_', ' ')}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text style={styles.companyName}>{item.organisation}</Text>

              <View style={styles.locationRow}>
                <Feather name="map-pin" size={14} color="#16A34A" style={styles.locationIcon} />
                <Text style={styles.locationText}>{item.location}{item.country ? `, ${item.country}` : ''}</Text>
              </View>

              <View style={styles.tagsRow}>
                {[item.type?.replace('_', ' '), item.workMode].filter(Boolean).map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.deadlineText}>
                {item.deadline ? `Deadline: ${item.deadline}` : 'No deadline specified'}
              </Text>

            </Pressable>
          ))
        )}

{/* Render bottom skeletons and loader when fetching the next page */}
        {loadingMore && (
          <>
            {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
              <View key={`skeleton-${index}`} style={styles.skeletonCard}>
                <View style={styles.skeletonLineShort} />
                <View style={styles.skeletonLineLong} />
                <View style={styles.skeletonMetaRow}>
                  <View style={styles.skeletonBadge} />
                  <View style={styles.skeletonBadge} />
                </View>
              </View>
            ))}
            <View style={styles.footerLoaderContainer}>
              <ActivityIndicator size="small" color="#16A34A" />
              <Text style={styles.footerLoaderText}>Loading more opportunities...</Text>
            </View>
          </>
        )}

      </ScrollView>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  clearIconButton: {
    padding: 4,
    marginLeft: 4,
  },
  footerLoaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  footerLoaderText: {
    fontSize: 12,
    fontFamily: 'medium',
    color: '#6B7280',
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'semiBold',
    color: '#111827',
  },
  filterIconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'regular',
    color: '#111827',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  matchIcon: {
    marginRight: 4,
  },
  matchText: {
    fontSize: 11,
    fontFamily: 'semiBold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeBadge: {
    backgroundColor: '#DCFCE7',
  },
  closingSoonBadge: {
    backgroundColor: '#FEE2E2',
  },
  activeText: {
    fontSize: 10,
    fontFamily: 'semiBold',
    color: '#16A34A',
  },
  closingSoonText: {
    fontSize: 10,
    fontFamily: 'semiBold',
    color: '#DC2626',
  },
  jobTitle: {
    fontSize: 16,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 13,
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
    fontSize: 12,
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
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontFamily: 'regular',
    color: '#374151',
  },
  deadlineText: {
    fontSize: 11,
    fontFamily: 'regular',
    color: '#9CA3AF',
  },
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  skeletonLineShort: {
    width: '60%',
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonLineLong: {
    width: '40%',
    height: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 14,
  },
  skeletonMetaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  skeletonBadge: {
    width: 70,
    height: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'regular',
  },
});
