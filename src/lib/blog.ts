import { siteImages } from "@/lib/site-images";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  imageAlt: string;
  body: { heading: string; paragraphs: string[] }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "choosing-railings-for-your-home",
    title: "Choosing the right railing for your home or balcony",
    excerpt:
      "Stainless steel, glass or a mix of both — how to pick a railing that suits your space, your budget and the way you actually use it.",
    date: "2026-08-18",
    readTime: "5 min read",
    category: "Guides",
    image: siteImages.railing,
    imageAlt: "Stainless steel staircase railing with glass panels in a bright home",
    body: [
      {
        heading: "Start with how the space is used",
        paragraphs: [
          "A staircase inside a family home, a first-floor balcony and a shop mezzanine all carry different demands. Before choosing a material, think about who uses the space every day, whether small children are around, and how much weather the railing will face.",
          "That single question usually narrows the choice quickly. Interior stairs can take a lighter, more decorative approach, while external balconies need finishes that hold up to sun and rain year after year.",
        ],
      },
      {
        heading: "Stainless steel versus glass infill",
        paragraphs: [
          "Stainless steel gives you strength, a clean look and a finish that wipes down easily. Glass infill keeps sightlines open, which makes small balconies and narrow staircases feel much larger.",
          "Many of our projects combine the two: steel posts and handrail for structure, toughened glass panels for light. It is a practical middle ground and it ages well.",
        ],
      },
      {
        heading: "Measure before you commit",
        paragraphs: [
          "Heights, spacing between posts and the fixing method all affect both safety and cost. We take site measurements before fabrication so the finished railing fits the opening properly rather than being adjusted on site.",
          "Send us photos and rough dimensions and we can talk through the options with you before anything is cut.",
        ],
      },
    ],
  },
  {
    slug: "aluminium-windows-and-doors-explained",
    title: "Aluminium windows and doors: what to ask before you order",
    excerpt:
      "Frames, glazing and hardware make a bigger difference than most people expect. Here is what to check when specifying aluminium for a new build or renovation.",
    date: "2026-07-02",
    readTime: "6 min read",
    category: "Materials",
    image: siteImages.aluminium,
    imageAlt: "Modern aluminium framed sliding doors on a contemporary house",
    body: [
      {
        heading: "Frames do more than hold glass",
        paragraphs: [
          "The profile you choose sets the sightlines, the weight the frame can carry and how the unit seals against dust and rain. Slimmer is not always better — larger openings need deeper sections to stay rigid.",
          "For openings above standard sizes we usually recommend a heavier system, even where a lighter one would technically fit.",
        ],
      },
      {
        heading: "Glazing options change the room",
        paragraphs: [
          "Clear, tinted, laminated and double-glazed units all behave differently in terms of heat, glare and sound. A west-facing living room and a back office are not the same brief.",
          "We can walk through the trade-offs and quote a couple of alternatives so you can compare before deciding.",
        ],
      },
      {
        heading: "Hardware is what you touch every day",
        paragraphs: [
          "Handles, hinges, rollers and locks take the wear. Specifying decent hardware from the start costs a little more and saves callouts later.",
          "Ask for the hardware to be listed on your quote so you know exactly what is being supplied.",
        ],
      },
    ],
  },
  {
    slug: "caring-for-glass-and-steel-finishes",
    title: "Keeping glass and steel finishes looking new",
    excerpt:
      "Simple maintenance habits that keep balustrades, shower enclosures and shopfronts looking as good as the day they were installed.",
    date: "2026-05-21",
    readTime: "4 min read",
    category: "Maintenance",
    image: siteImages.shower,
    imageAlt: "Frameless glass shower enclosure in a modern tiled bathroom",
    body: [
      {
        heading: "Glass: rinse, then dry",
        paragraphs: [
          "Most marks on shower glass are mineral deposits from water left to dry on the surface. A quick squeegee after use does more than any cleaning product.",
          "For shopfronts and partitions, a mild soap solution and a soft cloth is enough. Avoid abrasive pads, which leave fine scratches that catch the light.",
        ],
      },
      {
        heading: "Stainless steel needs air and a wipe",
        paragraphs: [
          "Stainless resists corrosion but it is not immune, especially near coastal air or where cleaning chemicals sit on the surface. Wipe along the grain with a damp cloth and dry it off.",
          "Small surface marks can usually be polished out rather than replaced.",
        ],
      },
      {
        heading: "Check the fixings once a year",
        paragraphs: [
          "Railings and gates move slightly with use. An annual look at bolts, hinges and wall fixings catches problems while they are still small.",
          "We also offer maintenance arrangements for commercial clients who would rather have this scheduled.",
        ],
      },
    ],
  },
  {
    slug: "planning-a-fabrication-project",
    title: "How a fabrication project actually runs, step by step",
    excerpt:
      "From the first conversation to handover — what happens at each stage of a steel, aluminium or glass project, and what we need from you.",
    date: "2026-04-09",
    readTime: "5 min read",
    category: "Process",
    image: siteImages.steel,
    imageAlt: "Fabricators welding a steel frame in a workshop",
    body: [
      {
        heading: "1. Brief and site visit",
        paragraphs: [
          "We start with what you are trying to achieve, then confirm it against the site. Drawings help, but photos and rough measurements are enough to begin.",
        ],
      },
      {
        heading: "2. Quotation and materials",
        paragraphs: [
          "You receive a written quote listing materials, finishes and scope so there are no surprises later. Once approved, materials are ordered and slotted into the workshop schedule.",
        ],
      },
      {
        heading: "3. Fabrication and finishing",
        paragraphs: [
          "Work is prepared in the workshop where conditions are controlled, which gives a better finish than doing everything on site.",
        ],
      },
      {
        heading: "4. Installation and handover",
        paragraphs: [
          "We coordinate delivery and installation around your programme, then walk the finished work with you before signing off.",
        ],
      },
    ],
  },
];

export function getPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function formatPostDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fromSupabaseRow(row: {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image_url: string | null;
  image_alt: string;
  read_time: string;
  body: unknown;
  published_at: string | null;
}): BlogPost {
  const body = Array.isArray(row.body) ? row.body : [];
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    date: row.published_at ?? new Date().toISOString(),
    readTime: row.read_time,
    category: row.category,
    image: row.image_url || siteImages.steel,
    imageAlt: row.image_alt || row.title,
    body: body as BlogPost["body"],
  };
}

export async function loadPublishedPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured) return blogPosts;
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, title, excerpt, category, image_url, image_alt, read_time, body, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) return blogPosts;
  return (data ?? []).map((row) => fromSupabaseRow(row));
}

export async function loadPublishedPost(slug: string): Promise<BlogPost | undefined> {
  if (!isSupabaseConfigured) return getPost(slug);
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, title, excerpt, category, image_url, image_alt, read_time, body, published_at")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) return getPost(slug);
  return data ? fromSupabaseRow(data) : undefined;
}
