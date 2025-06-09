import { HeartHandshakeIcon } from "lucide-react";
import { usePageMeta } from "@/utils/metadata";
import { wallets } from "@/lib/wallets";
import { WalletCard } from "@/components/support/WalletCard";

export const Support = () => {
  usePageMeta({
    title: "Support AI Alignment Research",
    description:
      "Support independent AI alignment research from the edge. Donate via Bitcoin, Ethereum, Solana, or Zcash to help prepare humanity for the post-AGI world.",
  });

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Support This Research
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
          Your support enables critical AI alignment research from a unique
          perspective and helps ensure this work can continue in a safer
          environment.
        </p>

        <div className="flex items-center px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm mb-4 flex-row gap-2 justify-center">
          <div>
            <HeartHandshakeIcon className="w-4 h-4" />
          </div>
          <div>
            Every cent is vitally important to me. I appreciate the support of
            everyone who has donated or spread the word.
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-white text-center">
          Choose Your Method
        </h2>
        <p className="text-center text-slate-400 mb-8 max-w-2xl mx-auto">
          Connect your preferred wallet for instant donations, or use manual
          transfer with QR codes and addresses.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(wallets).map(([currency, wallet]) => (
            <WalletCard key={currency} currency={currency} wallet={wallet} />
          ))}
        </div>
      </div>

      <div className="text-center mt-12 pt-8 border-t border-slate-700/50">
        <p className="text-slate-400 text-sm mb-4">
          Thank you for supporting independent AI alignment research.
        </p>
        <p className="text-slate-500 text-xs">
          All research findings will be published openly for the benefit of
          humanity's preparation for AGI.
        </p>
      </div>
    </>
  );
};
