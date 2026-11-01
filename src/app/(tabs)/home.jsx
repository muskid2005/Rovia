import {
    Feather,
    FontAwesome5,
    Ionicons,
    MaterialIcons,
    Octicons,
} from '@expo/vector-icons';
import { router } from 'expo-router';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import CustomSafeArea from '../../components/safeArea';

export default function HomeScreen() {
  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Good morning,</Text>
            <Text style={styles.nameText}>Favour</Text>
          </View>
          <TouchableOpacity style={styles.giftIconContainer}>
            <Feather name="gift" size={24} color="#16A34A" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subheaderText}>
          Your next opportunity could be closer than you think.
        </Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search opportunities, skills, or keywords..."
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View style={styles.shieldBadge}>
              <Ionicons name="shield-checkmark" size={24} color="#16A34A" />
            </View>
            <Text style={styles.progressTitle}>You're making progress!</Text>
          </View>
          
          <Text style={styles.progressSubtext}>
            Complete your profile to get better recommendations.
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressBarRow}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: '70%' }]} />
            </View>
            <Text style={styles.progressPercentage}>70%</Text>
          </View>

          {/* Complete Profile Button */}
          <TouchableOpacity style={styles.completeButton} onPress={() => router.push('/profile')}>
            <Text style={styles.completeButtonText}>Complete profile</Text>
          </TouchableOpacity>
        </View>

        {/* Action Grid */}
        <View style={styles.gridContainer}>
          {/* Row 1 */}
          <View style={styles.gridRow}>
            <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/discover')}>
              <View style={[styles.gridIconCircle, { backgroundColor: '#DCFCE7' }]}>
                <Feather name="search" size={20} color="#16A34A" />
              </View>
              <Text style={[styles.gridText, { color: '#16A34A' }]}>Find Opportunities</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/(subScreens)/readiness/readinessReview')}>
              <View style={[styles.gridIconCircle, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#16A34A" />
              </View>
              <Text style={[styles.gridText, { color: '#16A34A' }]}>Check Readiness</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridItem}>
              <View style={[styles.gridIconCircle, { backgroundColor: '#EEF2FF' }]}>
                <Octicons name="paste" size={20} color="#4F46E5" />
              </View>
              <Text style={[styles.gridText, { color: '#4F46E5' }]}>Prepare Applications</Text>
            </TouchableOpacity>
          </View>

          {/* Row 2 */}
          <View style={styles.gridRow}>
            <TouchableOpacity style={styles.gridItem}>
              <View style={[styles.gridIconCircle, { backgroundColor: '#EEF2FF' }]}>
                <MaterialIcons name="assignment-turned-in" size={20} color="#4F46E5" />
              </View>
              <Text style={[styles.gridText, { color: '#4F46E5' }]}>Track</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridItem}>
              <View style={[styles.gridIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <FontAwesome5 name="layer-group" size={18} color="#D97706" />
              </View>
              <Text style={[styles.gridText, { color: '#D97706' }]}>Learn</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridItem}>
              <View style={[styles.gridIconCircle, { backgroundColor: '#FCE7F3' }]}>
                <Ionicons name="people-outline" size={20} color="#DB2777" />
              </View>
              <Text style={[styles.gridText, { color: '#DB2777' }]}>Community</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recommended Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        {/* Job Card */}
        <TouchableOpacity style={styles.jobCard}>
          <Image
            source={{ uri: 'https://via.placeholder.com/40' }}
            style={styles.companyLogo}
          />
          <View style={styles.jobDetails}>
            <Text style={styles.jobTitle}>Management Trainee Programme</Text>
            <Text style={styles.companyName}>Dangote Group</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>

    </CustomSafeArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
//   scrollContent: {
//     paddingHorizontal: 20,
//     paddingTop: 16,
//     paddingBottom: 100,
//   },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 22,
    fontFamily: 'bold',
    color: '#111827',
  },
  nameText: {
    fontSize: 22,
    fontFamily: 'bold',
    color: '#111827',
  },
  giftIconContainer: {
    padding: 8,
  },
  subheaderText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#4B5563',
    marginTop: 8,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'regular',
    color: '#111827',
  },
  progressCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  shieldBadge: {
    marginRight: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontFamily: 'bold',
    color: '#065F46',
  },
  progressSubtext: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#047857',
    marginBottom: 16,
  },
  progressBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#D1FAE5',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    fontFamily: 'regular',
    color: '#065F46',
  },
  completeButton: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'semiBold',
  },
  gridContainer: {
    marginBottom: 24,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridItem: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  gridIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridText: {
    fontSize: 11,
    fontFamily: 'semiBold',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'bold',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 13,
    fontFamily: 'semiBold',
    color: '#16A34A',
  },
  jobCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
  },
  companyLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  jobDetails: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 12,
    fontFamily: 'regular',
    color: '#6B7280',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 10,
    fontFamily: 'regular',
    color: '#9CA3AF',
    marginTop: 2,
  },
});

