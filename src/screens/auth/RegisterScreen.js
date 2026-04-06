import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../services/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleRegister = async () => {
    // Basic validation
    if (!email || !password || !role) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters.");
      return;
    }

    try {
      console.log("Registering user:", email, role);
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", userCred.user.uid);

      // Save additional data in Firestore
      await setDoc(doc(db, "users", userCred.user.uid), {
        email,
        role,
      });

      Alert.alert("Success", "Account created successfully!");
      navigation.goBack(); // go back to login

    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Enter your password"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Text>Role (student/lecturer/prl/pl)</Text>
      <TextInput
        value={role}
        onChangeText={setRole}
        placeholder="Enter your role"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Button title="Register" onPress={handleRegister} />

      <Text
        onPress={() => navigation.goBack()}
        style={{ marginTop: 20, color: "blue" }}
      >
        Already have an account? Login
      </Text>
    </View>
  );
}