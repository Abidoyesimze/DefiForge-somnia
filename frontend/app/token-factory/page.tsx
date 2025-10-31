"use client";

import React, { useEffect, useState } from "react";
import { ERC20FactoryABI, ERC721FactoryABI, ERC1155FactoryABI, getContractAddress } from "../../ABI";
import ContractVerification from "../../components/ContractVerification";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";

type TokenType = "erc20" | "erc721" | "erc1155";

interface DeploymentResult {
  type: string;
  address: string;
  name: string;
  symbol: string;
  inputs: Record<string, string>;
}

interface SavedToken {
  type: string;
  address: string;
  name: string;
  symbol: string;
  chainId: string;
  timestamp: number;
  explorerUrl?: string;
}

const TokenFactoryPage = () => {
  const { address, isConnected } = useAccount();
  const [selectedTokenType, setSelectedTokenType] = useState<TokenType>("erc20");
  const [isDeploying, setIsDeploying] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const [networkInfo, setNetworkInfo] = useState<{ chainId: string; name: string } | null>(null);
  const [savedTokens, setSavedTokens] = useState<SavedToken[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showTokensModal, setShowTokensModal] = useState(false);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);

  // Check network on mount and when wallet connects
  useEffect(() => {
    const checkNetwork = async () => {
      if (isConnected && window.ethereum) {
        try {
          console.log("🔍 Checking network...");
          const provider = new ethers.BrowserProvider(window.ethereum);
          const network = await provider.getNetwork();
          console.log("🌐 Network detected:", network);

          const networkInfo = {
            chainId: network.chainId.toString(),
            name: network.name || "Unknown",
          };

          console.log("📡 Setting network info:", networkInfo);
          setNetworkInfo(networkInfo);
        } catch (error) {
          console.error("❌ Error checking network:", error);
        }
      } else {
        console.log("⚠️ Wallet not connected or ethereum not available");
      }
    };

    checkNetwork();
  }, [isConnected]);

  // Load tokens from blockchain
  useEffect(() => {
    const loadTokensFromBlockchain = async () => {
      if (!address || !window.ethereum || !networkInfo) return;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const allTokens: SavedToken[] = [];

        const explorerUrl = networkInfo.chainId === "50312" 
          ? "https://shannon-explorer.somnia.network"
          : "https://etherscan.io";

        // Load ERC20 tokens
        try {
          const erc20Factory = new ethers.Contract(
            getContractAddress("ERC20Factory"),
            ERC20FactoryABI,
            provider
          );
          const erc20Addresses = await erc20Factory.getTokensByCreator(address);
          
          for (const tokenAddr of erc20Addresses) {
            try {
              const tokenContract = new ethers.Contract(
                tokenAddr,
                ["function name() view returns (string)", "function symbol() view returns (string)"],
                provider
              );
              const name = await tokenContract.name();
              const symbol = await tokenContract.symbol();
              
              allTokens.push({
                type: "ERC20",
                address: tokenAddr,
                name,
                symbol,
                chainId: networkInfo.chainId,
                timestamp: 0,
                explorerUrl,
              });
            } catch (err) {
              console.error("Error loading ERC20 token details:", err);
            }
          }
        } catch (err) {
          console.error("Error loading ERC20 tokens:", err);
        }

        // Load ERC721 collections
        try {
          const erc721Factory = new ethers.Contract(
            getContractAddress("ERC721Factory"),
            ERC721FactoryABI,
            provider
          );
          const erc721Addresses = await erc721Factory.getCollectionsByCreator(address);
          
          for (const tokenAddr of erc721Addresses) {
            try {
              const tokenContract = new ethers.Contract(
                tokenAddr,
                ["function name() view returns (string)", "function symbol() view returns (string)"],
                provider
              );
              const name = await tokenContract.name();
              const symbol = await tokenContract.symbol();
              
              allTokens.push({
                type: "ERC721",
                address: tokenAddr,
                name,
                symbol,
                chainId: networkInfo.chainId,
                timestamp: 0,
                explorerUrl,
              });
            } catch (err) {
              console.error("Error loading ERC721 token details:", err);
            }
          }
        } catch (err) {
          console.error("Error loading ERC721 tokens:", err);
        }

        // Load ERC1155 contracts
        try {
          const erc1155Factory = new ethers.Contract(
            getContractAddress("ERC1155Factory"),
            ERC1155FactoryABI,
            provider
          );
          const erc1155Addresses = await erc1155Factory.getContractsByCreator(address);
          
          for (const tokenAddr of erc1155Addresses) {
            try {
              const tokenContract = new ethers.Contract(
                tokenAddr,
                ["function name() view returns (string)"],
                provider
              );
              const name = await tokenContract.name();
              
              allTokens.push({
                type: "ERC1155",
                address: tokenAddr,
                name,
                symbol: "Multi-Token",
                chainId: networkInfo.chainId,
                timestamp: 0,
                explorerUrl,
              });
            } catch (err) {
              console.error("Error loading ERC1155 token details:", err);
            }
          }
        } catch (err) {
          console.error("Error loading ERC1155 tokens:", err);
        }

        setSavedTokens(allTokens);
      } catch (error) {
        console.error("Error loading tokens from blockchain:", error);
      }
    };

    loadTokensFromBlockchain();
  }, [address, networkInfo]);

  // Reload tokens from blockchain
  const reloadTokens = async () => {
    if (!address || !window.ethereum || !networkInfo) return;

    setIsLoadingTokens(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const allTokens: SavedToken[] = [];

      const explorerUrl = networkInfo.chainId === "50312" 
        ? "https://shannon-explorer.somnia.network"
        : "https://etherscan.io";

      // Load all tokens from factories
      try {
        const erc20Factory = new ethers.Contract(getContractAddress("ERC20Factory"), ERC20FactoryABI, provider);
        const erc20Addresses = await erc20Factory.getTokensByCreator(address);
        
        for (const tokenAddr of erc20Addresses) {
          try {
            const tokenContract = new ethers.Contract(tokenAddr, ["function name() view returns (string)", "function symbol() view returns (string)"], provider);
            allTokens.push({
              type: "ERC20",
              address: tokenAddr,
              name: await tokenContract.name(),
              symbol: await tokenContract.symbol(),
              chainId: networkInfo.chainId,
              timestamp: 0,
              explorerUrl,
            });
          } catch (err) {
            console.error("Error loading ERC20 token:", err);
          }
        }

        const erc721Factory = new ethers.Contract(getContractAddress("ERC721Factory"), ERC721FactoryABI, provider);
        const erc721Addresses = await erc721Factory.getCollectionsByCreator(address);
        
        for (const tokenAddr of erc721Addresses) {
          try {
            const tokenContract = new ethers.Contract(tokenAddr, ["function name() view returns (string)", "function symbol() view returns (string)"], provider);
            allTokens.push({
              type: "ERC721",
              address: tokenAddr,
              name: await tokenContract.name(),
              symbol: await tokenContract.symbol(),
              chainId: networkInfo.chainId,
              timestamp: 0,
              explorerUrl,
            });
          } catch (err) {
            console.error("Error loading ERC721 token:", err);
          }
        }

        const erc1155Factory = new ethers.Contract(getContractAddress("ERC1155Factory"), ERC1155FactoryABI, provider);
        const erc1155Addresses = await erc1155Factory.getContractsByCreator(address);
        
        for (const tokenAddr of erc1155Addresses) {
          try {
            const tokenContract = new ethers.Contract(tokenAddr, ["function name() view returns (string)"], provider);
            allTokens.push({
              type: "ERC1155",
              address: tokenAddr,
              name: await tokenContract.name(),
              symbol: "Multi-Token",
              chainId: networkInfo.chainId,
              timestamp: 0,
              explorerUrl,
            });
          } catch (err) {
            console.error("Error loading ERC1155 token:", err);
          }
        }

        setSavedTokens(allTokens);
      } catch (err) {
        console.error("Error reloading tokens:", err);
      }
    } catch (error) {
      console.error("Error reloading tokens from blockchain:", error);
    } finally {
      setIsLoadingTokens(false);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    initialSupply: "1000000",
    decimals: 18,
    maxSupply: "10000",
    baseURI: "https://api.example.com/metadata/",
    uri: "https://api.example.com/metadata/",
    mintable: true,
    burnable: true,
    pausable: true,
    supplyTracked: true,
  });

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      symbol: "",
      initialSupply: "1000000",
      decimals: 18,
      maxSupply: "10000",
      baseURI: "https://api.example.com/metadata/",
      uri: "https://api.example.com/metadata/",
      mintable: true,
      burnable: true,
      pausable: true,
      supplyTracked: true,
    });
  };

  const deployAnother = () => {
    setShowSuccessModal(false);
    setDeploymentResult(null);
    resetForm();
  };

  const deployToken = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!formData.name || !formData.symbol) {
      toast.error("Name and symbol are required");
      return;
    }

    console.log("🚀 Starting token deployment...");
    console.log("Network Info:", networkInfo);
    console.log("Selected Token Type:", selectedTokenType);

    setIsDeploying(true);

    try {
      // Check if window.ethereum exists
      if (!window.ethereum) {
        throw new Error("MetaMask or wallet provider not found. Please install MetaMask.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      const signer = await provider.getSigner();

      let deployedAddress: string = ""; // Initialize deployedAddress

      switch (selectedTokenType) {
        case "erc20":
          const erc20Address = getContractAddress("ERC20Factory");
          console.log("🔗 Using ERC20Factory address:", erc20Address);

          const erc20Contract = new ethers.Contract(
            erc20Address, // Use network-aware address
            ERC20FactoryABI,
            signer,
          );

          // Use parseUnits with explicit decimals to avoid ENS resolution
          const initialSupplyWei = ethers.parseUnits(formData.initialSupply, formData.decimals);

          const erc20Tx = await erc20Contract.createToken(
            formData.name,
            formData.symbol,
            initialSupplyWei,
            formData.decimals,
          );

          const erc20Receipt = await erc20Tx.wait();
          const erc20Event = erc20Receipt.logs.find((log: any) => {
            try {
              const parsed = erc20Contract.interface.parseLog(log);
              return parsed?.name === "TokenCreated";
            } catch {
              return false;
            }
          });

          if (erc20Event) {
            const parsed = erc20Contract.interface.parseLog(erc20Event);
            if (parsed) deployedAddress = parsed.args.tokenAddress; // Null check
          }
          break;

        case "erc721":
          const erc721Address = getContractAddress("ERC721Factory");
          console.log("🔗 Using ERC721Factory address:", erc721Address);

          const erc721Contract = new ethers.Contract(
            erc721Address, // Use network-aware address
            ERC721FactoryABI,
            signer,
          );

          const maxSupply = formData.maxSupply ? parseInt(formData.maxSupply) : 0;

          const erc721Tx = await erc721Contract.createCollection(
            formData.name,
            formData.symbol,
            formData.baseURI,
            maxSupply,
            formData.mintable,
            formData.burnable,
            formData.pausable,
          );

          const erc721Receipt = await erc721Tx.wait();
          const erc721Event = erc721Receipt.logs.find((log: any) => {
            try {
              const parsed = erc721Contract.interface.parseLog(log);
              return parsed?.name === "CollectionCreated";
            } catch {
              return false;
            }
          });

          if (erc721Event) {
            const parsed = erc721Contract.interface.parseLog(erc721Event);
            if (parsed) deployedAddress = parsed.args.contractAddress; // Null check
          }
          break;

        case "erc1155":
          const erc1155Address = getContractAddress("ERC1155Factory");
          console.log("🔗 Using ERC1155Factory address:", erc1155Address);

          const erc1155Contract = new ethers.Contract(
            erc1155Address, // Use network-aware address
            ERC1155FactoryABI,
            signer,
          );

          const erc1155Tx = await erc1155Contract.createMultiToken(
            formData.name,
            formData.uri,
            formData.mintable,
            formData.burnable,
            formData.pausable,
            formData.supplyTracked,
          );

          const erc1155Receipt = await erc1155Tx.wait();
          const erc1155Event = erc1155Receipt.logs.find((log: any) => {
            try {
              const parsed = erc1155Contract.interface.parseLog(log);
              return parsed?.name === "MultiTokenCreated";
            } catch {
              return false;
            }
          });

          if (erc1155Event) {
            const parsed = erc1155Contract.interface.parseLog(erc1155Event);
            if (parsed) deployedAddress = parsed.args.contractAddress; // Null check
          }
          break;

        default:
          throw new Error("Invalid token type");
      }

      if (deployedAddress) {
        console.log("✅ Token deployed successfully at:", deployedAddress);

        // Create deployment result object
        const result: DeploymentResult = {
          type: selectedTokenType.toUpperCase(),
          address: deployedAddress,
          name: formData.name,
          symbol: formData.symbol,
          inputs: {
            "Token Name": formData.name,
            "Token Symbol": formData.symbol,
            ...(selectedTokenType === "erc20" && {
              "Initial Supply": formData.initialSupply,
              Decimals: formData.decimals.toString(),
            }),
            ...(selectedTokenType === "erc721" && {
              "Max Supply": formData.maxSupply || "Unlimited",
              "Base URI": formData.baseURI,
            }),
            ...(selectedTokenType === "erc1155" && {
              "Metadata URI": formData.uri,
            }),
            Mintable: formData.mintable ? "Yes" : "No",
            Burnable: formData.burnable ? "Yes" : "No",
            Pausable: formData.pausable ? "Yes" : "No",
            ...(selectedTokenType === "erc1155" && {
              "Supply Tracked": formData.supplyTracked ? "Yes" : "No",
            }),
          },
        };

        console.log("📋 Setting deployment result:", result);
        setDeploymentResult(result);
        setShowSuccessModal(true);
        console.log("🎉 Success modal should now be visible!");

        // Reload tokens from blockchain to update sidebar
        setTimeout(() => {
          reloadTokens();
        }, 2000); // Wait 2 seconds for blockchain confirmation

        toast.success(`${selectedTokenType.toUpperCase()} token deployed successfully!`);
      } else {
        console.log("❌ No deployed address found in transaction receipt");
      }
    } catch (error: any) {
      console.error("Deployment error:", error);
      let errorMessage = "Failed to deploy token";

      if (error.message.includes("user rejected")) {
        errorMessage = "Transaction rejected by user";
      } else if (error.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for deployment";
      } else if (error.message.includes("execution reverted")) {
        errorMessage = "Contract rejected the deployment";
      } else if (error.message.includes("ENS") || error.message.includes("UNSUPPORTED_OPERATION")) {
        errorMessage = "Network configuration error. Please ensure you're connected to an EVM-compatible network.";
      }

      toast.error(errorMessage);
    } finally {
      setIsDeploying(false);
    }
  };

  // Professional Sidebar Component
  const TokenSidebar = (): React.JSX.Element => {
    const menuItems = [
      {
        icon: "🏭",
        label: "Create Token",
        active: true,
        onClick: () => {},
      },
      {
        icon: "📊",
        label: "My Tokens",
        count: savedTokens.length,
        active: false,
        onClick: () => setShowTokensModal(true),
      },
    ];

    return (
      <div className={`${sidebarOpen ? "w-64" : "w-20"} transition-all duration-300 bg-gradient-to-b from-[#1c2941] to-[#0f1a2e] border-r border-[#2a3b54] flex-shrink-0 shadow-2xl`}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-[#2a3b54]">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                    DeFiForge
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Token Factory</p>
                </div>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-[#2a3b54] rounded-lg transition-all duration-200 hover:scale-110"
                title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                <span className="text-gray-400">{sidebarOpen ? "←" : "→"}</span>
              </button>
            </div>
          </div>

          {/* Sidebar Menu */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    item.active
                      ? "bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-emerald-500/30 text-emerald-400 shadow-lg"
                      : "hover:bg-[#2a3b54] text-gray-300 hover:text-white border border-transparent"
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left font-medium">{item.label}</span>
                      {item.count !== undefined && item.count > 0 && (
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full min-w-[24px] text-center">
                          {item.count}
                        </span>
                      )}
                    </>
                  )}
                  {!sidebarOpen && item.count !== undefined && item.count > 0 && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer */}
          {sidebarOpen && (
            <div className="p-4 border-t border-[#2a3b54]">
              <div className="text-xs text-gray-400 text-center">
                <p>Connected to</p>
                <p className="text-emerald-400 font-medium mt-1">
                  {networkInfo?.name || "Network"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // My Tokens Modal Component
  const MyTokensModal = (): React.JSX.Element | null => {
    if (!showTokensModal) return null;

    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      toast.success("Address copied to clipboard!");
    };

    const getTokenTypeColor = (type: string) => {
      switch (type.toLowerCase()) {
        case "erc20":
          return {
            bg: "bg-gradient-to-r from-blue-500/20 to-blue-600/10",
            text: "text-blue-400",
            border: "border-blue-500/30",
            badge: "bg-blue-500/20"
          };
        case "erc721":
          return {
            bg: "bg-gradient-to-r from-purple-500/20 to-purple-600/10",
            text: "text-purple-400",
            border: "border-purple-500/30",
            badge: "bg-purple-500/20"
          };
        case "erc1155":
          return {
            bg: "bg-gradient-to-r from-pink-500/20 to-pink-600/10",
            text: "text-pink-400",
            border: "border-pink-500/30",
            badge: "bg-pink-500/20"
          };
        default:
          return {
            bg: "bg-gradient-to-r from-gray-500/20 to-gray-600/10",
            text: "text-gray-400",
            border: "border-gray-500/30",
            badge: "bg-gray-500/20"
          };
      }
    };

    const getNetworkName = (chainId: string) => {
      if (chainId === "50312") return "Somnia Testnet";
      if (chainId === "31337") return "Localhost";
      return `Chain ${chainId}`;
    };

    // Group tokens by type
    const tokensByType = savedTokens.reduce((acc, token) => {
      if (!acc[token.type]) {
        acc[token.type] = [];
      }
      acc[token.type].push(token);
      return acc;
    }, {} as Record<string, SavedToken[]>);

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowTokensModal(false)}>
        <div className="bg-gradient-to-br from-[#1c2941] to-[#0f1a2e] rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-[#2a3b54] shadow-2xl" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="p-6 border-b border-[#2a3b54] bg-gradient-to-r from-emerald-900/20 to-blue-900/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
                  📊 My Tokens
                </h2>
                <p className="text-gray-400 mt-2">
                  {savedTokens.length} token{savedTokens.length !== 1 ? "s" : ""} deployed on {getNetworkName(networkInfo?.chainId || "")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    await reloadTokens();
                    toast.success("Tokens refreshed!");
                  }}
                  disabled={isLoadingTokens}
                  className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoadingTokens ? "⏳" : "🔄"} Refresh
                </button>
                <button
                  onClick={() => setShowTokensModal(false)}
                  className="p-2 hover:bg-[#2a3b54] rounded-lg transition-all text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {savedTokens.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏭</div>
                <h3 className="text-2xl font-bold text-gray-300 mb-2">No Tokens Yet</h3>
                <p className="text-gray-400 mb-6">Deploy your first token to see it here!</p>
                <button
                  onClick={() => setShowTokensModal(false)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all"
                >
                  Create Token Now
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(tokensByType).map(([type, tokens]) => (
                  <div key={type}>
                    <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
                      <span className={getTokenTypeColor(type).text}>{type}</span>
                      <span className="text-sm text-gray-400">({tokens.length})</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tokens.map((token) => {
                        const colors = getTokenTypeColor(token.type);
                        return (
                          <div
                            key={token.address}
                            className={`${colors.bg} rounded-xl p-5 border ${colors.border} hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
                          >
                            {/* Token Type Badge */}
                            <div className={`inline-block px-3 py-1 ${colors.badge} ${colors.text} text-xs font-bold rounded-full mb-3 border ${colors.border}`}>
                              {token.type}
                            </div>

                            {/* Token Info */}
                            <div className="mb-4">
                              <h4 className="font-bold text-white text-lg mb-1 truncate">{token.name}</h4>
                              <p className={`${colors.text} font-medium`}>{token.symbol}</p>
                            </div>

                            {/* Token Address */}
                            <div className="bg-black/30 rounded-lg p-3 mb-4">
                              <div className="text-xs text-gray-400 mb-2 font-medium">Contract Address</div>
                              <div className="flex items-center gap-2">
                                <code className="text-xs text-gray-300 font-mono flex-1 truncate">
                                  {token.address}
                                </code>
                                <button
                                  onClick={() => copyToClipboard(token.address)}
                                  className="p-2 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                                  title="Copy address"
                                >
                                  📋
                                </button>
                              </div>
                            </div>

                            {/* Actions */}
                            {token.explorerUrl && (
                              <a
                                href={`${token.explorerUrl}/address/${token.address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block text-center px-4 py-2 ${colors.badge} hover:${colors.badge.replace('20', '30')} ${colors.text} font-medium rounded-lg transition-all`}
                              >
                                View on Explorer →
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Success Modal Component
  const SuccessModal = (): React.JSX.Element | null => {
    if (!showSuccessModal || !deploymentResult) return null;

    // Get network display information
    const getNetworkDisplay = () => {
      if (!networkInfo) {
        return {
          name: "Unknown Network",
          chainId: "Unknown",
          explorer: "https://etherscan.io",
          color: "text-gray-400",
          bgColor: "bg-gray-900/20",
          borderColor: "border-gray-500/30",
        };
      }

      const chainId = networkInfo.chainId;
      // Only Somnia testnet supported
      if (chainId === "50312") {
        return {
          name: "Somnia Testnet",
          chainId: "50312",
          explorer: "https://shannon-explorer.somnia.network",
          color: "text-purple-400",
          bgColor: "bg-purple-900/20",
          borderColor: "border-purple-500/30",
        };
      } else {
        return {
          name: networkInfo.name || "Unknown Network",
          chainId: chainId,
          explorer: "https://etherscan.io",
          color: "text-gray-400",
          bgColor: "bg-gray-900/20",
          borderColor: "border-gray-500/30",
        };
      }
    };

    const network = getNetworkDisplay();

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#1c2941] rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#2a3b54] shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-emerald-400 mb-2">Token Deployed Successfully!</h2>
            <p className="text-xl text-gray-300">
              Your {deploymentResult.type} token has been created on {network.name}
            </p>
          </div>

          {/* Network Information */}
          <div className={`${network.bgColor} rounded-xl p-6 mb-6 border ${network.borderColor}`}>
            <h3 className="text-lg font-semibold mb-4 text-emerald-400">Network Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${network.color.replace("text-", "bg-")}`}></div>
                <div>
                  <div className="text-white font-medium">{network.name}</div>
                  <div className="text-sm text-gray-400">Chain ID: {network.chainId}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Block Explorer</div>
                <a
                  href={`${network.explorer}/address/${deploymentResult.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm ${network.color} hover:underline`}
                >
                  View on Explorer →
                </a>
              </div>
            </div>
          </div>

          {/* Token Info Display */}
          <div className="bg-[#0f1a2e] rounded-xl p-6 mb-6 border border-[#1e2a3a] text-center">
            <h3 className="text-lg font-semibold mb-3 text-emerald-400">Token Details</h3>
            <div className="text-2xl font-bold text-white mb-2">{deploymentResult.name}</div>
            <div className="text-lg text-emerald-400 mb-4">{deploymentResult.symbol}</div>
            <div className="bg-[#1a2332] p-3 rounded-lg border border-[#2a3b54]">
              <div className="text-sm text-gray-400 mb-1">Contract Address</div>
              <div className="text-sm text-emerald-400 font-mono break-all">{deploymentResult.address}</div>
            </div>
          </div>

          {/* Configuration Summary */}
          <div className="bg-[#0f1a2e] rounded-xl p-6 mb-6 border border-[#1e2a3a]">
            <h3 className="text-lg font-semibold mb-4 text-emerald-400">Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(deploymentResult.inputs).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-2 bg-[#1a2332] rounded-lg">
                  <span className="text-gray-400 text-sm">{key}:</span>
                  <span className="text-white font-medium text-sm">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contract Verification */}
          <div className="mb-6">
            <ContractVerification
              contractAddress={deploymentResult.address}
              networkChainId={networkInfo?.chainId || ""}
              contractType="token"
              contractName={deploymentResult.name}
            />
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl p-6 mb-6 border border-[#2a3b54]">
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Next Steps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div className="space-y-2">
                <div>
                  • <strong>Verify Contract:</strong> Use the verification guide above to verify your contract
                </div>
                <div>
                  • <strong>Add to Wallet:</strong> Import the token address to your wallet
                </div>
                <div>
                  • <strong>Test Functions:</strong> Try minting, transferring, or other features
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  • <strong>Share Address:</strong> Share the contract address with your community
                </div>
                <div>
                  • <strong>Monitor Activity:</strong> Track transactions and usage on the explorer
                </div>
                <div>
                  • <strong>Documentation:</strong> Keep track of your token&apos;s configuration
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={deployAnother}
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
            >
              Deploy Another Token
            </button>
            <a
              href={`${network.explorer}/address/${deploymentResult.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] text-center flex items-center justify-center"
            >
              View on Explorer
            </a>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-4 px-6 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#121d33] text-white flex">
      {/* Sidebar */}
      {isConnected && <TokenSidebar />}
      
      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-slate-400 bg-clip-text text-transparent">
              Token Factory
            </h1>
            <p className="text-xl text-gray-300">Deploy ERC20, ERC721, and ERC1155 tokens with custom configurations</p>
          </div>

        {/* Wallet Connection Check */}
        {!isConnected ? (
          <div className="text-center p-8 bg-[#1c2941] rounded-xl border border-[#2a3b54]">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-300">Please connect your wallet to any EVM-compatible network to create tokens.</p>
          </div>
        ) : (
          <>
            {/* Network Status */}
            <div className="max-w-4xl mx-auto mb-6">
              <div className="p-4 rounded-xl border bg-green-900/20 border-green-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">
                      Network: {networkInfo?.name || "Checking..."} (Chain ID: {networkInfo?.chainId || "..."})
                    </span>
                  </div>
                  <span className="text-green-400 text-sm">✓ EVM-Compatible Network</span>
                </div>
                <div className="mt-3 text-sm text-green-300">
                  <p>Connected to an EVM-compatible network. You can now deploy tokens!</p>
                  <p className="mt-1 text-xs text-gray-400">Supported testnet: Somnia (Chain ID: 50312)</p>
                </div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-[#1c2941] p-8 rounded-xl border border-[#2a3b54] shadow-xl">
                <h2 className="text-2xl font-bold mb-6">Create New Token</h2>

                {/* Token Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">Token Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["erc20", "erc721", "erc1155"] as TokenType[]).map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedTokenType(type)}
                        className={`p-3 rounded-lg border transition-all duration-200 ${
                          selectedTokenType === type
                            ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                            : "border-[#2a3b54] hover:border-emerald-500 hover:bg-[#1a2332]"
                        }`}
                      >
                        {type.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <form
                  onSubmit={e => {
                    e.preventDefault();
                    deployToken();
                  }}
                  className="space-y-6"
                >
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Token Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => handleInputChange("name", e.target.value)}
                        placeholder="My Awesome Token"
                        className="w-full px-4 py-3 bg-[#0f1a2e] border border-[#2a3b54] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Token Symbol *</label>
                      <input
                        type="text"
                        value={formData.symbol}
                        onChange={e => handleInputChange("symbol", e.target.value)}
                        placeholder="MAT"
                        className="w-full px-4 py-3 bg-[#0f1a2e] border border-[#2a3b54] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Token Type Specific Fields */}
                  {selectedTokenType === "erc20" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Initial Supply *</label>
                        <input
                          type="text"
                          value={formData.initialSupply}
                          onChange={e => handleInputChange("initialSupply", e.target.value)}
                          placeholder="1000000"
                          className="w-full px-4 py-3 bg-[#0f1a2e] border border-[#2a3b54] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Decimals *</label>
                        <select
                          value={formData.decimals}
                          onChange={e => handleInputChange("decimals", parseInt(e.target.value))}
                          className="w-full px-4 py-3 bg-[#0f1a2e] border border-[#2a3b54] rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-all duration-200"
                        >
                          <option value={18}>18 (Standard)</option>
                          <option value={6}>6 (USDC style)</option>
                          <option value={8}>8 (Bitcoin style)</option>
                          <option value={0}>0 (Whole numbers)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {(selectedTokenType === "erc721" || selectedTokenType === "erc1155") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {selectedTokenType === "erc721" ? "Base URI" : "Metadata URI"} *
                      </label>
                      <input
                        type="text"
                        value={selectedTokenType === "erc721" ? formData.baseURI : formData.uri}
                        onChange={e =>
                          handleInputChange(selectedTokenType === "erc721" ? "baseURI" : "uri", e.target.value)
                        }
                        placeholder="https://api.example.com/metadata/"
                        className="w-full px-4 py-3 bg-[#0f1a2e] border border-[#2a3b54] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all duration-200"
                        required
                      />
                    </div>
                  )}

                  {selectedTokenType === "erc721" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Maximum Supply</label>
                      <input
                        type="text"
                        value={formData.maxSupply}
                        onChange={e => handleInputChange("maxSupply", e.target.value)}
                        placeholder="10000 (0 for unlimited)"
                        className="w-full px-4 py-3 bg-[#0f1a2e] border border-[#2a3b54] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all duration-200"
                      />
                    </div>
                  )}

                  {/* Configuration Options */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-emerald-400">Configuration Options</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.mintable}
                          onChange={e => handleInputChange("mintable", e.target.checked)}
                          className="w-4 h-4 text-emerald-600 bg-[#0f1a2e] border-[#2a3b54] rounded focus:ring-emerald-500 focus:ring-2"
                        />
                        <span className="text-sm">Mintable</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.burnable}
                          onChange={e => handleInputChange("burnable", e.target.checked)}
                          className="w-4 h-4 text-emerald-600 bg-[#0f1a2e] border-[#2a3b54] rounded focus:ring-emerald-500 focus:ring-2"
                        />
                        <span className="text-sm">Burnable</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.pausable}
                          onChange={e => handleInputChange("pausable", e.target.checked)}
                          className="w-4 h-4 text-emerald-600 bg-[#0f1a2e] border-[#2a3b54] rounded focus:ring-emerald-500 focus:ring-2"
                        />
                        <span className="text-sm">Pausable</span>
                      </label>
                    </div>

                    {selectedTokenType === "erc1155" && (
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.supplyTracked}
                          onChange={e => handleInputChange("supplyTracked", e.target.checked)}
                          className="w-4 h-4 text-emerald-600 bg-[#0f1a2e] border-[#2a3b54] rounded focus:ring-emerald-500 focus:ring-2"
                        />
                        <span className="text-sm">Track Total Supply</span>
                      </label>
                    )}
                  </div>

                  {/* Deploy Button */}
                  <button
                    type="submit"
                    disabled={isDeploying}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                      isDeploying
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-600 to-slate-600 hover:from-emerald-700 hover:to-slate-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    }`}
                  >
                    {isDeploying ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Deploying {selectedTokenType.toUpperCase()} Token...
                      </div>
                    ) : (
                      `Deploy ${selectedTokenType.toUpperCase()} Token`
                    )}
                  </button>
                </form>
              </div>
            </div>
          </>
        )}

        {/* Success Modal */}
        <SuccessModal />
        
        {/* My Tokens Modal */}
        <MyTokensModal />
        </div>
      </div>
    </div>
  );
};

export default TokenFactoryPage;
