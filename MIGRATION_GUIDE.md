# Migration Guide: From Scaffold-ETH to Standalone Structure

This document explains the changes made to restructure DefiForge from Scaffold-ETH to a standalone Next.js + Hardhat structure.

## What Changed?

### Directory Structure

**Before:**
```
DefiForge/
├── packages/
│   ├── hardhat/      # Smart contracts
│   └── nextjs/       # Frontend
└── package.json      # Workspace configuration
```

**After:**
```
DefiForge/
├── smartcontract/    # Smart contracts (formerly packages/hardhat)
├── frontend/         # Frontend (formerly packages/nextjs)
└── package.json      # Simple project scripts
```

## Key Changes

### 1. Removed Scaffold-ETH Monorepo Structure
- Removed yarn workspaces configuration
- Each folder (smartcontract, frontend) is now independent
- No more `@defiforge/hardhat` or `@defiforge/nextjs` package names

### 2. Updated Package Names
- `@defiforge/hardhat` → `defiforge-smartcontract`
- `@defiforge/nextjs` → `defiforge-frontend`

### 3. Simplified Root package.json
- Removed workspace dependencies
- Added simple npm scripts for common tasks
- No more complex yarn workspace commands

### 4. Rebranded Scaffold-ETH Components
- `ScaffoldEthAppWithProviders` → `AppProviders`
- Updated metadata from "Scaffold-ETH 2 App" to "DeFiForge"
- Kept useful components but removed branding

### 5. Updated Documentation
- Added SETUP.md with clear installation instructions
- Updated README.md with new project structure
- Created this migration guide

## Migration Steps Performed

1. ✅ Created new `smartcontract/` and `frontend/` directories
2. ✅ Copied contents from `packages/hardhat/` to `smartcontract/`
3. ✅ Copied contents from `packages/nextjs/` to `frontend/`
4. ✅ Updated all package.json files to remove workspace references
5. ✅ Removed old `packages/` directory
6. ✅ Updated component names and branding
7. ✅ Created new documentation files
8. ✅ Updated .gitignore for new structure

## What Stayed the Same?

- All smart contracts remain unchanged
- Frontend functionality remains the same
- All existing features work as before
- Development workflow is similar
- Dependencies are the same

## Benefits of New Structure

### Simpler Setup
- No need to understand yarn workspaces
- Each part can be developed independently
- Easier for new developers to understand

### Better Separation
- Smart contracts and frontend are truly independent
- Can deploy each separately
- Easier to manage dependencies

### Standard Structure
- Follows common Next.js + Hardhat patterns
- More familiar to developers
- Better for documentation and tutorials

## Breaking Changes

### Installation Commands

**Before:**
```bash
yarn install                    # Install all packages
yarn hardhat:compile           # Compile contracts
yarn start                     # Start frontend
```

**After:**
```bash
cd smartcontract && npm install   # Install smart contract deps
cd frontend && npm install        # Install frontend deps
npm run compile                   # Compile contracts (from root)
npm run dev                       # Start frontend (from root)
```

Or use the helper script:
```bash
npm run install:all              # Install all dependencies
```

### Import Paths
Most import paths remain the same since we kept the `~~` alias in Next.js configuration.

### Deployment Scripts
All deployment scripts still work the same way, just run from the `smartcontract/` directory.

## Next Steps

1. **Install Dependencies**
   ```bash
   cd smartcontract && npm install
   cd ../frontend && npm install
   ```

2. **Verify Everything Works**
   ```bash
   cd smartcontract && npm run compile
   cd ../frontend && npm run dev
   ```

3. **Update Your .env Files**
   - Copy `.env.example` in smartcontract/
   - Copy `.env.local.example` in frontend/
   - Add your keys

4. **Test Deployment**
   ```bash
   cd smartcontract
   npm run deploy
   ```

## Troubleshooting

### "Module not found" errors
- Make sure you've installed dependencies in both directories
- Check that import paths use the correct aliases

### "Cannot find workspace" errors
- Delete old lock files if present
- Reinstall dependencies fresh

### Contract deployment issues
- Verify your .env file is in smartcontract/ directory
- Check that you're running commands from the correct directory

## Support

If you encounter any issues:
1. Check the SETUP.md file
2. Verify all dependencies are installed
3. Ensure you're running commands from the correct directory

---

**Migration completed successfully! 🎉**

