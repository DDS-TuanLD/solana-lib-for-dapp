import { Connection } from "@solana/web3.js";
import { getAllNftOfUser, getAllNftOfUserByCollection } from "../src/lib";

const getAllNft = async () => {
  //input data
  const ownerAddress = "55kn8dz9VhRB7KrXQbtacBPVed6fjEntHCKKcTSiS4Rt";
  const checkingCreator = "CACwqukKJZF2bkAV8wtfUNN3UT5RfpC4xvhvHUQEVxBf";

  //process
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );
  const data = await getAllNftOfUser(connection, ownerAddress, checkingCreator);
  console.log(data);
};

const getNftsOfUserByCollection = async () => {
  //input data
  const ownerAddress = "55kn8dz9VhRB7KrXQbtacBPVed6fjEntHCKKcTSiS4Rt";
  const checkingCreator = "CACwqukKJZF2bkAV8wtfUNN3UT5RfpC4xvhvHUQEVxBf";
  const checkingCollection = "46JRRCqrkR9BNCz6D3XEpZkHh4KsCmTPTwTx7gngrPoe";

  //process
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );
  const data = await getAllNftOfUserByCollection(
    connection,
    ownerAddress,
    checkingCreator,
    checkingCollection
  );
  console.log(data);
};
