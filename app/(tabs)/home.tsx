import {
  TextInput,
  ToastAndroid,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Icon from 'react-native-feather';
import ProductCard from '@/components/product';
import HorizontalFilter from '@/components/horizontalFilter';
import { useNavigation } from 'expo-router';

const Home = () => {
  // States
  const [product, setProduct] = useState([]);
  const [searchProduct, setSearchProduct] = useState([]);
  const [search, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isFetched, setIsFetched] = useState(false); // Track if data is already fetched

  const flatListRef = useRef(null);
  const navigation = useNavigation();

  const brands = [
    'Dell',
    'Lenovo',
    'Samsung',
    'Huawei',
    'Pixel',
    'Macbook',
    'Microsoft',
  ];

  // Fetch all products
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isFetched) return; // Prevent re-fetching
        const localData = await AsyncStorage.getItem('productData');
        if (localData) {
          // Use data from local storage if available
          const parsedData = JSON.parse(localData);
          setProduct(parsedData);
          setSearchProduct(parsedData);
        } else {
          // Fetch data from the server if not in local storage
          const response = await fetch(
            'https://e-commerce-rest-api-1-rqrw.onrender.com/api/get-all-products',
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }

          const data = await response.json();
          setProduct(data); // Store original data
          setSearchProduct(data); // Store data for searching

          // Save fetched data to local storage
          await AsyncStorage.setItem('productData', JSON.stringify(data));
        }
        setIsFetched(true); // Mark data as fetched
      } catch (error) {
        ToastAndroid.show(`Error: ${error.message}`, ToastAndroid.LONG);
      }
    };

    fetchData();

    // Restore scroll position when navigating back
    const unsubscribe = navigation.addListener('focus', () => {
      if (flatListRef.current && scrollOffset) {
        flatListRef.current.scrollToOffset({ offset: scrollOffset, animated: false });
      }
    });

    return unsubscribe;
  }, [isFetched, scrollOffset]);

  // Helper function to check if an item matches the query
  const contains = (item, query) => {
    return (
      item.product_name?.toLowerCase().includes(query) || // Match product name
      item.brand?.toLowerCase().includes(query) // Match brand
    );
  };

  // Refresh list
  const refreshList = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(
        'https://e-commerce-rest-api-1-rqrw.onrender.com/api/get-all-products',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) throw new Error('Failed to refresh products');
      const data = await response.json();
      setProduct(data);
      setSearchProduct(data);

      // Save refreshed data to local storage
      await AsyncStorage.setItem('productData', JSON.stringify(data));
    } catch (error) {
      ToastAndroid.show(`Error: ${error.message}`, ToastAndroid.LONG);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle search input
  const handleSearch = (text) => {
    const formattedQuery = text.toLowerCase();
    setQuery(text);

    const filteredData = product.filter((item) => contains(item, formattedQuery));
    setSearchProduct(filteredData);
  };

  // Handle scroll event
  const handleScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  return (
    <SafeAreaView className="flex bg-white p-2">
      <View className="bg-white">
        <View className="bg-inherit p-5 m-2">
          <TouchableOpacity className="flex-col items-end">
            <Icon.ShoppingCart height={32} width={32} color="#1F41BB" />
          </TouchableOpacity>
          <View className="p-3" />
          <View className="flex-row p-1 border border-gray rounded-2xl items-center">
            <Icon.Search width={32} height={32} color="#1F41BB" />
            <TextInput
              className="w-full"
              placeholder="Search by brand, name"
              value={search}
              onChangeText={(searchQuery) => handleSearch(searchQuery)}
            />
          </View>
        </View>
        <View>
          <FlatList
            className="m-2 pb-3 bg-inherit"
            scrollEnabled={true}
            data={brands}
            keyExtractor={(item) => item}
            renderItem={({ item }) => <HorizontalFilter item={item} />}
            horizontal={true}
            contentContainerStyle={{
              gap: 10,
              paddingHorizontal: 16,
              alignItems: 'center',
            }}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <FlatList
          ref={flatListRef}
          className="m-2 bg-slate-50 p-2"
          data={searchProduct}
          numColumns={2}
          refreshing={refreshing}
          onRefresh={refreshList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ProductCard product={item} />}
          onScroll={handleScroll}
          contentContainerClassName="gap-2 max-w-[960px] mx-auto w-full"
          columnWrapperClassName="gap-2 justify-center"
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
