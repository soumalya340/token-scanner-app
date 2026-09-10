import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { formatEth } from "../formatters";
import { shared, theme } from "../theme";
import type { ConsoleSnapshot, SettingsPatch } from "../types";

export function ConfigRows({
  snapshot,
  onSave,
}: {
  snapshot: ConsoleSnapshot;
  onSave: (patch: SettingsPatch) => void;
}) {
  const colors = theme.colors;
  const [open, setOpen] = useState<"amount" | "stop" | null>(null);
  const [amount, setAmount] = useState(String(snapshot.tradeAmountEth));
  const [stop, setStop] = useState(String(snapshot.trailingStopPct));

  useEffect(() => {
    if (open !== "amount") setAmount(String(snapshot.tradeAmountEth));
  }, [open, snapshot.tradeAmountEth]);
  useEffect(() => {
    if (open !== "stop") setStop(String(snapshot.trailingStopPct));
  }, [open, snapshot.trailingStopPct]);

  return (
    <View>
      <Row
        label="Trade amount"
        value={`${formatEth(snapshot.tradeAmountEth)} ETH`}
        open={open === "amount"}
        onToggle={() => setOpen(open === "amount" ? null : "amount")}
      >
        <View>
          <View style={styles.suffixWrap}>
            <TextInput
              style={[
                shared.input,
                styles.inputPad,
                {
                  borderColor: colors.rule,
                  color: colors.ink,
                  backgroundColor: colors.paper,
                },
              ]}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              accessibilityLabel="Trade amount in ETH"
            />
            <Text style={[styles.suffix, { color: colors.muted }]}>ETH</Text>
          </View>
          <ActionPair
            onSave={() => {
              const n = Number(amount);
              if (Number.isFinite(n)) onSave({ tradeAmountEth: n });
              setOpen(null);
            }}
            onCancel={() => setOpen(null)}
          />
        </View>
      </Row>

      <Row
        label="Trailing stop"
        value={`${Number(snapshot.trailingStopPct).toFixed(0)}%`}
        open={open === "stop"}
        last
        onToggle={() => setOpen(open === "stop" ? null : "stop")}
      >
        <View>
          <View style={styles.suffixWrap}>
            <TextInput
              style={[
                shared.input,
                styles.inputPad,
                {
                  borderColor: colors.rule,
                  color: colors.ink,
                  backgroundColor: colors.paper,
                },
              ]}
              keyboardType="decimal-pad"
              value={stop}
              onChangeText={setStop}
              accessibilityLabel="Trailing stop percent"
            />
            <Text style={[styles.suffix, { color: colors.muted }]}>%</Text>
          </View>
          <ActionPair
            onSave={() => {
              const n = Number(stop);
              if (Number.isFinite(n)) onSave({ trailingStopPct: n });
              setOpen(null);
            }}
            onCancel={() => setOpen(null)}
          />
        </View>
      </Row>
    </View>
  );
}

function ActionPair({
  onSave,
  onCancel,
}: {
  onSave: () => void;
  onCancel: () => void;
}) {
  const colors = theme.colors;
  return (
    <View style={styles.actions}>
      <Pressable
        onPress={onSave}
        style={({ pressed }) => [
          shared.fillButton,
          styles.actionHalf,
          {
            backgroundColor: colors.ink,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
        ]}
      >
        <Text style={[styles.body, { color: colors.paper }]}>Save</Text>
      </Pressable>
      <Pressable
        onPress={onCancel}
        style={[
          shared.outlineButton,
          styles.actionHalf,
          { borderColor: colors.rule, backgroundColor: colors.paper },
        ]}
      >
        <Text style={[styles.body, { color: colors.ink }]}>Cancel</Text>
      </Pressable>
    </View>
  );
}

function Row({
  label,
  value,
  open,
  onToggle,
  last,
  children,
}: {
  label: string;
  value: string;
  open: boolean;
  onToggle: () => void;
  last?: boolean;
  children: React.ReactNode;
}) {
  const colors = theme.colors;
  return (
    <View style={!last ? { borderBottomWidth: 1, borderBottomColor: colors.rule } : undefined}>
      <Pressable onPress={onToggle} style={styles.rowButton}>
        <Text style={[styles.body, { color: colors.muted }]}>{label}</Text>
        <Text style={[styles.body, { color: colors.ink }]}>{value}</Text>
      </Pressable>
      {open ? <View style={styles.expand}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  rowButton: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 12,
  },
  expand: {
    paddingBottom: 16,
  },
  suffixWrap: {
    position: "relative",
    justifyContent: "center",
  },
  inputPad: {
    paddingRight: 56,
  },
  suffix: {
    position: "absolute",
    right: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    marginTop: 12,
    flexDirection: "row",
    gap: 12,
  },
  actionHalf: {
    flex: 1,
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
