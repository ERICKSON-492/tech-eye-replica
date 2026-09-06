export type ShopProduct = {
  id: string;
  sku: string;
  name: string;
  category: string;
  description: string;
  priceKes: number;
  image: string;
  imageAlt: string;
  unit: string;
  active: boolean;
};

export const starterProducts: ShopProduct[] = [
  {
    id: "stainless-handrail-kit",
    sku: "EYE-SS-001",
    name: "Stainless Steel Handrail Kit",
    category: "Stainless Steel",
    description:
      "Made-to-measure handrail components for stairs, balconies and commercial interiors.",
    priceKes: 18500,
    image: "/images/steel-railings.jpg",
    imageAlt: "Stainless steel railing detail",
    unit: "per project estimate",
    active: true,
  },
  {
    id: "aluminium-sliding-window",
    sku: "EYE-AL-001",
    name: "Aluminium Sliding Window System",
    category: "Aluminium Works",
    description: "Modern aluminium window systems supplied in project-specific sizes and finishes.",
    priceKes: 32000,
    image: "/images/aluminium-doors.jpg",
    imageAlt: "Modern aluminium doors and windows",
    unit: "from",
    active: true,
  },
  {
    id: "glass-balustrade-system",
    sku: "EYE-GL-001",
    name: "Glass Balustrade System",
    category: "Glass & Railings",
    description: "Contemporary glass railing solutions for staircases, balconies and terraces.",
    priceKes: 42000,
    image: "/images/balcony-railing.jpg",
    imageAlt: "Glass and metal balcony railing",
    unit: "from",
    active: true,
  },
  {
    id: "commercial-kitchen-worktable",
    sku: "EYE-KT-001",
    name: "Commercial Kitchen Worktable",
    category: "Commercial Kitchens",
    description:
      "Durable stainless-steel worktable fabrication for professional food-service spaces.",
    priceKes: 28500,
    image: "/images/steel-kitchen.jpg",
    imageAlt: "Stainless steel commercial kitchen worktable",
    unit: "from",
    active: true,
  },
];

export const formatKes = (value: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
