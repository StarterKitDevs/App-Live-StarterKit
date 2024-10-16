export const token_id =
  "11856102366659983612749935230057658851725349010695617715943760134076253604792";

export const NFT_ADDRESS = "0x2953399124F0cBB46d2CbACD8A89cF0599974963";

export const NFT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_owner", type: "address" },
      { internalType: "uint256", name: "_id", type: "uint256" },
    ],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export const projectId = "8e281161f038ae9e0afa0dc1569bfdf4";

export const metadata = {
  name: "AppKit",
  description: "AppKit Example",
  url: "https://example.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};
