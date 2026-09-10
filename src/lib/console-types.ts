export type TradeMode = "auto" | "manual";
export type PendingAction = "buy" | "sell";

export type DetectedToken = {
  name: string;
  address: string;
  detectedAt: string;
  graduated: boolean;
  ageMinutes: number;
};

export type OpenPosition = {
  name: string;
  address: string;
  boughtAt: string;
  entryEth: number;
  peakEth: number;
};

export type PendingTrade = {
  action: PendingAction;
  hash: string;
  startedAt: string;
  name: string;
  address: string;
  amountEth: number;
};

export type TelegramChat = {
  id: number;
  name: string | null;
  chatId: string;
};

export type ConsoleSnapshot = {
  running: boolean;
  runningSince: string | null;
  stoppedSince: string | null;
  mode: TradeMode;
  tradeAmountEth: number;
  trailingStopPct: number;
  dailyTimerOn: boolean;
  dailyTimerStart: string;
  dailyTimerEnd: string;
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
  inTimerWindow: boolean;
};

export type SettingsPatch = {
  tradeAmountEth?: number;
  trailingStopPct?: number;
  dailyTimerOn?: boolean;
  dailyTimerStart?: string;
  dailyTimerEnd?: string;
  graduatedApproval?: boolean;
  tokenAgeMinutes?: number;
  maxTradePct?: number;
  pollingSeconds?: number;
};
