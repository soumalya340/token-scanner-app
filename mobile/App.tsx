import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initialSnapshot } from "./src/initialData";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { TradingScreen } from "./src/screens/TradingScreen";
import { theme } from "./src/theme";
import type { ConsoleSnapshot, SettingsPatch } from "./src/types";

export default function App() {
  const [snapshot, setSnapshot] = useState<ConsoleSnapshot>(initialSnapshot);
  const [activeScreen, setActiveScreen] = useState<"trading" | "settings">("trading");

  // Live telemetry ticker: updates prices and checks trailing stop
  useEffect(() => {
    if (!snapshot.running) return;

    const interval = setInterval(() => {
      setSnapshot((prev) => {
        if (!prev.position) {
          // Occasionally discover new token if none detected recently
          const randomTokens = ["$CYBER_PEPE", "$DEGEN_ROLL", "$TURBO_DEX", "$QUANTUM"];
          if (Math.random() < 0.25) {
            const picked = randomTokens[Math.floor(Math.random() * randomTokens.length)];
            return {
              ...prev,
              detected: {
                name: picked,
                address: "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
                detectedAt: new Date().toISOString(),
                graduated: Math.random() > 0.7,
              },
            };
          }
          return prev;
        }

        // Modulate current price with gentle crypto volatility (-1.5% to +2.5%)
        const deltaPct = (Math.random() * 4 - 1.8) / 100;
        const newCurrent = Math.max(0.001, prev.position.currentEth * (1 + deltaPct));
        const newPeak = Math.max(prev.position.peakEth, newCurrent);
        const newStop = newPeak * (1 - prev.trailingStopPct / 100);

        // Check if trailing stop triggered
        if (newCurrent <= prev.position.trailingStopEth) {
          const soldEth = newCurrent;
          return {
            ...prev,
            walletEth: prev.walletEth + soldEth,
            position: null,
            lastError: `Trailing stop hit on ${prev.position.tokenName} at ${soldEth.toFixed(4)} ETH`,
          };
        }

        return {
          ...prev,
          position: {
            ...prev.position,
            currentEth: newCurrent,
            peakEth: newPeak,
            trailingStopEth: newStop,
          },
        };
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [snapshot.running]);

  const handleUpdateSettings = (patch: SettingsPatch) => {
    setSnapshot((prev) => ({
      ...prev,
      ...patch,
    }));
  };

  const handleToggleRunning = () => {
    setSnapshot((prev) => {
      const nextRunning = !prev.running;
      return {
        ...prev,
        running: nextRunning,
        runningSince: nextRunning ? new Date().toISOString() : undefined,
        stoppedSince: !nextRunning ? new Date().toISOString() : undefined,
      };
    });
  };

  const handleBuyDetected = () => {
    if (!snapshot.detected || snapshot.position) return;
    const detectedToken = snapshot.detected;

    setSnapshot((prev) => ({
      ...prev,
      pending: {
        action: "buy",
        hash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      },
    }));

    setTimeout(() => {
      setSnapshot((prev) => {
        const tradeCost = prev.tradeAmountEth;
        const entryStop = tradeCost * (1 - prev.trailingStopPct / 100);
        return {
          ...prev,
          pending: null,
          walletEth: Math.max(0, prev.walletEth - tradeCost),
          position: {
            tokenName: detectedToken.name,
            tokenAddress: detectedToken.address,
            boughtAt: new Date().toISOString(),
            entryEth: tradeCost,
            currentEth: tradeCost,
            peakEth: tradeCost,
            trailingStopEth: entryStop,
          },
          detected: null,
        };
      });
    }, 1200);
  };

  const handleSellPosition = () => {
    if (!snapshot.position) return;
    const currentEth = snapshot.position.currentEth;

    setSnapshot((prev) => ({
      ...prev,
      pending: {
        action: "sell",
        hash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      },
    }));

    setTimeout(() => {
      setSnapshot((prev) => ({
        ...prev,
        pending: null,
        walletEth: prev.walletEth + currentEth,
        position: null,
      }));
    }, 1000);
  };

  const handleRemoveChat = (chatId: string) => {
    setSnapshot((prev) => ({
      ...prev,
      chats: prev.chats.filter((c) => c.id !== chatId),
    }));
  };

  const handleAddChat = (chatId: string, name?: string) => {
    setSnapshot((prev) => ({
      ...prev,
      chats: [
        ...prev.chats,
        { id: `c_${Date.now()}`, chatId, name: name || "Notification Chat" },
      ],
    }));
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
        <SafeAreaView style={styles.safeArea}>
          {activeScreen === "trading" ? (
            <TradingScreen
              snapshot={snapshot}
              onUpdateSettings={handleUpdateSettings}
              onToggleRunning={handleToggleRunning}
              onBuyDetected={handleBuyDetected}
              onSellPosition={handleSellPosition}
              onNavigateSettings={() => setActiveScreen("settings")}
            />
          ) : (
            <SettingsScreen
              snapshot={snapshot}
              onUpdateSettings={handleUpdateSettings}
              onRemoveChat={handleRemoveChat}
              onAddChat={handleAddChat}
              onBack={() => setActiveScreen("trading")}
            />
          )}
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
  },
});
