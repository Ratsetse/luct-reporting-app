import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text } from "react-native";
import { AuthContext } from "../context/AuthContext";

// ================= STUDENT =================
import StudentDashboard from "../screens/student/StudentDashboard";
import StudentAttendanceScreen from "../screens/student/AttendanceScreen";
import RatingScreen from "../screens/student/RatingScreen";
import StudentMonitoringScreen from "../screens/student/LecturerMonitoringScreen";

// ================= LECTURER =================
import LecturerDashboard from "../screens/lecturer/LecturerDashboard";
import CreateReportScreen from "../screens/lecturer/CreateReportScreen";
import LecturerAttendanceScreen from "../screens/lecturer/AttendanceScreen";
import LecturerRatingsScreen from "../screens/lecturer/RatingsScreen";
import LecturerMonitoringScreen from "../screens/lecturer/MonitoringScreen";

// ================= PRL =================
import PRLDashboard from "../screens/prl/PRLDashboard";
import ViewReportsScreen from "../screens/prl/ViewReportsScreen";
import ReportDetailsScreen from "../screens/prl/ReportDetailsScreen";
import PRLReportsScreen from "../screens/prl/PRLReportsScreen";
import PRLLecturersScreen from "../screens/prl/PRLLecturersScreen";
import PRLMonitoringScreen from "../screens/prl/PRLMonitoringScreen";
import PRLClassesScreen from "../screens/prl/PRLClassesScreen";

// ================= PL =================
import PLDashboard from "../screens/pl/PLDashboard";
import ManageCoursesScreen from "../screens/pl/ManageCoursesScreen";
import AssignLecturerScreen from "../screens/pl/AssignLecturerScreen";
import PLCoursesScreen from "../screens/pl/PLCoursesScreen";
import PLRatingsScreen from "../screens/pl/PLRatingsScreen";

const Stack = createNativeStackNavigator();

function ErrorScreen({ role }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18 }}>❌ Role not recognized</Text>
      <Text style={{ marginTop: 10 }}>Current role: {role}</Text>
    </View>
  );
}

export default function RoleNavigator() {
  const { role } = useContext(AuthContext);

  const normalizedRole = role?.toLowerCase()?.trim() || "";

  const isLecturer =
    normalizedRole === "lecturer" || normalizedRole === "lecture";

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>

      {/* ================= STUDENT ================= */}
      {normalizedRole === "student" && (
        <>
          <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
          <Stack.Screen name="StudentAttendance" component={StudentAttendanceScreen} />
          <Stack.Screen name="StudentRating" component={RatingScreen} />
          <Stack.Screen name="StudentMonitoring" component={StudentMonitoringScreen} />
        </>
      )}

      {/* ================= LECTURER ================= */}
      {isLecturer && (
        <>
          <Stack.Screen name="LecturerDashboard" component={LecturerDashboard} />
          <Stack.Screen name="LecturerCreateReport" component={CreateReportScreen} />
          <Stack.Screen name="LecturerAttendance" component={LecturerAttendanceScreen} />
          <Stack.Screen name="LecturerRatings" component={LecturerRatingsScreen} />
          <Stack.Screen name="LecturerMonitoring" component={LecturerMonitoringScreen} />
        </>
      )}

      {/* ================= PRL ================= */}
      {normalizedRole === "prl" && (
        <>
          <Stack.Screen name="PRLDashboard" component={PRLDashboard} />
          <Stack.Screen name="PRLReports" component={PRLReportsScreen} />
          <Stack.Screen name="PRLViewReports" component={ViewReportsScreen} />
          <Stack.Screen name="PRLReportDetails" component={ReportDetailsScreen} />
          <Stack.Screen name="PRLLecturersScreen" component={PRLLecturersScreen} />
          <Stack.Screen name="PRLMonitoringScreen" component={PRLMonitoringScreen} />
          <Stack.Screen name="PRLClassesScreen" component={PRLClassesScreen} />
        </>
      )}

      {/* ================= PL ================= */}
      {normalizedRole === "pl" && (
        <>
          <Stack.Screen name="PLDashboard" component={PLDashboard} />
          <Stack.Screen name="PLCourses" component={PLCoursesScreen} />
          <Stack.Screen name="PLManageCourses" component={ManageCoursesScreen} />
          <Stack.Screen name="PLAssignLecturer" component={AssignLecturerScreen} />
          <Stack.Screen name="PLMonitoring" component={LecturerMonitoringScreen} />
          <Stack.Screen name="PLViewReports" component={ViewReportsScreen} />
          <Stack.Screen name="PLReportDetails" component={ReportDetailsScreen} />
          <Stack.Screen name="PLRatingsScreen" component={PLRatingsScreen} />
        </>
      )}

      {/* ================= ERROR ================= */}
      {!["student", "lecturer", "lecture", "prl", "pl"].includes(normalizedRole) && (
        <Stack.Screen name="Error">
          {() => <ErrorScreen role={normalizedRole || "undefined"} />}
        </Stack.Screen>
      )}

    </Stack.Navigator>
  );
}