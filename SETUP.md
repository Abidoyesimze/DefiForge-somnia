# DefiForge Setup Guide

This guide will help you set up and run the DefiForge project locally.

## Prerequisites

- Node.js >= 20.18.3
- npm or yarn
- A Web3 wallet (MetaMask recommended)
- Git

## Project Structure

```
DefiForge/
├── smartcontract/     # Solidity smart contracts (Hardhat)
├── frontend/          # Next.js web application
├── README.md          # Project documentation
└── SETUP.md          # This file
```

## Installation

### 1. Install Smart Contract Dependencies

```bash
cd smartcontract
npm install
```

### 2. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Smart Contract Development

### Compile Contracts

```bash
cd smartcontract
npm run compile
```

### Run Tests

```bash
npm run test
```

### Start Local Blockchain

```bash
npm run chain
```

### Deploy Contracts

For local deployment:
```bash
npm run deploy
```

For Somnia testnet deployment:
```bash
npm run deploy:somnia
```

### Other Useful Commands

- `npm run account` - List accounts
- `npm run account:generate` - Generate new account
- `npm run verify:contracts` - Verify deployed contracts
- `npm run flatten` - Flatten contracts for verification

## Frontend Development

### Start Development Server

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Environment Variables

### Smart Contract (.env in smartcontract/)

Create a `.env` file in the `smartcontract/` directory:

```env
SOMNIA_PRIVATE_KEY=your_private_key_here
SOMNIA_API_KEY=your_api_key_here
SOMNIA_TESTNET_RPC=https://dream-rpc.somnia.network/
COINMARKETCAP_API_KEY=your_coinmarketcap_key (optional)
```

### Frontend (.env.local in frontend/)

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_id
```

## Network Configuration

The project is configured to work with:
- **Local Network**: Hardhat local node (Chain ID: 31337)
- **Somnia Testnet**: Shannon testnet (Chain ID: 50312)

### Somnia Testnet Details

- **RPC URL**: https://dream-rpc.somnia.network/
- **Chain ID**: 50312
- **Block Explorer**: https://shannon-explorer.somnia.network/

## Development Workflow

1. **Start Local Blockchain** (Terminal 1)
   ```bash
   cd smartcontract
   npm run chain
   ```

2. **Deploy Contracts** (Terminal 2)
   ```bash
   cd smartcontract
   npm run deploy
   ```

3. **Start Frontend** (Terminal 3)
   ```bash
   cd frontend
   npm run dev
   ```

4. **Open Browser**
   - Navigate to `http://localhost:3000`
   - Connect your wallet to localhost:8545

## Troubleshooting

### Port Already in Use

If port 3000 or 8545 is already in use:
- Kill the process using the port
- Or change the port in the configuration

### Contract Deployment Failed

- Make sure you have enough test tokens
- Check your private key in .env
- Verify network configuration

### Frontend Can't Connect to Contracts

- Ensure contracts are deployed
- Check the contract addresses in frontend configuration
- Verify you're connected to the correct network

## Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Somnia Network Documentation](https://docs.somnia.network/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)

## Support

For issues and questions:
- Check existing documentation
- Review contract deployment logs
- Verify network connectivity

---

**Happy Building! 🚀**

