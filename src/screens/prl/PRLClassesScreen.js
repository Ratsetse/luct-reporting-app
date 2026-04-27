import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { db } from "../../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function PRLClassesScreen() {
  const [classes, setClasses] = useState([]);

  const fetchClasses = async () => {
    try {
      const snap = await getDocs(collection(db, "classes"));

      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(" CLASSES:", list);

      // optional safety filter
      const cleaned = list.filter((c) => c.className);

      setClasses(cleaned);
    } catch (err) {
      console.log("Error fetching classes:", err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}> PRL Classes</Text>

      <TouchableOpacity style={styles.refreshBtn} onPress={fetchClasses}>
        <Text style={{ color: "white" }}> Refresh</Text>
      </TouchableOpacity>

      {classes.length === 0 ? (
        <Text style={{ marginTop: 20, color: "red" }}>
          No classes found
        </Text>
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}> {item.className}</Text>
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
    marginBottom: 10,
  },

  refreshBtn: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#2563eb",
    shadowOpacity: 0.25,
    elevation: 3,
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#2563eb",
    shadowOpacity: 0.05,
    elevation: 2,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
});