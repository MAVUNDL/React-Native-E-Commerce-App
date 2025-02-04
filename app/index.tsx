import {useRouter } from "expo-router";
import React from "react";
import { View, Text, Image, TextInput, SafeAreaView, TouchableOpacity } from "react-native";

const Index = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 justify-center">
      {/* App image */}
      <View className="justify-center items-center">
        <View>
          <Image className="size-96" source={require("../assets/images/cart.png")} />
        </View>
        {/* Header */}
        <Text className="text-4xl text-primaryColor font-bold text-center text-gray-800 mb-7">
          Welcome to Easy-Order
        </Text>
        <Text className="text-sm text-center font-medium text-gray-600 ">
          Your go-to app for all your shopping needs, from tools and tech to books and more.
        </Text>
      </View>
      <View className="flex flex-row justify-evenly items-center pt-16 ">
        <TouchableOpacity className="bg-primaryColor w-40 h-16 justify-center items-center rounded-2xl" onPress={() => router.push("/signUp")}>
          <Text className="text-white text-xl font-bold">Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-gray w-40 h-16 justify-center items-center rounded-2xl" onPress={() => router.push("/signIn")}>
          <Text className="text-black text-xl font-bold">Sign In</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

export default Index;
