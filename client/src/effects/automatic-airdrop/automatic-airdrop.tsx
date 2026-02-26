import {
  PgCommon,
  PgConnection,
  PgSettings,
  PgTx,
  PgWallet,
  PgWeb3,
} from "../../utils";

export const automaticAirdrop = () => {
  return PgCommon.batchChanges(async () => {
    if (!PgSettings.wallet.automaticAirdrop) return;

    // Need the current account balance to decide the airdrop
    if (typeof PgWallet.balance !== "number") return;

    // Get airdrop amount based on network (in SOL)
    const airdropAmount = PgConnection.getAirdropAmount();
    if (!airdropAmount) return;

    // Only airdrop if the balance is less than the airdrop amount
    if (PgWallet.balance >= airdropAmount) return;

    // Current wallet should always exist when balance is a number
    if (!PgWallet.current) return;

    try {
      const txHash = await PgConnection.current.requestAirdrop(
        PgWallet.current.publicKey,
        PgWeb3.solToLamports(airdropAmount)
      );
      await PgTx.confirm(txHash);
    } catch (e) {
      console.log("Automatic airdrop failed:", e);
    }
  }, [
    PgWallet.onDidChangeBalance,
    PgSettings.onDidChangeWalletAutomaticAirdrop,
  ]);
};
