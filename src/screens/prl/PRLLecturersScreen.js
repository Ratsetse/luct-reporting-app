import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { db } from "../../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function PRLLecturersScreen() {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLecturers = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));

      const allUsers = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(" ALL USERS FROM FIRESTORE:", allUsers);

      const lecturerList = allUsers.filter((u) => {
        const role = (u.role || "").toString().toLowerCase().trim();

        return role === "lecturer" || role === "lecture";
      });

      console.log(" FILTERED LECTURERS:", lecturerList);

      setLecturers(lecturerList);
      setLoading(false);
    } catch (err) {
      console.log("Lecturer fetch error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLecturers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Lecturers</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : lecturers.length === 0 ? (
        <Text style={{ marginTop: 10, color: "red" }}>
          No lecturers found in system
        </Text>
      ) : (
        <FlatList
          data={lecturers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.email}</Text>
              <Text>Role: {item.role}</Text>
            </View>
          )}
        />
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
  },

  card: {
    padding: 15,
    borderRadius: 14,
    marginTop: 10,
    backgroundColor: "#fff",
    borderLeftWidth: 5,
    borderLeftColor: "#2563eb",
    elevation: 2,
  },

  name: {
    fontWeight: "700",
    fontSize: 15,
    color: "#0f172a",
  },
});