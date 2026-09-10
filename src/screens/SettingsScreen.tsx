import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { SegmentedControl } from "../components/SegmentedControl";
import { shared, theme } from "../theme";
import type { ConsoleSnapshot, SettingsPatch } from "../types";

function useFlash(): [string | null, (key: string) => void] {
  const [key, setKey] = useState<string | null>(null);
  useEffect(() => {
    if (!key) return;
    const id = setTimeout(() => setKey(null), 1200);
    return () => clearTimeout(id);
  }, [key]);
  return [key, setKey];
}

function Label({ text, saved }: { text: string; saved: boolean }) {
  const colors = theme.colors;
  return (
    <View style={styles.labelRow}>
      <Text style={[styles.meta, { color: colors.muted }]}>{text}</Text>
      {saved ? (
        <Text style={[styles.meta, { color: colors.muted }]}>Saved</Text>
      ) : null}
    </View>
  );
}

function SuffixInput({
  suffix,
  value,
  onChangeText,
  onBlur,
  keyboardType,
  accessibilityLabel,
}: {
  suffix: string;
  value: string;
  onChangeText: (v: string) => void;
  onBlur: () => void;
  keyboardType?: "numeric" | "decimal-pad" | "number-pad";
  accessibilityLabel: string;
}) {
  const colors = theme.colors;
  return (
    <View style={styles.suffixWrap}>
      <TextInput
        style={[
          shared.input,
          {
            borderColor: colors.rule,
            color: colors.ink,
            backgroundColor: colors.paper,
            paddingRight: 96,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        keyboardType={keyboardType}
        accessibilityLabel={accessibilityLabel}
        placeholderTextColor={colors.muted}
      />
      <Text style={[styles.suffix, { color: colors.muted }]}>{suffix}</Text>
    </View>
  );
}

interface SettingsScreenProps {
  snapshot: ConsoleSnapshot;
  currentUser?: string | null;
  onUpdateSettings: (patch: SettingsPatch) => void;
  onRemoveChat: (chatId: string) => void;
  onBack: () => void;
  onSignOut: () => void;
}

export function SettingsScreen({
  snapshot,
  currentUser,
  onUpdateSettings,
  onRemoveChat,
  onBack,
  onSignOut,
}: SettingsScreenProps) {
  const colors = theme.colors;
  const [flash, setFlash] = useFlash();
  const [age, setAge] = useState(String(snapshot.tokenAgeMinutes));
  const [maxPct, setMaxPct] = useState(String(snapshot.maxTradePct));
  const [polling, setPolling] = useState(String(snapshot.pollingSeconds));

  useEffect(() => setAge(String(snapshot.tokenAgeMinutes)), [snapshot.tokenAgeMinutes]);
  useEffect(() => setMaxPct(String(snapshot.maxTradePct)), [snapshot.maxTradePct]);
  useEffect(() => setPolling(String(snapshot.pollingSeconds)), [snapshot.pollingSeconds]);

  const persist = (patch: SettingsPatch, key: string) => {
    onUpdateSettings(patch);
    setFlash(key);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.paper }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable onPress={onBack} style={styles.back} accessibilityLabel="Back">
        <ChevronLeft size={20} color={colors.ink} strokeWidth={1.75} />
        <Text style={[styles.body, { color: colors.ink }]}>Back</Text>
      </Pressable>

      <Text style={[styles.title, { color: colors.ink }]}>Settings</Text>

      <View style={{ marginTop: 32, gap: 32 }}>
        <View>
          <Label text="Graduated coin approval" saved={flash === "graduated"} />
          <SegmentedControl
            value={snapshot.graduatedApproval ? "yes" : "no"}
            onChange={(value) =>
              persist({ graduatedApproval: value === "yes" }, "graduated")
            }
            options={[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ]}
          />
          <Text style={[styles.meta, { color: colors.muted, marginTop: 8 }]}>
            If no, a token that has already graduated is skipped.
          </Text>
        </View>

        <View>
          <Label text="Token age" saved={flash === "age"} />
          <SuffixInput
            suffix="minutes"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            accessibilityLabel="Token age in minutes"
            onBlur={() => {
              const n = Number(age);
              if (!Number.isFinite(n) || n === snapshot.tokenAgeMinutes) {
                setAge(String(snapshot.tokenAgeMinutes));
                return;
              }
              persist({ tokenAgeMinutes: n }, "age");
            }}
          />
          <Text style={[styles.meta, { color: colors.muted, marginTop: 8 }]}>
            A token older than this is skipped, even if everything else passes.
          </Text>
        </View>

        <View>
          <Label
            text="ETH trade amount max percentage"
            saved={flash === "max"}
          />
          <SuffixInput
            suffix="%"
            value={maxPct}
            onChangeText={setMaxPct}
            keyboardType="decimal-pad"
            accessibilityLabel="ETH trade amount max percentage"
            onBlur={() => {
              const n = Number(maxPct);
              if (!Number.isFinite(n) || n === snapshot.maxTradePct) {
                setMaxPct(String(snapshot.maxTradePct));
                return;
              }
              persist({ maxTradePct: n }, "max");
            }}
          />
          <Text style={[styles.meta, { color: colors.muted, marginTop: 8 }]}>
            The bot will not spend more than this share of the wallet on a single
            trade.
          </Text>
        </View>

        <View>
          <Label text="Polling time" saved={flash === "polling"} />
          <SuffixInput
            suffix="seconds"
            value={polling}
            onChangeText={setPolling}
            keyboardType="number-pad"
            accessibilityLabel="Polling time in seconds"
            onBlur={() => {
              const n = Number(polling);
              if (!Number.isFinite(n) || n === snapshot.pollingSeconds) {
                setPolling(String(snapshot.pollingSeconds));
                return;
              }
              persist({ pollingSeconds: n }, "polling");
            }}
          />
          <Text style={[styles.meta, { color: colors.muted, marginTop: 8 }]}>
            How often the scanner looks for a new token.
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 32 }}>
        <Text style={[styles.meta, { color: colors.muted, marginBottom: 8 }]}>
          Telegram notification chats
        </Text>
        <Text style={[styles.meta, { color: colors.muted, marginBottom: 16 }]}>
          Anyone who starts a chat with the bot receives notifications. Remove a
          chat to stop sending to it.
        </Text>
        {snapshot.chats.length === 0 ? (
          <Text style={[styles.body, { color: colors.muted }]}>
            No chats yet.
          </Text>
        ) : null}
        {snapshot.chats.map((chat, index) => (
          <View
            key={chat.id}
            style={[
              styles.chatRow,
              {
                borderBottomColor: colors.rule,
                borderTopColor: colors.rule,
                borderTopWidth: index === 0 ? StyleSheet.hairlineWidth : 0,
              },
            ]}
          >
            <Text style={[styles.body, { color: colors.ink, flex: 1 }]}>
              {chat.name ?? chat.chatId}
            </Text>
            <Pressable onPress={() => onRemoveChat(chat.id)}>
              <Text style={[styles.body, { color: colors.ink }]}>Remove</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View
        style={{
          marginTop: 48,
          paddingTop: 24,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.rule,
        }}
      >
        {currentUser ? (
          <Text style={[styles.meta, { color: colors.muted, marginBottom: 12 }]}>
            Signed in as{" "}
            <Text style={{ color: colors.ink, fontWeight: "500" }}>
              {currentUser}
            </Text>
          </Text>
        ) : null}
        <Pressable
          onPress={onSignOut}
          style={styles.signOutBtn}
          accessibilityLabel="Sign out"
        >
          <Text style={[styles.body, { color: colors.loss }]}>Sign out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  back: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
  },
  title: {
    marginTop: 24,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "500",
  },
  labelRow: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 12,
  },
  suffixWrap: {
    position: "relative",
    justifyContent: "center",
  },
  suffix: {
    position: "absolute",
    right: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  chatRow: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  meta: {
    fontSize: 14,
    lineHeight: 20,
  },
  signOutBtn: {
    minHeight: 44,
    justifyContent: "center",
  },
});
