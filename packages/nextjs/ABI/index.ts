// Import all contract ABIs
import ContractAnalyzerABI from "./ContractAnalyzer.json";
import ContractTemplatesABI from "./ContractTemplates.json";
import DeFiUtilsABI from "./DeFiUtils.json";
import ERC20FactoryABI from "./ERC20Factory.json";
import ERC721FactoryABI from "./ERC721FactoryABI.json";
import ERC1155FactoryABI from "./ERC1155FactoryABI.json";
import MerkleProofABI from "./MerkleProof.json";
import MerkleProofValidatorABI from "./MerkleProofValidator.json";

// Helper function to get contract address based on network
export const getContractAddress = (contractName: string, network: "somnia" = "somnia") => {
  const contracts = {
    ContractAnalyzer: ContractAnalyzerContract,
    ContractTemplates: ContractTemplatesContract,
    DeFiUtils: DeFiUtilsContract,
    ERC20Factory: ERC20FactoryContract,
    ERC721Factory: ERC721FactoryContract,
    ERC1155Factory: ERC1155FactoryContract,
    MerkleProof: MerkleProofContract,
    MerkleProofValidator: MerkleProofValidatorContract,
  };

  const contract = contracts[contractName as keyof typeof contracts];
  if (!contract) {
    throw new Error(`Contract ${contractName} not found`);
  }

  return contract.addresses[network] || contract.address;
};

// Export individual ABIs for backward compatibility
export {
  ContractAnalyzerABI,
  ContractTemplatesABI,
  DeFiUtilsABI,
  ERC20FactoryABI,
  ERC721FactoryABI,
  ERC1155FactoryABI,
  MerkleProofABI,
  MerkleProofValidatorABI,
};

// Export contract objects with ABI and address
// Somnia Testnet addresses
export const ContractAnalyzerContract = {
  abi: ContractAnalyzerABI,
  address: "0xB0170720d8BB751Ed8F7cC071b8D0d9b4e5f501F", // Somnia Testnet
  addresses: {
    somnia: "0xB0170720d8BB751Ed8F7cC071b8D0d9b4e5f501F",
  },
};

export const ContractTemplatesContract = {
  abi: ContractTemplatesABI,
  address: "0x24AAE861EAd800726066145d998BaECb73e61bD7", // Somnia Testnet
  addresses: {
    somnia: "0x24AAE861EAd800726066145d998BaECb73e61bD7",
  },
};

export const DeFiUtilsContract = {
  abi: DeFiUtilsABI,
  address: "0x875CbF85A375a573645a475Fe9daD9678FA24625", // Somnia Testnet
  addresses: {
    somnia: "0x875CbF85A375a573645a475Fe9daD9678FA24625",
  },
};

export const ERC20FactoryContract = {
  abi: ERC20FactoryABI,
  address: "0x4F6D41C9F94FdD64c8D82C4eb71a459075E5Ae57", // Somnia Testnet
  addresses: {
    somnia: "0x4F6D41C9F94FdD64c8D82C4eb71a459075E5Ae57",
  },
};

export const ERC721FactoryContract = {
  abi: ERC721FactoryABI,
  address: "0x915C81F20f8A6fFe4A19342B2C54Bf0840C37B9A", // Somnia Testnet
  addresses: {
    somnia: "0x915C81F20f8A6fFe4A19342B2C54Bf0840C37B9A",
  },
};

export const ERC1155FactoryContract = {
  abi: ERC1155FactoryABI,
  address: "0xaA65bf9B2c119Df5043498f0C78D7FC1a6F6F4B4", // Somnia Testnet
  addresses: {
    somnia: "0xaA65bf9B2c119Df5043498f0C78D7FC1a6F6F4B4",
  },
};

export const MerkleProofContract = {
  abi: MerkleProofABI,
  address: "0x0f1d9F35bc1631D8C3eB6A2B35A2972bF5061E53", // Somnia Testnet
  addresses: {
    somnia: "0x0f1d9F35bc1631D8C3eB6A2B35A2972bF5061E53",
  },
};

export const MerkleProofValidatorContract = {
  abi: MerkleProofValidatorABI,
  address: "0x6FA75F5dc94A1Cec18a8a113851231c66e2Bb90f", // Somnia Testnet
  addresses: {
    somnia: "0x6FA75F5dc94A1Cec18a8a113851231c66e2Bb90f",
  },
};
