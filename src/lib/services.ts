import { siteImages as images } from "@/lib/site-images";

export type Service = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  intro: string;
  hero: string;
  heroAlt: string;
  offerings: string[];
  applications: string[];
  options: { label: string; detail: string }[];
  projects: { title: string; detail: string; image: string }[];
  faqs: { question: string; answer: string }[];
};

export const services: Service[] = [
  {
    slug: "stainless-steel-fabrication",
    number: "01",
    title: "Stainless Steel Fabrication",
    shortTitle: "Stainless Steel",
    description:
      "Railings, stairs, gates, grills and architectural metalwork fabricated for dependable everyday use.",
    intro:
      "We design and fabricate stainless-steel elements that combine structural strength with a clean, considered finish. From residential railings to commercial gates and custom metal details, our team can support your project from measurement through installation.",
    hero: images.steel,
    heroAlt: "Stainless steel fabrication in a workshop",
    offerings: [
      "Balcony and staircase railings",
      "Gates, grills and security features",
      "Stainless-steel stairs and handrails",
      "Architectural and decorative metalwork",
    ],
    applications: [
      "Homes and apartments",
      "Offices, shops and hospitality spaces",
      "Schools, institutions and public buildings",
    ],
    options: [
      { label: "Finish", detail: "Brushed, polished or project-specific finishes." },
      { label: "Fabrication", detail: "Custom measurements and made-to-order detailing." },
      { label: "Delivery", detail: "Supply, installation and completion coordination." },
    ],
    projects: [
      {
        title: "Staircase and balcony railings",
        detail: "Residential application",
        image: images.railing,
      },
      {
        title: "Custom stainless-steel gate",
        detail: "Security and entrance feature",
        image: images.steel,
      },
      {
        title: "Architectural metal details",
        detail: "Commercial application",
        image: images.metalwork,
      },
    ],
    faqs: [
      {
        question: "Can you work from drawings or reference images?",
        answer:
          "Yes. Share drawings, dimensions or reference images and we can help define the fabrication approach.",
      },
      {
        question: "Do you provide measurements and installation?",
        answer:
          "We can coordinate site measurements, fabrication and installation as part of the project scope.",
      },
      {
        question: "Which finish is best for my project?",
        answer:
          "The right finish depends on location, use and the appearance you want. We can recommend an option during consultation.",
      },
    ],
  },
  {
    slug: "aluminium-works",
    number: "02",
    title: "Aluminium Works",
    shortTitle: "Aluminium Works",
    description:
      "Aluminium doors, windows, shopfronts, partitions, shutters and railings for modern spaces.",
    intro:
      "Our aluminium work is planned around the way your space is used. We help homeowners, architects and commercial clients select practical door, window and frontage solutions, then coordinate fabrication and installation for a clean final result.",
    hero: images.aluminium,
    heroAlt: "Modern aluminium doors and windows",
    offerings: [
      "Aluminium doors and windows",
      "Shopfronts and commercial frontages",
      "Office partitions and screens",
      "Shutters, railings and custom systems",
    ],
    applications: [
      "Homes, apartments and estates",
      "Offices, shops and restaurants",
      "Commercial and institutional developments",
    ],
    options: [
      {
        label: "System",
        detail: "Sliding, hinged, folding, fixed or project-specific configurations.",
      },
      {
        label: "Glazing",
        detail: "Select glass and frame combinations to suit light, privacy and use.",
      },
      {
        label: "Hardware",
        detail: "Coordinate handles, locks, rollers and other operating components.",
      },
    ],
    projects: [
      {
        title: "Residential aluminium windows",
        detail: "Light, ventilation and security",
        image: images.aluminium,
      },
      { title: "Office glass partitioning", detail: "Commercial interior", image: images.glazing },
      { title: "Retail shopfront", detail: "Customer-facing frontage", image: images.metalwork },
    ],
    faqs: [
      {
        question: "Can you replace or repair existing aluminium work?",
        answer:
          "We can review replacement, adjustment or new fabrication requirements after understanding the existing installation.",
      },
      {
        question: "Do you help choose between sliding and hinged systems?",
        answer:
          "Yes. We consider available space, ventilation, security, access and the way the opening will be used.",
      },
      {
        question: "Do you install the completed aluminium work?",
        answer: "Installation can be included in the agreed project scope.",
      },
    ],
  },
  {
    slug: "glass-curtain-walls",
    number: "03",
    title: "Glass Curtain Walls & Architectural Glazing",
    shortTitle: "Glass & Curtain Walls",
    description:
      "Glass partitions, curtain walls and architectural glazing for modern commercial and public spaces.",
    intro:
      "We support architectural glazing requirements with practical coordination from early measurements through fabrication and installation. Our team can work with architects, contractors and property owners on glass façades, partitions and contemporary interior applications.",
    hero: images.glazing,
    heroAlt: "Glass curtain wall and modern office glazing",
    offerings: [
      "Glass curtain walls",
      "Structural and architectural glazing",
      "Office partitions and fronts",
      "Custom glass installation",
    ],
    applications: [
      "Office buildings and commercial spaces",
      "Retail, hospitality and mixed-use developments",
      "Institutional and public projects",
    ],
    options: [
      {
        label: "Glass selection",
        detail: "Discuss privacy, light, appearance and project requirements.",
      },
      {
        label: "Framing",
        detail: "Coordinate framing and fixing details for the intended application.",
      },
      {
        label: "Project coordination",
        detail: "Work with drawings, site measurements and installation sequencing.",
      },
    ],
    projects: [
      {
        title: "Office glazing and partitions",
        detail: "Commercial interior",
        image: images.glazing,
      },
      {
        title: "Glass frontage",
        detail: "Retail and public-facing space",
        image: images.aluminium,
      },
      {
        title: "Architectural glass detail",
        detail: "Modern building application",
        image: images.metalwork,
      },
    ],
    faqs: [
      {
        question: "Can you work with an architect or contractor?",
        answer:
          "Yes. Share drawings and project requirements so we can coordinate the relevant fabrication and installation details.",
      },
      {
        question: "Do you offer site measurements?",
        answer: "Site assessment and measurement can be arranged as part of the quotation process.",
      },
      {
        question: "What information is needed for a quote?",
        answer:
          "Project location, drawings or dimensions, intended use, preferred appearance and timeline are helpful starting points.",
      },
    ],
  },
  {
    slug: "frameless-shower-cubicles",
    number: "04",
    title: "Frameless Shower Cubicles & Glass Doors",
    shortTitle: "Shower Cubicles",
    description:
      "Custom frameless shower enclosures, glass doors, mirrors and hardware for contemporary bathrooms.",
    intro:
      "We create made-to-measure glass shower solutions for homes, apartments, hotels and other interior spaces. The process considers the bathroom layout, door movement, wall condition, drainage and the finish you want to achieve.",
    hero: images.shower,
    heroAlt: "Contemporary glass shower enclosure",
    offerings: [
      "Walk-in shower screens",
      "Hinged and sliding glass doors",
      "Frameless shower cubicles",
      "Mirrors and designer glass details",
    ],
    applications: [
      "Residential bathrooms",
      "Apartments and property developments",
      "Hotels, spas and hospitality spaces",
    ],
    options: [
      { label: "Glass appearance", detail: "Clear, tinted, frosted or project-specific options." },
      {
        label: "Hardware finish",
        detail: "Coordinate the hardware appearance with the bathroom design.",
      },
      {
        label: "Configuration",
        detail: "Select fixed panels, hinged doors, sliding doors or walk-in layouts.",
      },
    ],
    projects: [
      { title: "Walk-in shower enclosure", detail: "Residential bathroom", image: images.shower },
      { title: "Frameless glass door", detail: "Contemporary interior", image: images.glazing },
      { title: "Custom mirror installation", detail: "Interior finish", image: images.aluminium },
    ],
    faqs: [
      {
        question: "Can you work with an unusual bathroom layout?",
        answer:
          "Yes. Custom measurement allows us to plan around walls, corners, openings and the available space.",
      },
      {
        question: "How do I choose the right shower-door configuration?",
        answer:
          "We consider available clearance, access, drainage and the desired look before recommending a layout.",
      },
      {
        question: "How should frameless glass be maintained?",
        answer:
          "Regular cleaning with suitable non-abrasive products helps preserve the glass and hardware finish.",
      },
    ],
  },
  {
    slug: "glass-railings-balustrades",
    number: "05",
    title: "Glass Railings & Balustrades",
    shortTitle: "Glass Railings",
    description:
      "Modern glass railing systems for staircases, balconies, terraces, rooftops and commercial interiors.",
    intro:
      "Glass balustrades bring light and openness to a space while providing a defined edge and finished architectural detail. We help select a suitable fixing approach, glass appearance and handrail option for the project.",
    hero: images.railing,
    heroAlt: "Glass railing and balustrade installation",
    offerings: [
      "Spigot-fixed balustrades",
      "Channel-fixed glass railings",
      "Staircase and balcony systems",
      "Handrails and stainless-steel details",
    ],
    applications: [
      "Staircases, balconies and terraces",
      "Rooftops and mezzanines",
      "Commercial interiors and public spaces",
    ],
    options: [
      {
        label: "Fixing style",
        detail: "Discuss spigot, channel, post-and-glass or other project-specific systems.",
      },
      {
        label: "Glass appearance",
        detail: "Select clear, tinted or privacy-oriented options where suitable.",
      },
      {
        label: "Top detail",
        detail: "Add a handrail or keep a minimal frameless profile depending on the design.",
      },
    ],
    projects: [
      { title: "Staircase balustrade", detail: "Residential interior", image: images.railing },
      { title: "Balcony glass railing", detail: "External application", image: images.glazing },
      {
        title: "Commercial atrium railing",
        detail: "Public-facing space",
        image: images.metalwork,
      },
    ],
    faqs: [
      {
        question: "Which fixing system should I choose?",
        answer:
          "The best system depends on the structure, edge condition, appearance and installation requirements. We can advise after a site review.",
      },
      {
        question: "Can you install glass railings on stairs?",
        answer:
          "Yes. Staircase and balcony applications can be planned around the geometry and fixing conditions of the site.",
      },
      {
        question: "Can a handrail be added?",
        answer:
          "Yes. Handrails and stainless-steel details can be included where required by the design or use case.",
      },
    ],
  },
  {
    slug: "commercial-kitchen-fabrication",
    number: "06",
    title: "Commercial Kitchen Supplies & Fabrication",
    shortTitle: "Commercial Kitchens",
    description:
      "Stainless-steel kitchen fabrication and supply planned around professional food-service workflows.",
    intro:
      "We create practical commercial kitchen elements for restaurants, hotels, institutions and other food-service environments. The work can be coordinated around your equipment list, site conditions, preparation flow and service requirements.",
    hero: images.kitchen,
    heroAlt: "Commercial kitchen preparation and fabrication",
    offerings: [
      "Preparation tables and counters",
      "Sinks, shelves and storage",
      "Service counters and workstations",
      "Custom stainless-steel kitchen elements",
    ],
    applications: [
      "Restaurants, cafés and hotels",
      "Schools, hospitals and institutions",
      "Catering and food-production facilities",
    ],
    options: [
      {
        label: "Workflow",
        detail: "Plan receiving, storage, preparation, cooking, service, washing and waste zones.",
      },
      {
        label: "Fabrication",
        detail: "Coordinate dimensions, equipment integration and stainless-steel details.",
      },
      {
        label: "Installation",
        detail: "Align fabrication and delivery with the wider site programme.",
      },
    ],
    projects: [
      {
        title: "Restaurant preparation area",
        detail: "Food-service workflow",
        image: images.kitchen,
      },
      {
        title: "Stainless-steel workstations",
        detail: "Commercial back-of-house",
        image: images.steel,
      },
      {
        title: "Service and storage counters",
        detail: "Hospitality application",
        image: images.aluminium,
      },
    ],
    faqs: [
      {
        question: "Can you work from an equipment list?",
        answer:
          "Yes. Equipment dimensions and workflow requirements are useful inputs for planning the fabrication.",
      },
      {
        question: "Do you fabricate custom stainless-steel counters?",
        answer:
          "Yes. Counters, tables, sinks, shelves and other made-to-measure elements can be discussed for your operation.",
      },
      {
        question: "Can installation be coordinated with other contractors?",
        answer:
          "Project sequencing can be discussed during quotation so the work fits the wider site programme.",
      },
    ],
  },
  {
    slug: "architectural-metalwork",
    number: "07",
    title: "Architectural & Decorative Metalwork",
    shortTitle: "Architectural Metalwork",
    description:
      "Custom metal screens, gates, feature details and fabricated elements that give spaces a distinctive finish.",
    intro:
      "We turn sketches, references and design ideas into fabricated metal elements for homes, commercial interiors, hospitality spaces and architectural projects. The service is suited to work that needs both careful detailing and dependable installation.",
    hero: images.metalwork,
    heroAlt: "Architectural metalwork and custom fabricated detail",
    offerings: [
      "Decorative screens and partitions",
      "Feature walls and frames",
      "Custom gates and entrance details",
      "Bespoke architectural metal elements",
    ],
    applications: [
      "Residential interiors and exteriors",
      "Hospitality, retail and office spaces",
      "Architectural façades and public projects",
    ],
    options: [
      {
        label: "Design input",
        detail: "Start with drawings, sketches, reference images or a design brief.",
      },
      {
        label: "Materials and finishes",
        detail: "Discuss suitable materials, surface treatment and the desired appearance.",
      },
      {
        label: "Installation",
        detail: "Coordinate fixing, delivery and final placement as part of the project.",
      },
    ],
    projects: [
      {
        title: "Decorative feature screen",
        detail: "Interior architectural detail",
        image: images.metalwork,
      },
      { title: "Custom entrance gate", detail: "Residential exterior", image: images.steel },
      { title: "Metal partition detail", detail: "Commercial interior", image: images.aluminium },
    ],
    faqs: [
      {
        question: "Can you fabricate from a sketch or reference image?",
        answer:
          "Yes. A sketch, drawing, reference image or design brief can be used to start the discussion.",
      },
      {
        question: "Can you help refine the design?",
        answer:
          "We can discuss fabrication considerations, materials, finishes and installation requirements during consultation.",
      },
      {
        question: "Do you install decorative metalwork?",
        answer: "Installation can be included in the agreed scope for the project.",
      },
    ],
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

export const serviceLinks = services.map(({ slug, shortTitle }) => ({
  slug,
  label: shortTitle,
}));
