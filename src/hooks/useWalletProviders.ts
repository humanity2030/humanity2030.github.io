import type {
  EIP6963AnnounceProviderEvent,
  EIP6963ProviderDetail,
} from "@/lib/eip6963";
import * as hooks from "preact/hooks";

export const useWalletProviders = () => {
  const [providers, setProviders] = hooks.useState<EIP6963ProviderDetail[]>([]);

  hooks.useEffect(() => {
    const handleAnnouncement = (event: EIP6963AnnounceProviderEvent) => {
      setProviders((prev) => {
        if (prev.some((p) => p.info.uuid === event.detail.info.uuid)) {
          return prev;
        }
        return [...prev, event.detail];
      });
    };

    window.addEventListener("eip6963:announceProvider", handleAnnouncement);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return () => {
      window.removeEventListener(
        "eip6963:announceProvider",
        handleAnnouncement,
      );
    };
  }, []);

  return providers;
};
