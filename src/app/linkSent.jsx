import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { postRequest } from '../api/postRequests';
import CustomModal from '../components/customModal';

const GREEN = '#16A34A';
const RESEND_SECONDS = 60;

export default function LinkSentScreen() {
  const { email, message } = useLocalSearchParams();
  const targetEmail = String(email || '').trim().toLowerCase();

  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);
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

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatCountdown = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  async function handleResendVerification() {
    if (secondsLeft > 0 || resending) return;

    if (!targetEmail) {
      setModal({
        visible: true,
        title: 'Missing email',
        message: 'Please go back and register with your email address.',
        type: 'error',
        onPrimaryAction: closeModal,
      });
      return;
    }

    setResending(true);
    try {
      const req = await postRequest('/auth/resend-verification', {
        email: targetEmail,
      });

      if (req?.success === false) {
        setModal({
          visible: true,
          title: 'Could not resend',
          message: req?.message || 'Unable to resend verification link.',
          type: 'error',
          onPrimaryAction: closeModal,
        });
        return;
      }

      setSecondsLeft(RESEND_SECONDS);
      setModal({
        visible: true,
        title: 'Verification email sent',
        message:
          req?.message ||
          'A new verification link has been sent to your email.',
        type: 'info',
        onPrimaryAction: closeModal,
      });
    } catch (e) {
      setModal({
        visible: true,
        title: 'Request failed',
        message:
          e?.data?.message ||
          e?.message ||
          'Could not resend verification link. Please try again.',
        type: 'error',
        onPrimaryAction: closeModal,
      });
    } finally {
      setResending(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconBadge}>
          <Ionicons name="mail-unread-outline" size={32} color={GREEN} />
        </View>

        <Text style={styles.title}>Check Your Email</Text>
        <Text style={styles.subtitle}>
          {message ||
            'We have sent a verification link to your email address. Open the link on the web to verify your account, then return to log in.'}
        </Text>

        {targetEmail ? (
          <Text style={styles.emailText}>{targetEmail}</Text>
        ) : null}

        <View style={styles.stepsBox}>
          <Text style={styles.stepItem}>1. Open your email inbox (and spam folder).</Text>
          <Text style={styles.stepItem}>2. Tap the verification link to open the web page.</Text>
          <Text style={styles.stepItem}>3. Come back here and log in to your account.</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.resendButton,
            (secondsLeft > 0 || resending) && styles.resendDisabled,
          ]}
          onPress={handleResendVerification}
          disabled={secondsLeft > 0 || resending}
        >
          {resending ? (
            <ActivityIndicator color={GREEN} />
          ) : (
            <Text
              style={[
                styles.resendText,
                (secondsLeft > 0 || resending) && styles.resendTextDisabled,
              ]}
            >
              {secondsLeft > 0
                ? `Resend verification email in ${formatCountdown(secondsLeft)}`
                : 'Resend verification email'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.replace('/login')}
        >
          <Text style={styles.loginButtonText}>Back to Log In</Text>
        </TouchableOpacity>
      </View>

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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontFamily: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 21,
  },
  emailText: {
    fontSize: 14,
    fontFamily: 'semiBold',
    color: '#111827',
    marginTop: 10,
  },
  stepsBox: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginTop: 22,
    gap: 8,
  },
  stepItem: {
    fontSize: 13,
    fontFamily: 'regular',
    color: '#374151',
    lineHeight: 19,
  },
  resendButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GREEN,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    paddingHorizontal: 14,
  },
  resendDisabled: {
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  resendText: {
    fontSize: 13,
    fontFamily: 'semiBold',
    color: GREEN,
  },
  resendTextDisabled: {
    color: '#9CA3AF',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  loginButton: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    backgroundColor: GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'bold',
  },
});