import { BaseData, NftCreator } from "./schema";
import { DataV2, Creator } from "@metaplex-foundation/mpl-token-metadata";

export const getRpcUrlFromEnvName = (name: string): string => {
  if (name.includes("devnet")) {
    return "https://api.devnet.solana.com";
  }
  if (name.includes("testnet")) {
    return "https://api.testnet.solana.com";
  }
  if (name.includes("mainet")) {
    return "https://api.mainnet-beta.solana.com";
  }
  throw new Error("Invalid cluster env name");
};

export const getTatumNftMetadataFromObjectInput = (
  rawInputData: any
): BaseData => {
  //validate input fields
  if (
    !rawInputData.name ||
    !rawInputData.symbol ||
    !rawInputData.uri ||
    !rawInputData.seller_fee_basis_points ||
    !rawInputData.properties ||
    !Array.isArray(rawInputData.properties.creators)
  ) {
    console.error("Invalid input data");
    throw new Error("Invalid input data");
  }

  // Validate creators
  const metaCreators = rawInputData.properties.creators as Array<NftCreator>;
  if (
    metaCreators.some((creator) => !creator.address) ||
    metaCreators.reduce((sum, creator) => creator.share + sum, 0) !== 100
  ) {
    console.error("Invalid input creator");
    throw new Error("Invalid input creator");
  }

  return new BaseData({
    name: rawInputData.name,
    symbol: rawInputData.symbol,
    uri: rawInputData.uri,
    sellerFeeBasisPoints: rawInputData.seller_fee_basis_points,
    creators: (rawInputData.properties.creators as Array<NftCreator>).map(
      (x) => {
        return new NftCreator({ ...x });
      }
    ),
  });
};

export const getMetaplexNftMetadataFromObjectInput = (
  rawInputData: any
): DataV2 => {
  //validate input fields
  const seller_fee_basis_points =
    rawInputData.seller_fee_basis_points !== undefined
      ? rawInputData.seller_fee_basis_points
      : rawInputData.sellerFeeBasisPoints;
  if (
    !rawInputData.name ||
    !rawInputData.image ||
    isNaN(seller_fee_basis_points) ||
    !rawInputData.properties ||
    !Array.isArray(rawInputData.properties.creators)
  ) {
    console.error("Invalid input data");
    throw new Error("Invalid input data");
  }

  // Validate creators
  const metaCreators = rawInputData.properties.creators as Array<Creator>;
  if (
    metaCreators.some((creator) => !creator.address) ||
    metaCreators.reduce((sum, creator) => creator.share + sum, 0) !== 100
  ) {
    console.error("Invalid input creator");
    throw new Error("Invalid input creator");
  }

  return new DataV2({
    symbol: rawInputData.symbol,
    name: rawInputData.name,
    uri:
      rawInputData.uri !== undefined
        ? rawInputData.uri
        : rawInputData.externalURL,
    sellerFeeBasisPoints: seller_fee_basis_points,
    creators: (rawInputData.properties.creators as Array<Creator>).map((x) => {
      return new Creator({
        address: x.address,
        verified: true,
        share: x.share,
      });
    }),
    collection: rawInputData.collection,
    uses: rawInputData.uses,
  });
};

export const delayInS = async (s: number) => {
  return new Promise((resolve) => setTimeout(resolve, s * 10 ** 3));
};
