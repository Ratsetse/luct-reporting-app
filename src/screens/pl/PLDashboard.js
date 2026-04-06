import React from "react";
import { View, Button } from "react-native";

export default function PLDashboard({ navigation }) {
  return (
    <View style={{ padding: 20 }}>
      <Button
        title="View Reports"
        onPress={() => navigation.navigate("ViewReports")}
      />
    </View>
  );
}