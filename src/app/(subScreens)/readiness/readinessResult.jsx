import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomSafeArea from '../../../components/safeArea';

export default function ReadinessResultsScreen() {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <CustomSafeArea>
        <View style={styles.skeletonHeader} />
        <View style={styles.skeletonCircle} />
        <View style={styles.skeletonBlock} />
      </CustomSafeArea>
    );
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <Text style={styles.screenTitle}>Your Readiness Results</Text>

        {/* Circular Score Indicator */}
        <View style={styles.scoreContainer}>
          <View style={styles.circularProgress}>
            <View style={styles.circularInner}>
              <Text style={styles.scoreText}>72%</Text>
            </View>
          </View>
        </View>

        <Text style={styles.statusMainHeading}>You're on track!</Text>
        <Text style={styles.statusSubHeading}>
          You meet most of the requirements for this opportunity.
        </Text>

        {/* Checklist Item 1: Education */}
        <View style={styles.checkCard}>
          <View style={styles.checkCardLeft}>
            <View style={styles.iconBoxSuccess}>
              <Feather name="check-circle" size={16} color="#16A34A" />
            </View>
            <Text style={styles.checkCardTitle}>Education</Text>
          </View>
          <View style={styles.badgeSatisfied}>
            <Feather name="check" size={12} color="#16A34A" style={{ marginRight: 4 }} />
            <Text style={styles.badgeSatisfiedText}>Satisfied</Text>
          </View>
        </View>

        {/* Checklist Item 2: Work Experience */}
        <View style={styles.checkCard}>
          <View style={styles.checkCardLeft}>
            <View style={styles.iconBoxWarning}>
              <Feather name="briefcase" size={16} color="#D97706" />
            </View>
            <Text style={styles.checkCardTitle}>Work Experience</Text>
          </View>
          <View style={styles.badgeWarning}>
            <Feather name="alert-circle" size={12} color="#D97706" style={{ marginRight: 4 }} />
            <Text style={styles.badgeWarningText}>Potential Gap</Text>
          </View>
        </View>

        {/* Checklist Item 3: Skills */}
        <View style={styles.checkCard}>
          <View style={styles.checkCardLeft}>
            <View style={styles.iconBoxInfo}>
              <Feather name="shield" size={16} color="#4F46E5" />
            </View>
            <Text style={styles.checkCardTitle}>Skills</Text>
          </View>
          <View style={styles.badgeSatisfied}>
            <Feather name="check" size={12} color="#16A34A" style={{ marginRight: 4 }} />
            <Text style={styles.badgeSatisfiedText}>Satisfied</Text>
          </View>
        </View>

        {/* Checklist Item 4: Location */}
        <View style={styles.checkCard}>
          <View style={styles.checkCardLeft}>
            <View style={styles.iconBoxSuccess}>
              <Feather name="map-pin" size={16} color="#16A34A" />
            </View>
            <Text style={styles.checkCardTitle}>Location</Text>
          </View>
          <View style={styles.badgeSatisfied}>
            <Feather name="check" size={12} color="#16A34A" style={{ marginRight: 4 }} />
            <Text style={styles.badgeSatisfiedText}>Satisfied</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('(subScreens)/readiness/recommendations')}>
            <Text style={styles.primaryButtonText}>View recommendations</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
            <Feather name="bookmark" size={16} color="#16A34A" style={{ marginRight: 6 }} />
            <Text style={styles.secondaryButtonText}>Save to profile</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 20,
    fontFamily: 'bold',
    color: '#111827',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  circularProgress: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 8,
    borderColor: '#E5E7EB',
    borderTopColor: '#16A34A',
    borderRightColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
  },
  circularInner: {
    transform: [{ rotate: '-45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontFamily: 'bold',
    color: '#16A34A',
  },
  statusMainHeading: {
    fontSize: 18,
    fontFamily: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statusSubHeading: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  checkCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  checkCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBoxSuccess: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxWarning: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxInfo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCardTitle: {
    fontSize: 13,
    fontFamily: 'semiBold',
    color: '#111827',
  },
  badgeSatisfied: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeSatisfiedText: {
    fontSize: 11,
    fontFamily: 'semiBold',
    color: '#16A34A',
  },
  badgeWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeWarningText: {
    fontSize: 11,
    fontFamily: 'semiBold',
    color: '#D97706',
  },
  actionButtonsContainer: {
    width: '100%',
    marginTop: 20,
    gap: 12,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#16A34A',
    borderRadius: 12,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: '#16A34A',
  },
  skeletonHeader: {
    width: '50%',
    height: 24,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  skeletonCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#E5E7EB',
    marginBottom: 20,
    alignSelf: 'center',
  },
  skeletonBlock: {
    width: '100%',
    height: 60,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 10,
  },
});