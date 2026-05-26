import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const screenEdges = ["left", "right", "bottom"];
export const fullScreenEdges = ["top", "left", "right", "bottom"];

export function ScreenContainer({ children, style, edges = screenEdges }) {
  return (
    <SafeAreaView edges={edges} style={[styles.screen, style]}>
      {children}
    </SafeAreaView>
  );
}

export function ScrollScreenContainer({
  children,
  style,
  contentContainerStyle,
  edges = screenEdges,
}) {
  return (
    <SafeAreaView edges={edges} style={styles.screen}>
      <ScrollView
        style={[styles.screen, style]}
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#eff6ff",
  },
});
