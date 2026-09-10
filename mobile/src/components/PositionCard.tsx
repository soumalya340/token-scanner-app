import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { formatAddress, formatAge, formatEth, formatPercent } from "../formatters";
import { theme } from "../theme";
import type { Position } from "../types";

interface PositionCardProps {
  position: Position;
  onSell: () => void;
  isSelling?: boolean;
}

export function PositionCard({ position, onSell, isSelling }: PositionCardProps) {
  const pnlEth = position.currentEth - position.entryEth;
  const pnlPct = position.entryEth > 0 ? (pnlEth / position.entryEth) * 100 : 0;
  const isProfit = pnlPct >= 0;

  const handleSellPress = () => {
    Alert.alert(
      "Confirm Sell",
      `Are you sure you want to market sell your position in ${position.tokenName} immediately?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sell Now", style: "destructive", onPress: onSell },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.tokenTitle}>{position.tokenName}</Text>
          <Text style={styles.tokenSubtitle}>
            {formatAddress(position.tokenAddress)} · {formatAge(position.boughtAt)}
          </Text>
        </View>

        <View style={[styles.badge, isProfit ? styles.badgeGain : styles.badgeLoss]}>
          <Text style={[styles.badgeText, isProfit ? styles.textGain : styles.textLoss]}>
            {formatPercent(pnlPct)}
          </Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Entry</Text>
          <Text style={styles.metricValue}>{formatEth(position.entryEth)} ETH</Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Current</Text>
          <Text style={[styles.metricValue, isProfit ? styles.textGain : styles.textLoss]}>
            {formatEth(position.currentEth)} ETH
          </Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Peak</Text>
          <Text style={styles.metricValue}>{formatEth(position.peakEth)} ETH</Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Stop at</Text>
          <Text style={[styles.metricValue, styles.textLoss]}>
            {formatEth(position.trailingStopEth)} ETH
          </Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSellPress}
        disabled={isSelling}
        style={[styles.sellButton, isSelling && styles.buttonDisabled]}
      >
        <Text style={styles.sellButtonText}>
          {isSelling ? "Executing Sell…" : "Market Sell Position"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  tokenTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  tokenSubtitle: {
    fontSize: 12,
    color: theme.colors.textDim,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radii.sm,
  },
  badgeGain: {
    backgroundColor: theme.colors.gainBg,
    borderWidth: 1,
    borderColor: theme.colors.gain,
  },
  badgeLoss: {
    backgroundColor: theme.colors.lossBg,
    borderWidth: 1,
    borderColor: theme.colors.loss,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "700",
  },
  textGain: {
    color: theme.colors.gain,
  },
  textLoss: {
    color: theme.colors.loss,
  },
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 11,
    color: theme.colors.textDim,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  sellButton: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.loss,
    paddingVertical: 12,
    borderRadius: theme.radii.md,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  sellButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
});
