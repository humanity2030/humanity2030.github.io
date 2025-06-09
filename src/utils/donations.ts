export const getTokenSuggestions = (
  currency: string,
  selectedToken?: string
) => {
  const token = selectedToken || currency;

  if (token === "BTC") {
    return [{ amount: "0.0005" }, { amount: "0.002" }, { amount: "0.005" }];
  }

  if (token === "ETH") {
    return [{ amount: "0.01" }, { amount: "0.025" }, { amount: "0.1" }];
  }

  if (token === "SOL") {
    return [{ amount: "0.25" }, { amount: "1" }, { amount: "2.5" }];
  }

  if (["USDT", "USDC", "DAI"].includes(token)) {
    return [{ amount: "20" }, { amount: "100" }, { amount: "500" }];
  }

  if (token === "ZEC") {
    return [{ amount: "1" }, { amount: "3" }, { amount: "8" }];
  }

  return null;
}; 