import * as Clipboard from "expo-clipboard";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { formatAddress } from "../formatters";
import { theme } from "../theme";

export function CopyAddress({
  address,
  style,
}: {
  address: string;
  style?: object;
}) {
  const colors = theme.colors;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(id);
  }, [copied]);

  return (
    <Pressable
      onPress={async () => {
        try {
          await Clipboard.setStringAsync(address);
          setCopied(true);
        } catch {
          setCopied(false);
        }
      }}
      style={style}
    >
      <Text style={[styles.text, { color: colors.muted }]}>
        {copied ? "Address copied" : formatAddress(address)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "left",
  },
});
