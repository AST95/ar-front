import { StyleSheet, Image, TouchableOpacity, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import HomeScreen from "../../screens/user/HomeScreen";
import { colors } from "../../constants";
import UserProfileScreen from "../../screens/profile/UserProfileScreen";
import MyOrderScreen from "../../screens/user/MyOrderScreen";
import CategoriesScreen from "../../screens/user/CategoriesScreen";

const Tab = createBottomTabNavigator();

const Tabs = ({ navigation, route }) => {
  const { user } = route.params;
  
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarHideOnKeyboard: true,
      headerShown: false,
      tabBarShowLabel: false, // ⬅️ Hide the tab labels
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.muted,
      tabBarStyle: {
        height: 50,
        paddingTop: 4,
        borderTopWidth: 1,
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
        borderRadius: 14,
      },
      tabBarIcon: ({ focused, color, size }) => {
        let iconSize = 24;
  
        if (route.name === 'home') {
          return (
            <View style={focused ? styles.activeIconContainer : null}>
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={iconSize}
                color={color}
              />
            </View>
          );
        } else if (route.name === 'categories') {
          return (
            <View style={focused ? styles.activeIconContainer : null}>
              <MaterialIcons
                name="category"
                size={iconSize}
                color={color}
              />
            </View>
          );
        } else if (route.name === 'myorder') {
          return (
            <View style={focused ? styles.activeIconContainer : null}>
              <Ionicons
                name={focused ? 'cart' : 'cart-outline'}
                size={iconSize}
                color={color}
              />
            </View>
          );
        } else if (route.name === 'user') {
          return (
            <View style={focused ? styles.activeIconContainer : null}>
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={iconSize}
                color={color}
              />
            </View>
          );
        }
      },
    })}
  >
  
      <Tab.Screen 
        name="home" 
        component={HomeScreen}
        initialParams={{ user: user }}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="categories" 
        component={CategoriesScreen}
        initialParams={{ user: user }}
        options={{ title: 'Categories' }}
      />
      <Tab.Screen 
        name="myorder" 
        component={MyOrderScreen}
        initialParams={{ user: user }}
        options={{ title: 'Orders' }}
      />
      <Tab.Screen 
        name="user" 
        component={UserProfileScreen}
        initialParams={{ user: user }}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  activeIconContainer: {
    backgroundColor: colors.primary + '20', // 20% opacity
    padding: 8,
    borderRadius: 20,
  },
  tabBar: {
    position: 'absolute',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});