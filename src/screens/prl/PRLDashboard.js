import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ScrollScreenContainer } from "../../components/ScreenContainer";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";

export default function PRLDashboard({ navigation }) {

  return (
    <ScrollScreenContainer contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PRL Dashboard</Text>
        <Text style={styles.subtitle}>Review lecturers, reports, classes, and monitoring.</Text>
      </View>

      <TouchableOpacity style={[styles.card, styles.cardBlue]}
        onPress={() => navigation.navigate("PRLLecturersScreen")}>
        <Text style={styles.cardText}>Lecturers</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, styles.cardGreen]}
        onPress={() => navigation.navigate("PRLViewReports")}>
        <Text style={styles.cardText}>Reports</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, styles.cardAmber]}
        onPress={() => navigation.navigate("PRLMonitoringScreen")}>
        <Text style={styles.cardText}>Monitoring</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, styles.cardPurple]}
        onPress={() => navigation.navigate("PRLClassesScreen")}>
        <Text style={styles.cardText}>Classes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logout}
        onPress={() => signOut(auth)}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#eef6f3",
  },

  header: {
    backgroundColor: "#123c69",
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#ffffff",
  },

  subtitle: {
    color: "#dbeafe",
    lineHeight: 20,
    marginTop: 6,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  cardText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
  },

  cardBlue: { borderLeftColor: "#2563eb" },
  cardGreen: { borderLeftColor: "#0f766e" },
  cardAmber: { borderLeftColor: "#f59e0b" },
  cardPurple: { borderLeftColor: "#7c3aed" },

  logout: {
    marginTop: 25,
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#ef4444",
    shadowOpacity: 0.3,
    elevation: 3,
  },

  logoutText: {
    color: "white",
    fontWeight: "800",
  },
});
