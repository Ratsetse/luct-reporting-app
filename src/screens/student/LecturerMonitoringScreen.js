import React, { useEffect, useState, useContext, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";

import { db } from "../../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";

export default function LecturerMonitoringScreen() {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "attendance"));

      const allAttendance = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const myData = allAttendance.filter(
        (a) => a.studentId === user.uid
      );

      setAttendance(myData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const coursesData = useMemo(() => {
    const map = {};

    attendance.forEach((item) => {
      const course = item.className?.trim();
      if (!course) return;

      if (!map[course]) {
        map[course] = {
          name: course,
          total: 0,
          present: 0,
          absent: 0,
        };
      }

      map[course].total += 1;

      if (item.status === "absent") {
        map[course].absent += 1;
      } else {
        map[course].present += 1;
      }
    });

    return Object.values(map);
  }, [attendance]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}> My Attendance</Text>
      <Text style={styles.subtitle}>Blue progress dashboard</Text>

      <FlatList
        data={coursesData}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.course}> {item.name}</Text>

            <View style={styles.row}>
              <Text>Total</Text>
              <Text style={styles.bold}>{item.total}</Text>
            </View>

            <View style={styles.row}>
              <Text style={{ color: "#16a34a" }}>Present</Text>
              <Text style={styles.bold}>{item.present}</Text>
            </View>

            <View style={styles.row}>
              <Text style={{ color: "#dc2626" }}>Absent</Text>
              <Text style={styles.bold}>{item.absent}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fb",
    padding: 15,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e3a8a",
  },

  subtitle: {
    color: "#6b7280",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  course: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },

  bold: {
    fontWeight: "bold",
  },
});