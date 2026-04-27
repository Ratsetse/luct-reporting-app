import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { db } from "../../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function PLRatingsScreen() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        //  GETING COURSES 
        const courseSnapshot = await getDocs(collection(db, "courses"));

        const courseMap = {};
        courseSnapshot.docs.forEach((doc) => {
          courseMap[doc.id] = doc.data().name;
        });

        //  GETING RATINGS 
        const ratingSnapshot = await getDocs(collection(db, "ratings"));

        const ratings = ratingSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        //  GROUPING BY COURSE 
        const grouped = {};

        ratings.forEach((r) => {
          const courseId = r.courseId;

         
          const courseName =
            r.courseName ||
            courseMap[courseId] ||
            "Unnamed Course";

          if (!grouped[courseName]) {
            grouped[courseName] = {
              total: 0,
              count: 0,
              comments: [],
            };
          }

          grouped[courseName].total += Number(r.rating || 0);
          grouped[courseName].count += 1;

          if (r.comment && r.comment.trim() !== "") {
            grouped[courseName].comments.push(r.comment);
          }
        });

        const formatted = Object.keys(grouped).map((key) => ({
          course: key,
          avg: (grouped[key].total / grouped[key].count).toFixed(1),
          count: grouped[key].count,
          comments: grouped[key].comments,
        }));

        setCourses(formatted);
      } catch (error) {
        console.log("Error loading ratings:", error);
      }
    };

    fetchRatings();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}> PL Ratings Dashboard</Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.course}
        ListEmptyComponent={
          <Text style={styles.empty}>No ratings found</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.course}>{item.course}</Text>

            <Text style={styles.rating}>
               Average: {item.avg} ({item.count} reviews)
            </Text>

            {item.comments.length > 0 && (
              <View style={styles.commentBox}>
                <Text style={styles.commentTitle}>Comments:</Text>

                {item.comments.slice(0, 3).map((c, index) => (
                  <Text key={index} style={styles.comment}>
                    • {c}
                  </Text>
                ))}
              </View>
            )}
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
    fontSize: 22,
    fontWeight: "800",
    color: "#1e40af",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 12,
    borderRadius: 14,
    borderLeftWidth: 5,
    borderLeftColor: "#2563eb",
  },

  course: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },

  rating: {
    marginTop: 5,
    color: "#2563eb",
    fontWeight: "600",
  },

  commentBox: {
    marginTop: 10,
  },

  commentTitle: {
    fontWeight: "700",
    color: "#1e40af",
  },

  comment: {
    color: "#64748b",
    fontSize: 13,
  },

  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#64748b",
  },
});