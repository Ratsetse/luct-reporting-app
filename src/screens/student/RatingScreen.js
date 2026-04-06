import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert
} from "react-native";

import { db } from "../../services/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";

export default function RatingScreen() {
  const { user } = useContext(AuthContext);

  const [lecturerId, setLecturerId] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (!lecturerId || !rating) {
      Alert.alert("Error", "Fill all required fields");
      return;
    }

    if (Number(rating) < 1 || Number(rating) > 5) {
      Alert.alert("Error", "Rating must be between 1 and 5");
      return;
    }

    try {
      await addDoc(collection(db, "ratings"), {
        studentId: user.uid,
        lecturerId,
        rating: Number(rating),
        comment,
        createdAt: serverTimestamp()
      });

      Alert.alert("Success", "Rating submitted!");

      setLecturerId("");
      setRating("");
      setComment("");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate Lecturer</Text>

      <Text>Lecturer ID</Text>
      <TextInput
        style={styles.input}
        value={lecturerId}
        onChangeText={setLecturerId}
      />

      <Text>Rating (1-5)</Text>
      <TextInput
        style={styles.input}
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />

      <Text>Comment</Text>
      <TextInput
        style={styles.input}
        value={comment}
        onChangeText={setComment}
      />

      <Button title="Submit Rating" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8
  }
});