import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { db } from "../../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function ViewAttendanceScreen() {
  const [data, setData] = useState([]);

  const fetchAttendance = async () => {
    const snapshot = await getDocs(collection(db, "attendance"));
    const list = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setData(list);
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>
            {item.className} - {item.status}
          </Text>
        )}
      />
    </View>
  );
}