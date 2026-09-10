import React, { useEffect, useState } from "react";
import { Appearance, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { initialSnapshot } from "./src/initialData";
import { LoginScreen } from "./src/screens/LoginScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { TradingScreen } from "./src/screens/TradingScreen";
import { theme } from "./src/theme";
import type { ConsoleSnapshot, SettingsPatch, TradeMode } from "./src/types";

export default function App() {
  const [snapshot, setSnapshot] = useState<ConsoleSnapshot>(initialSnapshot);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [activeScreen, setActiveScreen] = useState<"trading" | "settings">(
    "trading",
  );
  const [scheme, setScheme] = useState(Appearance.getColorScheme());
  const colors = theme.colors;

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const handleSignIn = (username: string) => {
    setCurrentUser(username);
    setIsAuthenticated(true);
    setActiveScreen("trading");
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveScreen("trading");
  };

  useEffect(() => {
    if (!snapshot.running) return;

    const interval = setInterval(() => {
      setSnapshot((prev) => {
        if (!prev.position) {
          const randomTokens = ["MOONCAT", "FROGE", "CHONK", "GIGA", "PEPU"];
          if (Math.random() < 0.25) {
            const picked =
              randomTokens[Math.floor(Math.random() * randomTokens.length)];
            return {
              ...prev,
              detected: {
                name: picked,
                address:
                  "0x" +
                  Array.from({ length: 40 }, () =>
                    Math.floor(Math.random() * 16).toString(16),
                  ).join(""),
                detectedAt: new Date().toISOString(),
                graduated: Math.random() > 0.7,
              },
            };
          }
          return prev;
        }

        const deltaPct = (Math.random() * 4 - 1.8) / 100;
        const newCurrent = Math.max(
          0.001,
          prev.position.currentEth * (1 + deltaPct),
        );
        const newPeak = Math.max(prev.position.peakEth, newCurrent);
        const stopEth = newPeak * (1 - prev.trailingStopPct / 100);

        if (newCurrent <= stopEth) {
          return {
            ...prev,
            walletEth: prev.walletEth + newCurrent,
            position: null,
            lastError: `Trailing stop hit on ${prev.position.name} at ${newCurrent.toFixed(4)} ETH`,
          };
        }

        return {
          ...prev,
          position: {
            ...prev.position,
            currentEth: newCurrent,
            peakEth: newPeak,
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

  const handleSetMode = (mode: TradeMode) => {
    setSnapshot((prev) => ({ ...prev, mode }));
  };

  const handleToggleRunning = () => {
    setSnapshot((prev) => {
      const nextRunning = !prev.running;
      return {
        ...prev,
        running: nextRunning,
        runningSince: nextRunning ? new Date().toISOString() : null,
        stoppedSince: !nextRunning ? new Date().toISOString() : null,
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
        hash:
          "0x" +
          Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16),
          ).join(""),
      },
    }));

    setTimeout(() => {
      setSnapshot((prev) => {
        const tradeCost = prev.tradeAmountEth;
        return {
          ...prev,
          pending: null,
          walletEth: Math.max(0, prev.walletEth - tradeCost),
          position: {
            name: detectedToken.name,
            address: detectedToken.address,
            boughtAt: new Date().toISOString(),
            entryEth: tradeCost,
            currentEth: tradeCost,
            peakEth: tradeCost,
          },
          detected: null,
          lastError: null,
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
        hash:
          "0x" +
          Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16),
          ).join(""),
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

  return (
    <SafeAreaProvider>
      <View style={[styles.container, { backgroundColor: colors.paper }]}>
        <StatusBar
          barStyle={scheme === "dark" ? "light-content" : "dark-content"}
          backgroundColor={colors.paper}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.mobileWrapper, { backgroundColor: colors.paper }]}>
            {!isAuthenticated ? (
              <LoginScreen onSignIn={handleSignIn} />
            ) : activeScreen === "trading" ? (
              <TradingScreen
                snapshot={snapshot}
                onUpdateSettings={handleUpdateSettings}
                onToggleRunning={handleToggleRunning}
                onBuyDetected={handleBuyDetected}
                onSellPosition={handleSellPosition}
                onNavigateSettings={() => setActiveScreen("settings")}
                onSetMode={handleSetMode}
              />
            ) : (
              <SettingsScreen
                snapshot={snapshot}
                currentUser={currentUser}
                onUpdateSettings={handleUpdateSettings}
                onRemoveChat={handleRemoveChat}
                onBack={() => setActiveScreen("trading")}
                onSignOut={handleSignOut}
              />
            )}
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  mobileWrapper: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
});
