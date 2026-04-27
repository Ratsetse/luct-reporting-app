import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { db, auth } from "../../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function PLCoursesScreen() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "courses"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCourses(data);
    } catch (error) {
      console.log("Error loading courses:", error);
      Alert.alert("Error", "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> PL Courses</Text>

      {loading ? (
        <Text style={styles.info}>Loading courses...</Text>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.info}>No courses found</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.courseName}>
                 {item.name || "Unnamed Course"}
              </Text>

              <Text style={styles.sub}>
                Lecturer: {item.lecturerEmail || "Not assigned"}
              </Text>

              <Text style={styles.sub}>
                Course ID: {item.id}
              </Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

//  STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#eff6ff",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1e40af",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#2563eb",
  },

  courseName: {
    fontWeight: "700",
    color: "#0f172a",
  },

  sub: {
    color: "#64748b",
  },

  info: {
    textAlign: "center",
    marginTop: 20,
    color: "#64748b",
  },

  logout: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },

  logoutText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
  },
});