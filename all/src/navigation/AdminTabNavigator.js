import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "../components/AdminText";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import AdminVerificationScreen from "../screens/admin/AdminVerificationScreen";
import AdminUsersScreen from "../screens/admin/AdminUsersScreen";
import AdminServicesScreen from "../screens/admin/AdminServicesScreen";
import AdminVendorNotificationsScreen from "../screens/admin/AdminVendorNotificationsScreen";
import AdminProfileScreen from "../screens/admin/AdminProfileScreen";

// These two screens remain available for navigation,
// but they will NOT show in bottom tab bar.
import AdminApprovalsScreen from "../screens/admin/AdminApprovalsScreen";
import AdminNotificationsScreen from "../screens/admin/AdminNotificationsScreen";

import { COLORS } from "../constants/colors";
import { useMatrimony } from "../context/MatrimonyContext";

const Tab = createBottomTabNavigator();

function TabIcon({ focused, icon, label }) {
  return (
    <View style={styles.tabItem}>
      <Ionicons
        name={focused ? icon : `${icon}-outline`}
        size={22}
        color={focused ? COLORS.primary : COLORS.muted}
      />

      <Text
        adminTranslate={false}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.65}
        style={[styles.tabText, focused && { color: COLORS.primary }]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function AdminTabNavigator() {
  const { language } = useMatrimony();
  const labels = language === "te"
    ? { home: "హోమ్", verify: "ధృవీకరణ", users: "వినియోగదారులు", services: "సేవలు" }
    : { home: "Home", verify: "Verify", users: "Users", services: "Services" };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="grid" label={labels.home} />
          ),
        }}
      />

      <Tab.Screen
        name="AdminVerification"
        component={AdminVerificationScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="shield-checkmark" label={labels.verify} />
          ),
        }}
      />

      <Tab.Screen
        name="AdminUsers"
        component={AdminUsersScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="people" label={labels.users} />
          ),
        }}
      />

      <Tab.Screen
        name="AdminServices"
        component={AdminServicesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="business" label={labels.services} />
          ),
        }}
      />

      {/* Hidden screen: Approve tab removed from bottom navigation */}
      <Tab.Screen
        name="AdminApprovals"
        component={AdminApprovalsScreen}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
        }}
      />

      {/* Hidden screen: Alerts tab removed from bottom navigation */}
      <Tab.Screen
        name="AdminNotifications"
        component={AdminNotificationsScreen}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
        }}
      />

      <Tab.Screen
        name="AdminVendorNotifications"
        component={AdminVendorNotificationsScreen}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="AdminProfile"
        component={AdminProfileScreen}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 74,
    borderTopWidth: 0,
    elevation: 12,
    backgroundColor: COLORS.white,
  },

  tabBarItem: {
    flex: 1,
    minWidth: 0,
  },

  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
    width: "100%",
    paddingHorizontal: 4,
  },

  tabText: {
    width: "100%",
    minHeight: 18,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 3,
    color: COLORS.muted,
    fontWeight: "800",
    textAlign: "center",
  },
});