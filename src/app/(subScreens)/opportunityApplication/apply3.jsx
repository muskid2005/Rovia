import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
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
import CustomSafeArea from '../../../components/safeArea';
import { professions } from '../../../utils/profession';

export default function ApplyThreeScreen() {
  const params = useLocalSearchParams();

  // State simulating backend fetch readiness
  const [loading, setLoading] = useState(false);

  // Selected skills state (allow 5 or more)
  const [selectedSkills, setSelectedSkills] = useState([
    'Communication',
    'Analytical Thinking',
    'Teamwork',
    'Problem Solving',
    'Digital Literacy',
  ]);

  // Modal and search state for professions
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // File states
  const [cvFile, setCvFile] = useState(null);
  const [certFile, setCertFile] = useState(null);

  // Flatten or extract professions list from imported object
  const allProfessions = Array.isArray(professions)
    ? professions
    : Object.values(professions).flat();

  const filteredProfessions = allProfessions.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSkillSelection = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const pickDocument = async (fileType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        if (fileType === 'cv') {
          setCvFile(selectedAsset);
        } else if (fileType === 'cert') {
          setCertFile(selectedAsset);
        }
      }
    } catch (error) {
      console.log('Error picking document:', error);
    }
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

  const handleSubmit = () => {
    const finalPayload = {
      ...params,
      selectedSkills,
      cvFile,
      certFile,
    };
    
    console.log('Submitting application payload:', finalPayload);
    router.back();
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
          <Text style={styles.stepText}>Step 3 of 3</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: '100%' }]} />
        </View>

        {/* Skills and Documents Step Container */}
        <View style={styles.stepContainer}>
          <Text style={styles.stepMainTitle}>Skills & Documents</Text>
          <Text style={styles.stepSubTitle}>Add your skills and upload required documents.</Text>

          <View style={styles.skillsHeaderRow}>
            <Text style={styles.inputLabel}>Skills (Select 5 or more)</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <Text style={styles.addSkillActionText}>+ Add Skills</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.skillsTagsWrap}>
            {selectedSkills.map((skill, index) => (
              <View key={index} style={styles.skillPill}>
                <Text style={styles.skillPillText}>{skill}</Text>
                <TouchableOpacity onPress={() => toggleSkillSelection(skill)}>
                  <Feather name="x" size={12} color="#16A34A" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <Text style={styles.inputLabel}>Upload Documents</Text>

          <View style={styles.uploadCard}>
            <View style={styles.uploadLeft}>
              <Feather name="file-text" size={20} color="#16A34A" style={{ marginRight: 10 }} />
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.uploadDocTitle}>CV / Resume</Text>
                <Text style={styles.uploadDocSub} numberOfLines={1}>
                  {cvFile ? cvFile.name : 'PDF, DOC, DOCX (Max 5MB)'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => pickDocument('cv')}>
              <Text style={styles.uploadActionText}>{cvFile ? 'Change' : 'Upload'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.uploadCard}>
            <View style={styles.uploadLeft}>
              <Feather name="file-text" size={20} color="#16A34A" style={{ marginRight: 10 }} />
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.uploadDocTitle}>Degree Certificate</Text>
                <Text style={styles.uploadDocSub} numberOfLines={1}>
                  {certFile ? certFile.name : 'PDF, DOC, DOCX (Max 5MB)'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => pickDocument('cert')}>
              <Text style={styles.uploadActionText}>{certFile ? 'Change' : 'Upload'}</Text>
            </TouchableOpacity>
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
              onPress={handleSubmit}
            >
              <Text style={styles.primaryNavText}>Submit Application</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* Skills Selection Modal with Search */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Skills</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Feather name="x" size={22} color="#111827" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search skills or professions..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <FlatList
              data={filteredProfessions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                const isSelected = selectedSkills.includes(item);
                return (
                  <TouchableOpacity
                    style={[styles.modalItemRow, isSelected && styles.modalItemSelected]}
                    onPress={() => toggleSkillSelection(item)}
                  >
                    <Text style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>
                      {item}
                    </Text>
                    {isSelected && <Feather name="check" size={16} color="#16A34A" />}
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={{ paddingBottom: 20 }}
            />

            <TouchableOpacity
              style={styles.modalDoneButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalDoneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  skillsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: 'semiBold',
    color: '#374151',
  },
  addSkillActionText: {
    fontSize: 12,
    fontFamily: 'semiBold',
    color: '#16A34A',
  },
  skillsTagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  skillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  skillPillText: {
    fontSize: 12,
    fontFamily: 'regular',
    color: '#16A34A',
  },
  uploadCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  uploadLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  uploadDocTitle: {
    fontSize: 13,
    fontFamily: 'semiBold',
    color: '#111827',
  },
  uploadDocSub: {
    fontSize: 11,
    fontFamily: 'regular',
    color: '#6B7280',
    marginTop: 2,
  },
  uploadActionText: {
    fontSize: 13,
    fontFamily: 'semiBold',
    color: '#16A34A',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '75%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'bold',
    color: '#111827',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    fontFamily: 'regular',
    color: '#111827',
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
  },
  modalItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalItemSelected: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  modalItemText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#374151',
  },
  modalItemTextSelected: {
    fontFamily: 'semiBold',
    color: '#16A34A',
  },
  modalDoneButton: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  modalDoneButtonText: {
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