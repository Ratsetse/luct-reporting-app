import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { db } from "../../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function ViewAttendanceScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
      const snapshot = await getDocs(collection(db, "attendance"));

      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(list);
    } catch (error) {
      console.log("Attendance fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 10, color: "#2563eb" }}>
          Loading attendance...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Attendance Records</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>No attendance records found</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.className}>
                 {item.className || "Unknown Class"}
              </Text>

              <View
                style={[
                  styles.badge,
                  item.status === "present"
                    ? styles.present
                    : styles.absent,
                ]}
              >
                <Text style={styles.badgeText}>
                  {item.status?.toUpperCase()}
                </Text>
              </View>
            </View>

            <Text style={styles.subText}>
              Student ID: {item.studentId || "N/A"}
            </Text>

            <Text style={styles.subText}>
              Date: {item.dateISO?.split("T")[0] || "N/A"}
            </Text>
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

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eff6ff",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1e40af",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#2563eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  className: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },

  subText: {
    marginTop: 5,
    color: "#64748b",
    fontSize: 13,
  },

  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  present: {
    backgroundColor: "#22c55e",
  },

  absent: {
    backgroundColor: "#ef4444",
  },

  badgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#64748b",
  },
});