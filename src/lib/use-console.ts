import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  buyDetected,
  getConsole,
  removeChat,
  sellNow,
  setBotRunning,
  setTradeMode,
  updateSettings,
} from "./console-api";
import type { ConsoleSnapshot, SettingsPatch, TradeMode } from "./console-types";

const KEY = ["console"] as const;

export function useConsole() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: KEY,
    queryFn: () => getConsole(),
    refetchInterval: 2000,
  });

  const apply = (snapshot: ConsoleSnapshot) => {
    queryClient.setQueryData(KEY, snapshot);
  };

  const running = useMutation({
    mutationFn: (next: boolean) => setBotRunning({ data: { running: next } }),
    onSuccess: apply,
  });
  const mode = useMutation({
    mutationFn: (next: TradeMode) => setTradeMode({ data: { mode: next } }),
    onSuccess: apply,
  });
  const sell = useMutation({
    mutationFn: () => sellNow(),
    onSuccess: apply,
  });
  const buy = useMutation({
    mutationFn: () => buyDetected(),
    onSuccess: apply,
  });
  const settings = useMutation({
    mutationFn: (patch: SettingsPatch) => updateSettings({ data: patch }),
    onSuccess: apply,
  });
  const chat = useMutation({
    mutationFn: (id: number) => removeChat({ data: { id } }),
    onSuccess: apply,
  });

  return {
    snapshot: query.data ?? null,
    isPending: query.isPending,
    connected: !query.isError,
    setRunning: running.mutate,
    setMode: mode.mutate,
    sellNow: sell.mutate,
    buyDetected: buy.mutate,
    updateSettings: settings.mutate,
    removeChat: chat.mutate,
    saving: settings.isPending,
  };
}
