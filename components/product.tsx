// ProductCard.js
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const ProductCard = ({ product}) => {
    const router = useRouter();
    const extractPrice = (priceString) => {
        // Use a regular expression to extract the number after "R"
        const match = priceString.match(/R\s?(\d+[,\d]*\.\d{2})/);
        if (match) {
          // Remove any commas and return the price as a number
          return match[1];
        }
        return null; // Return null if no match is found
      };

  return (
    <TouchableOpacity style={styles.container} onPress={() => router.push({
        pathname: "/screens/ProductPageDetails",
        params: { product: JSON.stringify(product)}
    })}>
      <Image source={{uri: product.image_url}}  style={styles.image} resizeMode='contain' />
      <Text className='text-wrap text-center text-sm font-normal mb-2'>{product.product_name}</Text>
      <Text className='text-wrap text-center font-semibold pt-3'>R{extractPrice(product.price)}</Text>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: "center",
        justifyContent: "center",
        height: 400,
        width: "auto",
        borderRadius: 6,
        boxShadow: "0 25px 50px -12px rgb(255 230 0 / 0.25)",
    },
    image: {
        height: 240,
        width: 150,
        marginBottom: 6
    }
})