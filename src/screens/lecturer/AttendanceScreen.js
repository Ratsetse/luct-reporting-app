import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { db } from "../../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function AttendanceScreen({ route, navigation }) {
  const { classId, courseId, className } = route.params;

  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [usersMap, setUsersMap] = useState({});

  //FETCHING USERS (for names)
  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));

    const map = {};

    snapshot.docs.forEach((doc) => {
      const data = doc.data();

      const name =
        data.fullName ||
        data.name ||
        data.displayName ||
        data.email ||
        "Unknown Student";

      // support both structures: uid field OR doc.id
      map[data.uid || doc.id] = name;
    });

    setUsersMap(map);
  };

  // FETCHING ATTENDANCE 
  const fetchAttendance = async () => {
    try {
      const snapshot = await getDocs(collection(db, "attendance"));

      const all = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filtered = all.filter(
        (a) =>
          a.classId === classId &&
          a.courseId === courseId &&
          a.status === "present"
      );

      setAttendance(filtered);
    } catch (error) {
      console.log("Attendance error:", error);
    } finally {
      setLoading(false);
    }
  };

  //  LOADING DATA 
  useEffect(() => {
    const load = async () => {
      await fetchUsers();
      await fetchAttendance();
    };

    load();
  }, []);

  //  GETING STUDENT NAME 
  const getStudentName = (studentId) => {
    return usersMap[studentId] || "Unknown Student";
  };

  //  UI 
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}> {className} Attendance</Text>

      <FlatList
        data={attendance}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>No students yet</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("StudentAttendanceDetails", {
                studentId: item.studentId,
                classId,
                courseId,
                className,
              })
            }
          >
            
            <Text style={styles.student}>
              🎓 {getStudentName(item.studentId)}
            </Text>

            <Text style={styles.date}>
               {item.dayName} | {item.dateISO?.split("T")[0]}
            </Text>

            <Text style={styles.status}>🟢 Present</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// STYLES 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#eff6ff",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1e40af",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },

  student: {
    fontWeight: "700",
    fontSize: 16,
    color: "#0f172a",
  },

  date: {
    color: "#64748b",
    marginTop: 5,
  },

  status: {
    marginTop: 6,
    color: "#22c55e",
    fontWeight: "700",
  },

  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#64748b",
  },
});