import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import cartIcon from "../../assets/icons/cart_beg.png";
import scanIcon from "../../assets/icons/scan_icons.png";
import easybuylogo from "../../assets/logo/logo.png";
import { colors } from "../../constants";
import CustomIconButton from "../../components/CustomIconButton/CustomIconButton";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreaters from "../../states/actionCreaters/actionCreaters";
import SearchableDropdown from "react-native-searchable-dropdown";
import CategoriesScreen from "./CategoriesScreen";
import { SliderBox } from "react-native-image-slider-box";
import SofaLine from "../../assets/icons/sofa-line.png";
import Chairs from "../../assets/icons/chair.png";
import Stools from "../../assets/icons/stool.png";
import Tables from "../../assets/icons/table.png";
import SofaBanner from "../../assets/image/banners/sofa-banner.jpeg";
import Contrast from "../../assets/image/banners/contrast.jpeg";
import ChairBanner from "../../assets/image/banners/chair.jpeg";
import Shirt from "../../assets/image/shirt_1.jpg";
import Watch from "../../assets/image/Watch_1.jpg";
import Glasses from "../../assets/image/Glasses_1.jpg";
import { set } from "date-fns";
import { value } from "deprecated-react-native-prop-types/DeprecatedTextInputPropTypes";
import { src } from "deprecated-react-native-prop-types/DeprecatedImagePropType";


// Static categories
const categories = [
  {
    _id: "62fe244f58f7aa8230817f89",
    title: "Shirts",
    image: SofaLine,
  },
  {
    _id: "62fe243858f7aa8230817f86",
    title: "Watches",
    image: Chairs,
  },
  {
    _id: "62fe241958f7aa8230817f83",
    title: "Glasses",
    image: Stools,
  },
  // Add more categories if needed
];


// Static slides for SliderBox
const slides = [SofaBanner, Contrast, ChairBanner];


const HomeScreen = ({ navigation }) => {
  const cartproduct = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const { addCartItem } = bindActionCreators(actionCreaters, dispatch);

  // Hardcoded user data
  const user = {
    id: "123",
    name: "AST",
    email: "ast222@gmail.com",
    password: "123456",
  };

  // State Variables
  const [products, setProducts] = useState([]);
  const [searchItems, setSearchItems] = useState([]);
  const [userInfo, setUserInfo] = useState({});

  // Static Slides for SliderBox
  const slides = [SofaBanner, Contrast, ChairBanner];

  // Method to convert user to JSON
  const convertToJSON = (obj) => {
    try {
      setUserInfo(JSON.parse(obj));
    } catch (e) {
      setUserInfo(obj);
    }
  };

  // Initialize products
  useEffect(() => {
    setProducts([
      {
        _id: "1",
        title: "Classic Dark Shirt",
        image: require('../../assets/image/shirt_1.jpg'),
        categoryID: "62fe244f58f7aa8230817f89",
        price: 499.99,
        quantity: 10,
        description:"Hey this is really great textured and comfortable shirt"
      },
      {
        _id: "2",
        title: "ARMANI Watch",
        image: require('../../assets/image/Watch_1.jpg'),
        categoryID: "62fe241958f7aa8230817f83",
        price: 149.99,
        quantity: 25,
        description:"Hey this is really great textured and comfortable shirt"
      },
      {
        _id: "3",
        title: "RAY BAN Glasses",
        image: require('../../assets/image/Glasses_1.jpg'),
        productImage:require('../../assets/image/Glasses_1.jpg'),
        categoryID: "62fe243858f7aa8230817f86",
        price: 299.99,
        quantity: 15,
        description:"Hey this is really great textured and comfortable shirt"
      },
    ]);
  }, []);

  // Update search items whenever products change
  useEffect(() => {
    const payload = products.map((product, index) => ({
      ...product,
      id: `${product._id}-${index}`,
      name: product.title,
    }));
    setSearchItems(payload);
  }, [products]);

  // Convert user to JSON on mount
  useEffect(() => {
    convertToJSON(user);
  }, []);

  // Handle Product Press
  const handleProductPress = (product) => {
    navigation.navigate("productdetail", { product: product });
  };

  // Handle Add to Cart
  const handleAddToCart = (product) => {
    addCartItem(product);
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.topBarContainer}>
        <TouchableOpacity disabled>
          <Ionicons name="menu" size={30} color={colors.muted} />
        </TouchableOpacity>
        <View style={styles.topbarlogoContainer}>
          <Image source={easybuylogo} style={styles.logo} />
        </View>
        <TouchableOpacity
          style={styles.cartIconContainer}
          onPress={() => navigation.navigate("cart")}
        >
          {cartproduct.length > 0 && (
            <View style={styles.cartItemCountContainer}>
              <Text style={styles.cartItemCountText}>{cartproduct.length}</Text>
            </View>
          )}
          <Image source={cartIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.searchContainer}>
          <View style={styles.inputContainer}>
            <SearchableDropdown
              onTextChange={(text) => console.log(text)}
              onItemSelect={(item) => handleProductPress(item)}
              defaultIndex={0}
              containerStyle={{
                borderRadius: 5,
                width: "100%",
                elevation: 5,
                position: "absolute",
                zIndex: 20,
                top: -20,
                maxHeight: 300,
                backgroundColor: colors.light,
              }}
              textInputStyle={{
                borderRadius: 10,
                padding: 6,
                paddingLeft: 10,
                borderWidth: 0,
                backgroundColor: colors.white,
              }}
              itemStyle={{
                padding: 10,
                marginTop: 2,
                backgroundColor: colors.white,
                borderColor: colors.muted,
              }}
              itemTextStyle={{
                color: colors.muted,
              }}
              itemsContainerStyle={{
                maxHeight: "100%",
              }}
              items={searchItems}
              placeholder="Search..."
              resetValue={false}
              underlineColorAndroid="transparent"
            />
          </View>
          
        </View>
        <ScrollView nestedScrollEnabled={true}>
          <View style={styles.promotionSliderContainer}>
            {/* Replace with <SliderBox> if needed */}
          </View>
          <View style={styles.primaryTextContainer}>
            <Text style={styles.primaryText}>Categories</Text>
          </View>
          <View style={styles.categoryContainer}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              style={styles.flatListContainer}
              horizontal
              data={categories}
              keyExtractor={(item, index) => `${item._id}-${index}`}
              renderItem={({ item }) => (
                <View style={{ marginBottom: 10 }}>
                  <CustomIconButton
                    text={item.title}
                    image={item.image}
                    onPress={() =>
                      navigation.navigate("categories", { categoryID: item._id })
                    }
                  />
                </View>
              )}
            />
          </View>
          <View style={styles.primaryTextContainer}>
            <Text style={styles.primaryText}>New Arrivals</Text>
          </View>
          {products.length === 0 ? (
            <View style={styles.productCardContainerEmpty}>
              <Text style={styles.productCardContainerEmptyText}>
                No Product
              </Text>
            </View>
          ) : (
            <View style={styles.productCardContainer}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                data={products}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View
                    key={item._id}
                    style={{
                      marginLeft: 5,
                      marginBottom: 10,
                      marginRight: 5,
                    }}
                  >

                    <ProductCard
                      name={item.title}
                      image={item.image}
                      price={item.price}
                      quantity={item.quantity}
                      onPress={() => handleProductPress(item)}
                      onPressSecondary={() => handleAddToCart(item)}
                    />
                  </View>
                )}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  topbarlogoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    height: 150, // Adjusted for better visibility
    width: 150,
    resizeMode: "contain",
    marginRight: 10,
  },
  toBarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#252422",
  },
  cartIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  cartItemCountContainer: {
    position: "absolute",
    top: -10,
    left: 10,
    backgroundColor: colors.primary,
    borderRadius: 11,
    padding: 4,
  },
  cartItemCountText: {
    color: colors.light,
    fontSize: 12,
    fontWeight: "bold",
  },
  bodyContainer: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginTop: 10,
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  buttonContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  scanButtonText: {
    fontSize: 16,
    color: colors.light,
    fontWeight: "bold",
    marginRight: 5, // Added space between text and icon
  },
  promotionSliderContainer: {
    marginVertical: 20,
    backgroundColor: colors.light,
  },
  primaryTextContainer: {
    paddingHorizontal: 20,
    // Removed fontSize and fontWeight from container
    // These should be in the Text component
    // fontSize: 20,
    // fontWeight: "bold",
    // color: colors.text,
    marginBottom: 10,
  },
  primaryText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  categoryContainer: {
    flexDirection: "row",
    marginRight: 10,
  },
  flatListContainer: {
    paddingHorizontal: 10,
  },
  emptyView: {
    height: 20,
  },
  productCardContainerEmpty: {
    padding: 20,
    alignItems: "center",
  },
  productCardContainerEmptyText: {
    fontSize: 18,
    fontStyle: "italic",
    color: colors.muted,
    fontWeight: "600",
    textAlign: "center",
  },
  productCardContainer: {
    paddingLeft: 10,
  },
});
