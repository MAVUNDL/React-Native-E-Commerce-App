import { ActivityIndicator, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { OtpInput } from "react-native-otp-entry";
import { router, useLocalSearchParams } from 'expo-router';

const forgotpassword = () => {
    // states
    const [loading, setLoader] = useState<boolean>(false);
    const [Pin, setPin] = useState<string>('');
    const otpRef = useRef(null);
    const {Email} = useLocalSearchParams(); // GET email from signIn

    // handle submit
    const submit = async () => {
        // set loader
        setLoader(true);
        
        // send to database
        try{
            // send request and get response
            const response = await fetch("https://e-commerce-rest-api-1-rqrw.onrender.com/api/verify-OTP", {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                email: Email,
                forgot_pass_otp: Pin,
                }),
            });
    
          // get data from the response
          const data = await response.json();

          if(response.ok){
            otpRef.current.clear(); // Clear OTP fields on success
            ToastAndroid.show(`${data.message}`, ToastAndroid.LONG);
            // Delay routing by 5 seconds
            setTimeout(() => {
                router.push({
                pathname: "/resetpassword",
                params: { Email },  // Pass the email state to the next screen
                });
            }, 5000); // 5 seconds delay

          } else {
            ToastAndroid.show(`${data.message}`, ToastAndroid.LONG)
          }

        } catch(error){
            ToastAndroid.show(`${error}`, ToastAndroid.LONG);
        } finally{
            // update
            setLoader(false);
            // refest OTP state
            setPin('');
        }
    }
  return (
    <SafeAreaView className='flex-1 bg-white'>
       <View className='justify-center items-center'>
       <View className='items-center'>
         <Text className='text-primaryColor font-extrabold text-5xl pt-40 pb-7'>
            OTP Verification
         </Text>
         <Text className='font-semibold'>
            Enter OTP from your email
         </Text>
       </View>
       <OtpInput  focusColor="#1F41BB"  numberOfDigits={4} onFilled={(pin) => setPin(pin)}   ref={otpRef} theme={
            {containerStyle: styles.container}
         }/>
         <View className='items-center'>
            <TouchableOpacity className='bg-primaryColor w-80 h-16 mt-10 justify-center items-center rounded-xl' disabled={loading} onPress={submit}>
                {loading ? <ActivityIndicator size="small" color="#fff"/> : <Text className='text-white text-xl font-bold'> Submit </Text> }
            </TouchableOpacity>
         </View>
       </View>
    </SafeAreaView>
  )
}


export default forgotpassword


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'space-around',
        padding: 30,
        alignItems: 'center',
        paddingTop: 45,
    } 
})