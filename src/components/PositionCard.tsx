import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatAddress, formatAge, formatEth, formatPct, formatUsd } from "../formatters";
import { theme } from "../theme";
import type { ConsoleSnapshot } from "../types";
import { CopyAddress } from "./CopyAddress";

export function PositionCard({
  snapshot,
  now,
  onSell,
}: {
  snapshot: ConsoleSnapshot;
  now: number;
  onSell: () => void;
}) {
  const colors = theme.colors;
  const position = snapshot.position;
  if (!position) return null;

  const currentEth = position.currentEth;
  const entryEth = position.entryEth;
  const pnlEth = currentEth - entryEth;
  const pnlPct = entryEth === 0 ? 0 : (pnlEth / entryEth) * 100;
  const positive = pnlPct >= 0;
  const tone = positive ? colors.gain : colors.loss;
  const selling = snapshot.pending?.action === "sell";
  const buying = snapshot.pending?.action === "buy";

  return (
    <View
      style={[
        styles.card,
        { borderColor: colors.rule, backgroundColor: colors.paper },
      ]}
    >
      <Text style={[styles.holding, { color: colors.ink }]}>
        Holding {position.name}
      </Text>
      <CopyAddress address={position.address} style={{ marginTop: 4 }} />

      <Text style={[styles.pnl, { color: tone }]}>{formatPct(pnlPct)}</Text>
      <Text style={[styles.value, { color: tone }]}>
        {formatEth(pnlEth)} ETH · {formatUsd(pnlEth * snapshot.ethUsd)}
      </Text>

      <Text style={[styles.meta, { color: colors.muted, marginTop: 24 }]}>
        Bought {formatAge(position.boughtAt, now)}
      </Text>

      <Pressable
        disabled={selling || buying}
        onPress={onSell}
        style={({ pressed }) => [
          styles.sell,
          {
            borderColor: colors.loss,
            opacity: selling || buying ? 0.4 : pressed ? 0.85 : 1,
            transform: [{ scale: pressed && !selling && !buying ? 0.96 : 1 }],
          },
        ]}
      >
        <Text style={[styles.sellText, { color: colors.loss }]}>
          {selling ? "Selling" : "Sell now"}
        </Text>
      </Pressable>

      {selling && snapshot.pending ? (
        <Text style={[styles.meta, { color: colors.muted, marginTop: 8 }]}>
          {formatAddress(snapshot.pending.hash)}
        </Text>
      ) : null}
      {snapshot.lastError ? (
        <Text style={[styles.meta, { color: colors.loss, marginTop: 8 }]}>
          {snapshot.lastError}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  holding: {
    fontSize: 16,
    lineHeight: 24,
  },
  pnl: {
    marginTop: 24,
    fontSize: 56,
    lineHeight: 56,
    fontWeight: "600",
    letterSpacing: -1.1,
  },
  value: {
    marginTop: 8,
    fontSize: 17,
    lineHeight: 24,
  },
  meta: {
    fontSize: 14,
    lineHeight: 20,
  },
  sell: {
    marginTop: 16,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sellText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
