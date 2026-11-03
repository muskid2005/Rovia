// import { Ionicons } from '@expo/vector-icons';
// import { useEffect } from 'react';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import Animated, {
//     useAnimatedStyle,
//     useSharedValue,
//     withTiming,
// } from 'react-native-reanimated';

// export default function CustomModal({
//   visible,
//   title,
//   message,
//   onClose,
//   type = 'info', // 'info' | 'error' | 'destructive'
//   primaryButtonText = 'OK',
//   onPrimaryAction,
//   secondaryButtonText,
//   onSecondaryAction,
// }) {
//   const scale = useSharedValue(0.9);
//   const opacity = useSharedValue(0);

//   useEffect(() => {
//     if (visible) {
//       opacity.value = withTiming(1, { duration: 200 });
//       scale.value = withTiming(1, { duration: 200 });
//     } else {
//       opacity.value = withTiming(0, { duration: 150 });
//       scale.value = withTiming(0.9, { duration: 150 });
//     }
//   }, [visible]);

//   const animatedStyle = useAnimatedStyle(() => ({
//     opacity: opacity.value,
//     transform: [{ scale: scale.value }],
//   }));

//   if (!visible) return null;

//   const handlePrimaryPress = () => {
//     if (onPrimaryAction) {
//       onPrimaryAction();
//     } else {
//       onClose();
//     }
//   };

//   const handleSecondaryPress = () => {
//     if (onSecondaryAction) {
//       onSecondaryAction();
//     } else {
//       onClose();
//     }
//   };

//   const getPrimaryButtonStyle = () => {
//     if (type === 'destructive' || type === 'error') {
//       return styles.destructiveButton;
//     }
//     return styles.successButton;
//   };

//   return (
//     <View style={styles.overlay}>
//       <Animated.View style={[styles.modalContainer, animatedStyle]}>
//         {/* Top-Right Close Button */}
//         <TouchableOpacity
//           style={styles.closeIconButton}
//           onPress={onClose}
//           activeOpacity={0.7}
//         >
//           <Ionicons name="close" size={22} color="#6B7280" />
//         </TouchableOpacity>

//         {/* Content Section */}
//         <View style={styles.contentContainer}>
//           <Text style={styles.title}>{title}</Text>
//           <Text style={styles.message}>{message}</Text>
//         </View>

//         {/* Action Buttons Section */}
//         <View style={styles.buttonContainer}>
//           {Boolean(secondaryButtonText) && (
//             <TouchableOpacity
//               style={[styles.button, styles.secondaryButton]}
//               onPress={handleSecondaryPress}
//               activeOpacity={0.8}
//             >
//               <Text style={styles.secondaryButtonText}>
//                 {secondaryButtonText}
//               </Text>
//             </TouchableOpacity>
//           )}

//           <TouchableOpacity
//             style={[
//               styles.button,
//               getPrimaryButtonStyle(),
//               Boolean(secondaryButtonText) && styles.halfWidthButton,
//             ]}
//             onPress={handlePrimaryPress}
//             activeOpacity={0.8}
//           >
//             <Text style={styles.primaryButtonText}>{primaryButtonText}</Text>
//           </TouchableOpacity>
//         </View>
//       </Animated.View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     position: 'absolute', // <--- Ensure it covers the whole absolute screen
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)', // <--- Semi-transparent dark background
//     justifyContent: 'center', // <--- Centers the modal vertically
//     alignItems: 'center', // <--- Centers the modal horizontally
//     zIndex: 1000, // <--- Ensures it sits on top of everything
//     padding: 20,
//   },
//   modalContainer: {
//     width: '100%',
//     maxWidth: 340,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 20,
//     position: 'relative',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     elevation: 5,
//   },
//   closeIconButton: {
//     position: 'absolute',
//     top: 14,
//     right: 14,
//     zIndex: 10,
//     padding: 4,
//   },
//   contentContainer: {
//     alignItems: 'center',
//     marginTop: 12,
//     marginBottom: 20,
//   },
//   title: {
//     fontFamily: 'bold',
//     fontSize: 18,
//     color: '#111827',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   message: {
//     fontFamily: 'regular',
//     fontSize: 14,
//     color: '#4B5563',
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     gap: 12,
//   },
//   button: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   halfWidthButton: {
//     flex: 1,
//   },
//   successButton: {
//     backgroundColor: '#16A34A',
//   },
//   destructiveButton: {
//     backgroundColor: '#DC2626',
//   },
//   secondaryButton: {
//     backgroundColor: '#F3F4F6',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   primaryButtonText: {
//     fontFamily: 'semiBold',
//     fontSize: 15,
//     color: '#FFFFFF',
//   },
//   secondaryButtonText: {
//     fontFamily: 'semiBold',
//     fontSize: 15,
//     color: '#374151',
//   },
// });

import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

export default function CustomModal({
  visible,
  title,
  message,
  onClose,
  type = 'info', 
  primaryButtonText = 'OK',
  onPrimaryAction,
  secondaryButtonText,
  onSecondaryAction,
}) {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withTiming(1, { duration: 200 });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      scale.value = withTiming(0.9, { duration: 150 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const handlePrimaryPress = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    } else {
      onClose();
    }
  };

  const handleSecondaryPress = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    } else {
      onClose();
    }
  };

  const getPrimaryButtonStyle = () => {
    if (type === 'destructive' || type === 'error') {
      return styles.destructiveButton;
    }
    return styles.successButton;
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, animatedStyle]}>
          {/* Top-Right Close Button */}
          <TouchableOpacity
            style={styles.closeIconButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={22} color="#6B7280" />
          </TouchableOpacity>

          {/* Content Section */}
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>

          {/* Action Buttons Section */}
          <View style={styles.buttonContainer}>
            {Boolean(secondaryButtonText) && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handleSecondaryPress}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>
                  {secondaryButtonText}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                getPrimaryButtonStyle(),
                Boolean(secondaryButtonText) && styles.halfWidthButton,
              ]}
              onPress={handlePrimaryPress}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>{primaryButtonText}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  closeIconButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  contentContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: '#10B981',
  },
  destructiveButton: {
    backgroundColor: '#EF4444',
  },
  secondaryButton: {
    backgroundColor: '#E5E7EB',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },
});