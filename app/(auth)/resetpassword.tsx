import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';

const resetpassword = () => {
    const router = useRouter();
    // state for focus
    const [passFocus, setPassFocus] = useState<boolean>(false);
    const [confirmpassFocus, setConfirmPassFocus] = useState<boolean>(false);

    // state for inputs
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    // state to verify if inputs are not empty
    const [passEmpty, setPassEmpty] = useState<boolean>(false);
    const [confirmPassEmpty, setConfirmPassEmpty] = useState<boolean>(false);

    // state to update loader
    const [loader, setLoader] = useState<boolean>(false);
    const {Email} = useLocalSearchParams(); // GET email from signIn

    const validateInputs = () => { 
        let isValid = true; 
    
        if (password === '') {
          setPassEmpty(true); 
          setPassFocus(true); 
          isValid = false; 
        } 
        
        if (confirmPass === '') {
          setConfirmPassEmpty(true); 
          setConfirmPassFocus(true); 
          isValid = false; 
        } 
    
        return isValid;
    }

    const match = () => {
        let isvalid = true;

        if(confirmPass !== password){
            setConfirmPassEmpty(true);
            setConfirmPassFocus(true);
            isvalid = false;
        }

        return isvalid;
    }

    const handleSubmit = async () => {
        // check if inputs are empty just return 
        if(!validateInputs()){
            ToastAndroid.show('Please fill the missing fields', 50);
            return;
        }
        
        if(!match()){
            ToastAndroid.show('Password does not match', ToastAndroid.LONG);
            return;
        }

        try{
            setLoader(true);
            // send request and get response
            const response = await fetch("https://e-commerce-rest-api-1-rqrw.onrender.com/api/set-new-password", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: Email,
                password: password,
            }),
            });
    
            // get data from the response
            const data = await response.json();

            if(response.ok){
                ToastAndroid.show(`${data.message}`, ToastAndroid.LONG);
                // Delay routing by 3 seconds
                setTimeout(() => {
                    router.push({
                    pathname: "/signIn",
                    params: { Email },  // Pass the email state to the next screen
                    });
                }, 3000); // 3 seconds delay
            } else{
                ToastAndroid.show(`${data.message}`, ToastAndroid.LONG);
            }

        } catch(error){
            ToastAndroid.show(`${error}`, ToastAndroid.LONG);
        } finally{
            // udpate loader
            setLoader(false);
            // clear inputs
            setPassword('');
            setConfirmPass('');
        }
    }

  return (
    <SafeAreaView className='flex-1 bg-white'>
       <ScrollView>
       <View className='items-center'>
            <Text className='font-extrabold text-5xl text-primaryColor pt-28 pb-5'>
                Reset Password
            </Text>
            <Text className='text-gray-600 pt-3 font-medium pb-5'>
                Enter your new password here
            </Text>
            <TextInput className={`bg-lightBlue w-96 h-16 mt-10 rounded-xl border-2 font-medium p-5 ${passFocus ? ' border-primaryColor': 'border-white' } ${passEmpty ? 'border-red-600' : ''}`} placeholder='Password' value={password} onChangeText={setPassword} onFocus={() => setPassFocus(true)} onBlur={() => {setPassFocus(false) ; setPassEmpty(false)}}/>
            <TextInput className={`bg-lightBlue w-96 h-16 mt-10 rounded-xl border-2 font-medium p-5 ${confirmpassFocus ? ' border-primaryColor': 'border-white' } ${confirmPassEmpty ? 'border-red-600' : ''}`} placeholder='Confirm password' value={confirmPass} onChangeText={setConfirmPass} textContentType='password' onFocus={() => setConfirmPassFocus(true)} onBlur={() => {setConfirmPassFocus(false) ; setConfirmPassEmpty(false)}} secureTextEntry />
        </View>
        <View className='items-center'>
            <TouchableOpacity className='bg-primaryColor w-96 h-16 mt-10 justify-center items-center rounded-xl' onPressIn={handleSubmit} disabled={loader}>
                {loader ? <ActivityIndicator size="small" color="#fff"/> : <Text className='text-white text-xl font-bold'> Submit </Text>}
            </TouchableOpacity>
        </View>
       </ScrollView>
    </SafeAreaView>
  )
}

export default resetpassword

const styles = StyleSheet.create({})