import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { postRequest } from "../api/postRequests";
import { useAuthStore } from '../store/useAuthStore';
import { useStore } from '../store/useStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("")
  const [notReady, setNotReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  async function initiateLogin(){
    setLoading(true)

    if(!email || !password ){
      setError("kindly fill all fields")
      setNotReady(true)
      setLoading(false)
      return
    }

    try{
      setError("")
      setNotReady(false)
      const params = {
        "email": email,
        "password": password
      }
      const response = await postRequest("/auth/login", params)

      if(!response.success){
        setError(response.message)
        setNotReady(true)
        return
      }
      setAccessToken(response.data.accessToken);
      setLoading(false)
      router.replace({
        pathname: '/home',
        params: { 
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          name: response.data.user.firstName
        }
      })
      // console.log(response)

    }catch (error){
      if (error.message === "Too many authentication attempts. Please try again in 15 minutes."){
        setError("Too many Login attempts. Please try again later.")
        setLoading(false)
        setNotReady(true)
        return
      }
      setError("Invalid Credentials")
      setLoading(false)
      setNotReady(true)
      console.error(error.message)
    }
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Log in to your applicant account</Text>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Email Address */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
            <TouchableOpacity disabled={loading} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity disabled={loading} style={styles.forgotPasswordContainer} onPress={() => router.push('/forgotPassword')}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          {notReady && <View style={{marginBottom: 12,}}>
            <Text style={{fontSize: 12, color: "#EF4444", textAlign: 'left'}}>{error}</Text>
          </View>}
          {/* Log In Button */}
          {/* <TouchableOpacity style={styles.submitButton} onPress={() => router.replace('/home')}> */}
          <TouchableOpacity disabled={loading} style={[styles.submitButton, loading && {backgroundColor: "#4aa66c"}]} onPress={() => initiateLogin()}>
            {loading && <ActivityIndicator size={"small"} color={"#ffffff"} />}
            <Text style={styles.submitButtonText}>Log In</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.line} />
          </View>

          {/* Google Login Button */}
          <TouchableOpacity disabled={loading} style={styles.googleButton} onPress={() => useStore.setState({ hasCompletedOnboarding: false })}>
            <Image source={require("../../assets/images/localImages/google.png")} style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>Log in with Google</Text>
          </TouchableOpacity>

          {/* Footer Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity disabled={loading} onPress={() => router.push('/signUp')}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 32,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 30,
  },
  backButton: {
    marginBottom: 20,
    width: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "regular",
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 30,
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
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: "regular",
    color: '#1A1A1A',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: "regular",
  },
  submitButton: {
    backgroundColor: '#16A34A',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    display: "flex",
    flexDirection: "row",
    gap: 8,
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: "regular",
    paddingHorizontal: 12,
  },
  googleButton: {
    flexDirection: 'row',
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  googleIcon: {
    marginRight: 10,
    width: 18,
    height: 19
  },
  googleButtonText: {
    color: '#1A1A1A',
    fontSize: 14,
    fontFamily: "semiBold",
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 14,
    fontFamily: "regular",
    color: '#6B7280',
  },
  signUpText: {
    fontSize: 14,
    color: '#16A34A',
    fontFamily: 'bold',
  },
});