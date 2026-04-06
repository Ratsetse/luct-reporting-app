import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList } from "react-native";
import { db } from "../../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";

export default function ViewRatingsScreen() {
  const [ratings, setRatings] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchRatings = async () => {
    const snapshot = await getDocs(collection(db, "ratings"));
    const list = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Only show ratings for this lecturer
    const filtered = list.filter(r => r.lecturerId === user.uid);
    setRatings(filtered);
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={ratings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>
            ⭐ {item.rating} - {item.comment}
          </Text>
        )}
      />
    </View>
  );
}