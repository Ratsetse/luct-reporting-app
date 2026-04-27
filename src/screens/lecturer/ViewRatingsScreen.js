import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { db } from "../../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";

export default function ViewRatingsScreen() {
  const [ratings, setRatings] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchRatings = async () => {
    try {
      const snapshot = await getDocs(collection(db, "ratings"));

      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      //  SAFE FILTER 
      const filtered = list.filter(r =>
        r.lecturerId === user?.uid
      );

      setRatings(filtered);

    } catch (error) {
      console.log("Ratings fetch error:", error);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchRatings();
    }
  }, [user]);

  return (
    <View style={styles.container}>

      <Text style={styles.title}> My Ratings</Text>

      {ratings.length === 0 ? (
        <Text style={styles.empty}>
          No ratings yet for your courses
        </Text>
      ) : (
        <FlatList
          data={ratings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.rating}>
                 {item.rating}
              </Text>
              <Text style={styles.comment}>
                {item.comment}
              </Text>
            </View>
          )}
        />
      )}

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
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#2563eb",
  },

  rating: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2563eb",
  },

  comment: {
    marginTop: 5,
    color: "#64748b",
  },

  empty: {
    marginTop: 20,
    color: "#64748b",
  },
});