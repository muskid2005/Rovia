


import { Feather } from '@expo/vector-icons';
import { getNames } from 'country-list';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { putRequest } from '../../../api/putRequests'; // Adjust path if needed
import CustomModal from '../../../components/customModal';
import CustomSafeArea from '../../../components/safeArea';

const COUNTRY_OPTIONS = getNames(); // Automatically gets all world countries

export default function CompleteProfileScreen() {
  // Backend payload states set to empty for placeholders
  const [headline, setHeadline] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [biography, setBiography] = useState('');

  const [saving, setSaving] = useState(false);

  // Country dropdown states
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  // Custom Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const showCustomModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const filteredCountries = COUNTRY_OPTIONS.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        headline,
        location,
        country,
        biography,
      };

      console.log('SENDING PROFILE UPDATE PAYLOAD:', payload);
      const response = await putRequest('/profile', payload);
      console.log('PROFILE UPDATE RESPONSE:', response);

      showCustomModal('Success', 'Profile updated successfully!');
      setTimeout(() => {
        setModalVisible(false);
        router.replace('/(tabs)/profile');
      }, 7000); // Navigate to profile tab after successful update
    } catch (error) {
      console.error('Failed to update profile:', error?.response?.data || error?.message || error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Could not update profile.';
      showCustomModal('Error', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Title Section */}
        <Text style={styles.titleText}>Complete your profile</Text>
        <Text style={styles.subtitleText}>
          This helps us give you better opportunities and personalised guidance.
        </Text>

        {/* Headline Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Headline</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.inputText}
              value={headline}
              onChangeText={setHeadline}
              placeholder="e.g. Backend Engineer | Node.js Specialist"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Location Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>City / Location</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.inputText}
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Lagos"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Country of Residence Dropdown Trigger */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Country of Residence</Text>
          <TouchableOpacity 
            style={styles.inputBoxWithIcon} 
            activeOpacity={0.8}
            onPress={() => setShowCountryModal(true)}
          >
            <Text style={[styles.inputText, !country && styles.placeholderText]}>
              {country || 'Select your country'}
            </Text>
            <Feather name="chevron-down" size={18} color="#16A34A" />
          </TouchableOpacity>
        </View>

        {/* Biography Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Biography</Text>
          <View style={[styles.inputBox, styles.textAreaBox]}>
            <TextInput
              style={[styles.inputText, styles.textArea]}
              value={biography}
              onChangeText={setBiography}
              placeholder="Tell us a bit about yourself..."
              placeholderTextColor="#9CA3AF"
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Save & Continue Button */}
        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.disabledButton]} 
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Save & Continue</Text>
          )}
        </TouchableOpacity>

      </ScrollView>

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

      {/* Reusable Custom Modal */}
      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        onClose={() => {
          setModalVisible(false)
          router.replace('/(tabs)/profile');
        }}
      />

    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    
    paddingBottom: 40,
  },
  titleText: {
    fontSize: 24,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontFamily: 'semiBold',
    color: '#374151',
    marginBottom: 6,
  },
  inputBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  inputBoxWithIcon: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 15,
    fontFamily: 'regular',
    color: '#111827',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  textAreaBox: {
    height: 100,
    paddingTop: 12,
  },
  textArea: {
    height: '100%',
  },
  saveButton: {
    backgroundColor: '#16A34A',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
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
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'semiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
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
    fontSize: 15,
    fontFamily: 'regular',
    color: '#374151',
  },
  selectedItemText: {
    fontFamily: 'semiBold',
    color: '#16A34A',
  },
});