import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Settings } from "lucide-react-native";
import { ConfigRows } from "../components/ConfigRows";
import { CopyAddress } from "../components/CopyAddress";
import { PositionCard } from "../components/PositionCard";
import { SegmentedControl } from "../components/SegmentedControl";
import {
  formatAddress,
  formatAge,
  formatEth,
  formatIstClock,
  formatUsd,
} from "../formatters";
import { shared, theme } from "../theme";
import type { ConsoleSnapshot, SettingsPatch, TradeMode } from "../types";

function statusCaption(snapshot: ConsoleSnapshot): string {
  if (snapshot.running && snapshot.runningSince) {
    return `since ${formatIstClock(snapshot.runningSince)}`;
  }
  if (!snapshot.running && snapshot.stoppedSince) {
    return `since ${formatIstClock(snapshot.stoppedSince)}`;
  }
  return "since just now";
}

interface TradingScreenProps {
  snapshot: ConsoleSnapshot;
  onUpdateSettings: (patch: SettingsPatch) => void;
  onToggleRunning: () => void;
  onBuyDetected: () => void;
  onSellPosition: () => void;
  onNavigateSettings: () => void;
  onSetMode: (mode: TradeMode) => void;
}

export function TradingScreen({
  snapshot,
  onUpdateSettings,
  onToggleRunning,
  onBuyDetected,
  onSellPosition,
  onNavigateSettings,
  onSetMode,
}: TradingScreenProps) {
  const colors = theme.colors;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.paper }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.status,
              {
                color: snapshot.running ? colors.gain : colors.muted,
                fontWeight: "500",
              },
            ]}
          >
            {snapshot.running ? "Running" : "Stopped"}
          </Text>
          <Text style={[styles.meta, { color: colors.muted, marginTop: 4 }]}>
            {statusCaption(snapshot)}
          </Text>
        </View>
        <Pressable
          onPress={onNavigateSettings}
          style={styles.settingsBtn}
          accessibilityLabel="Settings"
        >
          <Settings size={24} color={colors.ink} strokeWidth={1.75} />
        </Pressable>
      </View>

      {!snapshot.connected ? (
        <View
          style={[
            styles.offline,
            { borderColor: colors.rule, backgroundColor: colors.paper },
          ]}
        >
          <Text style={[styles.meta, { color: colors.ink }]}>
            Not connected. Values may be out of date.
          </Text>
        </View>
      ) : null}

      {snapshot.position ? (
        <View style={{ marginTop: 32 }}>
          <PositionCard
            snapshot={snapshot}
            now={now}
            onSell={onSellPosition}
          />
        </View>
      ) : (
        <Text style={[styles.body, { color: colors.muted, marginTop: 32 }]}>
          No open position.
        </Text>
      )}

      {!snapshot.position && snapshot.lastError ? (
        <Text style={[styles.meta, { color: colors.loss, marginTop: 12 }]}>
          {snapshot.lastError}
        </Text>
      ) : null}

      <View style={[styles.hairline, { backgroundColor: colors.rule }]} />

      <View>
        <Text style={[styles.body, { color: colors.muted, marginBottom: 12 }]}>
          Mode
        </Text>
        <SegmentedControl
          value={snapshot.mode}
          onChange={onSetMode}
          options={[
            { value: "auto", label: "Auto" },
            { value: "manual", label: "Manual" },
          ]}
        />

        {snapshot.mode === "manual" &&
        snapshot.detected &&
        !snapshot.position ? (
          <View style={{ marginTop: 16 }}>
            <Pressable
              disabled={snapshot.pending?.action === "buy"}
              onPress={onBuyDetected}
              style={({ pressed }) => [
                shared.fillButton,
                {
                  backgroundColor: colors.ink,
                  opacity:
                    snapshot.pending?.action === "buy"
                      ? 0.4
                      : pressed
                        ? 0.9
                        : 1,
                  transform: [
                    {
                      scale:
                        pressed && snapshot.pending?.action !== "buy"
                          ? 0.96
                          : 1,
                    },
                  ],
                },
              ]}
            >
              <Text style={[styles.body, { color: colors.paper }]}>
                {snapshot.pending?.action === "buy"
                  ? "Buying"
                  : `Buy ${snapshot.detected.name}`}
              </Text>
            </Pressable>
            {snapshot.pending?.action === "buy" ? (
              <Text style={[styles.meta, { color: colors.muted, marginTop: 8 }]}>
                {formatAddress(snapshot.pending.hash)}
              </Text>
            ) : null}
          </View>
        ) : null}

        <View style={{ marginTop: 16 }}>
          <Pressable
            onPress={onToggleRunning}
            style={({ pressed }) => [
              shared.fillButton,
              {
                backgroundColor: colors.ink,
                opacity: pressed ? 0.9 : 1,
                transform: [
                  {
                    scale: pressed ? 0.96 : 1,
                  },
                ],
              },
            ]}
          >
            <Text style={[styles.body, { color: colors.paper }]}>
              {snapshot.running ? "Stop bot" : "Start bot"}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.hairline, { backgroundColor: colors.rule }]} />

      <ConfigRows snapshot={snapshot} onSave={onUpdateSettings} />

      <View style={[styles.hairline, { backgroundColor: colors.rule }]} />

      <View style={{ gap: 24 }}>
        <View>
          <Text style={[styles.body, { color: colors.muted }]}>
            Latest detected
          </Text>
          {snapshot.detected ? (
            <>
              <Text
                style={[
                  styles.section,
                  { color: colors.ink, fontWeight: "500", marginTop: 4 },
                ]}
              >
                {snapshot.detected.name} ·{" "}
                {formatAge(snapshot.detected.detectedAt, now)}
              </Text>
              <CopyAddress
                address={snapshot.detected.address}
                style={{ marginTop: 4 }}
              />
            </>
          ) : (
            <Text
              style={[
                styles.section,
                { color: colors.muted, fontWeight: "500", marginTop: 4 },
              ]}
            >
              Nothing detected yet
            </Text>
          )}
        </View>

        <View>
          <Text style={[styles.body, { color: colors.muted }]}>Wallet</Text>
          <Text
            style={[
              styles.section,
              { color: colors.ink, fontWeight: "500", marginTop: 4 },
            ]}
          >
            {formatEth(snapshot.walletEth)} ETH ·{" "}
            {formatUsd(snapshot.walletEth * snapshot.ethUsd)}
          </Text>
        </View>
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
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  offline: {
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  hairline: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 32,
  },
  status: {
    fontSize: 24,
    lineHeight: 29,
  },
  section: {
    fontSize: 20,
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  meta: {
    fontSize: 14,
    lineHeight: 20,
  },
});
