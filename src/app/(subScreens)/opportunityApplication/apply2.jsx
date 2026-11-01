import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import CustomSafeArea from '../../../components/safeArea';

export default function ApplyTwoScreen() {
  const params = useLocalSearchParams();

  // State simulating backend fetch readiness
  const [loading, setLoading] = useState(false);

  // Work experience states
  const [employer, setEmployer] = useState('Access Bank');
  const [jobTitle, setJobTitle] = useState('Relationship Officer');
  const [startDate, setStartDate] = useState(new Date(2021, 0, 1));
  const [endDate, setEndDate] = useState(new Date(2023, 11, 1));

  // Picker visibility states
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatDateString = (date) => {
    const options = { month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

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
      pathname: 'apply3',
      params: {
        ...params, // carry over applyOne params
        employer,
        jobTitle,
        startDate: formatDateString(startDate),
        endDate: formatDateString(endDate),
      },
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Feather name="chevron-left" size={24} color="#16A34A" />
        </TouchableOpacity>

        <Text style={styles.screenTitle}>Application Form</Text>

        {/* Step Progress Bar */}
        <View style={styles.stepHeaderRow}>
          <Feather name="clock" size={14} color="#6B7280" />
          <Text style={styles.stepText}>Step 2 of 3</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: '66.66%' }]} />
        </View>

        {/* Work Experience Step Container */}
        <View style={styles.stepContainer}>
          <Text style={styles.stepMainTitle}>Work Experience</Text>
          <Text style={styles.stepSubTitleGreen}>Add your relevant work experience.</Text>

          <Text style={styles.inputLabel}>Current/Most Recent Employer</Text>
          <TextInput
            style={styles.textInput}
            value={employer}
            onChangeText={setEmployer}
            placeholder="Company Name"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.inputLabel}>Job Title</Text>
          <TextInput
            style={styles.textInput}
            value={jobTitle}
            onChangeText={setJobTitle}
            placeholder="Your Role"
            placeholderTextColor="#9CA3AF"
          />

          <View style={styles.dateRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.inputLabel}>Start Date</Text>
              <TouchableOpacity 
                style={styles.dateInputContainer} 
                onPress={() => setShowStartPicker(true)}
              >
                <Text style={styles.dateInputText}>{formatDateString(startDate)}</Text>
                <Feather name="calendar" size={16} color="#16A34A" />
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onValueChange={(event, selectedDate) => {
                    setShowStartPicker(Platform.OS === 'ios');
                    if (selectedDate) {
                      setStartDate(selectedDate);
                    }
                  }}
                />
              )}
            </View>

            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.inputLabel}>End Date</Text>
              <TouchableOpacity 
                style={styles.dateInputContainer} 
                onPress={() => setShowEndPicker(true)}
              >
                <Text style={styles.dateInputText}>{formatDateString(endDate)}</Text>
                <Feather name="calendar" size={16} color="#16A34A" />
              </TouchableOpacity>
              {showEndPicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowEndPicker(Platform.OS === 'ios');
                    if (selectedDate) {
                      setEndDate(selectedDate);
                    }
                  }}
                />
              )}
            </View>
          </View>

          <View style={styles.navButtonsRow}>
            <TouchableOpacity 
              style={styles.secondaryNavButton} 
              onPress={handleBack}
            >
              <Text style={styles.secondaryNavText}>Back</Text>
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
  stepSubTitleGreen: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#16A34A',
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
  dateRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  dateInputContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  dateInputText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#111827',
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