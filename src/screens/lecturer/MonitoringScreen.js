import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { db } from "../../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function MonitoringScreen({ route }) {
  // SAFE ACCESS (preventing crash)
  const courseId = route?.params?.courseId ?? null;

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [ratings, setRatings] = useState([]);

  const fetchData = async () => {
    const [usersSnap, attSnap, rateSnap] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "attendance")),
      getDocs(collection(db, "ratings")),
    ]);

    const allUsers = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const allAttendance = attSnap.docs.map(d => d.data());
    const allRatings = rateSnap.docs.map(d => d.data());

    setStudents(allUsers.filter(u => u.role === "student"));

    setAttendance(
      courseId
        ? allAttendance.filter(a => a.courseId === courseId)
        : allAttendance
    );

    setRatings(
      courseId
        ? allRatings.filter(r => r.courseId === courseId)
        : allRatings
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getAttendance = (studentId) => {
    const records = attendance.filter(a => a.studentId === studentId);

    const present = records.filter(r => r.status === "present").length;
    const total = records.length;
    const percent = total === 0 ? 0 : ((present / total) * 100).toFixed(0);

    return { present, total, percent };
  };

  const getRating = (studentId) => {
    const records = ratings.filter(r => r.studentId === studentId);

    if (records.length === 0) return { avg: 0, count: 0 };

    const sum = records.reduce((a, b) => a + b.rating, 0);

    return {
      avg: (sum / records.length).toFixed(1),
      count: records.length,
    };
  };

  const topStudents = [...students]
    .map(s => ({
      ...s,
      avg: parseFloat(getRating(s.id).avg),
    }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 3);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}> Monitoring</Text>

      {!courseId && (
        <Text style={styles.warning}>
          ⚠ Showing ALL courses 
        </Text>
      )}

      <View style={styles.card}>
        <Text>Students: {students.length}</Text>
        <Text>Attendance Records: {attendance.length}</Text>
        <Text>Ratings: {ratings.length}</Text>
      </View>

      <Text style={styles.section}> Top Students</Text>

      {topStudents.map(s => {
        const a = getAttendance(s.id);
        const r = getRating(s.id);

        return (
          <View key={s.id} style={styles.card}>
            <Text style={styles.name}>{s.email}</Text>
            <Text> {r.avg}</Text>
            <Text> {a.percent}% attendance</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

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
  },

  warning: {
    color: "#ef4444",
    marginVertical: 10,
    fontWeight: "600",
  },

  section: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 12,
    color: "#1e40af",
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#2563eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    elevation: 2,
  },

  name: {
    fontWeight: "700",
    fontSize: 15,
    color: "#0f172a",
    marginBottom: 4,
  },
});