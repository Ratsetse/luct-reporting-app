import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { AuthContext } from "../../context/AuthContext";

export default function PLDashboard({ navigation }) {
  const { user } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}> PL Dashboard</Text>
      <Text style={styles.subtitle}>Programme Leader Control Panel</Text>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("PLCourses")}
        >
          <Text style={styles.cardText}> Courses</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("PLManageCourses")}
        >
          <Text style={styles.cardText}> Manage Courses</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("PLAssignLecturer")}
        >
          <Text style={styles.cardText}> Assign Lecturer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("PLMonitoring")}
        >
          <Text style={styles.cardText}> Monitoring</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("PLViewReports")}
        >
          <Text style={styles.cardText}> View Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("PLRatingsScreen")}
        >
          <Text style={styles.cardText}> Ratings</Text>
        </TouchableOpacity>
      </View>

      {/*  LOGOUT */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#eff6ff",
    flexGrow: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: "#1e40af",
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#64748b",
    marginBottom: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#ffffff",
    padding: 20,
    marginBottom: 12,
    borderRadius: 16,
    alignItems: "center",
    borderLeftWidth: 5,
    borderLeftColor: "#2563eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    elevation: 3,
  },

  cardText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
  },

  logoutBtn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
  },

  logoutText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
  },
});