const networks: { name: string; id: string }[] = [
  {
    name: "Ethereum",
    id: "1",
  },
  {
    name: "BSC",
    id: "56",
  },
  {
    name: "Arbitrum",
    id: "42161",
  },
  {
    name: "Polygon",
    id: "137",
  },
  {
    name: "Solana",
    id: "solana",
  },
  {
    name: "opBNB",
    id: "204",
  },
  {
    name: "zkSync Era",
    id: "324",
  },
  {
    name: "Linea Mainnet",
    id: "59144",
  },
  {
    name: "Base",
    id: "8453",
  },
  {
    name: "Mantle",
    id: "5000",
  },
  {
    name: "Scroll",
    id: "534352",
  },
  {
    name: "Optimism",
    id: "10",
  },
  {
    name: "Avalanche",
    id: "43114",
  },
  {
    name: "Fantom",
    id: "250",
  },
  {
    name: "Cronos",
    id: "25",
  },
  {
    name: "HECO",
    id: "128",
  },
  {
    name: "Gnosis",
    id: "100",
  },
  {
    name: "Tron",
    id: "tron",
  },
  {
    name: "KCC",
    id: "321",
  },
  {
    name: "FON",
    id: "201022",
  },
  {
    name: "ZKFair",
    id: "42766",
  },
  {
    name: "Blast",
    id: "81457",
  },
  {
    name: "Manta Pacific",
    id: "169",
  },
  {
    name: "Berachain Artio Testnet",
    id: "80085",
  },
  {
    name: "Merlin",
    id: "4200",
  },
];

export function translateNetwork(input: string | number) {
    let key: string | undefined;

    if (!Number.isNaN(Number(input)) && typeof(Number(input)) == "number") {
        const network = networks.find(network => network.id === input);
        key = network ? network.id : undefined;
    } else if (typeof input === "string") {
        const stringToCompare = input.toLowerCase();
        const network = networks.find(network => network.name.toLowerCase() === stringToCompare);
        key = network ? network.id : undefined;
    }

    return key;
}

export default networks;