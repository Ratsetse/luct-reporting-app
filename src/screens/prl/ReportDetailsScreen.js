import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function ReportDetailsScreen({ route }) {
  const { report } = route.params || {};

  if (!report) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#64748b" }}>No report data found</Text>
      </View>
    );
  }

  const Field = ({ label, value }) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "N/A"}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📄 Report Details</Text>

      <View style={styles.card}>
        <Field label="Course Name" value={report.courseName} />
        <Field label="Course Code" value={report.courseCode} />
        <Field label="Faculty Name" value={report.facultyName} />
        <Field label="Class Name" value={report.className} />
      </View>

      <View style={styles.card}>
        <Field label="Week of Reporting" value={report.weekOfReporting} />
        <Field label="Lecture Date" value={report.lectureDate} />
        <Field label="Lecturer Name" value={report.lecturerName} />
        <Field label="Venue" value={report.venue} />
        <Field label="Scheduled Time" value={report.scheduledTime} />
      </View>

      <View style={styles.card}>
        <Field label="Topic Taught" value={report.topicTaught} />
        <Field label="Learning Outcomes" value={report.learningOutcomes} />
        <Field label="Recommendations" value={report.recommendations} />
      </View>

      <View style={styles.card}>
        <Field label="Students Present" value={report.studentsPresent} />
        <Field label="Total Students" value={report.totalStudents} />
      </View>

      {report.prlFeedback && (
        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackTitle}>PRL Feedback</Text>
          <Text style={styles.feedbackText}>
            {report.prlFeedback}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

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
    fontSize: 24,
    fontWeight: "800",
    color: "#1e40af",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#2563eb",
  },

  field: {
    marginBottom: 10,
  },

  label: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
  },

  feedbackCard: {
    backgroundColor: "#ecfdf5",
    padding: 15,
    borderRadius: 14,
    borderLeftWidth: 5,
    borderLeftColor: "#22c55e",
    marginTop: 10,
  },

  feedbackTitle: {
    fontWeight: "800",
    color: "#16a34a",
    marginBottom: 5,
  },

  feedbackText: {
    color: "#166534",
  },
});