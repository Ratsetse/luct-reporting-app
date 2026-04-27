import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

import { db } from "../../services/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { AuthContext } from "../../context/AuthContext";

export default function AttendanceScreen() {
  const { user } = useContext(AuthContext);

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const [className, setClassName] = useState("");
  const [status, setStatus] = useState("present");

  const today = new Date();
  const dayName = today.toLocaleDateString("en-GB", {
    weekday: "long",
  });

  //  LOADING COURSES
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const snap = await getDocs(collection(db, "courses"));

        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCourses(list);
      } catch (err) {
        console.log("Error loading courses:", err);
      }
    };

    fetchCourses();
  }, []);

  const selectedCourse = courses.find(
    (c) => c.id === selectedCourseId
  );

  const handleSubmit = async () => {
    if (!selectedCourse) {
      Alert.alert("Error", "Please select a course");
      return;
    }

    if (!className) {
      Alert.alert("Error", "Enter class name");
      return;
    }

    try {
      await addDoc(collection(db, "attendance"), {
        studentId: user.uid,

        courseId: selectedCourse.id,
        courseName: selectedCourse.name,

        className,
        status,

        date: new Date().toISOString(),
        dayName,

        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Attendance saved!");
      setClassName("");
      setStatus("present");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}> Attendance</Text>
        <Text style={styles.subtitle}>
          Mark your class attendance
        </Text>
        <Text style={styles.day}>Today: {dayName}</Text>
      </View>

      {/* COURSE */}
      <View style={styles.card}>
        <Text style={styles.label}>Selected Course</Text>

        <View style={styles.pickerBox}>
          <Picker
            selectedValue={selectedCourseId}
            onValueChange={(value) =>
              setSelectedCourseId(value)
            }
          >
            <Picker.Item
              label="-- Select Course --"
              value=""
            />

            {courses.map((course) => (
              <Picker.Item
                key={course.id}
                label={course.name}
                value={course.id}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.selectedText}>
          {selectedCourse
            ? selectedCourse.name
            : "No course selected"}
        </Text>
      </View>

      {/* CLASS */}
      <View style={styles.card}>
        <Text style={styles.label}>Class Name</Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. Hall 1"
          value={className}
          onChangeText={setClassName}
          placeholderTextColor="#94a3b8"
        />
      </View>

      {/* STATUS */}
      <View style={styles.card}>
        <Text style={styles.label}>Attendance Status</Text>

        <View style={styles.pickerBox}>
          <Picker
            selectedValue={status}
            onValueChange={(value) => setStatus(value)}
          >
            <Picker.Item label="Present" value="present" />
            <Picker.Item label="Absent" value="absent" />
          </Picker>
        </View>
      </View>

      {/* BUTTON */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>
          Submit Attendance
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eff6ff",
    padding: 20,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1d4ed8",
  },

  subtitle: {
    color: "#64748b",
    marginTop: 4,
  },

  day: {
    marginTop: 6,
    color: "#2563eb",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  label: {
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1e3a8a",
  },

  pickerBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
  },

  selectedText: {
    marginTop: 8,
    color: "#2563eb",
    fontWeight: "500",
  },

  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#f8fafc",
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});