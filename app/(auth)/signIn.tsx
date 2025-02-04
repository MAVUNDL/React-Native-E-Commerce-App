import { Image, SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, ToastAndroid} from 'react-native'
import React, { useState } from 'react'
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const signIn = () => {
  // create state variables
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState(''); 
  const [loading, setLoader] = useState<boolean>(false);
  const [forgotLorder, setForgotLoader] = useState<boolean>(false);
  const [focused, setFocus] = useState<boolean>(false);
  const [focuse, setFocuse] = useState<boolean>(false);
  const [authenticated, setAuth] = useState<boolean>(false);

  // state for checking if input is not emepty before submitting data
  const [EmptyMail, setEmptyMail] =  useState<boolean>(false);
  const [EmptyPass, setEmptyPass] = useState<boolean>(false);

  // refresh state
  const [refresh, setRefresh] = useState<boolean>(false);

  // router object
  const router = useRouter();
  const shareStae = useLocalSearchParams();

  const validateInputs = () => { 
    let isValid = true; 

    if (Email === '') {
      setEmptyMail(true); 
      setFocus(true); 
      isValid = false; 
    } 
    
    if (Password === '') {
      setEmptyPass(true); 
      setFocuse(true); 
      isValid = false; 
    } 

    return isValid;
}

  // handle post request
    const handleSubmit = async () => {
      try{

        // check if inputs are empty just return 
        if(!validateInputs()){
          ToastAndroid.show('Please fill the missing fields', 50);
          return;
        }

        setLoader(true);
        // send request and get response
        const response = await fetch("https://e-commerce-rest-api-1-rqrw.onrender.com/api/signIn", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: Email,
            password: Password
          }),
        });
  
        // get data from the response
        const data = await response.json();
  
        if(response.ok){
          ToastAndroid.show(`Welcome  back  ${data.user.name}`, ToastAndroid.LONG)
          setRefresh(true)
          // route to home
          router.push({
            pathname: "/(tabs)/home",
            params: {user: data.user},  // Pass the email state to the next screen
            }
          );
        } else{
         ToastAndroid.show('Incorrect password or email', ToastAndroid.LONG);
        }
      } catch(error){
       ToastAndroid.show(`${error}`, ToastAndroid.LONG);
      } finally {
        setLoader(false);
        if(refresh){
          // reset inputs
          setEmail('');
          setPassword('');
        }

      };
    }

    const handleForgotPassword = async () => {
      try{
        if (Email === '') {
          ToastAndroid.show('Please enter your email to proceed.', ToastAndroid.LONG);
          return;
        }

        setForgotLoader(true);
  
        // send request and get response
        const response = await fetch("https://e-commerce-rest-api-1-rqrw.onrender.com/api/resetPassword", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: Email,
          }),
        });
  
        // get data from the response
        const data = await response.json();
  
        if(response.ok){
          ToastAndroid.show(`${data.message}`, ToastAndroid.LONG);
          // Delay routing by 10 seconds
          setTimeout(() => {
            router.push({
              pathname: "/forgotpassword",
              params: { Email },  // Pass the email state to the next screen
            });
          }, 5000); // 5 seconds delay
        } else{
          ToastAndroid.show(`${data.message}`, ToastAndroid.LONG)
        }
      } catch(error){
        ToastAndroid.show(`${error}`, ToastAndroid.LONG);
      } finally{
        setForgotLoader(false);
      }
    };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView>
      <View className='items-center'>
          <Text className='font-extrabold text-5xl text-primaryColor pt-28 pb-5'>
            Login here
          </Text>
          <Text className='text-gray-600 pt-3 font-medium pb-5'>
            Welcome back you've been missed
          </Text>
          <TextInput className={`bg-lightBlue w-96 h-16 mt-10 rounded-xl border-2 font-medium p-5 ${focused ? ' border-primaryColor': 'border-white' } ${EmptyMail ? 'border-red-600' : ''}`} placeholder='Email' value={Email} onChangeText={setEmail} onFocus={() => setFocus(true)} onBlur={() => {setFocus(false) ; setEmptyMail(false)}} autoCapitalize='none'/>
          <TextInput className={`bg-lightBlue w-96 h-16 mt-10 rounded-xl border-2 font-medium p-5 ${focuse ? ' border-primaryColor': 'border-white' } ${EmptyPass ? 'border-red-600' : ''}`} placeholder='Password' value={Password} onChangeText={setPassword} textContentType='password' onFocus={() => setFocuse(true)} onBlur={() => {setFocuse(false) ; setEmptyPass(false)}} secureTextEntry />
        </View>
        <View className='items-end pr-10 pt-6'>
          <TouchableOpacity onPress={handleForgotPassword} disabled={forgotLorder}> 
            {forgotLorder ? <ActivityIndicator size="small" color="#1F41BB"/> : <Text className='text-primaryColor font-medium'> forgot your password? </Text>}
          </TouchableOpacity>
        </View>
        <View className='items-center'>
          <TouchableOpacity className='bg-primaryColor w-96 h-16 mt-10 justify-center items-center rounded-xl' onPressIn={handleSubmit} disabled={loading}>
              {loading ? <ActivityIndicator size="small" color="#fff"/> : <Text className='text-white text-xl font-bold'> Sign In </Text>}
          </TouchableOpacity>
        </View>
        <View className='items-center  pt-8'>
          <TouchableOpacity onPress={() => router.push("/signUp")}> 
            <Text className=' font-medium'> Create new account </Text>
          </TouchableOpacity>
        </View>
        <View className='items-center  pt-14 pb-4'>
          <TouchableOpacity> 
            <Text className='text-primaryColor font-semibold text-lg' > or continue with </Text>
          </TouchableOpacity>
        </View>
        <View className='flex-row justify-items-center pt-7 justify-evenly  '>
          <View>
            <TouchableOpacity className=' flex-1 bg-gray  justify-center items-center p-4 rounded-full'> 
              <AntDesign name="google" size={26}/>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity className=' flex-1 bg-gray  justify-center items-center p-4 rounded-full'> 
              <AntDesign name="twitter" size={26}/>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity className=' flex-1 bg-gray  justify-center items-center p-4 rounded-full'> 
              <AntDesign name="instagram" size={26}/>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity className=' flex-1 bg-gray  justify-center items-center p-4 rounded-full'> 
              <MaterialIcons name="facebook" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default signIn

