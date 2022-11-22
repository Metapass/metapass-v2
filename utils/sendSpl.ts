import {
  PublicKey,
  Connection,
  Transaction,
  clusterApiUrl,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from '@solana/spl-token';

export const sendSPL = async (
  mint: string,
  fromPubKey: PublicKey,
  toPubKey: PublicKey,
  amount: number,
) => {
  try {
    console.log(mint, fromPubKey, toPubKey, amount);
    const connection = new Connection(clusterApiUrl('mainnet-beta'));
    const token = new PublicKey(mint);
    const transaction = new Transaction();
    const fromTokenAccount = await getAssociatedTokenAddress(token, fromPubKey);
    const toTokenAccount = await getAssociatedTokenAddress(token, toPubKey);
    const toTokenAccountInfo = await connection.getAccountInfo(toTokenAccount);

    // Add create token account instruction if source account not created
    if (!toTokenAccountInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          fromPubKey,
          toTokenAccount,
          toPubKey,
          token,
        ),
      );
    }

    transaction.add(
      createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        fromPubKey,
        Number(amount) * 1000000,
      ),
    );
    console.log(transaction, '--tr');
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubKey;

    return transaction;
  } catch (e) {
    console.log('Error in Send SPL function:', e);
  }
};
