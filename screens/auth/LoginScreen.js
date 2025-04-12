import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  TextInput,
  Animated,
  Easing
} from "react-native";
import axios from "axios";
import { colors, network } from "../../constants";
import CustomButton from "../../components/CustomButton";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import ProgressDialog from "react-native-progress-dialog";
import InternetConnectionAlert from "react-native-internet-connection-alert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import header_logo from "../../assets/logo/logo.png";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [shakeAnimation] = useState(new Animated.Value(0));

  const _storeData = async (user) => {
    try {
      await AsyncStorage.setItem("authUser", JSON.stringify(user));
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
    ]).start();
  };

  const loginHandle = async () => {
    setIsLoading(true);
    setError("");

    // Validation
    if (email === "") {
      setIsLoading(false);
      shake();
      return setError("Please enter your email");
    }

    if (password === "") {
      setIsLoading(false);
      shake();
      return setError("Please enter your password");
    }

    if (!email.includes("@") || !email.includes(".")) {
      setIsLoading(false);
      shake();
      return setError("Please enter a valid email address");
    }

    if (password.length < 6) {
      setIsLoading(false);
      shake();
      return setError("Password must be at least 6 characters");
    }

    try {
      const response = await axios.post(network.serverip + "/login", {
        email,
        password,
      });

      const result = response.data;

      if (response.status === 200 && result.success === true) {
        if (result?.data?.userType === "ADMIN") {
          await _storeData(result.data);
          navigation.navigate("dashboard", { authUser: result.data });
        } else {
          await _storeData(result.data);
          navigation.navigate("tab", { user: result.data });
        }
      } else {
        setIsLoading(false);
        shake();
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("LOGIN ERROR :>> ", error);
      setIsLoading(false);
      shake();
      
      if (error.response) {
        setError(error.response.data.message || "Invalid credentials. Please try again.");
      } else if (error.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <InternetConnectionAlert 
      onChange={(connectionState) => {}}
      title="Connection Lost"
      message="Please check your internet connection"
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <ProgressDialog 
              visible={isLoading} 
              label={"Authenticating..."} 
              activityIndicatorColor={colors.primary}
            />
            
            <StatusBar 
              barStyle="dark-content" 
              backgroundColor="transparent" 
              translucent 
            />

            <Animated.View 
              style={[
                styles.content,
                { transform: [{ translateX: shakeAnimation }] }
              ]}
            >
              <View style={styles.logoContainer}>
                <Image 
                  source={header_logo} 
                  style={styles.logo} 
                  resizeMode="contain"
                />
                
                <Text style={styles.subText}>Sign in to continue</Text>
              </View>

              {error ? (
                <CustomAlert 
                  message={error} 
                  type={"error"} 
                  containerStyle={styles.alertContainer}
                />
              ) : null}

              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Ionicons 
                    name="mail-outline" 
                    size={20} 
                    color={colors.muted} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email address"
                    placeholderTextColor={colors.muted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons 
                    name="lock-closed-outline" 
                    size={20} 
                    color={colors.muted} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor={colors.muted}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity 
                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons 
                      name={secureTextEntry ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color={colors.muted} 
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  onPress={() => navigation.navigate("forgetpassword")}
                  style={styles.forgetContainer}
                >
                  <Text style={styles.forgetText}>
                    Forgot your password?
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonContainer}>
                <CustomButton 
                  text={"Sign In"} 
                  onPress={loginHandle}
                  style={styles.loginButton}
                  textStyle={styles.loginButtonText}
                />
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account?</Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate("signup")}
                >
                  <Text style={styles.signupText}> Sign Up</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </InternetConnectionAlert>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  content: {
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: width * 0.8,
    height: width * 0.46,
    marginBottom: 1,
  },
  subText: {
    fontSize: 16,
    color: colors.muted,
  },
  alertContainer: {
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: colors.dark,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  forgetContainer: {
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  forgetText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: colors.muted,
    fontSize: 14,
  },
  signupText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;