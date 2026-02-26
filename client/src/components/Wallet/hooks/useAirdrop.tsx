import { useEffect, useState } from "react";

import { Emoji } from "../../../constants";
import {
  PgConnection,
  PgTerminal,
  PgTx,
  PgWallet,
  PgWeb3,
} from "../../../utils";

export const useAirdrop = () => {
  const [airdropAmount, setAirdropAmount] =
    useState<ReturnType<typeof PgConnection["getAirdropAmount"]>>(null);

  useEffect(() => {
    const { dispose } = PgConnection.onDidChangeCurrent(() => {
      setAirdropAmount(PgConnection.getAirdropAmount());
    });
    return dispose;
  }, []);

  const airdrop = async () => {
    await PgTerminal.process(async () => {
      if (!airdropAmount) return;

      PgTerminal.println(PgTerminal.info("Sending an airdrop request..."));

      const conn = PgConnection.current;
      const walletPk = PgWallet.current!.publicKey;

      // Airdrop tx is sometimes successful even when the balance hasn't
      // changed. To solve this, we also check before and after balance instead
      // of only confirming the tx.
      const beforeBalance = await conn.getBalance(walletPk, "processed");

      // Send the airdrop request
      const txHash = await conn.requestAirdrop(
        walletPk,
        PgWeb3.solToLamports(airdropAmount)
      );

      // Allow enough time for balance to update by waiting for confirmation
      await PgTx.confirm(txHash, conn);

      let msg;
      const afterBalance = await conn.getBalance(walletPk, "processed");
      if (afterBalance > beforeBalance) {
        msg = `${Emoji.CHECKMARK} ${PgTerminal.success(
          "Success."
        )} Received ${PgTerminal.bold(airdropAmount.toString())} SOL.`;
      } else {
        msg = `${Emoji.CROSS} ${PgTerminal.error("Error receiving airdrop.")}`;
      }

      PgTerminal.println(msg + "\n");
    });
  };

  return { airdrop, airdropCondition: !!airdropAmount };
};
