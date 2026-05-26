import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, Text } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { ScreenContainer, fullScreenEdges } from "../components/ScreenContainer";

import AuthNavigator from "./AuthNavigator";
import RoleNavigator from "./RoleNavigator";

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <ScreenContainer
        edges={fullScreenEdges}
        style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#eff6ff" }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ color: "#1e3a8a", marginTop: 10 }}>Checking auth...</Text>
      </ScreenContainer>
    );
  }

  return (
    <NavigationContainer>
      {user ? <RoleNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
