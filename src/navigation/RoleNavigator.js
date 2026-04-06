// src/navigation/RoleNavigator.js
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/AuthContext";

// Import your screens
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

// Dashboards
import LecturerDashboard from "../screens/lecturer/LecturerDashboard";
import StudentDashboard from "../screens/student/StudentDashboard";
import PLDashboard from "../screens/pl/PLDashboard"; 
import PRLDashboard from "../screens/prl/PRLDashboard";

const Stack = createNativeStackNavigator();

export default function RoleNavigator() {
  const { user, role, loading } = useContext(AuthContext);

  // While checking auth state, show nothing (you could use a Loader)
  if (loading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // No user logged in → show login/register screens
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        // User logged in → show role-based dashboard
        <>
          {role === "lecture" && (
            <Stack.Screen
              name="LecturerDashboard"
              component={LecturerDashboard}
            />
          )}
          {role === "student" && (
            <Stack.Screen
              name="StudentDashboard"
              component={StudentDashboard}
            />
          )}
          {role === "pl" && (
            <Stack.Screen name="AdminDashboard" component={PLDashboard} />
          )}
          {role === "prl" && (
            <Stack.Screen name="PRLDashboard" component={PRLDashboard} />
          )}

          {/* Fallback in case role is unknown */}
          {!["lecture", "student", "pl", "prl"].includes(role) && (
            <Stack.Screen name="Login" component={LoginScreen} />
          )}
        </>
      )}
    </Stack.Navigator>
  );
}