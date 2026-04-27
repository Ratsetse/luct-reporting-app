import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { db } from "../../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function PRLMonitoringScreen() {
  const [users, setUsers] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // same logic style as RoleNavigator 
  const normalizeRole = (role) =>
    (role || "").toString().toLowerCase().trim();

  const isLecturer = (user) => {
    const role = normalizeRole(user.role);
    return role === "lecturer" || role === "lecture";
  };

  const fetchData = async () => {
    try {
      const userSnap = await getDocs(collection(db, "users"));
      const courseSnap = await getDocs(collection(db, "courses"));

      const allUsers = userSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      const allCourses = courseSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      console.log(" ALL USERS:", allUsers);

      const lecturerList = allUsers.filter(isLecturer);

      console.log(" LECTURERS FOUND:", lecturerList.length);

      setUsers(allUsers);
      setLecturers(lecturerList);
      setCourses(allCourses);
      setLoading(false);
    } catch (err) {
      console.log("PRL Monitoring error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}> PRL Monitoring Dashboard</Text>

      {loading ? (
        <Text>Loading system data...</Text>
      ) : (
        <>
          {/*  STATS */}
          <View style={styles.statsRow}>
            <View style={styles.card}>
              <Text style={styles.number}>{lecturers.length}</Text>
              <Text>Lecturers</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.number}>{courses.length}</Text>
              <Text>Courses</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.number}>{users.length}</Text>
              <Text>Total Users</Text>
            </View>
          </View>

          {/*  LECTURERS LIST */}
          <Text style={styles.section}> Lecturers</Text>

          {lecturers.length === 0 ? (
            <Text style={{ color: "red" }}>
              No lecturers found — check Firestore roles
            </Text>
          ) : (
            <FlatList
              data={lecturers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text style={styles.name}>{item.email}</Text>
                  <Text style={styles.role}>
                    Role: {item.role}
                  </Text>
                </View>
              )}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#eff6ff",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e40af",
    marginBottom: 15,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 5,
    borderRadius: 14,
    alignItems: "center",
    borderTopWidth: 4,
    borderTopColor: "#2563eb",
    elevation: 3,
  },

  number: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2563eb",
  },

  section: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
    color: "#1e40af",
  },

  listItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2563eb",
  },

  name: { fontWeight: "700" },

  role: { color: "#64748b" },
});