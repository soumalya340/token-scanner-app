import React, { useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { theme } from "../theme";

type Option<T extends string> = { value: T; label: string };

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
}) {
  const colors = theme.colors;
  const [width, setWidth] = useState(0);
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const count = options.length || 1;
  const pad = 2;
  const thumbWidth = width > 0 ? (width - pad * 2) / count : 0;

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.track,
        { borderColor: colors.rule, backgroundColor: colors.paper },
      ]}
    >
      {thumbWidth > 0 ? (
        <View
          pointerEvents="none"
          style={[
            styles.thumb,
            {
              backgroundColor: colors.ink,
              width: thumbWidth,
              transform: [{ translateX: index * thumbWidth }],
            },
          ]}
        />
      ) : null}
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={styles.segment}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text
              style={[
                styles.label,
                { color: active ? colors.paper : colors.ink },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    padding: 2,
    flexDirection: "row",
    position: "relative",
    overflow: "hidden",
  },
  thumb: {
    position: "absolute",
    top: 2,
    bottom: 2,
    left: 2,
    borderRadius: 6,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
  },
});
