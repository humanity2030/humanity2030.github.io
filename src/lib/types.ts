export interface WalletConfig {
  address: string;
  name: string;
  description: string;
  color: string;
  chainId?: string;
  hasWalletSupport: boolean;
}

export type Wallet = {
  currency: string;
  wallet: WalletConfig;
};

export type WalletConnectorProps = {
  currency: string;
  wallet: WalletConfig;
};

export interface WalletCardProps {
  currency: string;
  wallet: WalletConfig;
} 