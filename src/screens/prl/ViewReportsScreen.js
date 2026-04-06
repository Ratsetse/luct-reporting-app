import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Button
} from "react-native";
import XLSX from "xlsx";
import * as FileSystem from 'expo-file-system';
import { db } from "../../services/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";

import { AuthContext } from "../../context/AuthContext";

export default function ViewReportsScreen() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);
  const { role } = useContext(AuthContext);

  // Fetch reports
  const fetchReports = async () => {
  const querySnapshot = await getDocs(collection(db, "reports"));
  const data = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  const exportToExcel = async () => {
  try {
    // Convert reports to worksheet
    const worksheet = XLSX.utils.json_to_sheet(reports);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

    // Generate Excel file
    const excelData = XLSX.write(workbook, {
      type: "binary",
      bookType: "xlsx"
    });

    // Convert to buffer
    const buffer = new Uint8Array(
      excelData.split("").map((char) => char.charCodeAt(0))
    );

    // File path
    const path = `${RNFS.DownloadDirectoryPath}/Reports.xlsx`;

    // Write file
    await RNFS.writeFile(path, buffer, "ascii");

    alert("Excel file saved to Downloads!");
  } catch (error) {
    alert(error.message);
  }
};

  setReports(data);
  setFilteredReports(data);
};

const handleSearch = (text) => {
  setSearch(text);

  const filtered = reports.filter((item) =>
    item.courseName?.toLowerCase().includes(text.toLowerCase()) ||
    item.className?.toLowerCase().includes(text.toLowerCase()) ||
    item.lecturerName?.toLowerCase().includes(text.toLowerCase())
  );

  setFilteredReports(filtered);
};

  useEffect(() => {
    fetchReports();
  }, []);

  const openReport = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const handleFeedback = async () => {
    if (!selectedReport) return;

    try {
      await updateDoc(doc(db, "reports", selectedReport.id), {
        feedback: feedback
      });

      setModalVisible(false);
      setFeedback("");
      fetchReports();
    } catch (error) {
      alert(error.message);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => openReport(item)}
    >
      <Text style={styles.title}>{item.courseName}</Text>
      <Text>{item.className}</Text>
      <Text>{item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Reports</Text>

      <FlatList
        data={filteredReports}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      {/* MODAL FOR DETAILS */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          {selectedReport && (
            <>
              {Object.entries(selectedReport).map(([key, value]) => (
                <Text key={key}>
                  {key}: {String(value)}
                </Text>
              ))}

              {/* Only PRL can add feedback */}
              {role === "prl" && (
                <>
                  <TextInput
                    placeholder="Enter feedback"
                    value={feedback}
                    onChangeText={setFeedback}
                    style={styles.input}
                  />
                  <Button title="Submit Feedback" onPress={handleFeedback} />
                </>
              )}
              <Button title="Export to Excel" onPress={exportToExcel} />

              <Button
                title="Close"
                onPress={() => setModalVisible(false)}
              />
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10
  },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    borderRadius: 8
  },
  title: {
    fontWeight: "bold"
  },
  modal: {
    padding: 20
  },
  searchInput: {
  borderWidth: 1,
  padding: 10,
  marginBottom: 10,
  borderRadius: 8
},
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10
  }
});