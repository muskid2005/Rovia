import { Feather, Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { getRequest } from '../../api/getRequests';
import CustomSafeArea from '../../components/safeArea';

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship'];

export default function FilterOpportunitiesScreen() {
  const [selectedJobType, setSelectedJobType] = useState('Full-time');
  const [filtersData, setFiltersData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchFiltersMeta() {
      setLoading(true);
      try {
        const response = await getRequest('/opportunities/filters');
        const data = response?.data || response;
        if (isMounted) {
          setFiltersData(data);
        }
      } catch (error) {
        console.error('Failed to fetch filter metadata:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchFiltersMeta();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleClearAll = () => {
    setSelectedJobType('Full-time');
  };

  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Title & Clear All */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Filter Opportunities</Text>
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearAllText}>Clear all</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          // Skeleton Loader State
          <View style={styles.skeletonContainer}>
            <View style={styles.skeletonLabel} />
            <View style={styles.skeletonBox} />
            <View style={[styles.skeletonLabel, { marginTop: 16 }]} />
            <View style={styles.skeletonPillsRow}>
              <View style={styles.skeletonPill} />
              <View style={styles.skeletonPill} />
              <View style={styles.skeletonPill} />
            </View>
            <View style={[styles.skeletonLabel, { marginTop: 16 }]} />
            <View style={styles.skeletonBox} />
            <View style={[styles.skeletonLabel, { marginTop: 16 }]} />
            <View style={styles.skeletonBox} />
            <View style={[styles.skeletonLabel, { marginTop: 16 }]} />
            <View style={styles.skeletonBox} />
          </View>
        ) : (
          <>
            {/* Location Filter */}
            <Text style={styles.fieldLabel}>Location</Text>
            <TouchableOpacity style={styles.dropdownField}>
              <View style={styles.dropdownLeft}>
                <Ionicons name="location-outline" size={16} color="#16A34A" style={styles.fieldIcon} />
                <Text style={styles.dropdownText}>Nigeria</Text>
              </View>
              <Feather name="chevron-down" size={16} color="#16A34A" />
            </TouchableOpacity>

            {/* Job Type Filter Pills */}
            <Text style={styles.fieldLabel}>Job Type</Text>
            <View style={styles.pillsRow}>
              {JOB_TYPES.map((type) => {
                const isSelected = selectedJobType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.pill, isSelected && styles.selectedPill]}
                    onPress={() => setSelectedJobType(type)}
                  >
                    <Text style={[styles.pillText, isSelected && styles.selectedPillText]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Industry Filter */}
            <Text style={styles.fieldLabel}>Industry</Text>
            <TouchableOpacity style={styles.dropdownField}>
              <Text style={styles.dropdownText}>All industries</Text>
              <Feather name="chevron-down" size={16} color="#16A34A" />
            </TouchableOpacity>

            {/* Salary Range Filter */}
            <Text style={styles.fieldLabel}>Salary Range</Text>
            <TouchableOpacity style={styles.dropdownField}>
              <Text style={styles.dropdownText}>₦0 – ₦500,000+</Text>
              <Feather name="chevron-down" size={16} color="#16A34A" />
            </TouchableOpacity>

            {/* Date Posted Filter */}
            <Text style={styles.fieldLabel}>Date Posted</Text>
            <TouchableOpacity style={styles.dropdownField}>
              <Text style={styles.dropdownText}>Anytime</Text>
              <Feather name="chevron-down" size={16} color="#16A34A" />
            </TouchableOpacity>
          </>
        )}

      </ScrollView>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'semiBold',
    color: '#111827',
  },
  clearAllText: {
    fontSize: 13,
    fontFamily: 'semiBold',
    color: '#16A34A',
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 8,
    marginTop: 12,
  },
  dropdownField: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldIcon: {
    marginRight: 8,
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#111827',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  selectedPill: {
    borderColor: '#16A34A',
    backgroundColor: '#16A34A',
  },
  pillText: {
    fontSize: 13,
    fontFamily: 'medium',
    color: '#4B5563',
  },
  selectedPillText: {
    color: '#FFFFFF',
    fontFamily: 'semiBold',
  },
  // Skeleton Styles
  skeletonContainer: {
    gap: 8,
  },
  skeletonLabel: {
    width: '30%',
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  skeletonBox: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  skeletonPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  skeletonPill: {
    flex: 1,
    height: 40,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
  },
});