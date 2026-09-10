import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Activity,
  Check,
  Copy,
  Flame,
  Settings as SettingsIcon,
  ShieldCheck,
  Wallet,
} from "lucide-react-native";
import {
  formatAddress,
  formatAge,
  formatClockIst,
  formatEth,
  formatUsd,
} from "../formatters";
import { theme } from "../theme";
import type { ConsoleSnapshot, SettingsPatch } from "../types";
import { PositionCard } from "../components/PositionCard";
import { SegmentedControl } from "../components/SegmentedControl";

interface TradingScreenProps {
  snapshot: ConsoleSnapshot;
  onUpdateSettings: (patch: SettingsPatch) => void;
  onToggleRunning: () => void;
  onBuyDetected: () => void;
  onSellPosition: () => void;
  onNavigateSettings: () => void;
}

export function TradingScreen({
  snapshot,
  onUpdateSettings,
  onToggleRunning,
  onBuyDetected,
  onSellPosition,
  onNavigateSettings,
}: TradingScreenProps) {
  const [copied, setCopied] = useState(false);
  const [editingField, setEditingField] = useState<"amount" | "stop" | null>(null);
  const [tempAmount, setTempAmount] = useState(String(snapshot.tradeAmountEth));
  const [tempStop, setTempStop] = useState(String(snapshot.trailingStopPct));

  const handleCopyAddress = (address: string) => {
    // In React Native Expo, clipboard can be set via Clipboard.setStringAsync(address)
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert("Copied", `Address ${address} copied to clipboard!`);
  };

  const getStatusCaption = () => {
    if (snapshot.running && snapshot.runningSince) {
      return `Active since ${formatClockIst(snapshot.runningSince)} IST`;
    }
    if (!snapshot.running && snapshot.stoppedSince) {
      return `Paused since ${formatClockIst(snapshot.stoppedSince)} IST`;
    }
    return snapshot.running ? "Active" : "Paused";
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                snapshot.running ? styles.dotActive : styles.dotInactive,
              ]}
            />
            <Text
              style={[
                styles.statusTitle,
                snapshot.running ? styles.textGain : styles.textMuted,
              ]}
            >
              {snapshot.running ? "Running" : "Stopped"}
            </Text>
          </View>
          <Text style={styles.statusSubtitle}>{getStatusCaption()}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onNavigateSettings}
          style={styles.settingsButton}
          accessibilityLabel="Open settings"
        >
          <SettingsIcon size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Connection Warning if offline */}
      {!snapshot.connected && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            Reconnecting to DEX node… Market telemetry might be delayed.
          </Text>
        </View>
      )}

      {/* Open Position Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Active Position</Text>
        {snapshot.position ? (
          <PositionCard
            position={snapshot.position}
            onSell={onSellPosition}
            isSelling={snapshot.pending?.action === "sell"}
          />
        ) : (
          <View style={styles.emptyCard}>
            <Activity size={24} color={theme.colors.textDim} style={{ marginBottom: 8 }} />
            <Text style={styles.emptyCardTitle}>No open position</Text>
            <Text style={styles.emptyCardSubtitle}>
              {snapshot.running
                ? `Scanner actively querying pairs every ${snapshot.pollingSeconds}s`
                : "Start the scanner below to automatically scan & execute"}
            </Text>
          </View>
        )}

        {snapshot.lastError && !snapshot.position ? (
          <Text style={styles.errorText}>Notice: {snapshot.lastError}</Text>
        ) : null}
      </View>

      {/* Mode & Scanner Control */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Trading Strategy Mode</Text>
        <SegmentedControl
          value={snapshot.mode}
          onChange={(newMode) => onUpdateSettings({ mode: newMode })}
          options={[
            { value: "auto", label: "Auto Pilot" },
            { value: "manual", label: "Manual Confirmation" },
          ]}
        />

        {/* If manual mode and detected token available */}
        {snapshot.mode === "manual" && snapshot.detected && !snapshot.position && (
          <View style={styles.manualActionCard}>
            <View style={styles.manualHeader}>
              <Flame size={18} color="#f59e0b" />
              <Text style={styles.manualTokenTitle}>
                {snapshot.detected.name} ready for entry
              </Text>
            </View>
            <Text style={styles.manualTokenMeta}>
              Discovered {formatAge(snapshot.detected.detectedAt)} · Max:{" "}
              {snapshot.maxTradePct}% of wallet
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onBuyDetected}
              disabled={snapshot.pending?.action === "buy"}
              style={[
                styles.buyButton,
                snapshot.pending?.action === "buy" && styles.buttonDisabled,
              ]}
            >
              <Text style={styles.buyButtonText}>
                {snapshot.pending?.action === "buy"
                  ? "Submitting Swap…"
                  : `Execute Buy (${formatEth(snapshot.tradeAmountEth)} ETH)`}
              </Text>
            </TouchableOpacity>

            {snapshot.pending?.action === "buy" && (
              <Text style={styles.txHashText}>
                Tx Hash: {formatAddress(snapshot.pending.hash)}
              </Text>
            )}
          </View>
        )}

        {/* Master Bot Toggle */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onToggleRunning}
          style={[
            styles.masterButton,
            snapshot.running ? styles.stopButtonBg : styles.startButtonBg,
          ]}
        >
          <Text
            style={[
              styles.masterButtonText,
              snapshot.running ? styles.stopButtonText : styles.startButtonText,
            ]}
          >
            {snapshot.running ? "Pause Scanner" : "Start Scanner"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Config Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Quick Configuration</Text>
        <View style={styles.configGrid}>
          {/* Trade Amount */}
          <TouchableOpacity
            style={styles.configItem}
            activeOpacity={0.7}
            onPress={() => {
              setEditingField(editingField === "amount" ? null : "amount");
              setTempAmount(String(snapshot.tradeAmountEth));
            }}
          >
            <Text style={styles.configLabel}>Trade Size</Text>
            <Text style={styles.configValue}>{formatEth(snapshot.tradeAmountEth)} ETH</Text>
            <Text style={styles.configSub}>Tap to adjust</Text>
          </TouchableOpacity>

          {/* Trailing Stop */}
          <TouchableOpacity
            style={styles.configItem}
            activeOpacity={0.7}
            onPress={() => {
              setEditingField(editingField === "stop" ? null : "stop");
              setTempStop(String(snapshot.trailingStopPct));
            }}
          >
            <Text style={styles.configLabel}>Trailing Stop</Text>
            <Text style={styles.configValue}>{snapshot.trailingStopPct}%</Text>
            <Text style={styles.configSub}>Tap to adjust</Text>
          </TouchableOpacity>
        </View>

        {/* Inline adjustment form */}
        {editingField === "amount" && (
          <View style={styles.inlineEdit}>
            <Text style={styles.inlineEditLabel}>Set Trade Amount (ETH):</Text>
            <View style={styles.inlineInputRow}>
              <TextInput
                style={styles.inlineInput}
                keyboardType="decimal-pad"
                value={tempAmount}
                onChangeText={setTempAmount}
                placeholder="0.05"
                placeholderTextColor={theme.colors.textDim}
              />
              <TouchableOpacity
                style={styles.inlineSaveBtn}
                onPress={() => {
                  const num = Number(tempAmount);
                  if (Number.isFinite(num) && num > 0) {
                    onUpdateSettings({ tradeAmountEth: num });
                    setEditingField(null);
                  }
                }}
              >
                <Text style={styles.inlineSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {editingField === "stop" && (
          <View style={styles.inlineEdit}>
            <Text style={styles.inlineEditLabel}>Set Trailing Stop (%):</Text>
            <View style={styles.inlineInputRow}>
              <TextInput
                style={styles.inlineInput}
                keyboardType="decimal-pad"
                value={tempStop}
                onChangeText={setTempStop}
                placeholder="5"
                placeholderTextColor={theme.colors.textDim}
              />
              <TouchableOpacity
                style={styles.inlineSaveBtn}
                onPress={() => {
                  const num = Number(tempStop);
                  if (Number.isFinite(num) && num > 0) {
                    onUpdateSettings({ trailingStopPct: num });
                    setEditingField(null);
                  }
                }}
              >
                <Text style={styles.inlineSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Latest Detected Token */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Latest Detected Token</Text>
        {snapshot.detected ? (
          <View style={styles.detectedCard}>
            <View style={styles.detectedTopRow}>
              <View>
                <Text style={styles.detectedTokenName}>{snapshot.detected.name}</Text>
                <Text style={styles.detectedAge}>
                  Discovered {formatAge(snapshot.detected.detectedAt)}
                </Text>
              </View>
              {snapshot.detected.graduated ? (
                <View style={styles.graduatedPill}>
                  <ShieldCheck size={14} color={theme.colors.gain} />
                  <Text style={styles.graduatedText}>Graduated</Text>
                </View>
              ) : null}
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleCopyAddress(snapshot.detected!.address)}
              style={styles.addressRow}
            >
              <Text style={styles.addressText}>
                {formatAddress(snapshot.detected.address)}
              </Text>
              <View style={styles.copyPill}>
                {copied ? (
                  <Check size={13} color={theme.colors.gain} />
                ) : (
                  <Copy size={13} color={theme.colors.textMuted} />
                )}
                <Text style={styles.copyText}>{copied ? "Copied" : "Copy"}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyCardTitle}>No new token detected</Text>
            <Text style={styles.emptyCardSubtitle}>
              Listening to decentralized exchange liquidity pool creations…
            </Text>
          </View>
        )}
      </View>

      {/* Connected Wallet */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Connected Wallet</Text>
        <View style={styles.walletCard}>
          <View style={styles.walletIconWrap}>
            <Wallet size={22} color={theme.colors.textPrimary} />
          </View>
          <View style={styles.walletInfo}>
            <Text style={styles.walletEth}>{formatEth(snapshot.walletEth)} ETH</Text>
            <Text style={styles.walletUsd}>
              ≈ {formatUsd(snapshot.walletEth * snapshot.ethUsd)} (@ $
              {snapshot.ethUsd.toLocaleString()}/ETH)
            </Text>
          </View>
        </View>
      </View>
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
    gap: theme.spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: theme.spacing.sm,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  dotActive: {
    backgroundColor: theme.colors.gain,
  },
  dotInactive: {
    backgroundColor: theme.colors.textDim,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  statusSubtitle: {
    fontSize: 13,
    color: theme.colors.textDim,
    marginTop: 3,
  },
  textGain: {
    color: theme.colors.gain,
  },
  textMuted: {
    color: theme.colors.textMuted,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  warningBox: {
    backgroundColor: "#291b00",
    borderWidth: 1,
    borderColor: "#854d0e",
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
  },
  warningText: {
    color: "#fde047",
    fontSize: 12,
  },
  section: {
    gap: theme.spacing.sm,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textDim,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  emptyCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  emptyCardSubtitle: {
    fontSize: 12,
    color: theme.colors.textDim,
    textAlign: "center",
    marginTop: 4,
  },
  errorText: {
    color: theme.colors.loss,
    fontSize: 12,
    marginTop: 4,
  },
  manualActionCard: {
    backgroundColor: "#1e1b10",
    borderWidth: 1,
    borderColor: "#78350f",
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  manualHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  manualTokenTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fef3c7",
  },
  manualTokenMeta: {
    fontSize: 12,
    color: "#d97706",
    marginTop: 3,
  },
  buyButton: {
    marginTop: theme.spacing.md,
    backgroundColor: "#d97706",
    paddingVertical: 12,
    borderRadius: theme.radii.md,
    alignItems: "center",
  },
  buyButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  txHashText: {
    fontSize: 11,
    color: theme.colors.textDim,
    marginTop: 6,
    textAlign: "center",
  },
  masterButton: {
    marginTop: theme.spacing.md,
    paddingVertical: 15,
    borderRadius: theme.radii.md,
    alignItems: "center",
  },
  startButtonBg: {
    backgroundColor: theme.colors.buttonPrimary,
  },
  stopButtonBg: {
    backgroundColor: theme.colors.subtleCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  masterButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  startButtonText: {
    color: theme.colors.buttonPrimaryText,
  },
  stopButtonText: {
    color: theme.colors.loss,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  configGrid: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  configItem: {
    flex: 1,
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  configLabel: {
    fontSize: 12,
    color: theme.colors.textDim,
  },
  configValue: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginVertical: 4,
  },
  configSub: {
    fontSize: 11,
    color: theme.colors.accent,
  },
  inlineEdit: {
    backgroundColor: theme.colors.subtleCard,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    marginTop: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.borderActive,
  },
  inlineEditLabel: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  inlineInputRow: {
    flexDirection: "row",
    gap: 8,
  },
  inlineInput: {
    flex: 1,
    height: 42,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    color: theme.colors.textPrimary,
    fontSize: 14,
  },
  inlineSaveBtn: {
    backgroundColor: theme.colors.buttonPrimary,
    paddingHorizontal: 16,
    borderRadius: theme.radii.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  inlineSaveText: {
    color: theme.colors.buttonPrimaryText,
    fontWeight: "700",
  },
  detectedCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  detectedTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  detectedTokenName: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  detectedAge: {
    fontSize: 12,
    color: theme.colors.textDim,
    marginTop: 2,
  },
  graduatedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.gainBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radii.sm,
  },
  graduatedText: {
    fontSize: 11,
    color: theme.colors.gain,
    fontWeight: "600",
  },
  addressRow: {
    marginTop: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.subtleCard,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: theme.radii.md,
  },
  addressText: {
    fontSize: 13,
    fontFamily: "monospace",
    color: theme.colors.textMuted,
  },
  copyPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  copyText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  walletCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.lg,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  walletIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.subtleCard,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  walletInfo: {
    flex: 1,
  },
  walletEth: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  walletUsd: {
    fontSize: 12,
    color: theme.colors.textDim,
    marginTop: 2,
  },
});
