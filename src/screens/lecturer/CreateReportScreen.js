import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Button,
  StyleSheet,
  Alert
} from "react-native";

import { db } from "../../services/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";

export default function CreateReportScreen() {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    facultyName: "",
    className: "",
    week: "",
    date: "",
    courseName: "",
    courseCode: "",
    lecturerName: "",
    studentsPresent: "",
    totalStudents: "",
    venue: "",
    lectureTime: "",
    topic: "",
    learningOutcomes: "",
    recommendations: ""
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      // Validation
      if (!form.facultyName || !form.className || !form.courseName) {
        Alert.alert("Error", "Please fill required fields");
        return;
      }

      await addDoc(collection(db, "reports"), {
        ...form,
        studentsPresent: Number(form.studentsPresent),
        totalStudents: Number(form.totalStudents),
        createdBy: user.uid,
        createdAt: serverTimestamp()
      });

      Alert.alert("Success", "Report submitted!");

      // Reset form
      setForm({
        facultyName: "",
        className: "",
        week: "",
        date: "",
        courseName: "",
        courseCode: "",
        lecturerName: "",
        studentsPresent: "",
        totalStudents: "",
        venue: "",
        lectureTime: "",
        topic: "",
        learningOutcomes: "",
        recommendations: ""
      });

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Lecturer Report Form</Text>

      {Object.keys(form).map((key) => (
        <View key={key} style={styles.inputContainer}>
          <Text style={styles.label}>{key}</Text>
          <TextInput
            style={styles.input}
            value={form[key]}
            onChangeText={(value) => handleChange(key, value)}
          />
        </View>
      ))}

      <Button title="Submit Report" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15
  },
  inputContainer: {
    marginBottom: 10
  },
  label: {
    fontWeight: "bold"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5
  }
});