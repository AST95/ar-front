import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  StatusBar,
  Text,
  FlatList,
  Dimensions,
  SafeAreaView,
  ScrollView,
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
  const [label, setLabel] = useState("Loading...");
  const [error, setError] = useState("");
  const [foundItems, setFoundItems] = useState([]);
  const [filterItem, setFilterItem] = useState("");

  const [windowWidth, setWindowWidth] = useState(Dimensions.get("window").width);
  const windowHeight = Dimensions.get("window").height;

  const cartproduct = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const { addCartItem } = bindActionCreators(actionCreaters, dispatch);

  const category = [
    {
      _id: "62fe244f58f7aa8230817f89",
      title: "SHIRTS",
      image: SofaLine,
      color: "#FF6B6B",
      gradient: ["#FF6B6B", "#FF8E8E"]
    },
    {
      _id: "62fe243858f7aa8230817f86",
      title: "GLASSES",
      image: Chairs,
      color: "#4ECDC4",
      gradient: ["#4ECDC4", "#88E0D0"]
    },
    {
      _id: "62fe241958f7aa8230817f83",
      title: "WATCHES",
      image: Stools,
      color: "#FFD166",
      gradient: ["#FFD166", "#FFE3A3"]
    },
  ];

  const [selectedTab, setSelectedTab] = useState(category[0]);

  useEffect(() => {
    setProducts([
      {
        _id: "1",
        title: "Classic Dark Shirt",
        image: require('../../assets/image/shirt_1.jpg'),
        categoryID: "62fe244f58f7aa8230817f89",
        price: 499.99,
        quantity: 10,
        description: "Premium quality shirt with comfortable fit",
      },
      {
        _id: "2",
        title: "ARMANI Watch",
        image: require('../../assets/image/Watch_1.jpg'),
        categoryID: "62fe241958f7aa8230817f83",
        price: 149.99,
        quantity: 25,
        description: "Elegant timepiece with leather strap",
      },
      {
        _id: "3",
        title: "RAY BAN Glasses",
        image: require('../../assets/image/Glasses_1.jpg'),
        categoryID: "62fe243858f7aa8230817f86",
        price: 299.99,
        quantity: 15,
        description: "Stylish sunglasses with UV protection",
      },
    ]);
  }, []);

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

  useEffect(() => {
    setFoundItems(products.filter((product) => product.categoryID === selectedTab._id));
  }, [selectedTab, products]);

  navigation.addListener("focus", () => {
    if (categoryID) {
      setSelectedTab(categoryID);
    }
  });

  const handleProductPress = (product) => {
    navigation.navigate("productdetail", { product });
  };

  const handleAddToCat = (product) => {
    addCartItem(product);
  };

  // Custom gradient background component
  const GradientView = ({ colors, style, children }) => {
    return (
      <View style={[style, { overflow: 'hidden' }]}>
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors[0],
          opacity: 0.8
        }} />
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors[1],
          transform: [{ skewY: '-15deg' }],
          opacity: 0.8
        }} />
        {children}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header with custom gradient */}
      <View style={styles.headerContainer}>
        <GradientView 
          colors={[colors.primary, colors.secondary]} 
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.light}
              />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>{selectedTab.title}</Text>
            
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
              ) : null}
              <Ionicons name="cart" size={24} color={colors.light} />
            </TouchableOpacity>
          </View>
        </GradientView>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <CustomInput
          radius={30}
          placeholder={"Search products..."}
          value={filterItem}
          setValue={setFilterItem}
          icon="search"
          bgColor={colors.white}
          borderColor={colors.lightGray}
          elevation={5}
          iconColor={colors.primary}
          placeholderTextColor={colors.muted}
        />
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryTabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryTabsScroll}
        >
          {category.map((tab) => (
            <TouchableOpacity
              key={tab._id}
              onPress={() => setSelectedTab(tab)}
              activeOpacity={0.8}
            >
              <View style={[
                styles.categoryTab,
                selectedTab._id === tab._id && styles.selectedCategoryTab,
                { backgroundColor: tab.color }
              ]}>
                <Image 
                  source={tab.image} 
                  style={[
                    styles.categoryTabImage,
                    selectedTab._id === tab._id && { tintColor: colors.white }
                  ]} 
                  resizeMode="contain"
                />
                <Text style={[
                  styles.categoryTabText,
                  selectedTab._id === tab._id && styles.selectedCategoryTabText
                ]}>
                  {tab.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products Grid */}
      {foundItems.length === 0 ? (
        <View style={styles.noItemContainer}>
          <Image
            source={emptyBox}
            style={styles.emptyBoxImage}
          />
          <Text style={styles.emptyBoxText}>
            No products found in this category
          </Text>
          <Text style={styles.emptyBoxSubText}>
            Try another category or search for something else
          </Text>
        </View>
      ) : (
        <FlatList
          data={foundItems}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.productsGrid}
          numColumns={2}
          columnWrapperStyle={styles.productsColumnWrapper}
          renderItem={({ item: product }) => (
            <View style={styles.productCardWrapper}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  headerContainer: {
    height: 70,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  headerGradient: {
    flex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    flex: 1,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.light,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cartIconContainer: {
    position: 'relative',
    padding: 5,
  },
  cartItemCountContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.danger,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cartItemCountText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 10,
  },
  categoryTabsContainer: {
    paddingVertical: 15,
    marginBottom: 5,
  },
  categoryTabsScroll: {
    paddingHorizontal: 15,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  selectedCategoryTab: {
    transform: [{ scale: 1.05 }],
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  categoryTabImage: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: colors.light,
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectedCategoryTabText: {
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  productsGrid: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    paddingTop: 5,
  },
  productsColumnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  productCardWrapper: {
    width: '48%',
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyBoxImage: {
    height: 150,
    width: 150,
    marginBottom: 25,
    opacity: 0.6,
    tintColor: colors.primary,
  },
  emptyBoxText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyBoxSubText: {
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
  },
});

export default CategoriesScreen;