import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  StatusBar,
  Text,
  FlatList,
  RefreshControl,
  Dimensions,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";

import Ionicons from "react-native-vector-icons/Ionicons";
import cartIcon from "../../assets/icons/cart_beg.png";
import emptyBox from "../../assets/image/emptybox.png";
import { colors, network } from "../../constants";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreaters from "../../states/actionCreaters/actionCreaters";
import CustomIconButton from "../../components/CustomIconButton/CustomIconButton";
import ProductCard from "../../components/ProductCard/ProductCard";
import CustomInput from "../../components/CustomInput";
import Garments from "../../assets/icons/garments.png";
import Electronics from "../../assets/icons/electronics.png";
import Cosmetics from "../../assets/icons/cosmetics.png";
import Grocery from "../../assets/icons/grocery.png";
import SofaLine from "../../assets/icons/sofa-line.png";
import Chairs from "../../assets/icons/chair.png";
import Stools from "../../assets/icons/stool.png";

const CategoriesScreen = ({ navigation, route }) => {
  const { categoryID } = route.params;

  const [isLoading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [refeshing, setRefreshing] = useState(false);
  const [label, setLabel] = useState("Loading...");
  const [error, setError] = useState("");
  const [foundItems, setFoundItems] = useState([]);
  const [filterItem, setFilterItem] = useState("");

  // Get the dimensions of active window
  const [windowWidth, setWindowWidth] = useState(Dimensions.get("window").width);
  const windowHeight = Dimensions.get("window").height;

  // Initialize the cartproduct with redux data
  const cartproduct = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const { addCartItem } = bindActionCreators(actionCreaters, dispatch);

  // Static categories
  const category = [
    {
      _id: "62fe244f58f7aa8230817f89",
      title: "SHIRTS",
      image: SofaLine // Replace with actual image
    },
    {
      _id: "62fe243858f7aa8230817f86",
      title: "GLASSES",
      image: Chairs // Replace with actual image
    },
    {
      _id: "62fe241958f7aa8230817f83",
      title: "WATCHES",
      image: Stools // Replace with actual image
    },
  ];

  const [selectedTab, setSelectedTab] = useState(category[0]);

  // Static product data
  useEffect(() => {
    setProducts([
      {
        _id: "1",
        title: "Classic Dark Shirt",
        image: require('../../assets/image/shirt_1.jpg'),
        categoryID: "62fe244f58f7aa8230817f89", // Shirts category
        price: 499.99,
        quantity: 10,
        description: "Hey this is a really great textured and comfortable shirt",
      },
      {
        _id: "2",
        title: "ARMANI Watch",
        image: require('../../assets/image/Watch_1.jpg'),
        categoryID: "62fe241958f7aa8230817f83", // Watches category 
        price: 149.99,
        quantity: 25,
        description: "Hey this is a really great textured and comfortable watch",
      },
      {
        _id: "3",
        title: "RAY BAN Glasses",
        image: require('../../assets/image/Glasses_1.jpg'),
        categoryID: "62fe243858f7aa8230817f86", // Glasses category
        price: 299.99,
        quantity: 15,
        description: "Hey these are really great textured and comfortable glasses",
      },
    ]);
  }, []);

  // Filter products based on search term and selected category
  const filter = () => {
    const keyword = filterItem.toLowerCase();
    const results = products.filter((product) => {
      return (
        product.title.toLowerCase().includes(keyword) &&
        product.categoryID === selectedTab._id
      );
    });
    setFoundItems(results);
  };

  // Fetch the product on initial render
  useEffect(() => {
    setFoundItems(products.filter((product) => product.categoryID === selectedTab._id));
  }, [selectedTab, products]);

  // Listener call on tab focus and initialize categoryID
  navigation.addListener("focus", () => {
    if (categoryID) {
      setSelectedTab(categoryID);
    }
  });

  // Handle product press navigation
  const handleProductPress = (product) => {
    navigation.navigate("productdetail", { product });
  };

  // Add product to cart (redux)
  const handleAddToCat = (product) => {
    addCartItem(product);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <View style={styles.topBarContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("home");
            }}
          >
            <Ionicons
              name="arrow-back-circle-outline"
              size={30}
              color={colors.muted}
            />
          </TouchableOpacity>
          <View />
          <TouchableOpacity
            style={styles.cartIconContainer}
            onPress={() => navigation.navigate("cart")}
          >
            {cartproduct?.length > 0 ? (
              <View style={styles.cartItemCountContainer}>
                <Text style={styles.cartItemCountText}>
                  {cartproduct.length}
                </Text>
              </View>
            ) : (
              <></>
            )}
            <Image source={cartIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.bodyContainer}>
          <CustomInput
            radius={5}
            placeholder={"Search..."}
            value={filterItem}
            setValue={setFilterItem}
          />
          <FlatList
            data={category}
            keyExtractor={(item) => item._id}
            horizontal
            style={{ flexGrow: 0 }}
            contentContainerStyle={{ padding: 10 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: tab }) => (
              <CustomIconButton
                key={tab._id}
                text={tab.title}
                image={tab.image}
                active={selectedTab?._id === tab._id}
                onPress={() => {
                  setSelectedTab(tab);
                }}
              />
            )}
          />
          {foundItems.length === 0 ? (
            <View style={styles.noItemContainer}>
              <Image
                source={emptyBox}
                style={{ height: 80, width: 80, resizeMode: "contain" }}
              />
              <Text style={styles.emptyBoxText}>
                There are no products in this category
              </Text>
            </View>
          ) : (
            <FlatList
              data={foundItems}
              // refreshControl={
              //   <RefreshControl refreshing={refeshing} onRefresh={handleOnRefresh} />
              // }
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ margin: 10 }}
              numColumns={2}
              renderItem={({ item: product }) => (
                <View
                  style={[
                    styles.productCartContainer,
                    { width: (windowWidth - windowWidth * 0.1) / 2 },
                  ]}
                >
                  <ProductCard
                    cardSize={"large"}
                    name={product.title}
                    image={product.image}
                    price={product.price}
                    quantity={product.quantity}
                    onPress={() => handleProductPress(product)}
                    onPressSecondary={() => handleAddToCat(product)}
                  />
                </View>
              )}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};


export default CategoriesScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
  },
  topBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  toBarText: {
    fontSize: 15,
    fontWeight: "600",
  },
  bodyContainer: {
    flex: 1,
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,

    justifyContent: "flex-start",
    flex: 1,
  },
  cartIconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cartItemCountContainer: {
    position: "absolute",
    zIndex: 10,
    top: -10,
    left: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 22,
    width: 22,
    backgroundColor: colors.danger,
    borderRadius: 11,
  },
  cartItemCountText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 10,
  },
  productCartContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 5,
    padding: 5,
    paddingBottom: 0,
    paddingTop: 0,
    marginBottom: 0,
  },
  noItemContainer: {
    width: "100%",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  emptyBoxText: {
    fontSize: 11,
    color: colors.muted,
    textAlign: "center",
  },
  emptyView: {
    height: 20,
  },
});
