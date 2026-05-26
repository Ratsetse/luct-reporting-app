import React from "react";
import { StyleSheet, Text } from "react-native";
import { ScreenContainer } from "../../components/ScreenContainer";

export default function FeedbackScreen() {
  return (
    <ScreenContainer style={styles.container}>
      <Text>PRL Monitoring</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#eff6ff",
  },
});
