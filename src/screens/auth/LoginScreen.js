import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { ScreenContainer, fullScreenEdges } from "../../components/ScreenContainer";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Email and password cannot be empty.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      console.log("Login successful:", userCredential.user);

    
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <ScreenContainer edges={fullScreenEdges} style={styles.container}>
      <View style={styles.panel}>
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>LR</Text>
        </View>

        <Text style={styles.title}>LUCT Reporting</Text>
        <Text style={styles.subtitle}>Sign in to manage reports, attendance, and feedback.</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter your password"
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text
          onPress={() => navigation.navigate("Register")}
          style={styles.link}
        >
          Don't have an account? Register
        </Text>
      </View>
    </ScreenContainer>
  );
}

//STYLE
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

  brandMark: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#123c69",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  brandMarkText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
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

  button: {
    backgroundColor: "#123c69",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontWeight: "800",
  },

  link: {
    marginTop: 20,
    color: "#0f766e",
    textAlign: "center",
    fontWeight: "700",
  },
});
