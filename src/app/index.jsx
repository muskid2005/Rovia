import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const pagerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = () => {
    if (currentPage < 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      // Navigate to your Auth/Home screen here
      router.push('/signUp');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Image 
            source={require('../../assets/images/localImages/logo.png')} /* Update with your asset path */ 
            style={styles.logo} 
            resizeMode="contain"
          />
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Pager View Carousel */}
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {/* Slide 1 */}
        <View key="1" style={styles.slide}>
          <Text style={styles.subtitle}>Find. Apply. Grow</Text>
          <Image 
            source={require('../../assets/images/localImages/splash1.png')} /* Update with your asset path */ 
            style={styles.image} 
            resizeMode="contain"
          />
          <Text style={styles.title}>Find your next...</Text>
        </View>

        {/* Slide 2 */}
        <View key="2" style={styles.slide}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>✅</Text>
          </View>
          <Image 
            source={require('../../assets/images/localImages/splash2.png')} /* Update with your asset path */ 
            style={styles.image} 
            resizeMode="contain"
          />
          <Text style={styles.title}>Apply with <Text style={styles.greenText}>Confidence</Text></Text>
        </View>
      </PagerView>

      {/* Footer / Pagination Indicators & Button */}
      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, currentPage === 0 && styles.activeDot]} />
          <View style={[styles.dot, currentPage === 1 && styles.activeDot]} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}> {currentPage === 0 ? "Next" : "Get Started"}</Text>
        </TouchableOpacity>

        {currentPage === 1 && (
          <View style={styles.footerTextRow}>
            <Text style={styles.grayText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => console.log('Sign Up pressed')}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  brand: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16A34A',
  },
  skipText: {
    fontSize: 16,
    color: '#16A34A',
    fontWeight: '500',
  },
  pagerView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 20,
    textAlign: 'center',
  },
  greenText: {
    color: '#16A34A',
  },
  image: {
    width: 280,
    height: 320,
  },
  badgeContainer: {
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 16,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#16A34A',
    width: 24,
  },
  button: {
    backgroundColor: '#16A34A',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerTextRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  grayText: {
    color: '#6B7280',
    fontSize: 14,
  },
  signUpText: {
    color: '#16A34A',
    fontSize: 14,
    fontWeight: 'bold',
  },
});