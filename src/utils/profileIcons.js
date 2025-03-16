// Collection of profile icons for user selection
export const profileIcons = [
  // Boys/Men icons
  {
    id: "boy1",
    src: "/icons/icons8.svg",
    alt: "Boy with blue shirt",
    category: "boy",
  },
  {
    id: "boy2",
    src: "/icons/icons9.svg",
    alt: "Boy with glasses",
    category: "boy",
  },
  {
    id: "boy3",
    src: "/icons/boy3.svg",
    alt: "Boy with headphones",
    category: "boy",
  },
  {
    id: "man1",
    src: "/icons/man1.svg",
    alt: "Man with beard",
    category: "boy",
  },
  {
    id: "man2",
    src: "/icons/man2.svg",
    alt: "Man with tie",
    category: "boy",
  },

  // Girls/Women icons
  {
    id: "girl1",
    src: "/icons/girl1.svg",
    alt: "Girl with ponytail",
    category: "girl",
  },
  {
    id: "girl2",
    src: "/icons/girl2.svg",
    alt: "Girl with glasses",
    category: "girl",
  },
  {
    id: "girl3",
    src: "/icons/girl3.svg",
    alt: "Girl with curly hair",
    category: "girl",
  },
  {
    id: "woman1",
    src: "/icons/woman1.svg",
    alt: "Woman with long hair",
    category: "girl",
  },
  {
    id: "woman2",
    src: "/icons/woman2.svg",
    alt: "Woman with bun",
    category: "girl",
  },

  // Animal icons
  {
    id: "dog",
    src: "/icons/dog.svg",
    alt: "Dog",
    category: "animal",
  },
  {
    id: "cat",
    src: "/icons/cat.svg",
    alt: "Cat",
    category: "animal",
  },
  {
    id: "fox",
    src: "/icons/fox.svg",
    alt: "Fox",
    category: "animal",
  },
  {
    id: "owl",
    src: "/icons/owl.svg",
    alt: "Owl",
    category: "animal",
  },

  // Math-themed icons
  {
    id: "calculator",
    src: "/icons/calculator.svg",
    alt: "Calculator",
    category: "math",
  },
  {
    id: "pi",
    src: "/icons/pi.svg",
    alt: "Pi symbol",
    category: "math",
  },
  {
    id: "formula",
    src: "/icons/formula.svg",
    alt: "Math formula",
    category: "math",
  },
  {
    id: "graph",
    src: "/icons/graph.svg",
    alt: "Math graph",
    category: "math",
  },

  // Default/placeholder icon
  {
    id: "default",
    src: "/icons/default.svg",
    alt: "Default profile",
    category: "default",
  },
];

// Helper function to get an icon by ID
export const getIconById = (id) => {
  return (
    profileIcons.find((icon) => icon.id === id) ||
    profileIcons[profileIcons.length - 1]
  ); // Return default if not found
};

// Profile icon categories for filtering
export const iconCategories = [
  { id: "all", label: "כל האייקונים" },
  { id: "boy", label: "בנים" },
  { id: "girl", label: "בנות" },
  { id: "animal", label: "חיות" },
  { id: "math", label: "מתמטיקה" },
];
