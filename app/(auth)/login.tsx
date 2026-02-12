import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/authStore";

export default function Login() {
  const [isFocused, setIsFocused] = useState(false);
  const [passWord, setPassword] = useState("");
  const [email, setemail] = useState("");
  const [showPassword, setshowPassword] = useState(false);

  const {user, isLoading, login, token } = useAuthStore();

  const handleLogin =async () => {
    const result = await login(email, passWord);

    if (result.success) {
          Alert.alert("Success", result.message);
          // router.replace("/login"); // or go to main page if logged in
        } else {
          Alert.alert("Error", result.message || "Login failed. Try again.");
        }
  };
  console.log(user);
  console.log(token);
  
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text
        className="text-center font-bold text-3xl mb-11"
        style={{ color: "#FF6347" }}
      >
        Login
      </Text>

      <View className="w-[90%] h-[21rem]">
        <Text className="justify-start w-[90%] text-lg my-2">Email</Text>
        <View className="w-full relative ">
          <TextInput
            className={`border h-[3.5rem] rounded-lg bg-inputlogin ps-16 text-lg ${
              isFocused ? "border-gray-300" : "border-inputlogin"
            }`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setemail}
          />
          <Ionicons
            name="mail-outline"
            size={26}
            color="#FF6A55"
            className="absolute rounded-lg top-3 left-4"
          />
        </View>

        <Text className="justify-start w-[90%] text-lg my-2">Password</Text>
        <View className="w-full relative">
          <TextInput
            className={`border h-[3.5rem] rounded-lg bg-inputlogin ps-16 text-lg tracking-widest ${
              isFocused ? "border-gray-300" : "border-inputlogin"
            }`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter your password"
            keyboardType="number-pad"
            value={passWord}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <Ionicons
            name="lock-closed-outline"
            size={26}
            color="#FF6A55"
            className="absolute rounded-lg top-3 left-4"
          />
          <TouchableOpacity
            onPress={() => setshowPassword(!showPassword)}
            className="absolute right-4 top-3"
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={26}
              color="#FF6A55"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        className="h-[3rem] mt-14 w-[90%] bg-[#FF6A55] rounded-xl items-center justify-center"
      >
        <Text className="text-white text-xl font-semibold">Login</Text>
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

      <View className="flex-row gap-1">
        <Text className="text-gray-500">Dont you have an account?</Text>
        <Pressable onPress={() => router.push("/register")}>
          <Text className="text-[#FF6347] text-base font-medium">Sign Up</Text>
        </Pressable>
      </View>

      {/* <Button
        title="Go to Register"
        onPress={() => router.push("/(auth)/register")}
      /> */}
    </SafeAreaView>
  );
}
