import React from "react";
import { View, Button, Alert } from "react-native";
import { auth } from "../../services/firebaseConfig"; // adjust path if needed
import { signOut } from "firebase/auth";

export default function LecturerDashboard({ navigation }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login"); // send user back to Login screen
    } catch (error) {
      Alert.alert("Logout Error", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button
        title="Create Report"
        onPress={() => navigation.navigate("CreateReportScreen")}
      />
      <View style={{ marginTop: 20 }}>
        <Button title="Log Out" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
}