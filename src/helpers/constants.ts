import { PublicKey } from "@solana/web3.js";
// @ts-ignore
import dotenv from "dotenv";
dotenv.config();

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);
export const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const MEMO_PROGRAM_ID: PublicKey = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

export const solanaClusterUrl = String(process.env.SOLANA_CLUSTER_URL);

export const mongoDbUrl = String(process.env.MONGO_DB_URL);

export const mintAuthorityPrivateKey = String(
  process.env.MINT_AUTHORITY_PRIVATE_KEY
);

export const feePayerPrivateKey = String(process.env.FEE_PAYER_PRIVATE_KEY);

export const landCollectionAddress = String(
  process.env.WIDI_LAND_COLLECTION_ADDRESS
);

export const characterCollectionAddress = String(
  process.env.WIDI_CHARACTER_COLLECTION_ADDRESS
);

export const creator = String(process.env.WIDI_NFT_CREATOR_ADDRESS);

export enum NftCreatedState {
  NFT_CREATED_WITH_WRONG_COLLECTION = -2,
  NFT_CREATED_WITH_WRONG_CREATOR,
  NFT_CREATED_WITHOUT_COLLECTION,
  NFT_CREATED_WITH_UNVERIFIED_COLLECTION,
  NFT_CREATED_WITH_VERIFIED_COLLECTION,
}

export enum NftType {
  NFT_TYPE_LAND,
  NFT_TYPE_CHARACTER,
}
