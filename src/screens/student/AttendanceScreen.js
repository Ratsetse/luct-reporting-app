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

export default function AttendanceScreen() {
  const { user } = useContext(AuthContext);

  const [className, setClassName] = useState("");
  const [status, setStatus] = useState("present");

  const handleSubmit = async () => {
    if (!className) {
      Alert.alert("Error", "Enter class name");
      return;
    }

    try {
      await addDoc(collection(db, "attendance"), {
        studentId: user.uid,
        className,
        status,
        date: new Date().toISOString(),
        createdAt: serverTimestamp()
      });

      Alert.alert("Success", "Attendance recorded!");

      setClassName("");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Attendance</Text>

      <Text>Class Name</Text>
      <TextInput
        style={styles.input}
        value={className}
        onChangeText={setClassName}
      />

      <Text>Status (present/absent)</Text>
      <TextInput
        style={styles.input}
        value={status}
        onChangeText={setStatus}
      />

      <Button title="Submit" onPress={handleSubmit} />
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