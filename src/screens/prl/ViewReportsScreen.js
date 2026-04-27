import React, { useEffect, useState } from "react";
import {
  View,
  Text,
 FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import { db } from "../../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as XLSX from "xlsx";

export default function ViewReportsScreen() {
  const [reports, setReports] = useState([]);

  //  FETCHING REPORTS 
  const fetchReports = async () => {
    try {
      const snap = await getDocs(collection(db, "reports"));

      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReports(list);
    } catch (err) {
      console.log("REPORT ERROR:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  //  EXPORTING TO EXCEL 
  const exportToExcel = async () => {
    if (reports.length === 0) {
      Alert.alert("No data", "There are no reports to export.");
      return;
    }

    try {
      // Formating data for Excel
      const data = reports.map((item) => ({
        Course: item.courseName,
        Lecturer: item.lecturerName || "Unknown",
        Topic: item.topicTaught,
        Venue: item.venue,
        Date: item.lectureDate,
        Outcomes: item.learningOutcomes,
      }));

      // Createing worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Createing workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

      // Converting to binary
      const wbout = XLSX.write(workbook, {
        type: "base64",
        bookType: "xlsx",
      });

      const fileUri =
        FileSystem.documentDirectory + "LectureReports.xlsx";

      // Saveing file
      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Share / Download
      await Sharing.shareAsync(fileUri);

    } catch (error) {
      console.log("Excel error:", error);
      Alert.alert("Error", "Failed to export Excel file");
    }
  };

  // UI 
  return (
    <View style={styles.container}>
      <Text style={styles.title}> All Lecture Reports</Text>

      {/*  EXPORTing BUTTON */}
      <TouchableOpacity style={styles.button} onPress={exportToExcel}>
        <Text style={styles.buttonText}>⬇ Download Excel</Text>
      </TouchableOpacity>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>No reports found</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.course}>{item.courseName}</Text>

            <Text> Lecturer: {item.lecturerName || "Unknown"}</Text>
            <Text> Topic: {item.topicTaught}</Text>
            <Text> Venue: {item.venue}</Text>
            <Text> Date: {item.lectureDate}</Text>
            <Text> Outcomes: {item.learningOutcomes}</Text>
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
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOpacity: 0.25,
    elevation: 3,
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#2563eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    elevation: 2,
  },

  course: {
    fontWeight: "800",
    fontSize: 16,
    color: "#0f172a",
    marginBottom: 6,
  },

  text: {
    color: "#475569",
    marginTop: 2,
  },

  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#64748b",
  },
});