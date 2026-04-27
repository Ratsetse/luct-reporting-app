import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

import { db, auth } from "../../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

import { AuthContext } from "../../context/AuthContext";
import { signOut } from "firebase/auth";

export default function LecturerDashboard({ navigation }) {
  const { user } = useContext(AuthContext);

  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);

  const todayFormatted = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // FETCHING DATA
  const fetchData = async () => {
    if (!user) return;

    const courseSnap = await getDocs(collection(db, "courses"));
    const classSnap = await getDocs(collection(db, "classes"));

    const allCourses = courseSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const allClasses = classSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const myCourses = allCourses.filter(
      (c) => c.lecturerId === user.uid
    );

    const myCourseIds = myCourses.map((c) => c.id);

    const myClasses = allClasses.filter((cls) =>
      myCourseIds.includes(cls.courseId)
    );

    setCourses(myCourses);
    setClasses(myClasses);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const getClassesForCourse = (courseId) => {
    return classes.filter((c) => c.courseId === courseId);
  };

  const renderCourse = ({ item }) => {
    const courseClasses = getClassesForCourse(item.id);

    return (
      <View style={styles.card}>
        <Text style={styles.courseTitle}>📘 {item.name}</Text>
        <Text style={styles.subText}> {todayFormatted}</Text>

        <Text style={styles.sectionTitle}> Classes</Text>

        {courseClasses.length === 0 ? (
          <Text style={styles.empty}>No classes assigned</Text>
        ) : (
          courseClasses.map((cls) => (
            <View key={cls.id} style={styles.classBox}>
              <Text style={styles.classText}> {cls.className}</Text>

              <TouchableOpacity
                style={styles.viewBtn}
                onPress={() =>
                  navigation.navigate("LecturerAttendance", {
                    classId: cls.id,
                    courseId: item.id,
                    className: cls.className,
                  })
                }
              >
                <Text style={styles.viewBtnText}>
                   View Attendance
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* REPORTING BUTTON */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() =>
            navigation.navigate("LecturerCreateReport", {
              courseId: item.id,
              courseName: item.name,
            })
          }
        >
          <Text style={styles.primaryText}> Create Report</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.greeting}> Lecturer Dashboard</Text>
      <Text style={styles.date}> {todayFormatted}</Text>

      {/*  GLOBAL RATING BUTTON */}
      <TouchableOpacity
        style={styles.ratingGlobalBtn}
        onPress={() => navigation.navigate("LecturerRatings")}
      >
        <Text style={styles.ratingGlobalText}>
           View All Ratings
        </Text>
      </TouchableOpacity>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={renderCourse}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}> Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f6ff",
  },

  greeting: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1e3a8a",
  },

  date: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 10,
  },

  ratingGlobalBtn: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },

  ratingGlobalText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#2563eb",
  },

  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e3a8a",
  },

  subText: {
    color: "#64748b",
    marginTop: 5,
  },

  sectionTitle: {
    marginTop: 10,
    fontWeight: "bold",
    color: "#1d4ed8",
  },

  classBox: {
    backgroundColor: "#e0f2fe",
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
  },

  classText: {
    fontWeight: "bold",
    color: "#0f172a",
  },

  viewBtn: {
    backgroundColor: "#2563eb",
    padding: 8,
    marginTop: 6,
    borderRadius: 8,
  },

  viewBtnText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  primaryBtn: {
    backgroundColor: "#1d4ed8",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },

  primaryText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  logoutBtn: {
    backgroundColor: "#ef4444",
    padding: 12,
    marginTop: 10,
    borderRadius: 12,
  },

  logoutText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  empty: {
    color: "gray",
    fontStyle: "italic",
  },
});