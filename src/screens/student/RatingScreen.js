import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import { db } from "../../services/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { AuthContext } from "../../context/AuthContext";

export default function RatingScreen() {
  const { user } = useContext(AuthContext);

  const [lecturers, setLecturers] = useState([]);
  const [selectedLecturer, setSelectedLecturer] = useState(null);

  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const fetchLecturers = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));

      const list = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (u) =>
            u.role?.toLowerCase() === "lecturer" ||
            u.role?.toLowerCase() === "lecture"
        );

      setLecturers(list);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  useEffect(() => {
    fetchLecturers();
  }, []);

  const handleSubmit = async () => {
    if (!selectedLecturer || !rating) {
      Alert.alert("Error", "Select lecturer and rating");
      return;
    }

    const numRating = Number(rating);

    if (numRating < 1 || numRating > 5) {
      Alert.alert("Error", "Rating must be between 1 and 5");
      return;
    }

    try {
      await addDoc(collection(db, "ratings"), {
        studentId: user.uid,
        lecturerId: selectedLecturer.id,
        lecturerName: selectedLecturer.name || selectedLecturer.email,
        lecturerEmail: selectedLecturer.email,
        rating: numRating,
        comment,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Rating submitted!");

      setSelectedLecturer(null);
      setRating("");
      setComment("");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}> Rate Lecturer</Text>
      <Text style={styles.subtitle}>Give feedback to improve teaching</Text>

      {/* LECTURERS */}
      <Text style={styles.section}>Select Lecturer</Text>

      <FlatList
        data={lecturers}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              selectedLecturer?.id === item.id && styles.cardSelected,
            ]}
            onPress={() => setSelectedLecturer(item)}
          >
            <Text style={styles.name}>
              {item.name || "Lecturer"}
            </Text>
            <Text style={styles.email}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />

      {selectedLecturer && (
        <Text style={styles.selectedText}>
          Selected: {selectedLecturer.name || selectedLecturer.email}
        </Text>
      )}

      {/* RATING */}
      <Text style={styles.section}>Rating (1 - 5)</Text>
      <TextInput
        style={styles.input}
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
        placeholder="Enter rating"
      />

      {/* COMMENT */}
      <Text style={styles.section}>Comment</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={comment}
        onChangeText={setComment}
        placeholder="Write feedback..."
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Rating</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fb",
    padding: 15,
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

  section: {
    marginTop: 15,
    fontWeight: "bold",
    color: "#1e3a8a",
  },

  card: {
    backgroundColor: "white",
    padding: 12,
    marginRight: 10,
    borderRadius: 12,
    width: 150,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  cardSelected: {
    backgroundColor: "#dbeafe",
    borderColor: "#2563eb",
  },

  name: {
    fontWeight: "bold",
  },

  email: {
    fontSize: 12,
    color: "#6b7280",
  },

  selectedText: {
    marginTop: 10,
    color: "#2563eb",
    fontWeight: "bold",
  },

  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});