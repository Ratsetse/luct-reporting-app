import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from "react-native";
import { db } from "../../services/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function CreateReportScreen({ route, navigation }) {
  const { courseId, courseName } = route.params;

  const [form, setForm] = useState({
    facultyName: "",
    className: "",
    weekOfReporting: "",
    lectureDate: "",
    courseName: courseName || "",
    courseCode: "",
    lecturerName: "",
    studentsPresent: "",
    totalStudents: "",
    venue: "",
    scheduledTime: "",
    topicTaught: "",
    learningOutcomes: "",
    recommendations: "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const submitReport = async () => {
    if (!form.topicTaught || !form.courseName) {
      Alert.alert("Error", "Please fill required fields");
      return;
    }

    try {
      await addDoc(collection(db, "reports"), {
        courseId,
        ...form,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Report submitted successfully");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Lecture Report</Text>
      <Text>Course: {courseName}</Text>

      {Object.keys(form).map((key) => (
        <TextInput
          key={key}
          placeholder={key}
          value={form[key]}
          onChangeText={(text) => handleChange(key, text)}
          style={styles.input}
          multiline={key === "learningOutcomes" || key === "recommendations"}
        />
      ))}

      <Button title="Submit Report" onPress={submitReport} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});