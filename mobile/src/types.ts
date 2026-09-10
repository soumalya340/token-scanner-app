export type TradingMode = "auto" | "manual";

export interface ChatConfig {
  id: string;
  chatId: string;
  name?: string;
}

export interface DetectedToken {
  name: string;
  address: string;
  detectedAt: string;
  graduated?: boolean;
}

export interface Position {
  tokenName: string;
  tokenAddress: string;
  boughtAt: string;
  entryEth: number;
  currentEth: number;
  peakEth: number;
  trailingStopEth: number;
}

export interface PendingAction {
  action: "buy" | "sell";
  hash: string;
}

export interface ConsoleSnapshot {
  running: boolean;
  runningSince?: string;
  stoppedSince?: string;
  connected: boolean;
  mode: TradingMode;
  tradeAmountEth: number;
  trailingStopPct: number;
  tokenAgeMinutes: number;
  maxTradePct: number;
  pollingSeconds: number;
  graduatedApproval: boolean;
  dailyTimerOn: boolean;
  dailyTimerStart: string; // e.g. "09:00"
  dailyTimerEnd: string;   // e.g. "21:00"
  inTimerWindow: boolean;
  walletEth: number;
  ethUsd: number;
  position: Position | null;
  detected: DetectedToken | null;
  pending: PendingAction | null;
  lastError: string | null;
  chats: ChatConfig[];
}

export type SettingsPatch = Partial<
  Pick<
    ConsoleSnapshot,
    | "tradeAmountEth"
    | "trailingStopPct"
    | "tokenAgeMinutes"
    | "maxTradePct"
    | "pollingSeconds"
    | "graduatedApproval"
    | "dailyTimerOn"
    | "dailyTimerStart"
    | "dailyTimerEnd"
    | "mode"
  >
>;
