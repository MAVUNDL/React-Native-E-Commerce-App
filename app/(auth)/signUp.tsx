import { SafeAreaView, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, ToastAndroid} from 'react-native'
import React, { useEffect, useState } from 'react'
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';

const signUp = () => {
  // state declaration
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [focusName, setFocuName] = useState<boolean>(false);
  const [focusEmail, setFocusEmail] = useState<boolean>(false);
  const [focusPass, setFocusPass] = useState<boolean>(false);
  const [loading, setloading] = useState<boolean>(false);
  const [isVerificationStarted, setIsVerificationStarted] = useState(false);

  // state for checking if input is not emepty before submitting data
  const [EmptyName, setEmptyName] = useState<boolean>(false);
  const [EmptyMail, setEmptyMail] =  useState<boolean>(false);
  const [EmptyPass, setEmptyPass] = useState<boolean>(false);

  // handle refresh
  const [refresh,  setRefresh] = useState<boolean>(false);

  const validateInputs = () => { 
      let isValid = true; 

      if (Name === '') {
        setEmptyName(true);
        setFocuName(true); 
        isValid = false; 
      } 
      
      if (Email === '') {
        setEmptyMail(true); 
        setFocusEmail(true); 
        isValid = false; 
      } 
      
      if (Password === '') {
        setEmptyPass(true); 
        setFocusPass(true); 
        isValid = false; 
      } 

      return isValid;
  }
  
  // Verification polling using useEffect
  useEffect(() => {
    if (isVerificationStarted) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`https://e-commerce-rest-api-1-rqrw.onrender.com/api/check-verification/${Email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          if (data.verified) {
            clearInterval(interval); // Stop polling
            ToastAndroid.show("Email verified! Redirecting to Home page...", 50);
            router.push("/home"); // Navigate to Home page
          }
        } catch (error) {
          console.log('Error checking verification status:', error);
        }
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [isVerificationStarted, Email]);

  // handle post request
  const handleSubmit = async () => {
    try{

      // check if inputs are empty just return 
      if(!validateInputs()){
        ToastAndroid.show('Please fill the missing fields', 50);
        return;
      }
      setloading(true);
      // send request and get response
      const response = await fetch("https://e-commerce-rest-api-1-rqrw.onrender.com/api/signUp", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name : Name,
          email: Email,
          password: Password
        }),
      });

      // get data from the response
      const data = await response.json();

      if(response.ok){
        ToastAndroid.show( `Welcome  ${data.user.name}, please check your email.`, ToastAndroid.LONG);
        setRefresh(true);
        // start process
        setIsVerificationStarted(true);
      } else{
        ToastAndroid.show(`${data.error}`, ToastAndroid.LONG)
      }

    } catch(error){
      ToastAndroid.show('Internal server error', ToastAndroid.LONG);
      console.log(error);
    } finally{
      // update loading state
      setloading(false);
      
      if(refresh){
        // resets inputs
        setName('');
        setEmail('');
        setPassword('');
      }
    }

  }


  return (
   <SafeAreaView className='flex-1 bg-white'>
     <ScrollView>
        <View className='items-center'>
          <Text className='font-extrabold text-5xl pt-24  text-primaryColor'>
            Create account
          </Text>
          <Text className='text-gray-600 pt-3 font-medium'>
            Create an account to start ordering.
          </Text>
          <TextInput className={`bg-lightBlue w-96 h-16 mt-10 rounded-xl border-2 font-medium p-5 ${focusName ? ' border-primaryColor': 'border-white' } ${EmptyName ? 'border-red-600' : ''}`} placeholder='Name' value={Name} onChangeText={setName} onFocus={() => setFocuName(true)} onBlur={() => {setFocuName(false) ; setEmptyName(false)}} />
          <TextInput className={`bg-lightBlue w-96 h-16 mt-10 rounded-xl border-2 font-medium p-5 ${focusEmail ? ' border-primaryColor': 'border-white' } ${EmptyMail ? 'border-red-600' : ''}`} placeholder='Email' value={Email} onChangeText={setEmail} onFocus={() => setFocusEmail(true)} onBlur={() => {setFocusEmail(false) ; setEmptyMail(false)}}/>
          <TextInput className={`bg-lightBlue w-96 h-16 mt-10 rounded-xl border-2 font-medium p-5 ${focusPass ? ' border-primaryColor': 'border-white' } ${EmptyPass ? 'border-red-600' : ''}`} placeholder='Password' value={Password} onChangeText={setPassword} onFocus={() => setFocusPass(true)} onBlur={() => {setFocusPass(false) ; setEmptyPass(false)}} secureTextEntry/>
          <TouchableOpacity className='bg-primaryColor w-96 h-16 mt-10 justify-center items-center rounded-xl' onPressOut={handleSubmit}>
           {loading ? <ActivityIndicator size="small" color="#fff"/> :  <Text className='text-white text-xl font-bold'> Sign Up</Text> }
          </TouchableOpacity>
        </View>
        <View className='items-center  pt-8'>
          <TouchableOpacity onPress={() => router.push("/signIn")}> 
            <Text className=' font-medium'> Already have an account </Text>
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

export default signUp

const styles = StyleSheet.create({})