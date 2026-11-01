import { router } from 'expo-router';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


export default function ResetLinkScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Title */}
        <Text style={styles.title}>Reset Link</Text>

        {/* Message */}
        <Text style={styles.messageText}>
          A reset link has been sent to your email address.{'\n'}
          Kindly follow the instructions to reset your password.
        </Text>

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
    paddingTop: 100,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontFamily: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  messageText: {
    fontSize: 14,
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: "regular",
    paddingHorizontal: 20,
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