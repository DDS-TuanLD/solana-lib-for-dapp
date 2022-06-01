import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { MEMO_PROGRAM_ID } from "./helpers/constants";
import { getTokenAccount } from "./helpers/accounts";
import { Metaplex } from "@metaplex-foundation/js-next";
import { NftCreatedState } from "./helpers/constants";

export const addTransferTokenTransactions = async (
  connection: Connection,
  senderAddress: string,
  receiverAddress: string,
  tokenAddress: string,
  amountToken: bigint,
  isNft: boolean = false,
  transaction: Transaction
): Promise<Transaction> => {
  const senderPublicKey = new PublicKey(senderAddress);
  const receiverPublicKey = new PublicKey(receiverAddress);
  const tokenPublicKey = new PublicKey(tokenAddress);
  const receiverTokenAccountAddress = await getTokenAccount(
    receiverPublicKey,
    tokenPublicKey
  );
  const receiverTokenAccountInfo = await connection.getAccountInfo(
    receiverTokenAccountAddress
  );
  if (receiverTokenAccountInfo == null) {
    transaction.add(
      createAssociatedTokenAccountInstruction(
        senderPublicKey,
        receiverTokenAccountAddress,
        receiverPublicKey,
        tokenPublicKey,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    );
  }
  const senderTokenAccountAddress = await getAssociatedTokenAddress(
    tokenPublicKey,
    senderPublicKey,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  transaction.add(
    createTransferInstruction(
      senderTokenAccountAddress,
      receiverTokenAccountAddress,
      senderPublicKey,
      isNft ? 1 : amountToken,
      [],
      TOKEN_PROGRAM_ID
    )
  );
  return transaction;
};

export const addMemoTransaction = async (
  connection: Connection,
  signerAddress: string,
  memo: string,
  transaction: Transaction
): Promise<Transaction> => {
  const signerPublicKey = new PublicKey(signerAddress);
  transaction.add(
    new TransactionInstruction({
      keys: [
        {
          pubkey: signerPublicKey,
          isSigner: true,
          isWritable: false,
        },
      ],
      programId: MEMO_PROGRAM_ID,
      data: Buffer.from(memo, "utf8"),
    })
  );
  return transaction;
};

export const showMetadata = async (
  connection: Connection,
  mintAddress: string
): Promise<any> => {
  const metaplex = new Metaplex(connection);
  const mintKey = new PublicKey(mintAddress);
  try {
    return await metaplex.nfts().findByMint(mintKey);
  } catch (err) {
    return null;
  }
};

export const getOwnerOfNft = async (
  connection: Connection,
  mintAddress: string
): Promise<string> => {
  const largestAccounts = await connection.getTokenLargestAccounts(
    new PublicKey(mintAddress)
  );
  const largestAccountInfo = await connection.getParsedAccountInfo(
    largestAccounts.value[0].address
  );
  const ownerInfo = Object.create(largestAccountInfo.value);
  return ownerInfo.data.parsed.info.owner;
};

export const verifyNft = async (
  connection: Connection,
  mintAddress: string,
  checkingCreator: string
): Promise<boolean> => {
  const nftMetadata = await showMetadata(connection, mintAddress);
  return (
    nftMetadata.data.creators[0].address == checkingCreator &&
    nftMetadata.data.creators[0].verified == true
  );
};

export const getAllNftOfUser = async (
  connection: Connection,
  ownerAddress: string,
  checkingCreator: string
): Promise<any> => {
  const metaplex = new Metaplex(connection);
  const ownerPublicKey = new PublicKey(ownerAddress);
  const allNftMetadata = await metaplex.nfts().findAllByOwner(ownerPublicKey);
  return allNftMetadata.filter((x) => {
    const creatorData = (x.creators as any)[0];
    return (
      creatorData.address == checkingCreator && creatorData.verified == true
    );
  });
};

export const getAllNftOfUserByCollection = async (
  connection: Connection,
  ownerAddress: string,
  checkingCreator: string,
  checkingCollection: string = ""
): Promise<any> => {
  const metaplex = new Metaplex(connection);
  const ownerPublicKey = new PublicKey(ownerAddress);
  const allNftMetadata = await metaplex.nfts().findAllByOwner(ownerPublicKey);
  return allNftMetadata.filter((x) => {
    const creatorData = (x.creators as any)[0];
    const collectionData =
      x.collection == undefined
        ? { key: "", verified: false }
        : (x.collection as any);
    if (checkingCollection == "") {
      return (
        creatorData.address == checkingCreator && creatorData.verified == true
      );
    }
    return (
      creatorData.address == checkingCreator &&
      creatorData.verified == true &&
      collectionData.key == checkingCollection
    );
  });
};

export const recheckMintNft = async (
  connection: Connection,
  mintAddress: string,
  checkingCreator: string,
  checkingCollection?: string
): Promise<[NftCreatedState, string]> => {
  const nftMetadata = await showMetadata(connection, mintAddress);
  const creatorData = (nftMetadata.data.creators as any)[0];
  if (creatorData.address == checkingCreator && creatorData.verified == true) {
    if (nftMetadata.collection == undefined) {
      return [
        NftCreatedState.NFT_CREATED_WITHOUT_COLLECTION,
        "Nft without collection",
      ];
    }
    const collection = nftMetadata.collection as any;
    if (collection.verified == true && collection.key == checkingCollection) {
      return [
        NftCreatedState.NFT_CREATED_WITH_VERIFIED_COLLECTION,
        "Nft with verified collection",
      ];
    } else if (
      collection.verified == false &&
      collection.key == checkingCollection
    ) {
      return [
        NftCreatedState.NFT_CREATED_WITH_UNVERIFIED_COLLECTION,
        "Nft with unverified collection",
      ];
    }
    return [
      NftCreatedState.NFT_CREATED_WITH_WRONG_COLLECTION,
      "Nft created with wrong collection",
    ];
  }
  return [
    NftCreatedState.NFT_CREATED_WITH_WRONG_CREATOR,
    "Nft created with wrong creator",
  ];
};
