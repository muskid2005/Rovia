
import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { getRequest } from '../../api/getRequests';
import CustomSafeArea from '../../components/safeArea';

export default function SavedOpportunitiesScreen() {
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function fetchSavedOpportunities() {
        setLoading(true);
        try {
          const response = await getRequest('/opportunities/saved');
          const list = response?.data?.savedOpportunities || [];
        //   console.log(response.data.savedOpportunities)
          
          if (isMounted) {
            setSavedOpportunities(Array.isArray(list) ? list : []);
          }
        } catch (error) {
          console.error('Failed to fetch saved opportunities:', error);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }

      fetchSavedOpportunities();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Title */}
        <Text style={styles.headerTitle}>Saved Opportunities</Text>

        {loading ? (
          [1, 2, 3, 4].map((_, index) => (
            <View key={index} style={styles.skeletonCard}>
              <View style={styles.skeletonLineShort} />
              <View style={styles.skeletonLineLong} />
              <View style={styles.skeletonBadge} />
            </View>
          ))
        ) : savedOpportunities.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No saved opportunities found.</Text>
          </View>
        ) : (
          savedOpportunities.map((item) => (
            <Pressable 
              key={item.opportunity.id} 
              style={styles.card} 
              onPress={() => router.push(`/(subScreens)/opportunityApplication/opportunityDetail?id=${item.opportunity.id}`)}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.jobTitle} numberOfLines={1}>{item.opportunity.title}</Text>
                  <Feather name="chevron-right" size={18} color="#9CA3AF" />
                </View>
                <Text style={styles.companyName} numberOfLines={1}>
                  {item.opportunity.organisation}
                </Text>
                <View style={styles.savedBadge}>
                  <Text style={styles.savedBadgeText}>Saved</Text>
                </View>
              </View>
            </Pressable>
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
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardContent: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 15,
    fontFamily: 'semiBold',
    color: '#111827',
    flex: 1,
    marginRight: 4,
  },
  companyName: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#D97706',
    marginBottom: 10,
  },
  savedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  savedBadgeText: {
    fontSize: 11,
    fontFamily: 'semiBold',
    color: '#1D4ED8',
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
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
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
  skeletonBadge: {
    width: 120,
    height: 22,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    marginTop: 4,
  },
});