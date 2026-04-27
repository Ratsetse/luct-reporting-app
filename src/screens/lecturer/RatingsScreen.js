import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { db } from "../../services/firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";

export default function RatingsScreen() {
  const { user } = useContext(AuthContext);

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [ratings, setRatings] = useState([]);

  //  COURSES 
  const fetchCourses = async () => {
    try {
      const snap = await getDocs(collection(db, "courses"));

      const myCourses = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(c => c.lecturerId === user.uid);

      setCourses(myCourses);
    } catch (err) {
      console.log("COURSE ERROR:", err);
    }
  };

  // SHOWING STUDENTS
  const fetchStudents = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));

      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(u => u.role === "student");

      console.log("STUDENTS LOADED:", list.length);

      setStudents(list);
    } catch (err) {
      console.log("STUDENT ERROR:", err);
    }
  };

  // RATINGS 
  const fetchRatings = async (courseId) => {
    try {
      const snap = await getDocs(collection(db, "ratings"));

      const data = snap.docs.map(d => d.data());

      setRatings(data.filter(r => r.courseId === courseId));
    } catch (err) {
      console.log("RATING FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);

  //  SELECT COURSE 
  const selectCourse = (course) => {
    console.log("SELECTED COURSE:", course.id);

    setSelectedCourse(course);
    fetchRatings(course.id);
  };

  // RATE STUDENT
  const rateStudent = async (studentId, value) => {
    if (!selectedCourse) {
      Alert.alert("Error", "No course selected");
      return;
    }

    try {
      console.log("RATING CLICKED:", studentId, value);

      await addDoc(collection(db, "ratings"), {
        type: "student_rating",
        courseId: selectedCourse.id,
        studentId,
        rating: value,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Rating saved!");

      fetchRatings(selectedCourse.id);
    } catch (err) {
      console.log("WRITE ERROR:", err);
      Alert.alert("Error", err.message);
    }
  };

  //  AVG 
  const getAverage = (studentId) => {
    const studentRatings = ratings.filter(r => r.studentId === studentId);

    if (studentRatings.length === 0) return 0;

    const sum = studentRatings.reduce((a, b) => a + b.rating, 0);

    return (sum / studentRatings.length).toFixed(1);
  };

  //  COURSE LIST 
  if (!selectedCourse) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}> Select Course</Text>

        <FlatList
          data={courses}
          keyExtractor={i => i.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.courseCard}
              onPress={() => selectCourse(item)}
            >
              <Text style={styles.courseName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  //  STUDENT LIST 
  return (
    <View style={styles.container}>
      <Text style={styles.title}> {selectedCourse.name}</Text>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => setSelectedCourse(null)}
      >
        <Text style={{ color: "white" }}>⬅ Back</Text>
      </TouchableOpacity>

      <FlatList
        data={students}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.email}</Text>

            <Text style={styles.avg}>
              Avg: {getAverage(item.id)}
            </Text>

            <View style={styles.row}>
              {[1, 2, 3, 4, 5].map(num => (
                <TouchableOpacity
                  key={num}
                  style={styles.star}
                  onPress={() => rateStudent(item.id, num)}
                >
                  <Text style={{ color: "white" }}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}

//  STYLES 
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
    marginBottom: 15,
  },

  courseCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#dbeafe",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  courseName: {
    fontWeight: "700",
    fontSize: 16,
    color: "#0f172a",
  },

  backBtn: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },

  name: {
    fontWeight: "700",
    fontSize: 15,
    color: "#0f172a",
  },

  avg: {
    marginVertical: 6,
    color: "#2563eb",
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  star: {
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 10,
    width: 42,
    alignItems: "center",
  },
});