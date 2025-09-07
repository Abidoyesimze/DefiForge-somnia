import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomicfoundation/hardhat-verify";
// Only import hardhat-deploy if not in CI environment
if (process.env.CI !== "true") {
  require("hardhat-deploy");
  require("hardhat-deploy-ethers");
}
import { task } from "hardhat/config";
import generateTsAbis from "./scripts/generateTsAbis";

// If not set, it uses ours Alchemy's default API key.
// You can get your own at https://dashboard.alchemyapi.io
const providerApiKey = process.env.ALCHEMY_API_KEY;
// If not set, it uses the hardhat account 0 private key.
// You can generate a random account with `yarn generate` or `yarn account:import` to import your existing PK
const deployerPrivateKey = process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY;
// Somnia testnet private key - use your actual private key from .env
const somniaPrivateKey = process.env.SOMNIA_PRIVATE_KEY;
// If not set, it uses our block explorers default API keys.
const etherscanApiKey = process.env.ETHERSCAN_MAINNET_API_KEY;
const etherscanOptimisticApiKey = process.env.ETHERSCAN_OPTIMISTIC_API_KEY;
const basescanApiKey = process.env.BASESCAN_API_KEY;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            // https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options
            runs: 200,
          },
        },
      },
    ],
  },
  defaultNetwork: "localhost",
  ...(process.env.CI !== "true" && {
    namedAccounts: {
      deployer: {
        // By default, it will take the first Hardhat account as the deployer
        default: 0,
      },
    },
  }),
  networks: {
    // Somnia-focused configuration - only Somnia testnet
    hardhat: {
      // Remove mainnet forking for Somnia-focused development
    },
    ...(somniaPrivateKey && {
      somnia: {
        url: "https://dream-rpc.somnia.network/",
        accounts: [somniaPrivateKey],
        chainId: 50312,
      },
    }),
  },
  // Configuration for hardhat-verify plugin - Somnia only
  etherscan: {
    apiKey: `${etherscanApiKey}`,
    customChains: [
      {
        network: "somnia",
        chainId: 50312,
        urls: {
          apiURL: "https://shannon-explorer.somnia.network/api",
          browserURL: "https://shannon-explorer.somnia.network/",
        },
      },
    ],
  },
  // Configuration for etherscan-verify from hardhat-deploy plugin
  ...(process.env.CI !== "true" && {
    verify: {
      etherscan: {
        apiKey: `${etherscanApiKey}`,
      },
    },
  }),
  sourcify: {
    enabled: false,
  },
};

// Extend the deploy task only if hardhat-deploy is available
if (process.env.CI !== "true") {
  task("deploy").setAction(async (args, hre, runSuper) => {
    // Run the original deploy task
    await runSuper(args);
    // Force run the generateTsAbis script
    await generateTsAbis(hre);
  });
}

export default config;
