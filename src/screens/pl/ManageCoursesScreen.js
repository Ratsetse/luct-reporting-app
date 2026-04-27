import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity
} from "react-native";
import { db, auth } from "../../services/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function ManageCoursesScreen() {
  const [courseName, setCourseName] = useState("");
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    const snapshot = await getDocs(collection(db, "courses"));
    setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const addCourse = async () => {
    if (!courseName) {
      Alert.alert("Error", "Enter course name");
      return;
    }

    await addDoc(collection(db, "courses"), {
      name: courseName,
      lecturerId: null,
      lecturerEmail: null,
    });

    setCourseName("");
    fetchCourses();
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}> Manage Courses</Text>

      <TextInput
        placeholder="Enter course name"
        value={courseName}
        onChangeText={setCourseName}
        style={styles.input}
      />

      <TouchableOpacity style={styles.addBtn} onPress={addCourse}>
        <Text style={{ color: "white", fontWeight: "bold" }}>+ Add Course</Text>
      </TouchableOpacity>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.courseName}>{item.name}</Text>
            <Text style={styles.sub}>
              {item.lecturerEmail || "No lecturer assigned"}
            </Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.navBtn}
        onPress={() => console.log("Go Assign Lecturer")}
      >
        <Text style={{ color: "white" }}>Go to Assign Lecturer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={{ color: "white" }}>Logout</Text>
      </TouchableOpacity>

    </View>
  );
}

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
  },

  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },

  addBtn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },

  item: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
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

  navBtn: {
    backgroundColor: "#1e40af",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },

  logout: {
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
});