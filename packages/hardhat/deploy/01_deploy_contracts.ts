import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  console.log("🚀 Starting deployment process...");

  try {
    const { deployer } = await (hre as any).getNamedAccounts();
    const { deploy } = (hre as any).deployments;

    console.log("Deploying contracts with the account:", deployer);
    console.log("Network:", hre.network.name);
    console.log("Chain ID:", hre.network.config.chainId);
    console.log("Deployer address:", deployer);

    // Check if we're on Somnia testnet and use existing addresses
    const isSomniaTestnet = hre.network.config.chainId === 50312;
    
    if (isSomniaTestnet) {
      console.log("🌐 Detected Somnia Testnet - checking for existing deployments...");
      
      // Use existing deployed addresses from your testing
      const existingAddresses = {
        ERC20Factory: "0x4F6D41C9F94FdD64c8D82C4eb71a459075E5Ae57",
        DeFiUtils: "0x8860C6081E3Dd957d225FEf12d718495EBa75255",
        ContractAnalyzer: "0xB0170720d8BB751Ed8F7cC071b8D0d9b4e5f501F",
        ContractTemplates: "0x157f375f0112837CA14c8dAFB9dFe26f83a94634",
        MerkleProofValidator: "0x6FA75F5dc94A1Cec18a8a113851231c66e2Bb90f",
        MerkleProof: "0x0f1d9F35bc1631D8C3eB6A2B35A2972bF5061E53"
      };

      console.log("📋 Using existing deployed addresses:");
      Object.entries(existingAddresses).forEach(([name, address]) => {
        console.log(`${name}: ${address}`);
      });

      // Store these addresses for the deployment system
      for (const [name, address] of Object.entries(existingAddresses)) {
        await (hre as any).deployments.save(name, {
          address: address,
          abi: [], // We'll load the ABI from artifacts
        });
      }

      console.log("✅ Existing addresses loaded successfully!");
      return;
    }

    // Deploy ERC20Factory
    console.log("📦 Deploying ERC20Factory...");
    const erc20Factory = await deploy("ERC20Factory", {
      from: deployer,
      args: [],
      log: true,
      autoMine: true,
    });
    console.log("✅ ERC20Factory deployed to:", erc20Factory.address);

    // Deploy DeFiUtils
    console.log("📦 Deploying DeFiUtils...");
    const defiUtils = await deploy("DeFiUtils", {
      from: deployer,
      args: [],
      log: true,
      autoMine: true,
    });
    console.log("✅ DeFiUtils deployed to:", defiUtils.address);

    // Deploy ContractAnalyzer
    console.log("📦 Deploying ContractAnalyzer...");
    const contractAnalyzer = await deploy("ContractAnalyzer", {
      from: deployer,
      args: [],
      log: true,
      autoMine: true,
    });
    console.log("✅ ContractAnalyzer deployed to:", contractAnalyzer.address);

    // Deploy ContractTemplates
    console.log("📦 Deploying ContractTemplates...");
    const contractTemplates = await deploy("ContractTemplates", {
      from: deployer,
      args: [],
      log: true,
      autoMine: true,
    });
    console.log("✅ ContractTemplates deployed to:", contractTemplates.address);

    // Deploy MerkleProofValidator
    console.log("📦 Deploying MerkleProofValidator...");
    const merkleProofValidator = await deploy("MerkleProofValidator", {
      from: deployer,
      args: [],
      log: true,
      autoMine: true,
    });
    console.log("✅ MerkleProofValidator deployed to:", merkleProofValidator.address);

    // Deploy MerkleProof
    console.log("📦 Deploying MerkleProof...");
    const merkleProof = await deploy("MerkleProof", {
      from: deployer,
      args: [deployer], // Set deployer as treasury
      log: true,
      autoMine: true,
    });
    console.log("✅ MerkleProof deployed to:", merkleProof.address);

    console.log("🎉 All contracts deployed successfully!");
    console.log("=== Contract Addresses ===");
    console.log("ERC20Factory:", erc20Factory.address);
    console.log("DeFiUtils:", defiUtils.address);
    console.log("ContractAnalyzer:", contractAnalyzer.address);
    console.log("ContractTemplates:", contractTemplates.address);
    console.log("MerkleProofValidator:", merkleProofValidator.address);
    console.log("MerkleProof:", merkleProof.address);
    console.log("==========================");

    // Only attempt verification on supported networks (not localhost/hardhat)
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
      console.log("⏳ Waiting for a few confirmations before verification...");
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds

      try {
        console.log("🔎 Verifying contracts on block explorer...");

        // Verify ERC20Factory
        await hre.run("verify:verify", {
          address: erc20Factory.address,
          constructorArguments: [],
        });
        console.log("✅ ERC20Factory verified");

        // Verify DeFiUtils
        await hre.run("verify:verify", {
          address: defiUtils.address,
          constructorArguments: [],
        });
        console.log("✅ DeFiUtils verified");

        // Verify ContractAnalyzer
        await hre.run("verify:verify", {
          address: contractAnalyzer.address,
          constructorArguments: [],
        });
        console.log("✅ ContractAnalyzer verified");

        // Verify ContractTemplates
        await hre.run("verify:verify", {
          address: contractTemplates.address,
          constructorArguments: [],
        });
        console.log("✅ ContractTemplates verified");

        // Verify MerkleProofValidator
        await hre.run("verify:verify", {
          address: merkleProofValidator.address,
          constructorArguments: [],
        });
        console.log("✅ MerkleProofValidator verified");

        // Verify MerkleProof
        await hre.run("verify:verify", {
          address: merkleProof.address,
          constructorArguments: [deployer],
        });
        console.log("✅ MerkleProof verified");

        console.log("🎉 All contracts verified successfully!");
      } catch (error) {
        console.log("⚠️ Verification failed:", error);
        console.log("You can verify manually using the addresses above");
      }
    } else {
      console.log("ℹ️ Skipping verification on local network");
    }
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
};

export default func;
func.tags = [
  "ERC20Factory",
  "DeFiUtils",
  "ContractAnalyzer",
  "ContractTemplates",
  "MerkleProofValidator",
  "MerkleProof",
];
