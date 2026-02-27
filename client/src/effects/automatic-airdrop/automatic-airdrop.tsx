import {
  PgCommand,
  PgCommon,
  PgConnection,
  PgSettings,
  PgWallet,
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

    // Execute the `airdrop` command (handles the default amount)
    await PgCommand.airdrop.execute();
  }, [
    PgWallet.onDidChangeBalance,
    PgSettings.onDidChangeWalletAutomaticAirdrop,
  ]);
};
