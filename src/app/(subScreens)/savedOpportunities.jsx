// // // import { Feather } from '@expo/vector-icons';
// // // import { router } from 'expo-router';
// // // import { useEffect, useState } from 'react';
// // // import {
// // //     Pressable,
// // //     ScrollView,
// // //     StyleSheet,
// // //     Text,
// // //     View,
// // // } from 'react-native';
// // // import { getRequest } from '../../api/getRequests';
// // // import CustomSafeArea from '../../components/safeArea';

// // // export default function SavedOpportunitiesScreen() {
// // //   const [savedOpportunities, setSavedOpportunities] = useState([]);
// // //   const [loading, setLoading] = useState(true);

// // //   useEffect(() => {
// // //     let isMounted = true;

// // //     async function fetchSavedOpportunities() {
// // //       setLoading(true);
// // //       try {
// // //         const response = await getRequest('/opportunities');
// // //         const data = response?.data?.opportunities || [];
// // //         if (isMounted) {
// // //           setSavedOpportunities(data);
// // //         }
// // //       } catch (error) {
// // //         console.error('Failed to fetch saved opportunities:', error);
// // //       } finally {
// // //         if (isMounted) {
// // //           setLoading(false);
// // //         }
// // //       }
// // //     }

// // //     fetchSavedOpportunities();

// // //     function openDetail(item) {
// // //       router.push(`/(subScreens)/opportunityApplication/opportunityDetail?id=${item.id}`)
// // //     }

// // //     return () => {
// // //       isMounted = false;
// // //     };
// // //   }, []);

// // //   return (
// // //     <CustomSafeArea>
// // //       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
// // //         {/* Header Title */}
// // //         <Text style={styles.headerTitle}>Saved Opportunities</Text>

// // //         {loading ? (
// // //           // Skeleton Loader State
// // //           [1, 2, 3, 4].map((_, index) => (
// // //             <View key={index} style={styles.skeletonCard}>
// // //               <View style={styles.skeletonLineShort} />
// // //               <View style={styles.skeletonLineLong} />
// // //               <View style={styles.skeletonBadge} />
// // //             </View>
// // //           ))
// // //         ) : savedOpportunities.length === 0 ? (
// // //           // Fallback UI matching design layout when mock / empty
// // //           <>
// // //             <Pressable style={styles.card} onPress={() => openDetail()}>
// // //               <View style={styles.cardContent}>
// // //                 <View style={styles.cardHeaderRow}>
// // //                   <Text style={styles.jobTitle}>Graduate Trainee Programme</Text>
// // //                   <Feather name="chevron-right" size={18} color="#9CA3AF" />
// // //                 </View>
// // //                 <Text style={styles.companyName}>Dangote Group</Text>
// // //                 <View style={styles.savedBadge}>
// // //                   <Text style={styles.savedBadgeText}>Saved - 30 Oct 2026</Text>
// // //                 </View>
// // //               </View>
// // //             </Pressable>

// // //             <Pressable style={styles.card} onPress={() => openDetail()}>
// // //               <View style={styles.cardContent}>
// // //                 <View style={styles.cardHeaderRow}>
// // //                   <Text style={styles.jobTitle}>Data Analyst (Graduate Program)</Text>
// // //                   <Feather name="chevron-right" size={18} color="#9CA3AF" />
// // //                 </View>
// // //                 <Text style={styles.companyName}>MTN Nigeria</Text>
// // //                 <View style={styles.savedBadge}>
// // //                   <Text style={styles.savedBadgeText}>Saved - 28 Oct 2026</Text>
// // //                 </View>
// // //               </View>
// // //             </Pressable>

// // //             <Pressable style={styles.card} onPress={() => openDetail()}>
// // //               <View style={styles.cardContent}>
// // //                 <View style={styles.cardHeaderRow}>
// // //                   <Text style={styles.jobTitle}>Customer Service Representative</Text>
// // //                   <Feather name="chevron-right" size={18} color="#9CA3AF" />
// // //                 </View>
// // //                 <Text style={styles.companyName}>Access Bank</Text>
// // //                 <View style={styles.savedBadge}>
// // //                   <Text style={styles.savedBadgeText}>Saved - 25 Oct 2026</Text>
// // //                 </View>
// // //               </View>
// // //             </Pressable>

// // //             <Pressable style={styles.card} onPress={() => openDetail()}>
// // //               <View style={styles.cardContent}>
// // //                 <View style={styles.cardHeaderRow}>
// // //                   <Text style={styles.jobTitle}>Digital Marketing Associate</Text>
// // //                   <Feather name="chevron-right" size={18} color="#9CA3AF" />
// // //                 </View>
// // //                 <Text style={styles.companyName}>TechPoint Africa · Remote</Text>
// // //                 <View style={styles.savedBadge}>
// // //                   <Text style={styles.savedBadgeText}>Saved - 24 Oct 2026</Text>
// // //                 </View>
// // //               </View>
// // //             </Pressable>
// // //           </>
// // //         ) : (
// // //           savedOpportunities.map((item) => (
// // //             <Pressable key={item.id} style={styles.card} onPress={() => router.push(`/(subScreens)/opportunityApplication/opportunityDetail?id=${item.id}`)}>
// // //               <View style={styles.cardContent}>
// // //                 <View style={styles.cardHeaderRow}>
// // //                   <Text style={styles.jobTitle}>{item.title}</Text>
// // //                   <Feather name="chevron-right" size={18} color="#9CA3AF" />
// // //                 </View>
// // //                 <Text style={styles.companyName}>{item.organisation}</Text>
// // //                 <View style={styles.savedBadge}>
// // //                   <Text style={styles.savedBadgeText}>Saved</Text>
// // //                 </View>
// // //               </View>
// // //             </Pressable>
// // //           ))
// // //         )}

// // //       </ScrollView>
// // //     </CustomSafeArea>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   scrollContent: {
// // //     // 
// // //     paddingBottom: 40,
// // //   },
// // //   headerTitle: {
// // //     fontSize: 26,
// // //     fontFamily: 'semiBold',
// // //     color: '#111827',
// // //     marginBottom: 16,
// // //   },
// // //   card: {
// // //     backgroundColor: '#FFFFFF',
// // //     borderRadius: 14,
// // //     
// // //     marginBottom: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#E5E7EB',
// // //   },
// // //   cardContent: {
// // //     flex: 1,
// // //   },
// // //   cardHeaderRow: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 4,
// // //   },
// // //   jobTitle: {
// // //     fontSize: 15,
// // //     fontFamily: 'semiBold',
// // //     color: '#111827',
// // //     flex: 1,
// // //     marginRight: 4,
// // //   },
// // //   companyName: {
// // //     fontSize: 13,
// // //     fontFamily: 'regular',
// // //     color: '#D97706',
// // //     marginBottom: 10,
// // //   },
// // //   savedBadge: {
// // //     alignSelf: 'flex-start',
// // //     backgroundColor: '#EFF6FF',
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 4,
// // //     borderRadius: 6,
// // //   },
// // //   savedBadgeText: {
// // //     fontSize: 11,
// // //     fontFamily: 'semiBold',
// // //     color: '#1D4ED8',
// // //   },
// // //   // Skeleton Styles
// // //   skeletonCard: {
// // //     backgroundColor: '#FFFFFF',
// // //     borderRadius: 14,
// // //     
// // //     marginBottom: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#E5E7EB',
// // //     gap: 8,
// // //   },
// // //   skeletonLineShort: {
// // //     width: '75%',
// // //     height: 15,
// // //     backgroundColor: '#E5E7EB',
// // //     borderRadius: 4,
// // //   },
// // //   skeletonLineLong: {
// // //     width: '45%',
// // //     height: 13,
// // //     backgroundColor: '#F3F4F6',
// // //     borderRadius: 4,
// // //   },
// // //   skeletonBadge: {
// // //     width: 120,
// // //     height: 22,
// // //     backgroundColor: '#EFF6FF',
// // //     borderRadius: 6,
// // //     marginTop: 4,
// // //   },
// // // });


// // import { Feather } from '@expo/vector-icons';
// // import { router, useFocusEffect } from 'expo-router';
// // import { useCallback, useState } from 'react';
// // import {
// //     Pressable,
// //     ScrollView,
// //     StyleSheet,
// //     Text,
// //     View
// // } from 'react-native';
// // import { getRequest } from '../../api/getRequests';
// // import CustomSafeArea from '../../components/safeArea';

// // export default function SavedOpportunitiesScreen() {
// //   const [savedOpportunities, setSavedOpportunities] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   // Use useFocusEffect so it re-fetches every time you navigate back to this screen
// //   useFocusEffect(
// //     useCallback(() => {
// //       let isMounted = true;

// //       async function fetchSavedOpportunities() {
// //         setLoading(true);
// //         try {
// //           const response = await getRequest('/opportunities');
// //           const allOpportunities = response?.data?.opportunities || response?.data || [];
// //           console.log(response)
          
// //           // Filter opportunities to check if response.data.isSaved is true
// //           const filteredSaved = allOpportunities.filter(item => item.isSaved === true);

// //           if (isMounted) {
// //             setSavedOpportunities(filteredSaved);
// //           }
// //         } catch (error) {
// //           console.error('Failed to fetch saved opportunities:', error);
// //         } finally {
// //           if (isMounted) {
// //             setLoading(false);
// //           }
// //         }
// //       }

// //       fetchSavedOpportunities();

// //       return () => {
// //         isMounted = false;
// //       };
// //     }, [])
// //   );

// //   const openDetail = (id) => {
// //     if (id) {
// //       router.push(`/(subScreens)/opportunityApplication/opportunityDetail?id=${id}`);
// //     }
// //   };

// //   return (
// //     <CustomSafeArea>
// //       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
// //         {/* Header Title */}
// //         <Text style={styles.headerTitle}>Saved Opportunities</Text>

// //         {loading ? (
// //           // Skeleton Loader State
// //           [1, 2, 3, 4].map((_, index) => (
// //             <View key={index} style={styles.skeletonCard}>
// //               <View style={styles.skeletonLineShort} />
// //               <View style={styles.skeletonLineLong} />
// //               <View style={styles.skeletonBadge} />
// //             </View>
// //           ))
// //         ) : savedOpportunities.length === 0 ? (
// //           // Empty State view if no items are saved
// //           <View style={styles.emptyContainer}>
// //             <Text style={styles.emptyText}>No saved opportunities found.</Text>
// //           </View>
// //         ) : (
// //           savedOpportunities.map((item) => (
// //             <Pressable 
// //               key={item.id} 
// //               style={styles.card} 
// //               onPress={() => openDetail(item.id)}
// //             >
// //               <View style={styles.cardContent}>
// //                 <View style={styles.cardHeaderRow}>
// //                   <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
// //                   <Feather name="chevron-right" size={18} color="#9CA3AF" />
// //                 </View>
// //                 <Text style={styles.companyName} numberOfLines={1}>
// //                   {item.organisation}{item.workMode ? ` · ${item.workMode}` : ''}
// //                 </Text>
// //                 <View style={styles.savedBadge}>
// //                   <Text style={styles.savedBadgeText}>Saved</Text>
// //                 </View>
// //               </View>
// //             </Pressable>
// //           ))
// //         )}

// //       </ScrollView>
// //     </CustomSafeArea>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   scrollContent: {
// //     // 
// //     paddingBottom: 40,
// //   },
// //   headerTitle: {
// //     fontSize: 26,
// //     fontFamily: 'semiBold',
// //     color: '#111827',
// //     marginBottom: 16,
// //   },
// //   card: {
// //     backgroundColor: '#FFFFFF',
// //     borderRadius: 14,
// //     
// //     marginBottom: 12,
// //     borderWidth: 1,
// //     borderColor: '#E5E7EB',
// //   },
// //   cardContent: {
// //     flex: 1,
// //   },
// //   cardHeaderRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 4,
// //   },
// //   jobTitle: {
// //     fontSize: 15,
// //     fontFamily: 'semiBold',
// //     color: '#111827',
// //     flex: 1,
// //     marginRight: 4,
// //   },
// //   companyName: {
// //     fontSize: 13,
// //     fontFamily: 'regular',
// //     color: '#D97706',
// //     marginBottom: 10,
// //   },
// //   savedBadge: {
// //     alignSelf: 'flex-start',
// //     backgroundColor: '#EFF6FF',
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 6,
// //   },
// //   savedBadgeText: {
// //     fontSize: 11,
// //     fontFamily: 'semiBold',
// //     color: '#1D4ED8',
// //   },
// //   emptyContainer: {
// //     alignItems: 'center',
// //     marginTop: 60,
// //   },
// //   emptyText: {
// //     fontSize: 14,
// //     fontFamily: 'regular',
// //     color: '#6B7280',
// //   },
// //   // Skeleton Styles
// //   skeletonCard: {
// //     backgroundColor: '#FFFFFF',
// //     borderRadius: 14,
// //     
// //     marginBottom: 12,
// //     borderWidth: 1,
// //     borderColor: '#E5E7EB',
// //     gap: 8,
// //   },
// //   skeletonLineShort: {
// //     width: '75%',
// //     height: 15,
// //     backgroundColor: '#E5E7EB',
// //     borderRadius: 4,
// //   },
// //   skeletonLineLong: {
// //     width: '45%',
// //     height: 13,
// //     backgroundColor: '#F3F4F6',
// //     borderRadius: 4,
// //   },
// //   skeletonBadge: {
// //     width: 120,
// //     height: 22,
// //     backgroundColor: '#EFF6FF',
// //     borderRadius: 6,
// //     marginTop: 4,
// //   },
// // });



// import { Feather } from '@expo/vector-icons';
// import { router, useFocusEffect } from 'expo-router';
// import { useCallback, useState } from 'react';
// import {
//     Pressable,
//     ScrollView,
//     StyleSheet,
//     Text,
//     View,
// } from 'react-native';
// import { getRequest } from '../../api/getRequests';
// import CustomSafeArea from '../../components/safeArea';

// export default function SavedOpportunitiesScreen() {
//   const [savedOpportunities, setSavedOpportunities] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useFocusEffect(
//     useCallback(() => {
//       let isMounted = true;

//       async function fetchSavedOpportunities() {
//         setLoading(true);
//         try {
//           // 1. Fetch the list of opportunities
//           const response = await getRequest('/opportunities');
//           const allOpportunities = response?.data?.opportunities || response?.data || [];
          
//           if (Array.isArray(allOpportunities)) {
//             // 2. Filter opportunities where isSaved is true
//             // If your backend list doesn't include isSaved, you can map and call GET /opportunities/{id}
//             const filtered = allOpportunities.filter(item => item.isSaved === true);
            
//             if (isMounted) {
//               setSavedOpportunities(filtered);
//             }
//           }
//         } catch (error) {
//           console.error('Failed to fetch saved opportunities:', error);
//         } finally {
//           if (isMounted) {
//             setLoading(false);
//           }
//         }
//       }

//       fetchSavedOpportunities();

//       return () => {
//         isMounted = false;
//       };
//     }, [])
//   );

//   return (
//     <CustomSafeArea>
//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
//         {/* Header Title */}
//         <Text style={styles.headerTitle}>Saved Opportunities</Text>

//         {loading ? (
//           [1, 2, 3, 4].map((_, index) => (
//             <View key={index} style={styles.skeletonCard}>
//               <View style={styles.skeletonLineShort} />
//               <View style={styles.skeletonLineLong} />
//               <View style={styles.skeletonBadge} />
//             </View>
//           ))
//         ) : savedOpportunities.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No saved opportunities found.</Text>
//           </View>
//         ) : (
//           savedOpportunities.map((item) => (
//             <Pressable 
//               key={item.id} 
//               style={styles.card} 
//               onPress={() => router.push(`/(subScreens)/opportunityApplication/opportunityDetail?id=${item.id}`)}
//             >
//               <View style={styles.cardContent}>
//                 <View style={styles.cardHeaderRow}>
//                   <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
//                   <Feather name="chevron-right" size={18} color="#9CA3AF" />
//                 </View>
//                 <Text style={styles.companyName} numberOfLines={1}>
//                   {item.organisation}
//                 </Text>
//                 <View style={styles.savedBadge}>
//                   <Text style={styles.savedBadgeText}>Saved</Text>
//                 </View>
//               </View>
//             </Pressable>
//           ))
//         )}

//       </ScrollView>
//     </CustomSafeArea>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContent: {
//     
//     paddingBottom: 40,
//   },
//   headerTitle: {
//     fontSize: 26,
//     fontFamily: 'semiBold',
//     color: '#111827',
//     marginBottom: 16,
//   },
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 14,
//     
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   cardContent: {
//     flex: 1,
//   },
//   cardHeaderRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   jobTitle: {
//     fontSize: 15,
//     fontFamily: 'semiBold',
//     color: '#111827',
//     flex: 1,
//     marginRight: 4,
//   },
//   companyName: {
//     fontSize: 13,
//     fontFamily: 'regular',
//     color: '#D97706',
//     marginBottom: 10,
//   },
//   savedBadge: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#EFF6FF',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   savedBadgeText: {
//     fontSize: 11,
//     fontFamily: 'semiBold',
//     color: '#1D4ED8',
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
//   skeletonCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 14,
//     
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     gap: 8,
//   },
//   skeletonLineShort: {
//     width: '75%',
//     height: 15,
//     backgroundColor: '#E5E7EB',
//     borderRadius: 4,
//   },
//   skeletonLineLong: {
//     width: '45%',
//     height: 13,
//     backgroundColor: '#F3F4F6',
//     borderRadius: 4,
//   },
//   skeletonBadge: {
//     width: 120,
//     height: 22,
//     backgroundColor: '#EFF6FF',
//     borderRadius: 6,
//     marginTop: 4,
//   },
// });


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
          // 1. Fetch the base list of opportunities
          const response = await getRequest('/opportunities');
          const list = response?.data?.opportunities || response?.data || [];
          
          if (!Array.isArray(list)) return;

          // 2. Loop through and fetch full details for each item in parallel to check `isSaved`
          const detailedPromises = list.map(async (item) => {
            try {
              const detailRes = await getRequest(`/opportunities/${item.id}`);
              return detailRes?.data || detailRes;
            } catch (err) {
              return null; // Skip if an individual request fails
            }
          });

          const allDetails = await Promise.all(detailedPromises);

          // 3. Filter only the ones where `isSaved` is true
          const savedOnly = allDetails.filter((detail) => detail && detail.isSaved === true);

          if (isMounted) {
            setSavedOpportunities(savedOnly);
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
              key={item.id} 
              style={styles.card} 
              onPress={() => router.push(`/(subScreens)/opportunityApplication/opportunityDetail?id=${item.id}`)}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
                  <Feather name="chevron-right" size={18} color="#9CA3AF" />
                </View>
                <Text style={styles.companyName} numberOfLines={1}>
                  {item.organisation}
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