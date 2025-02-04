import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const HorizontalFilter = ({item}) => {
  return (
    <View className='items-center'>
    <TouchableOpacity className='w-24 h-12 border border-gray p-2 bg-lightBlue rounded-2xl items-center justify-center'>
      <Text>{item}</Text>
    </TouchableOpacity>
    </View>
  )
}

export default HorizontalFilter;

const styles = StyleSheet.create({})