import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  LogOut,
  Plus,
  Trash2,
} from "lucide-react-native";
import { theme } from "../theme";
import type { ConsoleSnapshot, SettingsPatch } from "../types";
import { SegmentedControl } from "../components/SegmentedControl";

interface SettingsScreenProps {
  snapshot: ConsoleSnapshot;
  onUpdateSettings: (patch: SettingsPatch) => void;
  onRemoveChat: (chatId: string) => void;
  onAddChat: (chatId: string, name?: string) => void;
  onBack: () => void;
}

export function SettingsScreen({
  snapshot,
  onUpdateSettings,
  onRemoveChat,
  onAddChat,
  onBack,
}: SettingsScreenProps) {
  const [tokenAge, setTokenAge] = useState(String(snapshot.tokenAgeMinutes));
  const [maxTradePct, setMaxTradePct] = useState(String(snapshot.maxTradePct));
  const [pollingSeconds, setPollingSeconds] = useState(String(snapshot.pollingSeconds));
  const [timerStart, setTimerStart] = useState(snapshot.dailyTimerStart);
  const [timerEnd, setTimerEnd] = useState(snapshot.dailyTimerEnd);
  const [newChatId, setNewChatId] = useState("");
  const [newChatName, setNewChatName] = useState("");
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const triggerSaveFlash = (key: string) => {
    setSavedKey(key);
    setTimeout(() => setSavedKey(null), 1500);
  };

  const handleAgeBlur = () => {
    const num = Number(tokenAge);
    if (Number.isFinite(num) && num > 0 && num !== snapshot.tokenAgeMinutes) {
      onUpdateSettings({ tokenAgeMinutes: num });
      triggerSaveFlash("age");
    } else {
      setTokenAge(String(snapshot.tokenAgeMinutes));
    }
  };

  const handleMaxTradeBlur = () => {
    const num = Number(maxTradePct);
    if (Number.isFinite(num) && num > 0 && num <= 100 && num !== snapshot.maxTradePct) {
      onUpdateSettings({ maxTradePct: num });
      triggerSaveFlash("max");
    } else {
      setMaxTradePct(String(snapshot.maxTradePct));
    }
  };

  const handlePollingBlur = () => {
    const num = Number(pollingSeconds);
    if (Number.isFinite(num) && num > 0 && num !== snapshot.pollingSeconds) {
      onUpdateSettings({ pollingSeconds: num });
      triggerSaveFlash("polling");
    } else {
      setPollingSeconds(String(snapshot.pollingSeconds));
    }
  };

  const handleAddChat = () => {
    if (!newChatId.trim()) {
      Alert.alert("Input required", "Please provide a valid Telegram Chat ID");
      return;
    }
    onAddChat(newChatId.trim(), newChatName.trim() || undefined);
    setNewChatId("");
    setNewChatName("");
    triggerSaveFlash("chats");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header with Back Action */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBack}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={20} color={theme.colors.textPrimary} />
          <Text style={styles.backText}>Trading Console</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.screenTitle}>Console Settings</Text>

      {/* Setting 1: Graduated Coin Approval */}
      <View style={styles.settingCard}>
        <View style={styles.labelRow}>
          <Text style={styles.settingLabel}>Graduated Coin Approval</Text>
          {savedKey === "graduated" && (
            <View style={styles.savedPill}>
              <CheckCircle2 size={12} color={theme.colors.gain} />
              <Text style={styles.savedText}>Saved</Text>
            </View>
          )}
        </View>
        <SegmentedControl
          value={snapshot.graduatedApproval ? "yes" : "no"}
          onChange={(val) => {
            onUpdateSettings({ graduatedApproval: val === "yes" });
            triggerSaveFlash("graduated");
          }}
          options={[
            { value: "no", label: "No (Skip Graduated)" },
            { value: "yes", label: "Yes (Allow Graduated)" },
          ]}
        />
        <Text style={styles.settingHint}>
          When set to "No", any token that has already graduated curve migration will be bypassed.
        </Text>
      </View>

      {/* Setting 2: Token Age Limit */}
      <View style={styles.settingCard}>
        <View style={styles.labelRow}>
          <Text style={styles.settingLabel}>Maximum Token Age</Text>
          {savedKey === "age" && (
            <View style={styles.savedPill}>
              <CheckCircle2 size={12} color={theme.colors.gain} />
              <Text style={styles.savedText}>Saved</Text>
            </View>
          )}
        </View>
        <View style={styles.inputWithSuffix}>
          <TextInput
            style={styles.textInput}
            keyboardType="number-pad"
            value={tokenAge}
            onChangeText={setTokenAge}
            onBlur={handleAgeBlur}
            placeholderTextColor={theme.colors.textDim}
          />
          <Text style={styles.suffixText}>minutes</Text>
        </View>
        <Text style={styles.settingHint}>
          Tokens older than this threshold are skipped, even if volume and liquidity match.
        </Text>
      </View>

      {/* Setting 3: Max Trade Percentage */}
      <View style={styles.settingCard}>
        <View style={styles.labelRow}>
          <Text style={styles.settingLabel}>ETH Trade Amount Max Cap</Text>
          {savedKey === "max" && (
            <View style={styles.savedPill}>
              <CheckCircle2 size={12} color={theme.colors.gain} />
              <Text style={styles.savedText}>Saved</Text>
            </View>
          )}
        </View>
        <View style={styles.inputWithSuffix}>
          <TextInput
            style={styles.textInput}
            keyboardType="decimal-pad"
            value={maxTradePct}
            onChangeText={setMaxTradePct}
            onBlur={handleMaxTradeBlur}
            placeholderTextColor={theme.colors.textDim}
          />
          <Text style={styles.suffixText}>% of wallet</Text>
        </View>
        <Text style={styles.settingHint}>
          The bot will not commit more than this percentage of the connected wallet on a single swap.
        </Text>
      </View>

      {/* Setting 4: Polling Interval */}
      <View style={styles.settingCard}>
        <View style={styles.labelRow}>
          <Text style={styles.settingLabel}>Scanner Polling Interval</Text>
          {savedKey === "polling" && (
            <View style={styles.savedPill}>
              <CheckCircle2 size={12} color={theme.colors.gain} />
              <Text style={styles.savedText}>Saved</Text>
            </View>
          )}
        </View>
        <View style={styles.inputWithSuffix}>
          <TextInput
            style={styles.textInput}
            keyboardType="number-pad"
            value={pollingSeconds}
            onChangeText={setPollingSeconds}
            onBlur={handlePollingBlur}
            placeholderTextColor={theme.colors.textDim}
          />
          <Text style={styles.suffixText}>seconds</Text>
        </View>
        <Text style={styles.settingHint}>
          How frequently the scanner queries DEX RPC endpoints for freshly deployed pairs.
        </Text>
      </View>

      {/* Setting 5: Daily Schedule Timer */}
      <View style={styles.settingCard}>
        <View style={styles.labelRow}>
          <Text style={styles.settingLabel}>Daily Schedule Window (IST)</Text>
          <Switch
            value={snapshot.dailyTimerOn}
            onValueChange={(val) => {
              onUpdateSettings({ dailyTimerOn: val });
              triggerSaveFlash("timer");
            }}
            trackColor={{ false: theme.colors.subtleCard, true: theme.colors.gain }}
            thumbColor="#ffffff"
          />
        </View>

        {snapshot.dailyTimerOn && (
          <View style={styles.timerInputsRow}>
            <View style={styles.timerInputCol}>
              <Text style={styles.timerInputLabel}>Starts</Text>
              <TextInput
                style={styles.textInput}
                value={timerStart}
                onChangeText={setTimerStart}
                onBlur={() => {
                  onUpdateSettings({ dailyTimerStart: timerStart });
                  triggerSaveFlash("timer");
                }}
                placeholder="09:00"
                placeholderTextColor={theme.colors.textDim}
              />
            </View>
            <View style={styles.timerInputCol}>
              <Text style={styles.timerInputLabel}>Ends</Text>
              <TextInput
                style={styles.textInput}
                value={timerEnd}
                onChangeText={setTimerEnd}
                onBlur={() => {
                  onUpdateSettings({ dailyTimerEnd: timerEnd });
                  triggerSaveFlash("timer");
                }}
                placeholder="21:00"
                placeholderTextColor={theme.colors.textDim}
              />
            </View>
          </View>
        )}
        <Text style={styles.settingHint}>
          When active, scanner automatically begins and halts within these Indian Standard Time hours.
        </Text>
      </View>

      {/* Setting 6: Telegram Alert Broadcasts */}
      <View style={styles.settingCard}>
        <View style={styles.labelRow}>
          <View style={styles.rowInline}>
            <Bell size={16} color={theme.colors.textPrimary} />
            <Text style={styles.settingLabel}>Telegram Broadcasts</Text>
          </View>
        </View>
        <Text style={styles.settingHint}>
          Any connected Telegram chat receives instant entry, exit, and stop-loss notifications.
        </Text>

        {/* Existing chats */}
        <View style={styles.chatList}>
          {snapshot.chats.map((chat) => (
            <View key={chat.id} style={styles.chatItem}>
              <View>
                <Text style={styles.chatName}>{chat.name || "Telegram Channel"}</Text>
                <Text style={styles.chatId}>ID: {chat.chatId}</Text>
              </View>
              <TouchableOpacity
                onPress={() => onRemoveChat(chat.id)}
                style={styles.chatRemoveBtn}
                accessibilityLabel="Remove chat"
              >
                <Trash2 size={16} color={theme.colors.loss} />
              </TouchableOpacity>
            </View>
          ))}

          {snapshot.chats.length === 0 && (
            <Text style={styles.emptyChatsText}>No notification chats registered yet.</Text>
          )}
        </View>

        {/* Add chat input */}
        <View style={styles.addChatBox}>
          <TextInput
            style={styles.addChatInput}
            value={newChatId}
            onChangeText={setNewChatId}
            placeholder="New Chat ID (e.g. -1001234567)"
            placeholderTextColor={theme.colors.textDim}
          />
          <TextInput
            style={styles.addChatInput}
            value={newChatName}
            onChangeText={setNewChatName}
            placeholder="Label (e.g. Main Alerts)"
            placeholderTextColor={theme.colors.textDim}
          />
          <TouchableOpacity
            style={styles.addChatBtn}
            onPress={handleAddChat}
            activeOpacity={0.8}
          >
            <Plus size={16} color={theme.colors.buttonPrimaryText} />
            <Text style={styles.addChatBtnText}>Add Notification Chat</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Session Action */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          Alert.alert("Sign Out", "Are you sure you want to disconnect this mobile session?", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Sign Out",
              style: "destructive",
              onPress: () => {
                Alert.alert("Signed Out", "Session cleared successfully.");
                onBack();
              },
            },
          ]);
        }}
        style={styles.signOutButton}
      >
        <LogOut size={16} color={theme.colors.textDim} />
        <Text style={styles.signOutText}>Disconnect Session</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 40,
    gap: theme.spacing.lg,
  },
  topHeader: {
    paddingVertical: theme.spacing.sm,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  backText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  settingCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  savedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.gainBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radii.sm,
  },
  savedText: {
    fontSize: 11,
    color: theme.colors.gain,
    fontWeight: "600",
  },
  settingHint: {
    fontSize: 12,
    color: theme.colors.textDim,
    lineHeight: 17,
  },
  inputWithSuffix: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.subtleCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    height: 44,
    color: theme.colors.textPrimary,
    fontSize: 14,
  },
  suffixText: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  timerInputsRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  timerInputCol: {
    flex: 1,
    backgroundColor: theme.colors.subtleCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  timerInputLabel: {
    fontSize: 11,
    color: theme.colors.textDim,
    textTransform: "uppercase",
  },
  chatList: {
    marginTop: theme.spacing.sm,
    gap: 8,
  },
  chatItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.subtleCard,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chatName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  chatId: {
    fontSize: 12,
    color: theme.colors.textDim,
    marginTop: 2,
  },
  chatRemoveBtn: {
    padding: 8,
  },
  emptyChatsText: {
    fontSize: 13,
    color: theme.colors.textDim,
    fontStyle: "italic",
  },
  addChatBox: {
    marginTop: theme.spacing.md,
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  addChatInput: {
    backgroundColor: theme.colors.subtleCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    height: 42,
    paddingHorizontal: 12,
    color: theme.colors.textPrimary,
    fontSize: 13,
  },
  addChatBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: theme.colors.buttonPrimary,
    paddingVertical: 11,
    borderRadius: theme.radii.md,
    marginTop: 4,
  },
  addChatBtnText: {
    color: theme.colors.buttonPrimaryText,
    fontWeight: "700",
    fontSize: 13,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.cardBackground,
  },
  signOutText: {
    color: theme.colors.textDim,
    fontSize: 14,
    fontWeight: "600",
  },
});
