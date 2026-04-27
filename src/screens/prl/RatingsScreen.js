import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { db } from "../../services/firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";

export default function RatingsScreen() {
  const { user } = useContext(AuthContext);

  const [lecturers, setLecturers] = useState([]);
  const [ratings, setRatings] = useState([]);

  // LOADING LECTURERS ONLY
  const fetchLecturers = async () => {
    const snap = await getDocs(collection(db, "users"));

    const list = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(u => u.role === "lecturer");

    setLecturers(list);
  };

  // LOADING RATINGS
  const fetchRatings = async () => {
    const snap = await getDocs(collection(db, "ratings"));

    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    setRatings(list);
  };

  useEffect(() => {
    fetchLecturers();
    fetchRatings();
  }, []);

  // RATEING LECTURER
  const rateLecturer = async (lecturerId, value) => {
    try {
      await addDoc(collection(db, "ratings"), {
        type: "lecturer_performance",
        lecturerId,
        ratedBy: user.uid,
        rating: value,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Lecturer rated successfully!");
      fetchRatings();
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  // AVG
  const getAvg = (lecturerId) => {
    const list = ratings.filter(r => r.lecturerId === lecturerId);

    if (list.length === 0) return 0;

    const sum = list.reduce((a, b) => a + b.rating, 0);

    return (sum / list.length).toFixed(1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Rate Lecturers</Text>

      <FlatList
        data={lecturers}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.email}</Text>

            <Text>Avg Rating: {getAvg(item.id)}</Text>

            <View style={styles.row}>
              {[1, 2, 3, 4, 5].map(n => (
                <TouchableOpacity
                  key={n}
                  style={styles.btn}
                  onPress={() => rateLecturer(item.id, n)}
                >
                  <Text style={{ color: "white" }}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },

  title: { fontSize: 22, fontWeight: "bold" },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
  },

  name: { fontWeight: "bold" },

  row: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },

  btn: {
    backgroundColor: "#f59e0b",
    padding: 10,
    borderRadius: 8,
    width: 40,
    alignItems: "center",
  },
});