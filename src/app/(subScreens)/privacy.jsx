// import { Feather, Ionicons } from '@expo/vector-icons';
// import { router, useFocusEffect } from 'expo-router';
// import { useCallback, useState } from 'react';
// import {
//     ActivityIndicator,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import { getRequest } from '../../api/getRequests';
// import CustomModal from '../../components/customModal';
// import CustomSafeArea from '../../components/safeArea';

// export default function PrivacyScreen() {
//   const [viewMode, setViewMode] = useState('privacy'); // 'privacy' or 'report'
//   const [privacyData, setPrivacyData] = useState(null);
//   const [reportData, setReportData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Custom Feedback Modal States
//   const [feedbackVisible, setFeedbackVisible] = useState(false);
//   const [feedbackTitle, setFeedbackTitle] = useState('');
//   const [feedbackMessage, setFeedbackMessage] = useState('');

//   const showFeedback = (title, message) => {
//     setFeedbackTitle(title);
//     setFeedbackMessage(message);
//     setFeedbackVisible(true);
//   };

//   useFocusEffect(
//     useCallback(() => {
//       let isMounted = true;

//       async function fetchData() {
//         setLoading(true);
//         try {
//           const [privacyRes, reportRes] = await Promise.all([
//             getRequest('/trust/privacy'),
//             getRequest('/trust/report'),
//           ]);

//           if (isMounted) {
//             setPrivacyData(privacyRes?.data || privacyRes || {});
//             setReportData(reportRes?.data || reportRes || {});
//             console.log(reportData)
//           }
//         } catch (error) {
//           console.error('Failed to fetch trust & privacy data:', error);
//           const errorMessage =
//             error?.response?.data?.message ||
//             error?.message ||
//             'Could not load privacy and report details.';
//           showFeedback('Error', errorMessage);
//         } finally {
//           if (isMounted) {
//             setLoading(false);
//           }
//         }
//       }

//       fetchData();

//       return () => {
//         isMounted = false;
//       };
//     }, [])
//   );

//   return (
//     <CustomSafeArea>
//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
//         {/* Header */}
//         <View style={styles.headerRow}>
//           <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//             <Feather name="chevron-left" size={24} color="#16A34A" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>
//             {viewMode === 'privacy' ? 'Privacy Settings' : 'Trust Report'}
//           </Text>
//           <View style={{ width: 24 }} />
//         </View>

//         <Text style={styles.subtitleText}>
//           {viewMode === 'privacy'
//             ? 'Review your current account privacy settings and data sharing preferences.'
//             : 'Detailed trust and user data report retrieved from your account.'}
//         </Text>

//         {/* Loading State */}
//         {loading ? (
//           <View style={styles.loaderContainer}>
//             <ActivityIndicator size="large" color="#16A34A" />
//           </View>
//         ) : viewMode === 'privacy' ? (
//           /* Privacy View */
//           <View style={styles.card}>
//             <Text style={styles.cardHeader}>Privacy Configurations</Text>
//             {privacyData && Object.keys(privacyData).length > 0 ? (
//               Object.entries(privacyData).map(([key, value], idx) => (
//                 <View key={idx} style={styles.rowItem}>
//                   <Text style={styles.rowKey}>{key}</Text>
//                   <Text style={styles.rowValue}>
//                     {typeof value === 'boolean' ? (value ? 'Enabled' : 'Disabled') : String(value)}
//                   </Text>
//                 </View>
//               ))
//             ) : (
//               <Text style={styles.emptyText}>No privacy settings found.</Text>
//             )}
//           </View>
//         ) : (
//           /* Report View */
//           <View style={styles.card}>
//             <Text style={styles.cardHeader}>Full Trust Report Data</Text>
//             {reportData && Object.keys(reportData).length > 0 ? (
//               Object.entries(reportData).map(([key, value], idx) => (
//                 <View key={idx} style={styles.rowItem}>
//                   <Text style={styles.rowKey}>{key}</Text>
//                   <Text style={styles.rowValue}>
//                     {typeof value === 'object' ? JSON.stringify(value) : String(value)}
//                   </Text>
//                 </View>
//               ))
//             ) : (
//               <Text style={styles.emptyText}>No report data found.</Text>
//             )}
//           </View>
//         )}

//         {/* Bottom Toggle Button */}
//         {!loading && (
//           <TouchableOpacity
//             style={styles.switchButton}
//             onPress={() => setViewMode(viewMode === 'privacy' ? 'report' : 'privacy')}
//             activeOpacity={0.8}
//           >
//             <Ionicons
//               name={viewMode === 'privacy' ? 'document-text-outline' : 'shield-outline'}
//               size={18}
//               color="#FFFFFF"
//             />
//             <Text style={styles.switchButtonText}>
//               {viewMode === 'privacy' ? 'Show Full Report' : 'Show Privacy Settings'}
//             </Text>
//           </TouchableOpacity>
//         )}

//       </ScrollView>

//       {/* Reusable Custom Modal */}
//       <CustomModal
//         visible={feedbackVisible}
//         title={feedbackTitle}
//         message={feedbackMessage}
//         onClose={() => setFeedbackVisible(false)}
//       />
//     </CustomSafeArea>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContent: {
//     padding: 16,
//     paddingBottom: 40,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontFamily: 'semiBold',
//     color: '#111827',
//   },
//   backButton: {
//     padding: 4,
//   },
//   subtitleText: {
//     fontSize: 14,
//     fontFamily: 'regular',
//     color: '#6B7280',
//     marginBottom: 20,
//     lineHeight: 20,
//   },
//   loaderContainer: {
//     paddingVertical: 60,
//     alignItems: 'center',
//   },
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 14,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     marginBottom: 20,
//   },
//   cardHeader: {
//     fontSize: 16,
//     fontFamily: 'semiBold',
//     color: '#111827',
//     marginBottom: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//     paddingBottom: 8,
//   },
//   rowItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   rowKey: {
//     fontSize: 13,
//     fontFamily: 'semiBold',
//     color: '#374151',
//     flex: 1,
//     textTransform: 'capitalize',
//   },
//   rowValue: {
//     fontSize: 13,
//     fontFamily: 'regular',
//     color: '#6B7280',
//     flex: 1,
//     textAlign: 'right',
//   },
//   emptyText: {
//     fontSize: 14,
//     fontFamily: 'regular',
//     color: '#9CA3AF',
//     textAlign: 'center',
//     paddingVertical: 20,
//   },
//   switchButton: {
//     backgroundColor: '#16A34A',
//     borderRadius: 14,
//     paddingVertical: 16,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 8,

//   },
//   switchButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontFamily: 'semiBold',
//   },
// });

import { Feather, Ionicons } from '@expo/vector-icons';
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
import { getRequest } from '../../api/getRequests';
import CustomModal from '../../components/customModal';
import CustomSafeArea from '../../components/safeArea';

export default function PrivacyScreen() {
  const [viewMode, setViewMode] = useState('privacy'); // 'privacy' or 'report'
  const [privacyData, setPrivacyData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Custom Feedback Modal States
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const showFeedback = (title, message) => {
    setFeedbackTitle(title);
    setFeedbackMessage(message);
    setFeedbackVisible(true);
  };

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function fetchData() {
        setLoading(true);
        try {
          const [privacyRes, reportRes] = await Promise.all([
            getRequest('/trust/privacy'),
            getRequest('/trust/report'),
          ]);

          if (isMounted) {
            setPrivacyData(privacyRes?.data || privacyRes || {});
            setReportData(reportRes?.data || reportRes || {});
          }
        } catch (error) {
          console.error('Failed to fetch trust & privacy data:', error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Could not load privacy and report details.';
          showFeedback('Error', errorMessage);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }

      fetchData();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="chevron-left" size={24} color="#16A34A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {viewMode === 'privacy' ? 'Privacy Settings' : 'Trust Report'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.subtitleText}>
          {viewMode === 'privacy'
            ? 'Review your current account privacy settings and data sharing preferences.'
            : 'Detailed trust and user data report retrieved from your account.'}
        </Text>

        {/* Loading State */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#16A34A" />
          </View>
        ) : viewMode === 'privacy' ? (
          /* Privacy View */
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Privacy Configurations</Text>
            {privacyData && Object.keys(privacyData).length > 0 ? (
              Object.entries(privacyData).map(([key, value], idx) => (
                <View key={idx} style={styles.rowItem}>
                  <Text style={styles.rowKey}>{key}</Text>
                  <Text style={styles.rowValue}>
                    {typeof value === 'boolean' ? (value ? 'Enabled' : 'Disabled') : String(value)}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No privacy settings found.</Text>
            )}
          </View>
        ) : (
          /* Report View */
          <View>
            {/* Account Summary Card */}
            {reportData?.account && (
              <View style={styles.card}>
                <Text style={styles.cardHeader}>Account Info</Text>
                <View style={styles.rowItem}>
                  <Text style={styles.rowKey}>Email</Text>
                  <Text style={styles.rowValue}>{reportData.account.email}</Text>
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.rowKey}>Joined At</Text>
                  <Text style={styles.rowValue}>{reportData.account.joinedAt?.split('T')[0]}</Text>
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.rowKey}>Source</Text>
                  <Text style={styles.rowValue}>{reportData.account.source}</Text>
                </View>
              </View>
            )}

            {/* Summary Metrics */}
            {reportData?.summary && (
              <View style={styles.card}>
                <Text style={styles.cardHeader}>Summary Metrics</Text>
                <View style={styles.rowItem}>
                  <Text style={styles.rowKey}>Total Data Points</Text>
                  <Text style={styles.rowValue}>{reportData.summary.totalDataPoints}</Text>
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.rowKey}>User Provided</Text>
                  <Text style={styles.rowValue}>{reportData.summary.userProvided}</Text>
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.rowKey}>AI Generated</Text>
                  <Text style={styles.rowValue}>{reportData.summary.aiGenerated}</Text>
                </View>
              </View>
            )}

            {/* Data Categories Breakdown */}
            {reportData?.data && Array.isArray(reportData.data) && (
              <View style={styles.card}>
                <Text style={styles.cardHeader}>Data Categories</Text>
                {reportData.data.map((cat, idx) => (
                  <View key={idx} style={styles.categoryItem}>
                    <View style={styles.categoryHeaderRow}>
                      <Text style={styles.rowKey}>{cat.category}</Text>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{cat.source}</Text>
                      </View>
                    </View>
                    <Text style={styles.rowValueCount}>Count: {cat.count ?? 0}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Bottom Toggle Button */}
        {!loading && (
          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setViewMode(viewMode === 'privacy' ? 'report' : 'privacy')}
            activeOpacity={0.8}
          >
            <Ionicons
              name={viewMode === 'privacy' ? 'document-text-outline' : 'shield-outline'}
              size={18}
              color="#FFFFFF"
            />
            <Text style={styles.switchButtonText}>
              {viewMode === 'privacy' ? 'Show Full Report' : 'Show Privacy Settings'}
            </Text>
          </TouchableOpacity>
        )}

      </ScrollView>

      {/* Reusable Custom Modal */}
      <CustomModal
        visible={feedbackVisible}
        title={feedbackTitle}
        message={feedbackMessage}
        onClose={() => setFeedbackVisible(false)}
      />
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'semiBold',
    color: '#111827',
  },
  backButton: {
    padding: 4,
  },
  subtitleText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  loaderContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  cardHeader: {
    fontSize: 16,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 8,
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  rowKey: {
    fontSize: 13,
    fontFamily: 'semiBold',
    color: '#374151',
    flex: 1,
  },
  rowValue: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#6B7280',
    flex: 1,
    textAlign: 'right',
  },
  rowValueCount: {
    fontSize: 12,
    fontFamily: 'regular',
    color: '#9CA3AF',
  },
  badge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'medium',
    color: '#4B5563',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 20,
  },
  switchButton: {
    backgroundColor: '#16A34A',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  switchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'semiBold',
  },
});