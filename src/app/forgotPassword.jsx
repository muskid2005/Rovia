import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { postRequest } from '../api/postRequests';
import CustomModal from '../components/customModal';

const GREEN = '#16A34A';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info',
    onPrimaryAction: null,
  });

  const closeModal = () => {
    setModal((prev) => ({ ...prev, visible: false }));
  };

  async function sendEmail() {
    const trimmedEmail = String(email || '').trim().toLowerCase();

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setModal({
        visible: true,
        title: 'Invalid email',
        message: 'Please enter a valid email address.',
        type: 'error',
        onPrimaryAction: closeModal,
      });
      return;
    }

    setLoading(true);
    try {
      const req = await postRequest('/auth/forgot-password', {
        email: trimmedEmail,
      });

      if (req?.success) {
        router.push({
          pathname: '/resetLink',
          params: {
            email: trimmedEmail,
            message:
              req?.message ||
              'If an account exists with this email, check your inbox and follow the steps in the email to reset your password.',
          },
        });
      } else {
        setModal({
          visible: true,
          title: 'Could not send link',
          message: req?.message || 'Something went wrong. Please try again.',
          type: 'error',
          onPrimaryAction: closeModal,
        });
      }
    } catch (e) {
      setModal({
        visible: true,
        title: 'Request failed',
        message:
          e?.data?.message ||
          e.message ||
          'Unable to send reset link. Please check your connection.',
        type: 'error',
        onPrimaryAction: closeModal,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#6B7280"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={sendEmail}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={() => router.replace('/login')}
            disabled={loading}
          >
            <Text style={styles.backToLoginText}>Back to Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CustomModal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={closeModal}
        onPrimaryAction={modal.onPrimaryAction}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'regular',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 60,
    paddingHorizontal: 10,
    lineHeight: 20,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'regular',
    color: '#1A1A1A',
  },
  submitButton: {
    backgroundColor: GREEN,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'bold',
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  backToLoginButton: {
    borderWidth: 1,
    borderColor: GREEN,
    borderRadius: 12,
    height: 50,
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  backToLoginText: {
    color: GREEN,
    fontSize: 14,
    fontFamily: 'semiBold',
  },
});