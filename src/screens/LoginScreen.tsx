import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Eye, EyeOff, Lock, User } from "lucide-react-native";
import { shared, theme } from "../theme";

interface LoginScreenProps {
  onSignIn: (username: string) => void;
  initialError?: string | null;
}

export function LoginScreen({ onSignIn, initialError }: LoginScreenProps) {
  const colors = theme.colors;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    const trimmedUser = username.trim();
    if (!trimmedUser) {
      setError("Please enter your username.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError(null);
    setIsLoading(true);

    // Smooth mobile feedback
    setTimeout(() => {
      setIsLoading(false);
      onSignIn(trimmedUser);
    }, 250);
  };

  const handleDemoFill = () => {
    setUsername("trader");
    setPassword("scanner2026");
    setError(null);
  };

  const isFormValid = username.trim().length > 0 && password.length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { backgroundColor: colors.paper }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.ink }]}>
            Token scanner
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Sign in to access scanner settings, monitor live positions, and execute trades.
          </Text>
        </View>

        {error ? (
          <View
            style={[
              styles.errorBox,
              { backgroundColor: colors.paper, borderColor: colors.loss },
            ]}
          >
            <Text style={[styles.meta, { color: colors.loss }]}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: colors.muted }]}>Username</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                id="username"
                style={[
                  shared.input,
                  styles.input,
                  {
                    borderColor: colors.rule,
                    color: colors.ink,
                    backgroundColor: colors.paper,
                  },
                ]}
                value={username}
                onChangeText={(val) => {
                  setUsername(val);
                  if (error) setError(null);
                }}
                placeholder="Enter username"
                placeholderTextColor={colors.muted}
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                autoComplete="username"
                accessibilityLabel="Username"
                returnKeyType="next"
              />
              <View style={styles.inputIcon}>
                <User size={18} color={colors.muted} strokeWidth={1.5} />
              </View>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: colors.muted }]}>Password</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                id="password"
                style={[
                  shared.input,
                  styles.input,
                  styles.passwordInput,
                  {
                    borderColor: colors.rule,
                    color: colors.ink,
                    backgroundColor: colors.paper,
                  },
                ]}
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  if (error) setError(null);
                }}
                placeholder="Enter password"
                placeholderTextColor={colors.muted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="current-password"
                accessibilityLabel="Password"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
              <Pressable
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.eyeButton}
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={18} color={colors.muted} strokeWidth={1.5} />
                ) : (
                  <Eye size={18} color={colors.muted} strokeWidth={1.5} />
                )}
              </Pressable>
            </View>
          </View>

          <View style={styles.submitContainer}>
            <Pressable
              id="login-submit-button"
              disabled={!isFormValid || isLoading}
              onPress={handleSubmit}
              style={({ pressed }) => [
                shared.fillButton,
                {
                  backgroundColor: colors.ink,
                  opacity: !isFormValid || isLoading ? 0.45 : pressed ? 0.9 : 1,
                  transform: [
                    {
                      scale: pressed && isFormValid && !isLoading ? 0.98 : 1,
                    },
                  ],
                },
              ]}
              accessibilityLabel="Sign in"
            >
              <Text style={[styles.buttonText, { color: colors.paper }]}>
                {isLoading ? "Signing in…" : "Sign in"}
              </Text>
            </Pressable>
          </View>

          <View style={[styles.demoRow, { borderTopColor: colors.rule }]}>
            <Text style={[styles.meta, { color: colors.muted }]}>
              Testing credentials?
            </Text>
            <Pressable
              onPress={handleDemoFill}
              style={styles.demoButton}
              accessibilityLabel="Use demo credentials"
            >
              <Text style={[styles.meta, { color: colors.ink, fontWeight: "500" }]}>
                Fill Demo Account
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "500",
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
  },
  errorBox: {
    marginBottom: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  form: {
    gap: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  inputContainer: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    paddingRight: 44,
  },
  passwordInput: {
    paddingRight: 44,
  },
  inputIcon: {
    position: "absolute",
    right: 14,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  eyeButton: {
    position: "absolute",
    right: 6,
    width: 44,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  submitContainer: {
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  demoRow: {
    marginTop: 16,
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  demoButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  meta: {
    fontSize: 14,
    lineHeight: 20,
  },
});
