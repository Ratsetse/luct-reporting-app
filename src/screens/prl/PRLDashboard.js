import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";

export default function PRLDashboard({ navigation }) {

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}> PRL Dashboard</Text>

      <TouchableOpacity style={styles.card}
        onPress={() => navigation.navigate("PRLLecturersScreen")}>
        <Text> Lecturers</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}
        onPress={() => navigation.navigate("PRLViewReports")}>
        <Text> Reports</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}
        onPress={() => navigation.navigate("PRLMonitoringScreen")}>
        <Text> Monitoring</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}
        onPress={() => navigation.navigate("PRLClassesScreen")}>
        <Text> Classes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logout}
        onPress={() => signOut(auth)}
      >
        <Text style={{ color: "white" }}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#eff6ff",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1e40af",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#2563eb",
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
});