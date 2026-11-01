import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomSafeArea from '../../../components/safeArea';

export default function ApplyOneScreen() {
  const [loading, setLoading] = useState(false);

  // State for education step parameters to pass to apply two
  const [highestQual, setHighestQual] = useState('B.Sc. Accounting');
  const [institution, setInstitution] = useState('University of Lagos');
  const [gradYear, setGradYear] = useState('2021');

  if (loading) {
    return (
      <CustomSafeArea>
        <View style={styles.skeletonHeader} />
        <View style={styles.skeletonBar} />
        <View style={styles.skeletonBlock} />
      </CustomSafeArea>
    );
  }

  const handleNext = () => {
    router.push({
      pathname: 'apply2',
      params: {
        highestQual,
        institution,
        gradYear,
      },
    });
  };

  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#16A34A" />
        </TouchableOpacity>

        <Text style={styles.screenTitle}>Application Form</Text>

        {/* Step Progress Bar */}
        <View style={styles.stepHeaderRow}>
          <Feather name="clock" size={14} color="#6B7280" />
          <Text style={styles.stepText}>Step 1 of 3</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: '33.33%' }]} />
        </View>

        {/* Education Step Container */}
        <View style={styles.stepContainer}>
          <Text style={styles.stepMainTitle}>Education</Text>
          <Text style={styles.stepSubTitle}>Tell us about your highest qualification.</Text>

          <Text style={styles.inputLabel}>Highest Qualification</Text>
          <TextInput
            style={styles.textInput}
            value={highestQual}
            onChangeText={setHighestQual}
            placeholder="e.g. B.Sc. Accounting"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.inputLabel}>Institution</Text>
          <TextInput
            style={styles.textInput}
            value={institution}
            onChangeText={setInstitution}
            placeholder="e.g. University of Lagos"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.inputLabel}>Graduation Year</Text>
          <TextInput
            style={styles.textInput}
            value={gradYear}
            onChangeText={setGradYear}
            placeholder="YYYY"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />

          <View style={styles.navButtonsRow}>
            <TouchableOpacity 
              style={styles.secondaryNavButton} 
              onPress={() => router.back()}
            >
              <Text style={styles.secondaryNavText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.primaryNavButton} 
              onPress={handleNext}
            >
              <Text style={styles.primaryNavText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 20,
    fontFamily: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  stepText: {
    fontSize: 12,
    fontFamily: 'regular',
    color: '#6B7280',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 3,
  },
  stepContainer: {
    marginTop: 4,
  },
  stepMainTitle: {
    fontSize: 18,
    fontFamily: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  stepSubTitle: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: 'semiBold',
    color: '#374151',
    marginBottom: 6,
    marginTop: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 14,
    fontFamily: 'regular',
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  navButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  secondaryNavButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#16A34A',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  secondaryNavText: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: '#16A34A',
  },
  primaryNavButton: {
    flex: 1,
    backgroundColor: '#16A34A',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryNavText: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: '#FFFFFF',
  },
  skeletonHeader: {
    width: '40%',
    height: 24,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 16,
  },
  skeletonBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 20,
  },
  skeletonBlock: {
    width: '100%',
    height: 180,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 16,
  },
});