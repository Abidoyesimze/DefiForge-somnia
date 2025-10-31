# Manual Contract Verification Guide for Somnia Testnet

## Overview
The DefiForge smart contracts are already deployed on Somnia Testnet, but automatic verification failed due to bytecode mismatch. This guide provides manual verification steps.

## Deployed Contract Addresses

### Core Factory Contracts
- **ERC20 Token Factory**: `0x4F6D41C9F94FdD64c8D82C4eb71a459075E5Ae57`
- **ERC721 NFT Factory**: `0x915C81F20f8A6fFe4A19342B2C54Bf0840C37B9A`
- **ERC1155 Multi-Token Factory**: `0xaA65bf9B2c119Df5043498f0C78D7FC1a6F6F4B4`

### Utility Contracts
- **DeFi Utils Calculator**: `0x8860C6081E3Dd957d225FEf12d718495EBa75255`
- **Contract Analyzer**: `0xB0170720d8BB751Ed8F7cC071b8D0d9b4e5f501F`
- **Contract Templates**: `0x157f375f0112837CA14c8dAFB9dFe26f83a94634`

### Merkle Proof System
- **Merkle Proof Validator**: `0x6FA75F5dc94A1Cec18a8a113851231c66e2Bb90f`
- **Merkle Proof Generator**: `0x0f1d9F35bc1631D8C3eB6A2B35A2972bF5061E53`

## Manual Verification Steps

### Step 1: Access Shannon Explorer
1. Go to [Shannon Explorer](https://shannon-explorer.somnia.network/)
2. Search for any of the contract addresses above

### Step 2: Verify Each Contract
For each contract address:

1. **Click on the contract address** in the explorer
2. **Go to the "Contract" tab**
3. **Click "Verify and Publish"**
4. **Fill in the verification form:**

#### For ERC20Factory (`0x4F6D41C9F94FdD64c8D82C4eb71a459075E5Ae57`):
- **Contract Name**: `ERC20Factory`
- **Compiler Version**: `v0.8.20+commit.a1b79de6`
- **License**: `MIT`
- **Optimization**: `Yes` (200 runs)
- **Source Code**: Copy from `contracts/ERC20Factory.sol`

#### For ERC721Factory (`0x915C81F20f8A6fFe4A19342B2C54Bf0840C37B9A`):
- **Contract Name**: `ERC721Factory`
- **Compiler Version**: `v0.8.20+commit.a1b79de6`
- **License**: `MIT`
- **Optimization**: `Yes` (200 runs)
- **Source Code**: Copy from `contracts/ERC721Factory.sol`

#### For ERC1155Factory (`0xaA65bf9B2c119Df5043498f0C78D7FC1a6F6F4B4`):
- **Contract Name**: `ERC1155Factory`
- **Compiler Version**: `v0.8.20+commit.a1b79de6`
- **License**: `MIT`
- **Optimization**: `Yes` (200 runs)
- **Source Code**: Copy from `contracts/ERC1155Factory.sol`

#### For DeFiUtils (`0x8860C6081E3Dd957d225FEf12d718495EBa75255`):
- **Contract Name**: `DeFiUtils`
- **Compiler Version**: `v0.8.20+commit.a1b79de6`
- **License**: `MIT`
- **Optimization**: `Yes` (200 runs)
- **Source Code**: Copy from `contracts/DeFiUtils.sol`

#### For ContractAnalyzer (`0xB0170720d8BB751Ed8F7cC071b8D0d9b4e5f501F`):
- **Contract Name**: `ContractAnalyzer`
- **Compiler Version**: `v0.8.20+commit.a1b79de6`
- **License**: `MIT`
- **Optimization**: `Yes` (200 runs)
- **Source Code**: Copy from `contracts/ContractAnalyzer.sol`

#### For ContractTemplates (`0x157f375f0112837CA14c8dAFB9dFe26f83a94634`):
- **Contract Name**: `ContractTemplates`
- **Compiler Version**: `v0.8.20+commit.a1b79de6`
- **License**: `MIT`
- **Optimization**: `Yes` (200 runs)
- **Source Code**: Copy from `contracts/ContractTemplates.sol`

#### For MerkleProofValidator (`0x6FA75F5dc94A1Cec18a8a113851231c66e2Bb90f`):
- **Contract Name**: `MerkleProofValidator`
- **Compiler Version**: `v0.8.20+commit.a1b79de6`
- **License**: `MIT`
- **Optimization**: `Yes` (200 runs)
- **Source Code**: Copy from `contracts/MerkleValidator.sol`

#### For MerkleProofGenerator (`0x0f1d9F35bc1631D8C3eB6A2B35A2972bF5061E53`):
- **Contract Name**: `MerkleProof`
- **Compiler Version**: `v0.8.20+commit.a1b79de6`
- **License**: `MIT`
- **Optimization**: `Yes` (200 runs)
- **Constructor Arguments**: The deployer address (treasury)
- **Source Code**: Copy from `contracts/MerkleProof.sol`

### Step 3: Submit Verification
1. **Click "Verify and Publish"**
2. **Wait for verification** (usually takes a few minutes)
3. **Check the contract tab** to confirm verification

## Alternative: Use Hardhat Verify Command
If you want to try automatic verification again:

```bash
# Navigate to hardhat directory
cd packages/hardhat

# Try verifying with specific contract name
npx hardhat verify --network somniaTestnet --contract contracts/ERC20Factory.sol:ERC20Factory 0x4F6D41C9F94FdD64c8D82C4eb71a459075E5Ae57

# For contracts with constructor arguments (like MerkleProof)
npx hardhat verify --network somniaTestnet --contract contracts/MerkleProof.sol:MerkleProof 0x0f1d9F35bc1631D8C3eB6A2B35A2972bF5061E53 <DEPLOYER_ADDRESS>
```

## Troubleshooting

### Bytecode Mismatch Error
If you get a bytecode mismatch error:
1. **Check compiler version** - must match exactly
2. **Check optimization settings** - must match exactly
3. **Check source code** - must be identical to deployed version
4. **Try manual verification** instead of automatic

### Constructor Arguments
For contracts with constructor arguments:
- **MerkleProof**: Requires the deployer address as constructor argument
- **Other contracts**: No constructor arguments needed

## Network Information
- **Network**: Somnia Testnet
- **Chain ID**: 50312
- **RPC URL**: `https://dream-rpc.somnia.network/`
- **Explorer**: [Shannon Explorer](https://shannon-explorer.somnia.network/)

## Status
All contracts are **deployed and functional** on Somnia Testnet. Verification is optional but recommended for transparency and ease of interaction.

