import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../services/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { ScreenContainer, fullScreenEdges } from "../../components/ScreenContainer";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleRegister = async () => {
    if (!email || !password || !role) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const cleanRole = role.toLowerCase().trim();

      await setDoc(doc(db, "users", userCred.user.uid), {
        email: email.trim(),
        role: cleanRole,
      });

      Alert.alert("Success", "Account created!");
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScreenContainer edges={fullScreenEdges} style={styles.container}>
      <View style={styles.panel}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Choose your role and join the reporting workflow.</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter password"
          style={styles.input}
        />

        <Text style={styles.label}>Select Role</Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue)}
          >
            <Picker.Item label="Student" value="student" />
            <Picker.Item label="Lecturer" value="lecturer" />
            <Picker.Item label="PRL" value="prl" />
            <Picker.Item label="PL" value="pl" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Create Account
          </Text>
        </TouchableOpacity>

        <Text
          onPress={() => navigation.goBack()}
          style={styles.link}
        >
          Already have an account? Login
        </Text>
      </View>
    </ScreenContainer>
  );
}

// STYLES 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#eef6f3",
  },

  panel: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#dbeafe",
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#123c69",
  },

  subtitle: {
    color: "#64748b",
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 22,
  },

  input: {
    borderWidth: 1,
    borderColor: "#dbeafe",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  label: {
    marginBottom: 5,
    fontWeight: "600",
    color: "#1e3a8a",
  },

  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },

  button: {
    backgroundColor: "#123c69",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#0f766e",
    fontWeight: "700",
  },
});
