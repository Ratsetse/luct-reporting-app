import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { db } from "../../services/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function AssignLecturerScreen() {
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [lecturers, setLecturers] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  const [loading, setLoading] = useState(false);

  // 📥 LOAD DATA
  const fetchData = async () => {
    setLoading(true);
    try {
      const courseSnap = await getDocs(collection(db, "courses"));
      const classSnap = await getDocs(collection(db, "classes"));
      const userSnap = await getDocs(collection(db, "users"));

      setCourses(courseSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      setClasses(classSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      setLecturers(
        userSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter(
            (u) =>
              u.role?.toLowerCase() === "lecturer" ||
              u.role?.toLowerCase() === "lecture"
          )
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //  ASSIGN COURSE TO THEE LECTURER
  const assignCourse = async (lecturer) => {
    if (!selectedCourse) {
      Alert.alert("Select a course first");
      return;
    }

    try {
      await updateDoc(doc(db, "courses", selectedCourse.id), {
        lecturerId: lecturer.id,
        lecturerEmail: lecturer.email,
      });

      Alert.alert("Success", "Course assigned to lecturer");
      setSelectedCourse(null);
      fetchData();
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  // ASSIGN CLASS TO THE LECTURER
  const assignClass = async (lecturer) => {
    if (!selectedClass) {
      Alert.alert("Select a class first");
      return;
    }

    try {
      await updateDoc(doc(db, "classes", selectedClass.id), {
        lecturerId: lecturer.id,
        lecturerEmail: lecturer.email,
      });

      Alert.alert("Success", "Class assigned to lecturer");
      setSelectedClass(null);
      fetchData();
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assign Courses & Classes</Text>

      {/*  COURSES */}
      <Text style={styles.section}> Courses</Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              selectedCourse?.id === item.id && styles.selected,
            ]}
            onPress={() => setSelectedCourse(item)}
          >
            <Text style={styles.bold}> {item.name}</Text>
            <Text>{item.lecturerEmail || "Not assigned"}</Text>
          </TouchableOpacity>
        )}
      />

      {/*  CLASSES */}
      <Text style={styles.section}> Classes</Text>

      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              selectedClass?.id === item.id && styles.selected,
            ]}
            onPress={() => setSelectedClass(item)}
          >
            <Text style={styles.bold}> {item.className}</Text>
            <Text>Course: {item.courseName}</Text>
            <Text>{item.lecturerEmail || "Not assigned"}</Text>
          </TouchableOpacity>
        )}
      />

      {/* LECTURERS */}
      <Text style={styles.section}> Lecturers</Text>

      {lecturers.length === 0 ? (
        <Text style={{ color: "red" }}>No lecturers found</Text>
      ) : (
        lecturers.map((lec) => (
          <View key={lec.id} style={styles.lecturerBox}>
            <Text style={{ color: "white" }}>{lec.email}</Text>

            {/* COURSE ASSIGN */}
            {selectedCourse && (
              <TouchableOpacity
                style={styles.btn}
                onPress={() => assignCourse(lec)}
              >
                <Text style={{ color: "white" }}>
                  Assign to Course
                </Text>
              </TouchableOpacity>
            )}

            {/* CLASS ASSIGN */}
            {selectedClass && (
              <TouchableOpacity
                style={styles.btn2}
                onPress={() => assignClass(lec)}
              >
                <Text style={{ color: "white" }}>
                  Assign to Class
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      )}

      {loading && (
        <ActivityIndicator size="large" color="#2563eb" />
      )}
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

  section: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 15,
    marginBottom: 5,
    color: "#2563eb",
  },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    marginBottom: 10,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#93c5fd",
  },

  selected: {
    borderColor: "#2563eb",
    borderWidth: 2,
  },

  bold: {
    fontWeight: "700",
    color: "#0f172a",
  },

  lecturerBox: {
    backgroundColor: "#1e40af",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },

  btn: {
    backgroundColor: "#2563eb",
    padding: 8,
    marginTop: 6,
    borderRadius: 8,
  },

  btn2: {
    backgroundColor: "#22c55e",
    padding: 8,
    marginTop: 6,
    borderRadius: 8,
  },
});