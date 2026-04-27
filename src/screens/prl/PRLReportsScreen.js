import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Button, StyleSheet } from "react-native";
import { db } from "../../services/firebaseConfig";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

export default function PRLReportsScreen({ route }) {
  const { courseId, courseName } = route.params;

  const [reports, setReports] = useState([]);
  const [feedback, setFeedback] = useState("");

  const fetchReports = async () => {
    const q = query(collection(db, "reports"), where("courseId", "==", courseId));
    const snapshot = await getDocs(q);

    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setReports(list);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const addFeedback = async (reportId) => {
    try {
      await updateDoc(doc(db, "reports", reportId), {
        prlFeedback: feedback,
      });

      setFeedback("");
      fetchReports();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports - {courseName}</Text>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.report}>{item.report}</Text>

            <Text style={styles.date}>
              {item.prlFeedback ? "Feedback: " + item.prlFeedback : "No feedback"}
            </Text>

            <TextInput
              placeholder="Add feedback..."
              value={feedback}
              onChangeText={setFeedback}
              style={styles.input}
            />

            <Button
              title="Send Feedback"
              onPress={() => addFeedback(item.id)}
            />
          </View>
        )}
      />
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
    marginBottom: 10,
  },

  card: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderLeftWidth: 5,
    borderLeftColor: "#2563eb",
  },

  report: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
  },

  date: {
    fontSize: 12,
    color: "#64748b",
    marginVertical: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#dbeafe",
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 10,
    marginVertical: 8,
  },
});