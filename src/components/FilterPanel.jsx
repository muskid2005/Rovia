import { Feather, Ionicons } from '@expo/vector-icons';
import countryList from 'country-list';
import { useMemo, useState } from 'react';
import {
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const JOB_TYPES = ['JOB', 'INTERNSHIP', 'SCHOLARSHIP', 'GRADUATE_TRAINEE', 'APPRENTICESHIP'];const WORK_MODES = ['REMOTE', 'HYBRID', 'ONSITE'];

export default function FilterPanel({ visible, onClose, onApplyFilters }) {
  const [selectedType, setSelectedType] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(''); // Default empty to show all locations!
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');

  // Get full list of countries from country-list package
  const countries = useMemo(() => {
    return countryList.getNames();
  }, []);

  // Filter countries based on user search query
  const filteredCountries = useMemo(() => {
    if (!countrySearchQuery.trim()) return countries;
    return countries.filter((c) =>
      c.toLowerCase().includes(countrySearchQuery.toLowerCase())
    );
  }, [countrySearchQuery, countries]);

  const handleClearAll = () => {
    setSelectedType('');
    setSelectedWorkMode('');
    setSelectedLocation('');
  };

  const handleSelectCountry = (countryName) => {
    setSelectedLocation(countryName);
    setShowCountryPicker(false);
    setCountrySearchQuery('');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          
          {showCountryPicker ? (
            /* Nested Country Picker Screen */
            <View style={styles.pickerContainer}>
              <View style={styles.headerRow}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setShowCountryPicker(false)}
                >
                  <Feather name="arrow-left" size={20} color="#111827" />
                  <Text style={styles.backText}>Select Country</Text>
                </TouchableOpacity>
              </View>

              {/* Option to clear country selection and show all */}
              <TouchableOpacity
                style={styles.allCountriesOption}
                onPress={() => handleSelectCountry('')}
              >
                <Text style={styles.allCountriesText}>All Countries (Global)</Text>
                {!selectedLocation && <Ionicons name="checkmark" size={18} color="#16A34A" />}
              </TouchableOpacity>

              {/* Country Search Bar */}
              <View style={styles.searchContainer}>
                <Feather name="search" size={16} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search country..."
                  placeholderTextColor="#9CA3AF"
                  value={countrySearchQuery}
                  onChangeText={setCountrySearchQuery}
                />
                {countrySearchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setCountrySearchQuery('')}>
                    <Feather name="x" size={16} color="#6B7280" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Country List */}
              <FlatList
                data={filteredCountries}
                keyExtractor={(item) => item}
                style={styles.countryList}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isSelected = selectedLocation === item;
                  return (
                    <TouchableOpacity
                      style={[styles.countryItem, isSelected && styles.selectedCountryItem]}
                      onPress={() => handleSelectCountry(item)}
                    >
                      <Text style={[styles.countryItemText, isSelected && styles.selectedCountryText]}>
                        {item}
                      </Text>
                      {isSelected && <Ionicons name="checkmark" size={18} color="#16A34A" />}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          ) : (
            /* Main Filter View */
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Filter Opportunities</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Feather name="x" size={20} color="#111827" />
                </TouchableOpacity>
              </View>

              {/* Location Filter */}
              <Text style={styles.fieldLabel}>Location</Text>
              <TouchableOpacity
                style={styles.dropdownField}
                onPress={() => setShowCountryPicker(true)}
                activeOpacity={0.7}
              >
                <View style={styles.dropdownLeft}>
                  <Ionicons name="location-outline" size={16} color="#16A34A" style={styles.fieldIcon} />
                  <Text style={styles.dropdownText}>
                    {selectedLocation || 'All Locations (Global)'}
                  </Text>
                </View>
                <Feather name="chevron-down" size={16} color="#16A34A" />
              </TouchableOpacity>

              {/* Work Mode Filter Pills */}
              <Text style={styles.fieldLabel}>Work Mode</Text>
              <View style={styles.pillsRowStatic}>
                {WORK_MODES.map((mode) => {
                  const isSelected = selectedWorkMode === mode;
                  return (
                    <TouchableOpacity
                      key={mode}
                      style={[styles.pill, isSelected && styles.selectedPill]}
                      onPress={() => setSelectedWorkMode(isSelected ? '' : mode)}
                    >
                      <Text style={[styles.pillText, isSelected && styles.selectedPillText]}>
                        {mode}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Opportunity Type Filter Pills */}
              <Text style={styles.fieldLabel}>Opportunity Type</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pillsRow}
              >
                {JOB_TYPES.map((type) => {
                  const isSelected = selectedType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[styles.pill, isSelected && styles.selectedPill]}
                      onPress={() => setSelectedType(isSelected ? '' : type)}
                    >
                      <Text style={[styles.pillText, isSelected && styles.selectedPillText]}>
                        {type.replace('_', ' ')}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Action Buttons Row */}
              <View style={styles.actionsRow}>
                <TouchableOpacity onPress={handleClearAll} style={styles.clearAllButton}>
                  <Text style={styles.clearAllText}>Clear all</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => {
                    onApplyFilters({ 
                      type: selectedType, 
                      workMode: selectedWorkMode,
                      location: selectedLocation 
                    });
                    onClose();
                  }}
                >
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    maxHeight: '85%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'semiBold',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: '#111827',
    marginBottom: 8,
    marginTop: 12,
  },
  dropdownField: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldIcon: {
    marginRight: 8,
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#111827',
  },
  pillsRowStatic: {
    flexDirection: 'row',
    gap: 8,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  selectedPill: {
    borderColor: '#16A34A',
    backgroundColor: '#16A34A',
  },
  pillText: {
    fontSize: 12,
    fontFamily: 'medium',
    color: '#4B5563',
  },
  selectedPillText: {
    color: '#FFFFFF',
    fontFamily: 'semiBold',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  clearAllButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  clearAllText: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: '#16A34A',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 15,
    fontFamily: 'semiBold',
    color: '#FFFFFF',
  },
  // Country Picker Styles
  pickerContainer: {
    height: 380,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    fontSize: 16,
    fontFamily: 'semiBold',
    color: '#111827',
  },
  allCountriesOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
  },
  allCountriesText: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: '#16A34A',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'regular',
    color: '#111827',
    padding: 0,
  },
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedCountryItem: {
    backgroundColor: '#F0FDF4',
  },
  countryItemText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#374151',
  },
  selectedCountryText: {
    fontFamily: 'semiBold',
    color: '#16A34A',
  },
});