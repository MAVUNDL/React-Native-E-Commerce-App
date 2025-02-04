import { StyleSheet, Text, ToastAndroid, View, Image, ActivityIndicator, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Icon from "react-native-feather";
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Lenovo {
  id: number;
  product_name: string;
  price: string;
  image_urls: string;
  descriptions: string;
  lenovo_product_id: number
}

interface Dell{
  id: number;
  product_name: string;
  price: string;
  image_urls: string;
  descriptions: string;
  dell_product_id: number;
}

// for lenovo
interface ProductSpecs {
  Processor: string; // e.g., "Intel Core i5-1335U"
  Processor_Frequency?: string; // e.g., "3.3 GHz", optional
  Display_Diagonal: string; // e.g., "14-inch"
  Display_Type: string; // e.g., "Full HD"
  Internal_Memory: string; // e.g., "8GB"
  Total_Storage_Capacity: string; // e.g., "512GB"
  Operating_System: string; // e.g., "Windows 11 Home"
  Weight: string; // e.g., "1.65 kg"
  Product_Type?: string; // e.g., "Notebook", optional
}

// for dell
function extractTechnicalSpecs(description: string) {
  let specs: ProductSpecs = {
    Processor: '',
    Display_Diagonal: '',
    Display_Type: '',
    Internal_Memory: '',
    Total_Storage_Capacity: '',
    Operating_System: '',
    Weight: ''
  };

  // Extracting the processor
  const processorRegex = /Processor family:\s*([\w\s\d®™]+)/;
  const processorMatch = description.match(processorRegex);
  if (processorMatch) {
    specs['Processor'] = processorMatch[1];
  }

  // Extracting the display diagonal
  const displayDiagonalRegex = /Display diagonal:\s*([\d.]+\s*cm\s*\([\d.]+")/;
  const displayDiagonalMatch = description.match(displayDiagonalRegex);
  if (displayDiagonalMatch) {
    specs['Display_Diagonal'] = displayDiagonalMatch[1];
  }

  // Extracting the display type
  const displayTypeRegex = /HD type:\s*([\w\s]+)/;
  const displayTypeMatch = description.match(displayTypeRegex);
  if (displayTypeMatch) {
    specs['Display_Type'] = displayTypeMatch[1];
  }

  // Extracting internal memory
  const internalMemoryRegex = /Internal memory:\s*([\d\s\w]+)/;
  const internalMemoryMatch = description.match(internalMemoryRegex);
  if (internalMemoryMatch) {
    specs['Internal_Memory'] = internalMemoryMatch[1];
  }

  // Extracting total storage capacity
  const storageCapacityRegex = /Total storage capacity:\s*([\d\s\w]+)/;
  const storageCapacityMatch = description.match(storageCapacityRegex);
  if (storageCapacityMatch) {
    specs['Total_Storage_Capacity'] = storageCapacityMatch[1];
  }

  // Extracting operating system
  const osRegex = /Operating system installed:\s*([\w\s\d]+)/;
  const osMatch = description.match(osRegex);
  if (osMatch) {
    specs['Operating_System'] = osMatch[1];
  }

  // Extracting weight
  const weightRegex = /Weight:\s*([\d.]+\s*kg)/;
  const weightMatch = description.match(weightRegex);
  if (weightMatch) {
    specs['Weight'] = weightMatch[1];
  }

  // Remove empty properties from the object
  const filteredSpecs = Object.fromEntries(
    Object.entries(specs).filter(([key, value]) => value !== undefined && value !== '')
  );

  return filteredSpecs as ProductSpecs;
}



function extractProductSpecs(description: string) {
  let specs: ProductSpecs = {
    Processor: '',
    Display_Diagonal: '',
    Display_Type: '',
    Internal_Memory: '',
    Total_Storage_Capacity: '',
    Operating_System: '',
    Weight: ''
  };

  // Extracting the processor
  const processorRegex = /Intel Core i([A-Za-z0-9-]+)/;
  const processorMatch = description.match(processorRegex);
  if (processorMatch) {
    specs['Processor'] = `Intel Core i${processorMatch[1]}`;
  }

  // Extracting the processor frequency
  const processorFrequencyRegex = /(\d+(\.\d+)?)\s*GHz/;
  const processorFrequencyMatch = description.match(processorFrequencyRegex);
  if (processorFrequencyMatch) {
    specs['Processor_Frequency'] = `${processorFrequencyMatch[1]} GHz`;
  }

  // Extracting the display size
  const displayRegex = /(\d+(\.\d+)?)\s*[-inch]+/;
  const displayMatch = description.match(displayRegex);
  if (displayMatch) {
    specs['Display_Diagonal'] = `${displayMatch[1]}-inch`;
  }

  // Extracting the display type (e.g., WUXGA, Full HD)
  const displayTypeRegex = /(WUXGA|Full HD)/;
  const displayTypeMatch = description.match(displayTypeRegex);
  if (displayTypeMatch) {
    specs['Display_Type'] = displayTypeMatch[1];
  }

  // Extracting the RAM
  const ramRegex = /(\d+GB)\s*RAM/;
  const ramMatch = description.match(ramRegex);
  if (ramMatch) {
    specs['Internal_Memory'] = ramMatch[1];
  }

  // Extracting the storage
  const storageRegex = /(\d+GB)\s*SSD/;
  const storageMatch = description.match(storageRegex);
  if (storageMatch) {
    specs['Total_Storage_Capacity'] = `${storageMatch[1]}`;
  }

  // Extracting the operating system
  const osRegex = /Windows\s+(\d+)\s*Home/;
  const osMatch = description.match(osRegex);
  if (osMatch) {
    specs['Operating_System'] = `Windows ${osMatch[1]} Home`;
  }

  // Extracting the weight
  const weightRegex = /(\d+(\.\d+)?)\s*kg/;
  const weightMatch = description.match(weightRegex);
  if (weightMatch) {
    specs['Weight'] = `${weightMatch[1]} kg`;
  }

  // Extracting the product type (e.g., Notebook)
  const productTypeRegex = /(\w+)\s*notebook/;
  const productTypeMatch = description.match(productTypeRegex);
  if (productTypeMatch) {
    specs['Product_Type'] = productTypeMatch[1];
  }

  // Remove empty properties from the object
const filteredSpecs = Object.fromEntries(
  Object.entries(specs).filter(([key, value]) => value !== undefined && value !== "")
);

  return filteredSpecs as ProductSpecs;
}

const ProductPageDetails = () => {
  const { product } = useLocalSearchParams(); // Access the query params

  //states
  const [Lenovo_product, set_Lenovo] = useState<Lenovo>(null);
  const [Dell_product, set_Dell] = useState<Dell>(null);
  const [descriptions, setDescriptions] = useState<ProductSpecs>(null);
  const [Loaded, set_Load] = useState<boolean>(false);
  const [loaded_Dell, set_indicator] = useState<boolean>(false);
  // router
  const router = useRouter();

  // Ensure product is a string before parsing
  const productDetails = typeof product === "string" ? JSON.parse(product) : null;

  if (!productDetails) {
    return <Text>Invalid product details</Text>; // Handle invalid product data
  }

  // Fetch product details
  const fetchAndCacheData = async (retryCount = 0) => {
    const cacheKey = `product_${productDetails.brand}_${productDetails.id}`;
    const maxRetries = 3; // Maximum number of retries
  
    try {
      // Check cache
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (cachedData) {
        const data = JSON.parse(cachedData);
        set_Load(true);
        if (productDetails.brand === 'Dell') {
          set_Dell(data);
          setDescriptions(extractTechnicalSpecs(data.descriptions));
          set_indicator(true);
        } else if (productDetails.brand === 'Lenovo') {
          set_Lenovo(data);
          setDescriptions(extractProductSpecs(data.descriptions));
        }
        return; // Use cached data
      }
  
      // Fetch from API if no cache
      const response = await fetch(
        `https://e-commerce-rest-api-1-rqrw.onrender.com/api/get-product/${productDetails.brand}/${productDetails.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Save to cache
      await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
  
      set_Load(true);
      if (productDetails.brand === 'Dell') {
        set_Dell(data);
        setDescriptions(extractTechnicalSpecs(data.descriptions));
        set_indicator(true);
      } else if (productDetails.brand === 'Lenovo') {
        set_Lenovo(data);
        setDescriptions(extractProductSpecs(data.descriptions));
      }
    } catch (error) {
      if (retryCount < maxRetries) {
        ToastAndroid.show(`Retrying... (${retryCount + 1}/${maxRetries})`, ToastAndroid.SHORT);
        await fetchAndCacheData(retryCount + 1); // Retry the API call
      } else {
        ToastAndroid.show(`Error: ${error.message}`, ToastAndroid.LONG);
      }
    }
  };
  
// make the api call
  useEffect(() => {
    fetchAndCacheData();
  }, []);

  const getImageUrls = (product) => {
    if (!product || !product.image_urls) return [];
    return JSON.parse(product.image_urls.replace(/'/g, '"')).map((url) => `http:${url}`);
  };

  const images = Loaded
    ? loaded_Dell
      ? getImageUrls(Dell_product)
      : getImageUrls(Lenovo_product)
    : [];
  
    return (
      <View style={styles.container}>
        {/* Show loading or error message until images are available */}
        {Loaded ? (
          <ScrollView>
           <View className='flex-1'>
            <TouchableOpacity className='flex-1 top-10 z-10 ml-3 rounded-full bg-gray h-14 w-14 justify-center items-center' onPress={() => router.back()}>
              <Icon.ArrowLeft height={25} width={25} color="#1F41BB"/>
            </TouchableOpacity>
            <View className='flex-1 items-center p-5'>
              <FlatList
              data={images}
              horizontal
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.image} />
              )}
              contentContainerStyle={styles.flatList}
              showsHorizontalScrollIndicator={false}
              />
              {loaded_Dell ? <Text className='font-extrabold text-center'> {Dell_product.product_name} </Text> : <Text className='font-extrabold  text-center'> {Lenovo_product.product_name} </Text>}
              </View>
           </View>
          </ScrollView>
        ) : (
          <ActivityIndicator size="small" color="#1F41BB" />
        )}
      </View>
    );
};

export default ProductPageDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatList: {
    paddingHorizontal: 10,
  },
  image: {
    width: 240,
    height: 240,
    marginHorizontal: 5,
    borderRadius: 10,
    resizeMode: 'cover',
  },
});
