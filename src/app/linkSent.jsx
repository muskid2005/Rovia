import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerificationLinkScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Top Icon */}
        <View style={styles.iconContainer}>
          <Feather name="mail" size={40} color="#16A34A" />
        </View>

        {/* Title */}
        <View style={{ gap: 20 }}>
            <Text style={styles.title}>Verify Your Account</Text>

            {/* Message */}
            <Text style={styles.messageText}>
            A verification link has been sent to your email address. Please go to your email, click the link to verify your account, and then come back here to log in. You do not need to create an account again.
            </Text>
        </View>
        {/* Back to Log In Button */}
        <TouchableOpacity style={styles.backToLoginButton} onPress={() => router.replace('/login')}>
          <Text style={styles.backToLoginText}>Back to Log In</Text>
        </TouchableOpacity>

      </View>
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
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: 'bold',
    color: '#000000',
    textAlign: 'center',
    // marginBottom: 12,
  },
  messageText: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'regular',
    paddingHorizontal: 10,
    marginBottom: 40,
  },
backToLoginButton: {
    borderWidth: 1,
    borderColor: '#16A34A',
    borderRadius: 12,
    height: 50,
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 340,
  },
backToLoginText: {
    color: '#16A34A',
    fontSize: 14,
    fontFamily: "semiBold",
  },
});