import Checkbox from "@/components/checkboxlogin";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { firebaseConfig } from "../../firebaseConfig";

const OTP_LENGTH = 6;

export default function Login() {
  const recaptchaVerifier = useRef<any>(null);
  const inputs = useRef<(TextInput | null)[]>([]);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [isChecked, setIsChecked] = useState(false);
  const [OTP, setOTP] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (step === "OTP") {
      setTimeLeft(15);
    }
  }, [step]);

  const { sendOTP, verifyOTP, user, token } = useAuthStore();

  // ✅ Auto focus first OTP box
  useEffect(() => {
    if (step === "OTP") {
      setTimeout(() => inputs.current[0]?.focus(), 100);
    }
  }, [step]);

  // ✅ Format Cambodian phone
  const formatPhoneNumber = (phone: string) => {
    phone = phone.replace(/\s+/g, "").replace(/-/g, "");

    if (phone.startsWith("+")) return phone;
    if (phone.startsWith("0")) return "+855" + phone.slice(1);

    return "+855" + phone;
  };
  console.log(user);
  console.log(token);

  const handleResendOTP = async () => {
    const formattedPhone = formatPhoneNumber(phone);

    setTimeLeft(15); // 🔥 restart timer
    setOTP(Array(OTP_LENGTH).fill("")); // clear UI boxes
    setOtp("");

    inputs.current[0]?.focus(); // focus first box again

    const res = await sendOTP(formattedPhone, recaptchaVerifier.current);

    if (!res.success) {
      Alert.alert("Error", res.message);
    }
  };

  // ✅ Send OTP
  const handleSendOTP = async () => {
    if (!phone) {
      Alert.alert("Warning", "Please fill the phone number");
      return;
    }

    const formattedPhone = formatPhoneNumber(phone);
    const res = await sendOTP(formattedPhone, recaptchaVerifier.current);

    if (res.success) setStep("OTP");
    else Alert.alert("Error", res.message);
  };

  // ✅ Handle OTP change
  const handleChange = (text: string, index: number) => {
    if (!/^[0-9]?$/.test(text)) return;

    const newOtp = [...OTP];
    newOtp[index] = text;
    setOTP(newOtp);

    if (text && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }

    const combined = newOtp.join("");
    setOtp(combined);
  };

  // ✅ Verify OTP
  const handleVerifyOTP = async () => {
    if (otp.length !== OTP_LENGTH) {
      Alert.alert("Warning", "Please enter full OTP");
      return;
    }

    const res = await verifyOTP(otp);

    if (res.success) {
      Alert.alert("Success", "Login successful");
      const role = useAuthStore.getState().user?.role?.toLowerCase?.();

      if (role === "transporter") {
        router.replace("/navigation/transporter");
      } else {
        router.replace("/navigation/user");
      }
    } else {
      Alert.alert("Error", res.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />

      {/* ================= PHONE STEP ================= */}
      {step === "PHONE" && (
        <>
          <Text className="text-3xl font-bold mb-10 text-[#FF6347]">Login</Text>

          <View className="w-[90%] h-[21rem]">
            <TextInput
              className="border-gray-300 bg-inputlogin border h-[3.5rem] text-lg rounded-lg px-16"
              placeholder="Enter your phone number"
              keyboardType="default"
              value={phone}
              onChangeText={setPhone}
            />

            <Ionicons
              name="phone-portrait-outline"
              size={26}
              color="#FF6A55"
              className="absolute top-3 left-4"
            />

            <View className="items-center mt-10">
              <Checkbox
                checked={isChecked}
                label="Remember me"
                onPress={() => setIsChecked(!isChecked)}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSendOTP}
            className="mt-6 w-[90%] h-[3rem] bg-[#FF6A55] rounded-xl items-center justify-center"
          >
            <Text className="text-white text-xl font-bold">Login</Text>
          </TouchableOpacity>

          <View className="flex-row items-center my-4 w-[90%]">
            <View className="flex-1 border-t border-gray-300" />
            <Text className="mx-3 text-gray-500">Or sign in with</Text>
            <View className="flex-1 border-t border-gray-300" />
          </View>

          <View className="flex-row gap-2">
            <View className="w-[3rem] h-[3rem] border items-center justify-center rounded-3xl border-inputlogin">
              <Image source={require("../../assets/images/google.png")} />
            </View>
            <View className="w-[3rem] h-[3rem] border items-center justify-center rounded-3xl border-inputlogin">
              <Image source={require("../../assets/images/facebook.png")} />
            </View>
          </View>

          <View className="flex-row gap-1 mt-4">
            <Text className="text-gray-500">Don't have an account?</Text>
            <Pressable onPress={() => router.push("/register")}>
              <Text className="text-[#FF6347] text-base font-medium">
                Sign Up
              </Text>
            </Pressable>
          </View>
        </>
      )}

      {/* ================= OTP STEP ================= */}
      {step === "OTP" && (
        <View className="w-full items-center flex-1 justify-between px-6 py-10">
          {/* TOP */}
          <View className="w-full items-center">
            <Text className="text-3xl font-bold text-[#FF6347] mb-6">
              Verification
            </Text>

            <Text className="text-gray-500 text-center mb-8">
              Code has been sent to {formatPhoneNumber(phone)}
            </Text>

            {/* OTP BOXES */}
            <View className="flex-row justify-between w-full px-6 mb-6">
              {OTP.map((digit, index) => (
                <TextInput
                  key={index}
                  value={digit}
                  ref={(ref) => {
                    inputs.current[index] = ref;
                  }}
                  className="w-14 h-14 bg-gray-100 rounded-xl text-center text-xl font-bold"
                  keyboardType="default"
                  maxLength={1}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={({ nativeEvent }) => {
                    if (
                      nativeEvent.key === "Backspace" &&
                      !OTP[index] &&
                      index > 0
                    ) {
                      inputs.current[index - 1]?.focus();
                    }
                  }}
                />
              ))}
            </View>

            {/* RESEND */}
            <Text className="text-gray-400 mb-2 mt-4">
              Didn’t receive code?
            </Text>

            <Text className="text-gray-500">
              00:{timeLeft.toString().padStart(2, "0")}
            </Text>

            <Pressable disabled={timeLeft !== 0} onPress={handleResendOTP}>
              <Text
                className={`mt-2 font-semibold ${
                  timeLeft === 0 ? "text-[#FF6347]" : "text-gray-300"
                }`}
              >
                Resend Code
              </Text>
            </Pressable>
          </View>

          {/* VERIFY BUTTON */}
          <View className="w-full">
            <TouchableOpacity
              onPress={handleVerifyOTP}
              className="w-full h-14 bg-[#FF6347] rounded-full items-center justify-center"
            >
              <Text className="text-white text-lg font-bold">Verify</Text>
            </TouchableOpacity>

            {/* BACK */}
            <Pressable onPress={() => setStep("PHONE")}>
              <View className="items-center">
                <Text className="text-gray-500 mt-4">
                  Back to{" "}
                  <Text className="text-[#FF6347] font-semibold">Sign In</Text>
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
