import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import UserProfileCard from "../../components/UserProfileCard/UserProfileCard";
import Ionicons from "react-native-vector-icons/Ionicons";
import OptionList from "../../components/OptionList/OptionList";
import { colors } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserProfileScreen = ({ navigation, route }) => {
  const [userInfo, setUserInfo] = useState({});
  const { user } = route.params;

  const convertToJSON = (obj) => {
    try {
      setUserInfo(JSON.parse(obj));
    } catch (e) {
      setUserInfo(obj);
    }
  };

  useEffect(() => {
    convertToJSON(user);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu-sharp" size={28} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>My Profile</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* User Profile Card */}
        <View style={styles.userProfileContainer}>
          <UserProfileCard
            Icon={Ionicons}
            name={userInfo?.name}
            email={userInfo?.email}
          />
        </View>

        {/* Options */}
        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <OptionList
              text="My Account"
              Icon={Ionicons}
              iconName="person-outline"
              onPress={() => navigation.navigate("myaccount", { user: userInfo })}
            />
            <OptionList
              text="Wishlist"
              Icon={Ionicons}
              iconName="heart-outline"
              onPress={() => navigation.navigate("mywishlist", { user: userInfo })}
            />
          </View>
        </View>

        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.card}>
            <OptionList
              text="Logout"
              Icon={Ionicons}
              iconName="log-out-outline"
              isLastItem={true}
              onPress={async () => {
                await AsyncStorage.removeItem("authUser");
                navigation.replace("login");
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: colors.white,
    borderBottomWidth: 0.6,
    borderBottomColor: colors.lightGrey,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuButton: {
    padding: 6,
    borderRadius: 8,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
  },
  headerRightPlaceholder: {
    width: 28,
  },
  userProfileContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 15,
  },
  optionsSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fdfdfd",
    borderRadius: 16,
    elevation: 3,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },
});
