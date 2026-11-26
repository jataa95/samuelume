// Everything you'd normally want to edit lives in this file.

export const site = {
  name: "Samuel Ume",
  alias: "Artpostle Sam",
  role: "Visual Artist",
  tagline: "Paintings made with fire and acrylic.",
  location: "Nigeria",
  email: "samuelume0708@gmail.com",
  url: "https://samuelume.vercel.app",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/samuelume/" },
    { label: "Threads", href: "https://www.threads.net/@samuelume" },
  ],
  stats: [
    { value: "19.4K", label: "Instagram community" },
    { value: "211", label: "Posts of work & process" },
    { value: "100", label: "Days of posting fire art" },
  ],
};

export type Work = {
  slug: string;
  title: string;
  category: Category;
  medium: string;
  size?: string;
  year?: string;
  status?: "Available" | "Sold";
  edition?: string;
  /** One or two lines, shown on the home carousel and as the hero intro. */
  excerpt: string;
  /** The full story. Each `heading` becomes a serif pull-heading on the work page. */
  story: { heading?: string; body: string[] }[];
  quote?: { text: string; by: string };
  /** Path in /public. Leave undefined until a photo of the finished piece is available. */
  image?: { src: string; width: number; height: number };
  /** Process video in /public/video (without extension); a .jpg poster with the same name is expected. */
  video?: string;
};

export const categories = ["Heritage", "Childhood", "Memory", "Society"] as const;
export type Category = (typeof categories)[number];

export const works: Work[] = [
  {
    slug: "hadassah",
    title: "Hadassah",
    category: "Heritage",
    medium: "Fire, acrylic on canvas",
    size: "3 × 4 ft",
    year: "2025",
    status: "Available",
    excerpt: "A village girl's extraordinary ascent from obscurity to sovereignty, from adversity to triumph.",
    story: [
      {
        heading: "A visual prophecy of hope.",
        body: [
          "Hadassah tells the story of a village girl's extraordinary ascent from obscurity to sovereignty, from adversity to triumph. It is a visual prophecy of hope, a foreshadowing of the rise of a mediator and deliverer for the helpless, a reminder that destiny favors the bold and the faithful.",
        ],
      },
      {
        heading: "More than a portrait.",
        body: [
          "Through this piece, I seek to capture the essence of transformation, resilience, and the power of the human spirit. Hadassah is more than a portrait; it is a testament to the boundless potential within every individual, regardless of background or circumstance.",
          "As an artist, my work aims to inspire, uplift, and challenge societal norms. Hadassah is a celebration of African beauty, heritage, and the indomitable spirit of women who defied expectations, embraced their calling, and changed the course of history.",
        ],
      },
    ],
    image: { src: "/works/hadassah.webp", width: 676, height: 880 },
    video: "hadassah-process",
  },
  {
    slug: "hairitage",
    title: "Hairitage",
    category: "Heritage",
    medium: "Fire and acrylic on canvas",
    year: "2026",
    status: "Available",
    edition: "1/10",
    excerpt: "A celebration of African hair and the rich styling traditions passed down to us.",
    story: [
      {
        heading: "As though the hair itself is sacred.",
        body: [
          "Hairitage is a celebration of African hair and the rich styling traditions passed down to us. Set against a muted olive-green background, the woman's elaborate hairstyle is illuminated by a golden halo, almost as though the hair itself is sacred.",
          "The piece invites us to reconsider what we inherited, appreciate the uniqueness of African hair, and explore all that it can become.",
        ],
      },
    ],
    image: { src: "/works/hairitage.webp", width: 720, height: 690 },
    video: "hairitage-process",
  },
  {
    slug: "ada-big-sis",
    title: "Ada (Big Sis)",
    category: "Childhood",
    medium: "Fire and acrylics on canvas",
    year: "2026",
    excerpt: "For every elder sibling who had to stand in for a parent. The truest personification of a hero.",
    story: [
      {
        heading: "The truest personification of a hero.",
        body: [
          "This piece celebrates every elder sibling that had to stand in for their parent to raise and take care of their younger ones.",
          "Ada is an Igbo word for first daughter, and in most settings she is more like a mini mom, taking up some motherly roles very early. In the Igbo tradition, they are very well respected in families and the community at large.",
        ],
      },
      {
        heading: "A story that is rarely told.",
        body: [
          "This piece tells the true story of a military brat whose parents were both in active service and deployed to Japan in the late 90s. She recalls how she sacrificed some childhood play and convenience, putting on a parental instinct each time her parents were out on missions.",
          "It captures a moment back in time and tells a broader story that is rarely told, celebrating the heroes that are hardly noticed.",
        ],
      },
    ],
    image: { src: "/works/ada.webp", width: 628, height: 640 },
    video: "ada-process",
  },
  {
    slug: "untitled-border",
    // TODO: confirm the real title of this piece.
    title: "Untitled (Border)",
    category: "Society",
    medium: "Fire and acrylic on canvas",
    status: "Sold",
    excerpt: "Samuel's largest piece to date: a family of four, waiting at a taped-off border fence.",
    story: [
      {
        heading: "The largest canvas yet.",
        body: [
          "A father holding a passport, a mother in polka dots, two children and everything they own packed into a woven bag, set against chain-link fence and yellow tape that reads “no border crossing”.",
          "Built up figure by figure with flame and palette knife before the blue was laid in around them. The piece has since been sold.",
        ],
      },
    ],
    image: { src: "/works/no-border-crossing.webp", width: 1026, height: 1009 },
    video: "border-process",
  },
  {
    slug: "in-your-shoes",
    title: "In Your Shoes",
    category: "Childhood",
    medium: "Fire and acrylics on canvas",
    excerpt: "We grow up wanting to be in our parents' shoes, believing that being grown means having it all figured out.",
    story: [
      {
        heading: "The polished, 2D version.",
        body: [
          "We grow up wanting to be in our parents' shoes, believing that being grown means having it all figured out.",
          "Perhaps adulthood is not so different. We look at other people's lives, admire what they have, and sometimes wish we could trade places with them. But just like this child, we are only seeing the parts of their lives that are visible to us: the polished, 2D version.",
        ],
      },
      {
        heading: "Walk honestly in your own.",
        body: [
          "There is always a story behind the smile, a weight behind the walk, and a part of the journey we never get to see.",
          "After three decades here, I have come to realize that it is the owner of the shoe who knows where it hurts. Maybe the lesson is not to wish for another person's shoes, but to learn to walk honestly in our own.",
        ],
      },
    ],
    // TODO: add /works/in-your-shoes.webp once a photo file is available.
  },
  {
    slug: "tales-of-yesterday",
    title: "Tales of Yesterday",
    category: "Memory",
    medium: "Fire and acrylics on canvas",
    size: "3 × 4 ft",
    year: "2026",
    excerpt: "That nostalgic feeling that visits when we stumble upon some relic of our past.",
    quote: {
      text: "Memories are invisible threads that quietly tie our past to our present, woven from laughter, and moments that felt ordinary then become precious now.",
      by: "Pragar Loke",
    },
    story: [
      {
        heading: "Becoming children again.",
        body: [
          "We grow old so fast that we forget what it used to feel like to be young. This piece explores that nostalgic feeling that visits us every once in a while when we stumble upon some relic of our past, opening a portal where threads of beautiful memories, and sometimes painful ones, begin to flow.",
          "For a moment, we relive those memories, becoming children again.",
        ],
      },
    ],
    // TODO: add /works/tales-of-yesterday.webp once a photo file is available.
  },
];

export const process = [
  {
    n: "01",
    title: "Sketch",
    body: "Every piece starts as a graphite line drawing on raw canvas, gridded and measured at full scale.",
    points: ["Graphite", "Grid transfer", "Raw canvas"],
    video: "hairitage-process",
  },
  {
    n: "02",
    title: "Fire",
    body: "Tone is burnt in with a torch and a heated palette knife. Skin, fabric and hair are built from scorch, layer by layer.",
    points: ["Torch", "Palette knife", "Scorch & smoke"],
    video: "hadassah-process",
  },
  {
    n: "03",
    title: "Acrylic",
    body: "Colour arrives last: backgrounds, beads, halos and the small details that place each story in its world.",
    points: ["Backgrounds", "Gold leaf & halos", "Final details"],
    video: "ada-process",
  },
];

export function getWork(slug: string) {
  return works.find((w) => w.slug === slug);
}
