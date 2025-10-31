# ⚡ DefiForge Quick Start

## 🎯 30-Second Setup

```bash
# 1. Setup environment files
cd smartcontract && cp .env.example .env
cd ../frontend && cp .env.local.example .env.local

# 2. Start development (3 terminals)

# Terminal 1 - Local Blockchain
cd smartcontract && npm run chain

# Terminal 2 - Deploy Contracts  
cd smartcontract && npm run deploy

# Terminal 3 - Start Frontend
cd frontend && npm run dev

# 3. Open http://localhost:3000
```

## 📁 Project Structure

```
DefiForge/
├── smartcontract/  → Solidity contracts + Hardhat
└── frontend/       → Next.js web app
```

## 🔑 Essential Commands

### Smart Contracts
```bash
cd smartcontract
npm run compile      # Compile contracts
npm run test         # Run tests
npm run deploy       # Deploy locally
npm run deploy:somnia # Deploy to testnet
```

### Frontend
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
```

## 🌐 Deployed Contracts (Somnia Testnet)

- **ERC20 Factory**: `0x4F6D41C9F94FdD64c8D82C4eb71a459075E5Ae57`
- **ERC721 Factory**: `0x915C81F20f8A6fFe4A19342B2C54Bf0840C37B9A`
- **ERC1155 Factory**: `0xaA65bf9B2c119Df5043498f0C78D7FC1a6F6F4B4`
- **DeFi Utils**: `0x8860C6081E3Dd957d225FEf12d718495EBa75255`

## 🔧 Environment Variables

### smartcontract/.env
```env
SOMNIA_PRIVATE_KEY=your_private_key
SOMNIA_API_KEY=your_api_key
```

### frontend/.env.local
```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
```

## 📚 More Info

- **Full Setup**: See `SETUP.md`
- **Migration Details**: See `MIGRATION_GUIDE.md`
- **Completion Summary**: See `SETUP_COMPLETE.md`

---

**🎉 You're all set! Start building amazing DeFi apps!**

