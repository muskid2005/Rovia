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
  View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { postRequest } from "../api/postRequests";
import CustomModal from '../components/customModal';

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("")
  const [notReady, setNotReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function createAccount(){
    setLoading(true)

    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setNotReady(true);
      setError("Kindly use an email address ending with @gmail.com");
      setLoading(false);
      return;
    }

    if(!firstName  || !lastName || !email || !password || !confirmPassword){
      setError("kindly fill all fields")
      setNotReady(true)
      setLoading(false)
      return
    }

    if(password !== confirmPassword){
      setError("Password Mismatched")
      setNotReady(true)
      setLoading(false)
      return
    }

    try{
      setError("")
      setNotReady(false)
      const params = {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "password": password
      }
      
      const response = await postRequest("/auth/register", params)
      if(!response.success){
        setError(response.message)
        setNotReady(true)
        setLoading(false)
        return
      }
      setLoading(false)
      setSuccess(true)
      
      // 
    }catch (error){
      setNotReady(true)
      const check = error.message
      if (check === "An account with this email already exists"){
        setError("An account with this email already exists")
      } else {
        setError("your password must include a uppercase, lowercase, number and a symbol")
      }
      setLoading(false)
    }
  }
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <CustomModal 
          visible={success}
          title="Success"
          message="Account Created Successfully. "
          onClose={() => {
            setSuccess(false);
            router.replace('/login');
          }}
        />

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to apply for jobs</Text>

        {/* Form Container */}
        <View style={styles.formContainer}>
          
          {/* First Name */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#9CA3AF"
              value={firstName}
              onChangeText={setFirstName}
              editable={!loading}
            />
          </View>

           {/* last Name */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#9CA3AF"
              value={lastName}
              onChangeText={setLastName}
              editable={!loading}
            />
          </View>

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
              editable={!loading}
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity disabled={loading} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
            />
            <TouchableOpacity disabled={loading} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons
                name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {/* Terms & Conditions Checkbox */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}
              onPress={() => setAgreeTerms(!agreeTerms)}
              disabled={loading}
            >
              {agreeTerms && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
            </TouchableOpacity>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.linkText}>Terms & Conditions</Text> and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </View>
          {notReady && <View style={{marginBottom: 12,}}>
            <Text style={{fontSize: 12, color: "#EF4444", textAlign: 'right'}}>{error}</Text>
          </View>}
          {/* Create Account Button */}
          <TouchableOpacity style={[styles.submitButton, loading && {backgroundColor: "#4aa66c"}]} disabled={loading} onPress={() => createAccount()}>
          {/* <TouchableOpacity style={styles.submitButton} onPress={() => router.replace('/linkSent')}> */}
          {loading && <ActivityIndicator size={"small"} color={"#ffffff"} />}
            <Text style={styles.submitButtonText}>Create Account</Text>
          </TouchableOpacity>

          {/* Footer Navigation Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity disabled={loading} onPress={() => router.push('/login')}>
              <Text style={styles.signInText}>Sign In</Text>
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
    marginBottom: 28,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 4,
    marginRight: 10,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "regular",
    color: '#4B5563',
    lineHeight: 18,
  },
  linkText: {
    color: '#16A34A',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#16A34A',
    height: 50,
    borderRadius: 12,
    display: "flex",
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'bold',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    fontFamily: "regular",
    color: '#6B7280',
  },
  signInText: {
    fontSize: 14,
    color: '#16A34A',
    fontFamily: 'semiBold',
  },
});