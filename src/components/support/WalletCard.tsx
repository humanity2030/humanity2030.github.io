import { WalletConnector } from "@/components/support/WalletConnector";
import type { WalletCardProps } from "@/lib/types";
import { getTokenSuggestions } from "@/utils/donations";
import { generate } from "lean-qr";
import { makeAsyncComponent } from "lean-qr/extras/react";
import { createElement } from "preact";
import * as hooks from "preact/hooks";

const QR = makeAsyncComponent({ createElement, ...hooks }, generate);

export const WalletCard = ({ currency, wallet }: WalletCardProps) => {
  const [copied, setCopied] = hooks.useState(false);
  const [showQR, setShowQR] = hooks.useState(false);
  const [showManual, setShowManual] = hooks.useState(!wallet.hasWalletSupport);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-all overflow-hidden">
      <div className={`bg-gradient-to-r ${wallet.color} p-4`}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white">{currency}</h3>
            <p className="text-white/90 text-sm">{wallet.name}</p>
          </div>
          {wallet.hasWalletSupport && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowManual(!showManual)}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-sm transition-all"
              >
                {showManual ? "One-Click" : "Manual"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <p className="text-slate-400 text-sm mb-4">{wallet.description}</p>

        {!showManual && wallet.hasWalletSupport ? (
          <WalletConnector currency={currency} wallet={wallet} />
        ) : (
          <div className="space-y-4">
            {(() => {
              const suggestions = getTokenSuggestions(currency);
              return suggestions ? (
                <div>
                  <p className="text-slate-300 text-sm mb-2">
                    Suggested amounts:
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {suggestions.map(({ amount }) => (
                      <span
                        key={amount}
                        className="bg-slate-700/50 text-slate-300 px-2 py-1 rounded text-xs"
                      >
                        {amount} {currency}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowQR(!showQR)}
                className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 px-3 py-2 rounded text-sm transition-all"
              >
                {showQR ? "Hide QR" : "Show QR"}
              </button>
              <button
                type="button"
                onClick={copyToClipboard}
                className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 px-3 py-2 rounded text-sm transition-all"
              >
                {copied ? "✓ Copied!" : "Copy Address"}
              </button>
            </div>

            {showQR && (
              <div className="flex justify-center">
                <div className="bg-white p-3 rounded-lg">
                  <QR content={wallet.address} className="w-32 h-32" />
                </div>
              </div>
            )}

            <div className="bg-slate-900/50 rounded p-3">
              <p className="text-xs text-slate-500 mb-1">Address:</p>
              <p className="text-slate-300 font-mono text-xs break-all">
                {wallet.address}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
