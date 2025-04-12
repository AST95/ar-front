import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../../constants";
import CustomCard from "../../components/CustomCard/CustomCard";
import OptionList from "../../components/OptionList/OptionList";
import InternetConnectionAlert from "react-native-internet-connection-alert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProgressDialog from "react-native-progress-dialog";
import axios from "axios";

const { width } = Dimensions.get("window");

const DashboardScreen = ({ navigation, route }) => {
  const { authUser } = route.params;
  const [user, setUser] = useState(authUser);
  const [label, setLabel] = useState("Loading...");
  const [error, setError] = useState("");
  const [isloading, setIsloading] = useState(false);
  const [stats, setStats] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Logout function with confirmation
  const logout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          await AsyncStorage.removeItem("authUser");
          navigation.replace("login");
        },
      },
    ]);
  };

  // Fetch dashboard statistics
  const fetchStats = async () => {
    setIsloading(true);
    setLabel("Loading dashboard data...");

    try {
      const response = await axios.get(`${network.serverip}/dashboard`, {
        headers: {
          "x-auth-token": authUser.token,
        },
      });

      const result = response.data;

      if (result.success) {
        setStats([
          {
            id: 1,
            title: "Users",
            value: result.data?.usersCount,
            iconName: "people",
            type: "primary",
            screenName: "viewusers",
            color: colors.primary,
          },
          {
            id: 2,
            title: "Orders",
            value: result.data?.ordersCount,
            iconName: "cart",
            type: "secondary",
            screenName: "vieworder",
            color: colors.secondary,
          },
          {
            id: 3,
            title: "Products",
            value: result.data?.productsCount,
            iconName: "cube",
            type: "warning",
            screenName: "viewproduct",
            color: colors.warning,
          },
          {
            id: 4,
            title: "Categories",
            value: result.data?.categoriesCount,
            iconName: "list",
            type: "muted",
            screenName: "viewcategories",
            color: colors.muted,
          },
        ]);
        setError("");
      } else if (result.err === "jwt expired") {
        logout();
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
      if (error.response?.data?.err === "jwt expired") {
        logout();
      }
      setError(
        error.response?.data?.message || "Failed to load dashboard data"
      );
    } finally {
      setIsloading(false);
    }
  };

  // Handle pull-to-refresh
  const handleOnRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <InternetConnectionAlert
      onChange={(connectionState) => {}}
      title="No Internet Connection"
      message="Please check your internet connection and try again"
    >
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <ProgressDialog visible={isloading} label={label} />

        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={logout} style={styles.iconButton}>
              <Ionicons name="log-out" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Dashboard</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => navigation.navigate("profile", { authUser: user })}
              style={styles.iconButton}
            >
              <Ionicons name="person-circle" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleOnRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.adminText}>{user.name || "Admin"}</Text>
            <Text style={styles.subtitle}>Here's what's happening today</Text>
          </View>

          {/* Stats Cards */}
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={30} color={colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchStats}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.statsContainer}>
              {stats.map((stat) => (
                <CustomCard
                  key={stat.id}
                  iconName={stat.iconName}
                  title={stat.title}
                  value={stat.value}
                  color={stat.color}
                  onPress={() =>
                    navigation.navigate(stat.screenName, { authUser: user })
                  }
                />
              ))}
            </View>
          )}

          {/* Quick Actions Section */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>

          <View style={styles.actionsContainer}>
            <OptionList
              text={"Products"}
              Icon={Ionicons}
              iconName={"cube"}
              iconColor={colors.warning}
              onPress={() =>
                navigation.navigate("viewproduct", { authUser: user })
              }
              onPressSecondary={() =>
                navigation.navigate("addproduct", { authUser: user })
              }
              type="modern"
              chevron
            />

            <OptionList
              text={"Categories"}
              Icon={Ionicons}
              iconName={"list"}
              iconColor={colors.muted}
              onPress={() =>
                navigation.navigate("viewcategories", { authUser: user })
              }
              onPressSecondary={() =>
                navigation.navigate("addcategories", { authUser: user })
              }
              type="modern"
              chevron
            />

            <OptionList
              text={"Orders"}
              Icon={Ionicons}
              iconName={"cart"}
              iconColor={colors.secondary}
              onPress={() =>
                navigation.navigate("vieworder", { authUser: user })
              }
              type="modern"
              chevron
            />

            <OptionList
              text={"Users"}
              Icon={Ionicons}
              iconName={"people"}
              iconColor={colors.primary}
              onPress={() =>
                navigation.navigate("viewusers", { authUser: user })
              }
              type="modern"
              chevron
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </InternetConnectionAlert>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 15,
    elevation: 4,
  },
  headerLeft: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerCenter: {
    flex: 2,
    alignItems: "center",
  },
  headerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.white,
  },
  iconButton: {
    padding: 5,
  },
  welcomeContainer: {
    padding: 20,
    paddingTop: 25,
  },
  welcomeText: {
    fontSize: 22,
    color: colors.muted,
    marginBottom: 5,
  },
  adminText: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.dark,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
    marginLeft: 10,
  },
  actionsContainer: {
    paddingHorizontal: 15,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    margin: 20,
    backgroundColor: colors.white,
    borderRadius: 10,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorText: {
    color: colors.danger,
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: "500",
  },
});

export default DashboardScreen;
