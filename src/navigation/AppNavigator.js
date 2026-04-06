import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View, Text } from "react-native";
import { AuthContext } from "../context/AuthContext";

import AuthNavigator from "./AuthNavigator";
import RoleNavigator from "./RoleNavigator";

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Checking auth...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <RoleNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}