import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import Text from "../components/AutoText";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import MatchesScreen from "../screens/MatchesScreen";
import WishlistScreen from "../screens/WishlistScreen";
import ServicesScreen from "../screens/ServicesScreen";
import MyProfileScreen from "../screens/MyProfileScreen";
import { COLORS } from "../constants/colors";
import { getStrings } from "../constants/i18n";
import { useMatrimony } from "../context/MatrimonyContext";

const Tab = createBottomTabNavigator();

function TabIcon({ focused, icon, label }) {
  const { width } = useWindowDimensions();
  const { appTheme } = useMatrimony();
  const tabLabelStyle = [
    styles.tabText,
    {
      color: focused ? COLORS.primary : appTheme?.muted || COLORS.muted,
      fontSize: 6,
      maxWidth: Math.max(140, Math.floor(width / 2.5)),
    },
  ];

  return (
    <View style={styles.tabItem}>
      <Ionicons
        name={focused ? icon : `${icon}-outline`}
        size={22}
        color={focused ? COLORS.primary : appTheme?.muted || COLORS.muted}
      />
      <Text numberOfLines={1} style={tabLabelStyle}>
        {label}
      </Text>
    </View>
  );
}

function longTabItemStyle(flex = 1.25) {
  return { flex };
}

export default function MainTabNavigator() {
  const { appTheme, language } = useMatrimony();
  const t = getStrings(language).tabs;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [
          styles.tabBar,
          { backgroundColor: appTheme?.tabBar || COLORS.white },
        ],
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="home" label={t.home} />
          ),
        }}
      />

      <Tab.Screen
        name="Matches"
        component={MatchesScreen}
        options={{
          tabBarItemStyle: longTabItemStyle(1.35),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="heart" label={t.matches} />
          ),
        }}
      />

      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="bookmark" label={t.saved} />
          ),
        }}
      />

      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          tabBarItemStyle: longTabItemStyle(1.4),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="business" label={t.services} />
          ),
        }}
      />

      <Tab.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{
          tabBarItemStyle: longTabItemStyle(1.25),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="person" label={t.profile} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 96,
    borderTopWidth: 0,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    backgroundColor: COLORS.white,
  },
  tabBarItem: {
    flex: 1,
  },
  tabItem: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    paddingHorizontal: 3,
  },
  tabText: {
    marginTop: 3,
    color: COLORS.muted,
    fontWeight: "400",
    textAlign: "center",
  },
});
