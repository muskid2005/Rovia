import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
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
      router.replace('/signUp');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        {/* <Image source={require('../../assets/images/localImages/logo.png')} style={styles.logo}  resizeMode="contain"/> */}
        <TouchableOpacity onPress={() => router.replace('/login')}>
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
          <Image 
            source={require('../../assets/images/localImages/logo.png')} /* Update with your asset path */ 
            style={styles.logo} 
            resizeMode="contain"
          />
          <View style={{position: 'relative', alignItems: 'center'}}>
            <Image 
              source={require('../../assets/images/localImages/splash1.png')} /* Update with your asset path */ 
              style={styles.image} 
              resizeMode="contain"
            />

            <View style={[styles.badgeContainer, styles.badgeContainerPositionOne]}>
              <FontAwesome name="search" size={28} color="#31AC04" />
              <Text style={styles.badgeText}>Find Jobs</Text>
            </View>

            <View style={[styles.badgeContainer, styles.badgeContainerPositionTwo]}>
              <FontAwesome name="send" size={28} color="#31AC04" />
              <Text style={styles.badgeText}>Apply Easily</Text>
            </View>

            <View style={[styles.badgeContainer, styles.badgeContainerPositionThree]}>
              <Ionicons name="checkmark-done-sharp" size={28} color="#31AC04" />
              <Text style={styles.badgeText}>Get Hired</Text>
            </View>
          </View>
          
          
          
          <Text style={styles.title}>Find your next</Text>
          <Text style={styles.title2}>opportunity with us</Text>
        </View>

        {/* Slide 2 */}
        <View key="2" style={styles.slide}>
          <View style={[styles.badgeContainer, {borderBottomWidth: 0, borderRightWidth:0}]}>
            <Image source={require("../../assets/images/localImages/right.png")} style={{width: 64, height: 64}} resizeMode="contain"/>

          </View>
          {/* <View style={{position: "relative"}}> */}
            <Image 
              source={require('../../assets/images/localImages/splash2.png')} /* Update with your asset path */ 
              style={styles.image} 
              resizeMode="contain"
            />
            <View style={styles.congratulations}>
              <FontAwesome6 name="toolbox" size={24} color="#31AC04" />
              <View>
                <Text style={{fontSize: 14, fontFamily: "semiBold"}}>Congratulations!</Text>
                <Text style={{fontSize: 12, fontFamily: "regular"}}>You’ve been shortlisted</Text>
              </View>
            </View>
          {/* </View> */}
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
            <TouchableOpacity onPress={() => router.replace('/signUp')}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  congratulations: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderBottomWidth: 2,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#D1D5DB",
    marginTop: -30
    // position: "absolute"
  },
  logo: {
    width: 180,
    height: 80,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#31AC04',
    fontFamily: 'semiBold',
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
  title: {
    fontSize: 22,
    fontFamily: 'bold',
    color: '#1A1A1A',
    marginTop: 20,
    textAlign: 'center',
  },
  title2: {
    fontSize: 22,
    fontFamily: 'bold',
    color: '#31AC04',
    textAlign: 'center',
  },
  greenText: {
    color: '#31AC04',
  },
  image: {
    width: 280,
    height: 320,
    // position: 'relative',
  },
  badgeContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#D1D5DB',
    // borderRightWidth: 0,
    // gap: 8,  
  },
  badgeContainerPositionOne:{
    top: 24,
    right: 10,
    position: 'absolute',
  },
   badgeContainerPositionTwo:{
    top: 100,
    left: -30,
    position: 'absolute',
  },
   badgeContainerPositionThree:{
    right: -20,
    bottom: 20,
    position: 'absolute',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'regular',
    marginTop: 12,
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
    backgroundColor: '#31AC04',
    width: 24,
  },
  button: {
    backgroundColor: '#31AC04',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Regular',
  },
  footerTextRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  grayText: {
    color: '#6B7280',
    fontFamily: 'Regular',
    fontSize: 14,
  },
  signUpText: {
    color: '#31AC04',
    fontSize: 14,
    fontFamily: 'semiBold',
  },
});