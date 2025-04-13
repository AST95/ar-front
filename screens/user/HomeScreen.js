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
  Dimensions,
  Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, { useEffect, useState, useRef } from "react";
import cartIcon from "../../assets/icons/cart_beg.png";
import easybuylogo from "../../assets/logo/logo.png";
import { colors } from "../../constants";
import CustomIconButton from "../../components/CustomIconButton/CustomIconButton";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreaters from "../../states/actionCreaters/actionCreaters";
import SearchableDropdown from "react-native-searchable-dropdown";
import SofaLine from "../../assets/icons/sofa-line.png";
import Chairs from "../../assets/icons/chair.png";
import Stools from "../../assets/icons/stool.png";
import SofaBanner from "../../assets/image/banners/sofa-banner.jpeg";
import Contrast from "../../assets/image/banners/contrast.jpeg";
import ChairBanner from "../../assets/image/banners/chair.jpeg";
import Shirt from "../../assets/image/shirt_1.jpg";
import Watch from "../../assets/image/Watch_1.jpg";
import Glasses from "../../assets/image/Glasses_1.jpg";

const { width } = Dimensions.get("window");

// Static categories
const categories = [
  {
    _id: "62fe244f58f7aa8230817f89",
    title: "Shirts",
    image: SofaLine,
    color: "#FF6B6B",
  },
  {
    _id: "62fe243858f7aa8230817f86",
    title: "Watches",
    image: Chairs,
    color: "#4ECDC4",
  },
  {
    _id: "62fe241958f7aa8230817f83",
    title: "Glasses",
    image: Stools,
    color: "#FFD166",
  },
  {
    _id: "62fe241958f7aa8230817f84",
    title: "Shoes",
    image: Stools,
    color: "#7C4DFF",
  },
];

// Static slides for banner
const slides = [
  { id: '1', image: SofaBanner },
  { id: '2', image: Contrast },
  { id: '3', image: ChairBanner }
];

const HomeScreen = ({ navigation }) => {
  const cartproduct = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const { addCartItem } = bindActionCreators(actionCreaters, dispatch);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef(null);

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
        image: Shirt,
        categoryID: "62fe244f58f7aa8230817f89",
        price: 499.99,
        quantity: 10,
        description:
          "Premium quality shirt with comfortable fit and stylish design",
        rating: 4.5,
      },
      {
        _id: "2",
        title: "ARMANI Watch",
        image: Watch,
        categoryID: "62fe241958f7aa8230817f83",
        price: 149.99,
        quantity: 25,
        description: "Elegant timepiece with precision engineering",
        rating: 4.8,
      },
      {
        _id: "3",
        title: "RAY BAN Glasses",
        image: Glasses,
        categoryID: "62fe243858f7aa8230817f86",
        price: 299.99,
        quantity: 15,
        description: "Stylish sunglasses with UV protection",
        rating: 4.7,
      },
      {
        _id: "4",
        title: "Premium Leather Jacket",
        image: Shirt,
        categoryID: "62fe244f58f7aa8230817f89",
        price: 399.99,
        quantity: 8,
        description: "Genuine leather jacket with perfect fit",
        rating: 4.9,
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

  // Auto-scroll banner
  useEffect(() => {
    const interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % slides.length;
      setCurrentSlide(nextSlide);
      flatListRef.current?.scrollToIndex({
        index: nextSlide,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  // Handle Product Press
  const handleProductPress = (product) => {
    navigation.navigate("productdetail", { product: product });
  };

  // Handle Add to Cart
  const handleAddToCart = (product) => {
    addCartItem(product);
  };

  // Header animation
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  // Render banner item
  const renderBannerItem = ({ item }) => {
    return (
      <View style={styles.bannerItem}>
        <Image source={item.image} style={styles.bannerImage} />
      </View>
    );
  };

  // Render banner indicators
  const renderBannerIndicators = () => {
    return (
      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentSlide === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.headerContainer,
          { transform: [{ translateY: headerTranslateY }] },
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu-outline" size={28} color={colors.primary} />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Image source={easybuylogo} style={styles.logo} />
          </View>

          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate("cart")}
          >
            {cartproduct.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartproduct.length}</Text>
              </View>
            )}
            <Ionicons name="cart-outline" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchableDropdown
            onTextChange={(text) => console.log(text)}
            onItemSelect={(item) => handleProductPress(item)}
            containerStyle={styles.searchDropdownContainer}
            textInputStyle={styles.searchInput}
            itemStyle={styles.searchItem}
            itemTextStyle={styles.searchItemText}
            itemsContainerStyle={styles.searchItemsContainer}
            items={searchItems}
            placeholder="Search products..."
            placeholderTextColor={colors.muted}
            resetValue={false}
            underlineColorAndroid="transparent"
          />
          <Ionicons
            name="search-outline"
            size={22}
            color={colors.muted}
            style={styles.searchIcon}
          />
        </View>
      </Animated.View>

      {/* Main Content */}
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Banner Slider */}
        <View style={styles.sliderContainer}>
          <FlatList
            ref={flatListRef}
            data={slides}
            renderItem={renderBannerItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            onMomentumScrollEnd={(e) => {
              const contentOffset = e.nativeEvent.contentOffset;
              const viewSize = e.nativeEvent.layoutMeasurement;
              const pageNum = Math.floor(contentOffset.x / viewSize.width);
              setCurrentSlide(pageNum);
            }}
          />
          {renderBannerIndicators()}
        </View>

        {/* Categories Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate("categories")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
            data={categories}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.categoryCard, { backgroundColor: item.color }]}
                onPress={() =>
                  navigation.navigate("categories", { categoryID: item._id })
                }
              >
                <Image source={item.image} style={styles.categoryImage} />
                <Text style={styles.categoryText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* New Arrivals Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Arrivals</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {products.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products available</Text>
            </View>
          ) : (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productList}
              data={products}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <ProductCard
                  key={item._id}
                  name={item.title}
                  image={item.image}
                  price={item.price}
                  quantity={item.quantity}
                  rating={item.rating}
                  onPress={() => handleProductPress(item)}
                  onPressSecondary={() => handleAddToCart(item)}
                  style={styles.productCard}
                />
              )}
            />
          )}
        </View>

        {/* Featured Products Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.featuredContainer}>
            {products.slice(0, 2).map((item) => (
              <View key={item._id} style={styles.featuredCard}>
                <Image source={item.image} style={styles.featuredImage} />
                <View style={styles.featuredDetails}>
                  <Text style={styles.featuredTitle}>{item.title}</Text>
                  <Text style={styles.featuredPrice}>
                    ${item.price.toFixed(2)}
                  </Text>
                  <TouchableOpacity
                    style={styles.featuredButton}
                    onPress={() => handleAddToCart(item)}
                  >
                    <Text style={styles.featuredButtonText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Special Offer Banner */}
        <View style={styles.specialOfferContainer}>
          <View style={styles.specialOfferContent}>
            <Text style={styles.specialOfferText}>SUMMER SALE</Text>
            <Text style={styles.specialOfferDiscount}>UP TO 50% OFF</Text>
            <TouchableOpacity style={styles.specialOfferButton}>
              <Text style={styles.specialOfferButtonText}>SHOP NOW</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  headerContainer: {
    backgroundColor: "#fff",
    paddingTop: -19,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: "absolute",
    top: -10,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  menuButton: {
    padding: 5,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    height: 120,
    width: 120,
    resizeMode: "contain",
  },
  cartButton: {
    padding: 5,
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  searchContainer: {
    position: "relative",
  },
  searchDropdownContainer: {
    padding: 0,
    borderRadius: 10,
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    height: 45,
    borderRadius: 10,
    paddingLeft: 40,
    paddingRight: 15,
    backgroundColor: colors.white,
    fontSize: 16,
    color: colors.text,
  },
  searchIcon: {
    position: "absolute",
    left: 10,
    top: 12,
  },
  searchItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  searchItemText: {
    color: colors.text,
    fontSize: 16,
  },
  searchItemsContainer: {
    maxHeight: 200,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 180, // To account for the header height
  },
  sliderContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
    height: 180,
  },
  bannerItem: {
    width: width - 40,
    height: 180,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  indicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.muted,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: colors.primary,
  },
  sectionContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },
  categoryList: {
    paddingRight: 20,
  },
  categoryCard: {
    width: 100,
    height: 120,
    borderRadius: 15,
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginBottom: 10,
  },
  categoryText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  productList: {
    paddingRight: 20,
  },
  productCard: {
    marginRight: 15,
    width: 160,
  },
  emptyContainer: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.muted,
  },
  featuredContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  featuredCard: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featuredImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    resizeMode: "cover",
  },
  featuredDetails: {
    paddingTop: 10,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 5,
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 10,
  },
  featuredButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: "center",
  },
  featuredButtonText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
  specialOfferContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  specialOfferContent: {
    alignItems: "center",
  },
  specialOfferText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  specialOfferDiscount: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  specialOfferButton: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  specialOfferButtonText: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 14,
  },
});