import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { auth } from "../../services/firebaseConfig";
import { signOut } from "firebase/auth";

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
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}> Student Portal</Text>
        <Text style={styles.subtitle}>
          Welcome back, Stay on top of your studies
        </Text>
      </View>

      {/* CARDS */}
      <View style={styles.cardContainer}>

        <TouchableOpacity
          style={[styles.card, styles.blueCard]}
          onPress={() => navigation.navigate("StudentAttendance")}
        >
          <Text style={styles.cardTitle}> Attendance</Text>
          <Text style={styles.cardText}>
            Mark your class attendance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.lightBlueCard]}
          onPress={() => navigation.navigate("StudentRating")}
        >
          <Text style={styles.cardTitle}> Lecturer Rating</Text>
          <Text style={styles.cardText}>
            Share feedback on lecturers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.darkBlueCard]}
          onPress={() => navigation.navigate("StudentMonitoring")}
        >
          <Text style={styles.cardTitle}> Monitoring</Text>
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
        <Text style={styles.logoutText}> Log Out</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f6ff",
    padding: 20,
  },

  header: {
    marginBottom: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1d4ed8",
  },

  subtitle: {
    marginTop: 5,
    color: "#64748b",
  },

  cardContainer: {
    flex: 1,
  },

  card: {
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  blueCard: {
    backgroundColor: "#2563eb",
  },

  lightBlueCard: {
    backgroundColor: "#3b82f6",
  },

  darkBlueCard: {
    backgroundColor: "#1e40af",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },

  cardText: {
    marginTop: 6,
    color: "#e0e7ff",
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