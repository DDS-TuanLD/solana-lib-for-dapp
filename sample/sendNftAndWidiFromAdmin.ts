import {
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { addMemoTransaction, addTransferTokenTransactions } from "../src/lib";
import { getKeypairFromPrivateKey } from "../src/helpers/accounts";

const sendNftAndWidiFromAdmin = async () => {
  //input data
  const adminAddress = "CACwqukKJZF2bkAV8wtfUNN3UT5RfpC4xvhvHUQEVxBf";
  const adminPrivateKey =
    "2ewpZCbMfMbWSWNtEjndJg2XQbAgSFU4qvFLQsmKiNHzs2JiSZaRTEc89ggxAiebimU4b19gz4CB3LNRqv1KN7TK";
  const adminKeypair = getKeypairFromPrivateKey(adminPrivateKey);
  const widiTokenAddress = "2N3ZdvbFCU4SfCKY5Hidm7r7BV66zMfLqgmqaSHRJABm";
  const amountWidi = 10 * 10 ** 9; //widi now has decimal = 9, will change to 18
  const nftAddress = "DVWnnmq4osdpvvy4yD53W6AGxdtYxgptrz8SRbp7R2VJ";
  const receiverAddress = "55kn8dz9VhRB7KrXQbtacBPVed6fjEntHCKKcTSiS4Rt";
  const memo = "SendNftAndWidi";

  //process
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );
  const transaction = new Transaction({
    feePayer: new PublicKey(adminAddress),
  });

  //create transaction to send widi
  await addTransferTokenTransactions(
    connection,
    adminAddress,
    receiverAddress,
    widiTokenAddress,
    BigInt(amountWidi),
    false,
    transaction
  );

  //create transaction to send nft
  await addTransferTokenTransactions(
    connection,
    adminAddress,
    receiverAddress,
    nftAddress,
    BigInt(1),
    true,
    transaction
  );

  //add memo to transaction
  await addMemoTransaction(connection, adminAddress, memo, transaction);

  const signers = [adminKeypair];
  const txId = await sendAndConfirmTransaction(
    connection,
    transaction,
    signers
  );
  console.log("txId: " + txId);
};

sendNftAndWidiFromAdmin();
