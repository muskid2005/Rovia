

// import { Feather, Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import { useEffect, useState } from 'react';
// import {
//     Pressable,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View
// } from 'react-native';
// import { getRequest } from '../../api/getRequests';
// import CustomSafeArea from '../../components/safeArea';

// export default function LearnScreen() {
//   const [activeTab, setActiveTab] = useState('For You');
//   const [learningItems, setLearningItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let isMounted = true;

//     async function fetchLearnContent() {
//       setLoading(true);
//       try {
//         let endpoint = '/learning';
//         if (activeTab === 'For You') {
//           endpoint = '/learning/suggested'; // AI-suggested resources based on skill gaps
//         } else if (activeTab === 'Resources') {
//           endpoint = '/learning/my'; // User's saved learning resources
//         }

//         const response = await getRequest(endpoint);
//         console.log(response)
//         const data = response?.data || response || [];
        
//         if (isMounted) {
//           setLearningItems(Array.isArray(data) ? data : data.resources || data.items || []);
//         }
//       } catch (error) {
//         console.error('Failed to fetch learn content:', error?.response?.data || error?.message || error);
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     }

//     fetchLearnContent();

//     return () => {
//       isMounted = false;
//     };
//   }, [activeTab]);

//   return (
//     <CustomSafeArea>
//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
//         {/* Header Title */}
//         <Text style={styles.headerTitle}>Learn</Text>

//         {/* Tabs: For You / Courses / Resources */}
//         <View style={styles.tabToggleContainer}>
//           {['For You', 'Courses', 'Resources'].map((tab) => {
//             const isActive = activeTab === tab;
//             return (
//               <TouchableOpacity
//                 key={tab}
//                 style={[styles.toggleButton, isActive && styles.activeToggleButton]}
//                 onPress={() => setActiveTab(tab)}
//               >
//                 <Text style={[styles.toggleButtonText, isActive && styles.activeToggleText]}>
//                   {tab}
//                 </Text>
//               </TouchableOpacity>
//             );
//           })}
//         </View>

//         {loading ? (
//           // Skeleton Loader State
//           <View style={styles.skeletonContainer}>
//             <View style={styles.skeletonSectionHeader} />
//             <View style={styles.skeletonContinueCard} />
//             <View style={[styles.skeletonSectionHeader, { marginTop: 20 }]} />
//             {[1, 2, 3].map((_, index) => (
//               <View key={index} style={styles.skeletonTopicCard} />
//             ))}
//           </View>
//         ) : learningItems.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No learning items found for {activeTab}.</Text>
//           </View>
//         ) : (
//           <>
//             {/* Featured / Continue Learning Item (First item as primary hero card) */}
//             {learningItems.length > 0 && (
//               <>
//                 <Text style={styles.sectionHeader}>
//                   {activeTab === 'For You' ? 'Recommended for you' : 'Featured learning'}
//                 </Text>
                
//                 <Pressable 
//                   style={styles.continueCard} 
//                   onPress={() => router.push(`/courseDetail?id=${learningItems[0].id}`)}
//                 >
//                   <Text style={styles.courseTitle}>
//                     {learningItems[0].title || learningItems[0].name || 'Learning Module'}
//                   </Text>
//                   <View style={styles.courseMetaRow}>
//                     <Text style={styles.courseMetaText}>
//                       {learningItems[0].duration || '10 min'}
//                     </Text>
//                     <Text style={styles.dotSeparator}>·</Text>
//                     <Text style={styles.courseMetaText}>
//                       {learningItems[0].level || 'Beginner'}
//                     </Text>
//                   </View>
                  
//                   {/* Progress Bar & Percentage */}
//                   <View style={styles.progressRow}>
//                     <View style={styles.progressBarBackground}>
//                       <View 
//                         style={[
//                           styles.progressBarFill, 
//                           { width: `${learningItems[0].progress || 40}%` }
//                         ]} 
//                       />
//                     </View>
//                     <Text style={styles.progressPercentage}>
//                       {learningItems[0].progress || 40}%
//                     </Text>
//                     <Ionicons name="play-circle" size={24} color="#16A34A" style={styles.playIcon} />
//                   </View>
//                 </Pressable>
//               </>
//             )}

//             {/* Remaining Topics List */}
//             <Text style={styles.sectionHeader}>Explore topics</Text>

//             {learningItems.slice(1).map((item, index) => {
//               const colors = ['#EEF2FF', '#F0FDF4', '#FEF3C7'];
//               const iconColors = ['#3B82F6', '#16A34A', '#D97706'];
//               const iconNames = ['document-text-outline', 'diamond-outline', 'school-outline'];
              
//               const colorIdx = index % colors.length;

//               return (
//                 <Pressable 
//                   key={item.id || index} 
//                   style={styles.topicCard} 
//                   onPress={() => router.push(`/topicDetail?id=${item.id}`)}
//                 >
//                   <View style={[styles.topicIconContainer, { backgroundColor: colors[colorIdx] }]}>
//                     <Ionicons name={iconNames[colorIdx]} size={20} color={iconColors[colorIdx]} />
//                   </View>
//                   <View style={styles.topicInfo}>
//                     <Text style={styles.topicTitle}>{item.title || item.name}</Text>
//                     <Text style={styles.topicModules}>
//                       {item.modulesCount ? `${item.modulesCount} modules` : (item.category || 'Module')}
//                     </Text>
//                   </View>
//                   <Feather name="chevron-right" size={18} color="#9CA3AF" />
//                 </Pressable>
//               );
//             })}
//           </>
//         )}

//       </ScrollView>
//     </CustomSafeArea>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContent: {
//     paddingBottom: 40,
//   },
//   headerTitle: {
//     fontSize: 26,
//     fontFamily: 'semiBold',
//     color: '#111827',
//     marginBottom: 16,
//   },
//   tabToggleContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#F3F4F6',
//     borderRadius: 30,
//     padding: 4,
//     marginBottom: 24,
//   },
//   toggleButton: {
//     flex: 1,
//     paddingVertical: 10,
//     alignItems: 'center',
//     borderRadius: 24,
//   },
//   activeToggleButton: {
//     backgroundColor: '#16A34A',
//   },
//   toggleButtonText: {
//     fontSize: 13,
//     fontFamily: 'semiBold',
//     color: '#4B5563',
//   },
//   activeToggleText: {
//     color: '#FFFFFF',
//     fontFamily: 'semiBold',
//   },
//   sectionHeader: {
//     fontSize: 18,
//     fontFamily: 'semiBold',
//     color: '#111827',
//     marginBottom: 12,
//   },
//   continueCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
    
//     marginBottom: 24,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   courseTitle: {
//     fontSize: 16,
//     fontFamily: 'semiBold',
//     color: '#111827',
//     marginBottom: 6,
//   },
//   courseMetaRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 14,
//   },
//   courseMetaText: {
//     fontSize: 13,
//     fontFamily: 'regular',
//     color: '#D97706',
//   },
//   dotSeparator: {
//     marginHorizontal: 6,
//     color: '#9CA3AF',
//   },
//   progressRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   progressBarBackground: {
//     flex: 1,
//     height: 8,
//     backgroundColor: '#F3F4F6',
//     borderRadius: 4,
//     overflow: 'hidden',
//     marginRight: 12,
//   },
//   progressBarFill: {
//     height: '100%',
//     backgroundColor: '#16A34A',
//     borderRadius: 4,
//   },
//   progressPercentage: {
//     fontSize: 13,
//     fontFamily: 'semiBold',
//     color: '#4B5563',
//     marginRight: 12,
//   },
//   playIcon: {
//     marginLeft: 4,
//   },
//   topicCard: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 14,
//     padding: 14,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     alignItems: 'center',
//   },
//   topicIconContainer: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   topicInfo: {
//     flex: 1,
//   },
//   topicTitle: {
//     fontSize: 15,
//     fontFamily: 'semiBold',
//     color: '#111827',
//     marginBottom: 2,
//   },
//   topicModules: {
//     fontSize: 13,
//     fontFamily: 'regular',
//     color: '#6B7280',
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     marginTop: 60,
//   },
//   emptyText: {
//     fontSize: 14,
//     fontFamily: 'regular',
//     color: '#6B7280',
//   },
//   // Skeleton Styles
//   skeletonContainer: {
//     gap: 12,
//   },
//   skeletonSectionHeader: {
//     width: '40%',
//     height: 20,
//     backgroundColor: '#E5E7EB',
//     borderRadius: 4,
//     marginBottom: 4,
//   },
//   skeletonContinueCard: {
//     height: 120,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     marginBottom: 12,
//   },
//   skeletonTopicCard: {
//     height: 70,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
// });

import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { getRequest } from '../../api/getRequests';
import CustomSafeArea from '../../components/safeArea';

export default function LearnScreen() {
  const [activeTab, setActiveTab] = useState('For You');
  const [learningItems, setLearningItems] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchLearnContent() {
      setLoading(true);
      try {
        let endpoint = '/learning';
        if (activeTab === 'For You') {
          endpoint = '/learning/suggested'; // AI-suggested resources based on skill gaps
        } else if (activeTab === 'Resources') {
          endpoint = '/learning/my'; // User's saved learning resources
        }

        const response = await getRequest(endpoint);
        console.log('LEARN RESPONSE:', response);

        const responseData = response?.data || response || {};
        
        // Handle API structures where data might contain aiSuggestions text and curatedResources array
        const items = responseData.curatedResources || responseData.resources || responseData.items || (Array.isArray(responseData) ? responseData : []);
        const suggestions = responseData.aiSuggestions || null;

        if (isMounted) {
          setLearningItems(Array.isArray(items) ? items : []);
          setAiSuggestions(suggestions);
        }
      } catch (error) {
        console.error('Failed to fetch learn content:', error?.response?.data || error?.message || error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchLearnContent();

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Title */}
        <Text style={styles.headerTitle}>Learn</Text>

        {/* Tabs: For You / Courses / Resources */}
        <View style={styles.tabToggleContainer}>
          {['For You', 'Courses', 'Resources'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.toggleButton, isActive && styles.activeToggleButton]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.toggleButtonText, isActive && styles.activeToggleText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {loading ? (
          /* Skeleton Loader State */
          <View style={styles.skeletonContainer}>
            <View style={styles.skeletonSectionHeader} />
            <View style={styles.skeletonContinueCard} />
            <View style={[styles.skeletonSectionHeader, { marginTop: 20 }]} />
            {[1, 2, 3].map((_, index) => (
              <View key={index} style={styles.skeletonTopicCard} />
            ))}
          </View>
        ) : (
          <>
            {/* AI Guidance / Suggestions Banner (if provided by backend) */}
            {aiSuggestions && activeTab === 'For You' && (
              <View style={styles.aiCard}>
                <View style={styles.aiHeaderRow}>
                  <Ionicons name="sparkles" size={18} color="#16A34A" />
                  <Text style={styles.aiHeaderTitle}>Rovia AI Insights</Text>
                </View>
                <Text style={styles.aiText}>
                  {aiSuggestions.replace(/\*\*/g, '')}
                </Text>
              </View>
            )}

            {learningItems.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {aiSuggestions 
                    ? 'No external resources linked yet. Follow the suggestions above to bridge your skill gaps!' 
                    : `No learning items found for ${activeTab}.`}
                </Text>
              </View>
            ) : (
              <>
                {/* Featured / Continue Learning Item (First item as primary hero card) */}
                <Text style={styles.sectionHeader}>
                  {activeTab === 'For You' ? 'Recommended for you' : 'Featured learning'}
                </Text>
                
                <Pressable 
                  style={styles.continueCard} 
                  onPress={() => router.push(`/courseDetail?id=${learningItems[0].id}`)}
                >
                  <Text style={styles.courseTitle}>
                    {learningItems[0].title || learningItems[0].name || 'Learning Module'}
                  </Text>
                  <View style={styles.courseMetaRow}>
                    <Text style={styles.courseMetaText}>
                      {learningItems[0].duration || '10 min'}
                    </Text>
                    <Text style={styles.dotSeparator}>·</Text>
                    <Text style={styles.courseMetaText}>
                      {learningItems[0].level || 'Beginner'}
                    </Text>
                  </View>
                  
                  {/* Progress Bar & Percentage */}
                  <View style={styles.progressRow}>
                    <View style={styles.progressBarBackground}>
                      <View 
                        style={[
                          styles.progressBarFill, 
                          { width: `${learningItems[0].progress || 40}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressPercentage}>
                      {learningItems[0].progress || 40}%
                    </Text>
                    <Ionicons name="play-circle" size={24} color="#16A34A" style={styles.playIcon} />
                  </View>
                </Pressable>

                {/* Remaining Topics List */}
                {learningItems.length > 1 && (
                  <>
                    <Text style={styles.sectionHeader}>Explore topics</Text>

                    {learningItems.slice(1).map((item, index) => {
                      const colors = ['#EEF2FF', '#F0FDF4', '#FEF3C7'];
                      const iconColors = ['#3B82F6', '#16A34A', '#D97706'];
                      const iconNames = ['document-text-outline', 'diamond-outline', 'school-outline'];
                      
                      const colorIdx = index % colors.length;

                      return (
                        <Pressable 
                          key={item.id || index} 
                          style={styles.topicCard} 
                          onPress={() => router.push(`/topicDetail?id=${item.id}`)}
                        >
                          <View style={[styles.topicIconContainer, { backgroundColor: colors[colorIdx] }]}>
                            <Ionicons name={iconNames[colorIdx]} size={20} color={iconColors[colorIdx]} />
                          </View>
                          <View style={styles.topicInfo}>
                            <Text style={styles.topicTitle}>{item.title || item.name}</Text>
                            <Text style={styles.topicModules}>
                              {item.modulesCount ? `${item.modulesCount} modules` : (item.category || 'Module')}
                            </Text>
                          </View>
                          <Feather name="chevron-right" size={18} color="#9CA3AF" />
                        </Pressable>
                      );
                    })}
                  </>
                )}
              </>
            )}
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
  headerTitle: {
    fontSize: 24,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 16,
  },
  tabToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeToggleButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleButtonText: {
    fontSize: 14,
    fontFamily: 'medium',
    color: '#6B7280',
  },
  activeToggleText: {
    color: '#111827',
    fontFamily: 'semiBold',
  },
  aiCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  aiHeaderTitle: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: '#166534',
  },
  aiText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#374151',
    lineHeight: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 12,
    marginTop: 8,
  },
  continueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  courseTitle: {
    fontSize: 16,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 6,
  },
  courseMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  courseMetaText: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#6B7280',
  },
  dotSeparator: {
    marginHorizontal: 6,
    color: '#6B7280',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 3,
  },
  progressPercentage: {
    fontSize: 12,
    fontFamily: 'semiBold',
    color: '#16A34A',
    width: 32,
    textAlign: 'right',
  },
  playIcon: {
    marginLeft: 4,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  topicIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 2,
  },
  topicModules: {
    fontSize: 12,
    fontFamily: 'regular',
    color: '#6B7280',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  skeletonContainer: {
    paddingTop: 10,
  },
  skeletonSectionHeader: {
    height: 18,
    width: 140,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 12,
  },
  skeletonContinueCard: {
    height: 110,
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    marginBottom: 24,
  },
  skeletonTopicCard: {
    height: 64,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 10,
  },
});