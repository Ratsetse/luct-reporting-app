import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { AuthContext } from "../../context/AuthContext";
import { ScrollScreenContainer } from "../../components/ScreenContainer";

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
    <ScrollScreenContainer contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PL Dashboard</Text>
        <Text style={styles.subtitle}>Programme leader control panel</Text>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity
          style={[styles.card, styles.cardBlue]}
          onPress={() => navigation.navigate("PLCourses")}
        >
          <Text style={styles.cardText}>Courses</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardGreen]}
          onPress={() => navigation.navigate("PLManageCourses")}
        >
          <Text style={styles.cardText}>Manage Courses</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardAmber]}
          onPress={() => navigation.navigate("PLAssignLecturer")}
        >
          <Text style={styles.cardText}>Assign Lecturer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardPurple]}
          onPress={() => navigation.navigate("PLMonitoring")}
        >
          <Text style={styles.cardText}>Monitoring</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardRed]}
          onPress={() => navigation.navigate("PLViewReports")}
        >
          <Text style={styles.cardText}>View Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardSlate]}
          onPress={() => navigation.navigate("PLRatingsScreen")}
        >
          <Text style={styles.cardText}>Ratings</Text>
        </TouchableOpacity>
      </View>

      {/*  LOGOUT */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#eef6f3",
    flexGrow: 1,
  },

  header: {
    backgroundColor: "#123c69",
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
  },

  subtitle: {
    fontSize: 14,
    color: "#dbeafe",
    marginTop: 6,
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
    shadowColor: "#000",
    shadowOpacity: 0.05,
    elevation: 3,
  },

  cardBlue: { borderLeftColor: "#2563eb" },
  cardGreen: { borderLeftColor: "#0f766e" },
  cardAmber: { borderLeftColor: "#f59e0b" },
  cardPurple: { borderLeftColor: "#7c3aed" },
  cardRed: { borderLeftColor: "#ef4444" },
  cardSlate: { borderLeftColor: "#475569" },

  cardText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
  },

  logoutBtn: {
    backgroundColor: "#ef4444",
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
