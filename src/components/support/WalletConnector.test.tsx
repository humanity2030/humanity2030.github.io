import { useWalletProviders } from "@/hooks/useWalletProviders";
import type { WalletConfig } from "@/lib/types";
import { render, screen } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import { type Mock, describe, expect, it, vi } from "vitest";
import { WalletConnector } from "./WalletConnector";

vi.mock("@/hooks/useWalletProviders", () => ({
  useWalletProviders: vi.fn(),
}));

const mockWallet: WalletConfig = {
  address: "0x123",
  chainId: "0x1",
  name: "Mock Wallet",
  description: "A wallet for testing",
  color: "blue",
  hasWalletSupport: true,
};

describe("WalletConnector", () => {
  it("should display a message if no wallet providers are found", () => {
    (useWalletProviders as Mock).mockReturnValue([]);

    render(<WalletConnector currency="ETH" wallet={mockWallet} />);
    expect(
      screen.getByText(
        /Install MetaMask, Coinbase Wallet, or another Ethereum wallet/i,
      ),
    ).toBeInTheDocument();
  });

  it("should display a list of available wallet providers", () => {
    const mockProviders = [
      {
        info: {
          uuid: "1",
          name: "MetaMask",
          icon: "icon.png",
          rdns: "io.metamask",
        },
        provider: { request: vi.fn() },
      },
    ];
    (useWalletProviders as Mock).mockReturnValue(mockProviders);

    render(<WalletConnector currency="ETH" wallet={mockWallet} />);
    expect(screen.getByText(/Connect MetaMask/i)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /MetaMask/i })).toBeInTheDocument();
  });

  it("should connect to a wallet and display the connected account", async () => {
    const mockAccount = "0x1234567890abcdef";
    const mockProvider = {
      info: {
        uuid: "1",
        name: "MetaMask",
        icon: "icon.png",
        rdns: "io.metamask",
      },
      provider: {
        request: vi.fn().mockImplementation(async (args) => {
          if (args.method === "eth_requestAccounts") {
            return [mockAccount];
          }
          return null;
        }),
      },
    };
    (useWalletProviders as Mock).mockReturnValue([mockProvider]);

    render(<WalletConnector currency="ETH" wallet={mockWallet} />);
    const user = userEvent.setup();

    const connectButton = screen.getByRole("button", {
      name: /Connect MetaMask/i,
    });
    await user.click(connectButton);

    expect(mockProvider.provider.request).toHaveBeenCalledWith({
      method: "eth_requestAccounts",
    });

    expect(await screen.findByText(/0x1234...cdef/i)).toBeInTheDocument();
    expect(screen.getByText(/✓ MetaMask/i)).toBeInTheDocument();
  });
});
