import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getNames } from 'country-list';
import { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomSafeArea from '../../../components/safeArea';

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const COUNTRY_OPTIONS = getNames(); // Automatically gets all world countries

export default function CompleteProfileScreen() {
  const [firstName, setFirstName] = useState('Favour');
  const [lastName, setLastName] = useState('Ekeohuru');
  
  // Date of birth states
  const [date, setDate] = useState(new Date(2000, 0, 15));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dobText, setDobText] = useState('15 Jan 2000');

  // Gender dropdown states
  const [gender, setGender] = useState('Male');
  const [showGenderModal, setShowGenderModal] = useState(false);

  // Country dropdown states
  const [country, setCountry] = useState('Nigeria');
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      setDobText(selectedDate.toLocaleDateString('en-GB', options));
    }
  };

  
  const filteredCountries = COUNTRY_OPTIONS.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Title Section */}
        <Text style={styles.titleText}>Complete your profile</Text>
        <Text style={styles.subtitleText}>
          This helps us give you better opportunities and personalised guidance.
        </Text>

        {/* Profile Picture Section */}
        <View style={styles.profilePicContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://via.placeholder.com/80' }}
              style={styles.avatarImage}
            />
          </View>
          <TouchableOpacity style={styles.changePhotoRow}>
            <View style={styles.statusDot} />
            <Text style={styles.changePhotoText}>Change photo</Text>
          </TouchableOpacity>
        </View>

        {/* First Name & Last Name Fields */}
        <View style={styles.rowInputs}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>First Name</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.inputText}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
          </View>

          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Last Name</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.inputText}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>
        </View>

        {/* Date of Birth */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity 
            style={styles.inputBoxWithIcon} 
            activeOpacity={0.8}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.inputText}>{dobText}</Text>
            <Feather name="calendar" size={18} color="#16A34A" />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onValueChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* Gender Dropdown Trigger */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender</Text>
          <TouchableOpacity 
            style={styles.inputBoxWithIcon} 
            activeOpacity={0.8}
            onPress={() => setShowGenderModal(true)}
          >
            <Text style={styles.inputText}>{gender}</Text>
            <Feather name="chevron-down" size={18} color="#16A34A" />
          </TouchableOpacity>
        </View>

        {/* Country of Residence Dropdown Trigger */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Country of Residence</Text>
          <TouchableOpacity 
            style={styles.inputBoxWithIcon} 
            activeOpacity={0.8}
            onPress={() => setShowCountryModal(true)}
          >
            <Text style={styles.inputText}>{country}</Text>
            <Feather name="chevron-down" size={18} color="#16A34A" />
          </TouchableOpacity>
        </View>

        {/* Save & Continue Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save & Continue</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Gender Selection Modal */}
      <Modal visible={showGenderModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowGenderModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            <FlatList
              data={GENDER_OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalItem} 
                  onPress={() => { setGender(item); setShowGenderModal(false); }}
                >
                  <Text style={[styles.modalItemText, gender === item && styles.selectedItemText]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Country Selection Modal with Search */}
      <Modal visible={showCountryModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCountryModal(false)}>
          <View style={[styles.modalContent, { height: '70%', maxHeight: '70%' }]}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <View style={styles.modalSearchBox}>
              <Feather name="search" size={16} color="#9CA3AF" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Search country..."
                value={countrySearch}
                onChangeText={setCountrySearch}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalItem} 
                  onPress={() => { 
                    setCountry(item); 
                    setShowCountryModal(false); 
                    setCountrySearch('');
                  }}
                >
                  <Text style={[styles.modalItemText, country === item && styles.selectedItemText]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  titleText: {
    fontSize: 24,
    fontFamily: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#4B5563',
    marginBottom: 24,
    lineHeight: 20,
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  changePhotoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
    marginRight: 6,
  },
  changePhotoText: {
    fontSize: 13,
    fontFamily: 'semiBold',
    color: '#111827',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfInputContainer: {
    width: '48%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontFamily: 'regular',
    color: '#4B5563',
    marginBottom: 6,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  inputBoxWithIcon: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  inputText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#111827',
  },
  saveButton: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'semiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    maxHeight: '50%',
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 12,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'regular',
    color: '#111827',
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalItemText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#374151',
    textAlign: 'center',
  },
  selectedItemText: {
    fontFamily: 'bold',
    color: '#16A34A',
  },
});