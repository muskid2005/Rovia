import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
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

export default function ReadinessReviewScreen() {
  const [loading, setLoading] = useState(false);

  // File states for CV and Degree Certificate uploads
  const [cvFile, setCvFile] = useState(null);
  const [certFile, setCertFile] = useState(null);

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
        <View style={styles.skeletonBlock} />
        <View style={styles.skeletonBlockLarge} />
      </CustomSafeArea>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    router.push('/(subScreens)/readiness/readinessResult');
  };

  return (
    <CustomSafeArea>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Feather name="chevron-left" size={24} color="#16A34A" />
        </TouchableOpacity>

        <Text style={styles.screenTitle}>Readiness Review</Text>

        {/* Save Banner */}
        <View style={styles.bannerBox}>
          <Text style={styles.bannerText}>Save to Opportunities</Text>
        </View>

        {/* Skills Section */}
        <Text style={styles.sectionHeader}>Skills (Check)</Text>
        <View style={styles.skillsGrid}>
          
          <View style={styles.skillCard}>
            <View style={styles.skillIconBoxAlert}>
              <Feather name="alert-circle" size={16} color="#DC2626" />
            </View>
            <Text style={styles.skillCardText}>IFRS Standards</Text>
          </View>

          <View style={styles.skillCard}>
            <View style={styles.skillIconBoxSuccess}>
              <MaterialCommunityIcons name="shield-check" size={16} color="#16A34A" />
            </View>
            <Text style={styles.skillCardText}>Data Management</Text>
          </View>

          <View style={styles.skillCard}>
            <View style={styles.skillIconBoxSuccess}>
              <MaterialCommunityIcons name="shield-check" size={16} color="#16A34A" />
            </View>
            <Text style={styles.skillCardText}>Accounting Softwares</Text>
          </View>

          <View style={styles.skillCard}>
            <View style={styles.skillIconBoxSuccess}>
              <MaterialCommunityIcons name="shield-check" size={16} color="#16A34A" />
            </View>
            <Text style={styles.skillCardText}>Business Management</Text>
          </View>

        </View>

        {/* Upload Documents Section */}
        <Text style={styles.sectionHeader}>Upload Documents</Text>

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

        {/* Navigation Buttons */}
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
  bannerBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  bannerText: {
    fontSize: 13,
    fontFamily: 'semiBold',
    color: '#16A34A',
  },
  sectionHeader: {
    fontSize: 13,
    fontFamily: 'semiBold',
    color: '#374151',
    marginBottom: 10,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  skillCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  skillIconBoxAlert: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillIconBoxSuccess: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillCardText: {
    fontSize: 12,
    fontFamily: 'semiBold',
    color: '#111827',
    flex: 1,
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
    marginTop: 20,
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
  skeletonBlock: {
    width: '100%',
    height: 100,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 16,
  },
  skeletonBlockLarge: {
    width: '100%',
    height: 200,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
  },
});