import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getRequest } from '../../../api/getRequests';
import { postRequest } from '../../../api/postRequests';
import CustomModal from '../../../components/customModal'; // <--- Your custom modal import
import CustomSafeArea from '../../../components/safeArea';

export default function ReadinessScreen() {
  const [opportunities, setOpportunities] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  // Custom Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const showCustomModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  // Fetch opportunities list on load/focus
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function fetchOpportunities() {
        setLoading(true);
        try {
          const response = await getRequest('/opportunities');
          const list = response?.data?.opportunities || response?.data || [];
          if (isMounted) {
            setOpportunities(Array.isArray(list) ? list : []);
          }
        } catch (error) {
          console.error('Failed to fetch opportunities:', error);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }

      fetchOpportunities();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  // Handle Analyse Action
  const handleAnalyse = async () => {
    if (!selectedId) {
      showCustomModal('Selection Required', 'Please select an opportunity to run your readiness check.');
      return;
    }

    setAnalyzing(true);
    try {
      const payload = { opportunityId: selectedId };
      const response = await postRequest('/readiness/analyse', payload);
      
      const readinessResultId = response?.data?.id || response?.id;

      if (readinessResultId) {
        router.push(`/(subScreens)/readiness/readinessResult?id=${readinessResultId}`);
      } else {
        showCustomModal('Error', 'Could not retrieve analysis result ID.');
      }
    } catch (error) {
      console.error('Failed to analyse readiness:', error?.response?.data || error?.message || error);
      showCustomModal('Error', error?.response?.data?.message || 'Could not run readiness analysis.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <Text style={styles.headerTitle}>Readiness Check</Text>
        <Text style={styles.headerSubtitle}>Select an opportunity to analyze your readiness score and actionable items.</Text>

        {/* List / Loading State */}
        {loading ? (
          [1, 2, 3].map((_, index) => (
            <View key={index} style={styles.skeletonCard} />
          ))
        ) : opportunities.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No opportunities available.</Text>
          </View>
        ) : (
          opportunities.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, isSelected && styles.selectedCard]}
                activeOpacity={0.8}
                onPress={() => setSelectedId(item.id)}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={[styles.jobTitle, isSelected && styles.selectedText]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    {isSelected ? (
                      <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                    ) : (
                      <View style={styles.radioOutline} />
                    )}
                  </View>
                  <Text style={styles.companyName} numberOfLines={1}>
                    {item.organisation}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        {/* Analyse Button */}
        {opportunities.length > 0 && (
          <TouchableOpacity
            style={[styles.analyseButton]}
            onPress={handleAnalyse}
            disabled={!selectedId || analyzing}
          >
            {analyzing ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.analyseButtonText}>Analyse Readiness</Text>
            )}
          </TouchableOpacity>
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
    fontSize: 26,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#6B7280',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  selectedCard: {
    borderColor: '#16A34A',
    backgroundColor: '#F0FDF4',
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
    marginRight: 8,
  },
  selectedText: {
    color: '#166534',
  },
  companyName: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#D97706',
  },
  radioOutline: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
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
  analyseButton: {
    backgroundColor: '#16A34A',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  analyseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'semiBold',
  },
  skeletonCard: {
    height: 75,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});