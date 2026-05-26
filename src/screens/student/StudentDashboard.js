import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { auth } from "../../services/firebaseConfig";
import { signOut } from "firebase/auth";
import { ScreenContainer } from "../../components/ScreenContainer";

export default function StudentDashboard({ navigation }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Logout Error", error.message);
    }
  };

  return (
    <ScreenContainer style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Student Portal</Text>
        <Text style={styles.subtitle}>
          Welcome back. Stay on top of attendance, feedback, and progress.
        </Text>
      </View>

      {/* CARDS */}
      <View style={styles.cardContainer}>

        <TouchableOpacity
          style={[styles.card, styles.blueCard]}
          onPress={() => navigation.navigate("StudentAttendance")}
        >
          <Text style={styles.cardTitle}>Attendance</Text>
          <Text style={styles.cardText}>
            Mark your class attendance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.lightBlueCard]}
          onPress={() => navigation.navigate("StudentRating")}
        >
          <Text style={styles.cardTitle}>Lecturer Rating</Text>
          <Text style={styles.cardText}>
            Share feedback on lecturers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.darkBlueCard]}
          onPress={() => navigation.navigate("StudentMonitoring")}
        >
          <Text style={styles.cardTitle}>Monitoring</Text>
          <Text style={styles.cardText}>
            Track your performance & attendance
          </Text>
        </TouchableOpacity>

      </View>

      {/* LOGOUT */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef6f3",
    padding: 20,
  },

  header: {
    backgroundColor: "#123c69",
    padding: 22,
    borderRadius: 22,
    marginBottom: 25,
    shadowColor: "#0f172a",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },

  subtitle: {
    marginTop: 8,
    color: "#dbeafe",
    lineHeight: 20,
  },

  cardContainer: {
    flex: 1,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    borderLeftWidth: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  blueCard: {
    borderLeftColor: "#2563eb",
  },

  lightBlueCard: {
    borderLeftColor: "#0f766e",
  },

  darkBlueCard: {
    borderLeftColor: "#f59e0b",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },

  cardText: {
    marginTop: 6,
    color: "#64748b",
  },

  logoutBtn: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },

  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});
