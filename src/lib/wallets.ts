import type { WalletConfig } from "@/lib/types";

export const wallets: Record<string, WalletConfig> = {
  ETH: {
    address: "0xE482597D7A4a3905b9F26449f12526fD76a107F0",
    name: "Ethereum",
    description: "ETH, USDT, USDC, and all ERC-20 tokens",
    color: "from-blue-400 to-blue-600",
    chainId: "0x1",
    hasWalletSupport: true,
  },
  BTC: {
    address: "bc1qrrgcwl354h6aln2vfq56sds7c5zl2vkxqd5006",
    name: "Bitcoin",
    description: "Bitcoin only",
    color: "from-orange-400 to-orange-600",
    hasWalletSupport: false,
  },
  SOL: {
    address: "CjiRP6AX2JbD2RXrCADYGRo4p141dhufQUL3m4617hdp",
    name: "Solana",
    description: "SOL and SPL tokens (USDC, etc.)",
    color: "from-purple-400 to-purple-600",
    hasWalletSupport: true,
  },
  ZEC: {
    address: "t1QFCUSLRwqwfZATiFhCqkA7Wm5fCUqKiyc",
    name: "Zcash",
    description: "Privacy-focused transactions",
    color: "from-yellow-400 to-yellow-600",
    hasWalletSupport: false,
  },
};
