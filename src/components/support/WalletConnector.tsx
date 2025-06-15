import { useWalletProviders } from "@/hooks/useWalletProviders";
import type { EIP6963ProviderDetail } from "@/lib/eip6963";
import type { WalletConnectorProps } from "@/lib/types";
import { getTokenSuggestions } from "@/utils/donations";
import * as hooks from "preact/hooks";

export const WalletConnector = ({ currency, wallet }: WalletConnectorProps) => {
  const [isConnecting, setIsConnecting] = hooks.useState(false);
  const [connectedAccount, setConnectedAccount] = hooks.useState<string | null>(
    null,
  );
  const [connectedProvider, setConnectedProvider] =
    hooks.useState<EIP6963ProviderDetail | null>(null);
  const [customAmount, setCustomAmount] = hooks.useState("");
  const [selectedToken, setSelectedToken] = hooks.useState(currency);
  const [error, setError] = hooks.useState<string | null>(null);

  const providers = useWalletProviders();

  const getProvidersForCurrency = () => {
    if (currency === "ETH") {
      const knownEthProviders = [
        "io.metamask",
        "com.coinbase.wallet",
        "io.rabby",
        "io.zerion.wallet",
        "com.brave.wallet",
        "app.phantom",
        "io.xdefi",
        "com.exodus",
        "io.trustwallet",
      ];

      return providers.filter(
        (p) =>
          knownEthProviders.includes(p.info.rdns) ||
          p.info.name.toLowerCase().includes("ethereum") ||
          p.info.name.toLowerCase().includes("metamask") ||
          p.info.name.toLowerCase().includes("brave"),
      );
    }
    if (currency === "SOL") {
      const knownSolProviders = [
        "app.phantom",
        "com.solflare.wallet",
        "com.brave.wallet",
      ];

      return providers.filter(
        (p) =>
          knownSolProviders.includes(p.info.rdns) ||
          p.info.name.toLowerCase().includes("solana") ||
          p.info.name.toLowerCase().includes("phantom") ||
          p.info.name.toLowerCase().includes("brave"),
      );
    }
    return [];
  };

  const connectWallet = async (provider: EIP6963ProviderDetail) => {
    if (isConnecting) return;

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = (await provider.provider.request({
        method: "eth_requestAccounts",
      })) as string[] | undefined;

      if (accounts?.[0]) {
        if (currency === "ETH") {
          try {
            await provider.provider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: wallet.chainId }],
            });
          } catch (switchError) {
            console.warn("Network switch failed:", switchError);
          }
        }

        setConnectedAccount(accounts[0]);
        setConnectedProvider(provider);

        localStorage.setItem(
          `preferred-wallet-${currency}`,
          provider.info.rdns,
        );
      }
    } catch (err) {
      console.error("Connection failed:", err);
      setError(
        (err instanceof Error && err.message) || "Failed to connect wallet",
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setConnectedAccount(null);
    setConnectedProvider(null);
    localStorage.removeItem(`preferred-wallet-${currency}`);
  };

  const sendTransaction = async (amount: string) => {
    if (!connectedProvider || !connectedAccount) {
      setError("No wallet connected");
      return;
    }

    setError(null);

    try {
      if (currency === "ETH") {
        if (selectedToken === "ETH") {
          const value = `0x${(Number.parseFloat(amount) * 1e18).toString(16)}`;

          const txHash = await connectedProvider.provider.request({
            method: "eth_sendTransaction",
            params: [
              {
                from: connectedAccount,
                to: wallet.address,
                value: value,
              },
            ],
          });

          alert(`Transaction sent! Hash: ${txHash}`);
        } else {
          alert(
            "ERC-20 transfers require additional implementation with proper contract interaction",
          );
        }
      } else if (currency === "SOL") {
        alert(
          "Solana transfers require additional Solana-specific implementation",
        );
      }
    } catch (err) {
      console.error("Transaction failed:", err);
      setError((err instanceof Error && err.message) || "Transaction failed");
    }
  };

  const handleQuickDonate = (amount: string) => {
    sendTransaction(amount);
  };

  const handleCustomDonate = () => {
    if (!customAmount.trim()) {
      setError("Please enter an amount");
      return;
    }
    sendTransaction(customAmount);
  };

  hooks.useEffect(() => {
    const preferredRdns = localStorage.getItem(`preferred-wallet-${currency}`);
    if (preferredRdns && providers.length > 0) {
      const preferredProvider = providers.find(
        (p) => p.info.rdns === preferredRdns,
      );
      if (preferredProvider) {
        preferredProvider.provider
          .request({ method: "eth_accounts" })
          .then((accounts: string[]) => {
            if (accounts?.[0]) {
              setConnectedAccount(accounts[0]);
              setConnectedProvider(preferredProvider);
            }
          })
          .catch(() => {});
      }
    }
  }, [providers, currency]);

  const availableProviders = getProvidersForCurrency();

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-center">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {!connectedAccount ? (
        <div className="space-y-3">
          <h4 className="text-slate-300 text-sm">Available Wallets:</h4>
          {availableProviders.length > 0 ? (
            <div className="space-y-2">
              {availableProviders.map((provider) => (
                <button
                  type="button"
                  key={provider.info.uuid}
                  onClick={() => connectWallet(provider)}
                  disabled={isConnecting}
                  className="w-full flex items-center gap-3 bg-slate-800/50 hover:bg-slate-700/50 disabled:opacity-50 border border-slate-600/50 rounded-lg p-3 transition-all"
                >
                  <img
                    src={provider.info.icon}
                    alt={provider.info.name}
                    className="w-8 h-8 rounded"
                  />
                  <span className="text-white font-medium">
                    {isConnecting
                      ? "Connecting..."
                      : `Connect ${provider.info.name}`}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 text-center">
              <p className="text-yellow-300 text-sm">
                {currency === "ETH"
                  ? "Install MetaMask, Coinbase Wallet, or another Ethereum wallet"
                  : "Install Phantom or another Solana wallet"}
              </p>
            </div>
          )}
        </div>
      ) : (
        connectedProvider && (
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={connectedProvider.info.icon}
                  alt={connectedProvider.info.name}
                  className="w-8 h-8 rounded"
                />
                <div>
                  <div className="text-green-400 font-semibold">
                    ✓ {connectedProvider.info.name}
                  </div>
                  <div className="text-slate-400 text-xs font-mono">
                    {connectedAccount.slice(0, 6)}...
                    {connectedAccount.slice(-4)}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={disconnectWallet}
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                Disconnect
              </button>
            </div>

            {currency === "ETH" && (
              <div className="mb-4">
                <h4 className="text-slate-300 text-sm mb-2">Select Token:</h4>
                <div className="flex gap-2 flex-wrap">
                  {["ETH", "USDT", "USDC", "DAI"].map((token) => (
                    <button
                      type="button"
                      key={token}
                      onClick={() => setSelectedToken(token)}
                      className={`px-3 py-1 rounded text-sm transition-all ${
                        selectedToken === token
                          ? "bg-blue-500 text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      {token}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(() => {
              const suggestions = getTokenSuggestions(currency, selectedToken);
              return suggestions ? (
                <div className="mb-4">
                  <h4 className="text-slate-300 text-sm mb-2">Quick Donate:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {suggestions.map(({ amount }) => (
                      <button
                        type="button"
                        key={amount}
                        onClick={() => handleQuickDonate(amount)}
                        className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 py-2 px-3 rounded text-sm transition-all text-center"
                      >
                        <div className="font-semibold">
                          {amount} {selectedToken || currency}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            <div>
              <h4 className="text-slate-300 text-sm mb-2">Custom Amount:</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="any"
                  placeholder={`Amount in ${selectedToken || currency}`}
                  value={customAmount}
                  onChange={(e) =>
                    setCustomAmount((e.target as HTMLInputElement).value)
                  }
                  className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                />
                <button
                  type="button"
                  onClick={handleCustomDonate}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-all"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
