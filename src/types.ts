export type TradeMode = "auto" | "manual";
export type PendingAction = "buy" | "sell";

export type DetectedToken = {
  name: string;
  address: string;
  detectedAt: string;
  graduated: boolean;
};

export type OpenPosition = {
  name: string;
  address: string;
  boughtAt: string;
  entryEth: number;
  peakEth: number;
  currentEth: number;
};

export type PendingTrade = {
  action: PendingAction;
  hash: string;
};

export type TelegramChat = {
  id: string;
  name: string | null;
  chatId: string;
};

export type ConsoleSnapshot = {
  running: boolean;
  runningSince: string | null;
  stoppedSince: string | null;
  connected: boolean;
  mode: TradeMode;
  tradeAmountEth: number;
  trailingStopPct: number;
  graduatedApproval: boolean;
  tokenAgeMinutes: number;
  maxTradePct: number;
  pollingSeconds: number;
  walletEth: number;
  ethUsd: number;
  detected: DetectedToken | null;
  position: OpenPosition | null;
  pending: PendingTrade | null;
  lastError: string | null;
  chats: TelegramChat[];
};

export type SettingsPatch = {
  mode?: TradeMode;
  tradeAmountEth?: number;
  trailingStopPct?: number;
  graduatedApproval?: boolean;
  tokenAgeMinutes?: number;
  maxTradePct?: number;
  pollingSeconds?: number;
};
