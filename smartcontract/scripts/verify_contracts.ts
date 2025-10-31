import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Starting contract verification process...");

  // Contract addresses on Somnia Testnet
  const contracts = {
    ERC20Factory: "0x4F6D41C9F94FdD64c8D82C4eb71a459075E5Ae57",
    ERC721Factory: "0x915C81F20f8A6fFe4A19342B2C54Bf0840C37B9A",
    ERC1155Factory: "0xaA65bf9B2c119Df5043498f0C78D7FC1a6F6F4B4",
    DeFiUtils: "0x8860C6081E3Dd957d225FEf12d718495EBa75255",
    ContractAnalyzer: "0xB0170720d8BB751Ed8F7cC071b8D0d9b4e5f501F",
    ContractTemplates: "0x157f375f0112837CA14c8dAFB9dFe26f83a94634",
    MerkleProofValidator: "0x6FA75F5dc94A1Cec18a8a113851231c66e2Bb90f",
    MerkleProofGenerator: "0x0f1d9F35bc1631D8C3eB6A2B35A2972bF5061E53",
  };

  console.log("📋 Contract addresses to verify:");
  Object.entries(contracts).forEach(([name, address]) => {
    console.log(`  ${name}: ${address}`);
  });

  console.log("\n🚀 To verify contracts, run:");
  console.log("npx hardhat verify --network somniaTestnet <CONTRACT_ADDRESS> [CONSTRUCTOR_ARGS]");
  
  console.log("\n📖 Example commands:");
  console.log(`npx hardhat verify --network somniaTestnet ${contracts.ERC20Factory}`);
  console.log(`npx hardhat verify --network somniaTestnet ${contracts.ERC721Factory}`);
  console.log(`npx hardhat verify --network somniaTestnet ${contracts.ERC1155Factory}`);
  
  console.log("\n✅ Contract verification setup complete!");
  console.log("💡 Make sure you have SOMNIA_API_KEY set in your .env file");
  console.log("🌐 Contracts will be verified on Shannon Explorer: https://shannon-explorer.somnia.network/");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });

