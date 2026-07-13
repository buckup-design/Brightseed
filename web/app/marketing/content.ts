/**
 * Marketing site content — single source of truth for both style directions.
 *
 * Copy + structure lifted verbatim from the Figma draft
 * (BSD Hummingbird (Copy), node 23:183): Hero, Testimonials, Footer.
 * The two page compositions (editorial / product) import this so the
 * client is comparing the SAME content in different skins.
 */

export const hero = {
  eyebrow: "Traceable · Trusted · Proprietary",
  product: "hummingbird",
  trademark: "™",
  // Subhead shown inside the product preview in the Figma draft. Reused as the
  // hero lede across both directions.
  lede:
    "Ask questions, explore mechanisms, compare ingredients, and develop " +
    "evidence-backed product concepts with Brightseed's AI interface — powered " +
    "by proprietary bioactive intelligence.",
  primaryCta: "Log In",
  secondaryCta: "Request a Demo",
  // Product-preview mock (rebuilt as real DOM, not a screenshot).
  preview: {
    prompt: "What can I help you create today?",
    suggestions: [
      "Find compounds for glucose metabolism",
      "Show me ingredient combinations for weight management",
      "What synergizes with berberine?",
      "Give me comprehensive information about rutin.",
    ],
  },
} as const;

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Lauren R.",
    role: "Nutriquest",
    quote:
      "The value isn't another chatbot. It's something more evidence-based, more specific, and more useful for real scientific decisions.",
  },
  {
    name: "Anonymous",
    role: "R&D Team Lead",
    quote:
      "The ability to start with a natural-language question and quickly get to a credible shortlist is very useful.",
  },
  {
    name: "Ben P.",
    role: "Science Leader",
    quote:
      "What makes this useful is having the rationale, biomarkers, dose guidance, and supporting evidence tied together in one place.",
  },
];

export const footer = {
  signup: {
    heading: "Get in Touch",
    body: "Be the first to know about new updates, discoveries, and more from Brightseed.",
    emailPlaceholder: "Email Address",
    submit: "Submit",
  },
  menus: [
    {
      heading: "Brightseed",
      links: ["Mission", "About Us", "Our Evolution", "What We Do Today", "Our Team"],
    },
    {
      heading: "Connect",
      links: ["Newsroom", "Contact"],
    },
  ],
  social: ["LinkedIn", "X", "Instagram"] as const,
  legal: ["Privacy Policy", "Terms of Use", "Transparency in Coverage", "Cookie Settings"],
  copyright: "© 2026, Brightseed. All rights reserved.",
} as const;
