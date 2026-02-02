import { playlistAPI } from "@/services/api";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function CreatePlaylist() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const inputFocusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Playlist Name Required", "Please enter a name for your playlist.");
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setLoading(true);
      
      // Animate button press
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      const res = await playlistAPI.createPlaylist(name);
      console.log("🎵 CREATE PLAYLIST RESPONSE =>", res);

      if (res.status === "success") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Success animation
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -50,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          Alert.alert(
            "🎉 Playlist Created!",
            `"${name}" has been successfully created.`,
            [
              {
                text: "Add Songs",
                onPress: () => router.push("/explore"),
                style: "default",
              },
              {
                text: "View Playlist",
                onPress: () => router.replace("/profile"),
              },
            ]
          );
        });
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Creation Failed", res.message || "Please try again.");
      }
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Connection Error",
        "Unable to connect to the server. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputFocus = () => {
    Animated.timing(inputFocusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleInputBlur = () => {
    Animated.timing(inputFocusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const getBorderColor = () => {
    return inputFocusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(108, 140, 255, 0.2)', '#6C8CFF']
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0B0F1A', '#151B32', '#1A2342']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Decorative Elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Playlist</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Playlist Icon */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['#6C8CFF', '#4C6FFF']}
            style={styles.iconGradient}
          >
            <MaterialIcons name="playlist-add" size={60} color="#FFFFFF" />
          </LinearGradient>
          <View style={styles.iconGlow} />
        </View>

        <Text style={styles.subtitle}>Create your perfect playlist</Text>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Playlist Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <MaterialIcons name="label" size={16} color="#6C8CFF" /> Playlist Name
            </Text>
            <Animated.View style={[styles.inputWrapper, { borderColor: getBorderColor() }]}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="My Awesome Playlist"
                placeholderTextColor="#6B7A99"
                style={styles.input}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                maxLength={50}
                autoFocus
              />
              <View style={styles.charCounter}>
                <Text style={styles.charText}>{name.length}/50</Text>
              </View>
            </Animated.View>
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <MaterialIcons name="description" size={16} color="#6C8CFF" /> Description (Optional)
            </Text>
            <View style={[styles.inputWrapper, styles.textareaWrapper]}>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="What's this playlist about?"
                placeholderTextColor="#6B7A99"
                style={[styles.input, styles.textarea]}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Privacy Toggle */}
          <TouchableOpacity 
            style={styles.privacyToggle}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setIsPrivate(!isPrivate);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.privacyLeft}>
              <MaterialIcons 
                name={isPrivate ? "lock" : "public"} 
                size={20} 
                color={isPrivate ? "#FF6B6B" : "#00D4AA"} 
              />
              <View style={styles.privacyTextContainer}>
                <Text style={styles.privacyTitle}>
                  {isPrivate ? "Private Playlist" : "Public Playlist"}
                </Text>
                <Text style={styles.privacySubtitle}>
                  {isPrivate ? "Only you can see this" : "Visible to everyone"}
                </Text>
              </View>
            </View>
            <View style={[
              styles.toggleSwitch,
              isPrivate && styles.toggleSwitchActive
            ]}>
              <View style={[
                styles.toggleKnob,
                isPrivate && styles.toggleKnobActive
              ]} />
            </View>
          </TouchableOpacity>

          {/* Create Button */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              onPress={handleCreate}
              disabled={loading}
              activeOpacity={0.9}
              style={styles.createButton}
            >
              <LinearGradient
                colors={name.trim() ? ['#6C8CFF', '#4C6FFF'] : ['#4A5568', '#2D3748']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <Animated.View style={styles.spinner} />
                    <Text style={styles.buttonText}>Creating...</Text>
                  </View>
                ) : (
                  <>
                    <MaterialIcons name="add-circle" size={22} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Create Playlist</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Tips */}
          <View style={styles.tipsContainer}>
            <MaterialIcons name="lightbulb" size={16} color="#FFD166" />
            <Text style={styles.tipsText}>
              Tip: Use descriptive names to easily find your playlists later
            </Text>
          </View>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(108, 140, 255, 0.05)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(74, 85, 104, 0.03)',
  },
  decorativeCircle3: {
    position: 'absolute',
    top: '30%',
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 212, 170, 0.03)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C8CFF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(108, 140, 255, 0.15)',
    zIndex: -1,
  },
  subtitle: {
    color: '#8B9CB6',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '500',
  },
  formContainer: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    gap: 6,
  },
  inputWrapper: {
    backgroundColor: 'rgba(30, 38, 66, 0.6)',
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    position: 'relative',
  },
  input: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    padding: 0,
  },
  textareaWrapper: {
    minHeight: 100,
  },
  textarea: {
    minHeight: 80,
  },
  charCounter: {
    position: 'absolute',
    top: 8,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  charText: {
    color: '#8B9CB6',
    fontSize: 12,
    fontWeight: '500',
  },
  privacyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 38, 66, 0.6)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A3455',
  },
  privacyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  privacyTextContainer: {
    flex: 1,
  },
  privacyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  privacySubtitle: {
    color: '#8B9CB6',
    fontSize: 13,
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2D3748',
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: 'rgba(255, 107, 107, 0.3)',
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6B7A99',
  },
  toggleKnobActive: {
    backgroundColor: '#FF6B6B',
    transform: [{ translateX: 22 }],
  },
  createButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#6C8CFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  spinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderTopColor: 'transparent',
    animationKeyframes: {
      '0%': { transform: [{ rotate: '0deg' }] },
      '100%': { transform: [{ rotate: '360deg' }] },
    },
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  tipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 209, 102, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 209, 102, 0.2)',
  },
  tipsText: {
    color: '#FFD166',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
});