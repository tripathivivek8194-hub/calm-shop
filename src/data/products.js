const products = [
  {
    id: 'sphere-cluster-1',
    name: 'Aurora Sphere Cluster',
    slug: 'aurora-sphere-cluster',
    price: 128,
    originalPrice: null,
    description: 'A delicate arrangement of translucent spheres capturing the gentle gradient of dawn. Each sphere catches and refracts light differently, creating a calm, meditative presence in any space.',
    shortDescription: 'Translucent sphere arrangement with dawn gradients',
    category: 'spheres',
    geometryType: 'sphereCluster',
    color: '#a8d0e6',
    secondaryColor: '#f8c8d8',
    material: 'glass',
    dimensions: { width: 15, height: 20, depth: 15 },
    weight: 1.2,
    inStock: true,
    featured: true,
    tags: ['calm', 'glass', 'dawn', 'meditative'],
  },
  {
    id: 'torus-knot-1',
    name: 'Infinity Torus Knot',
    slug: 'infinity-torus-knot',
    price: 156,
    originalPrice: null,
    description: 'An elegant mathematical form that flows endlessly without beginning or end. The torus knot represents harmony and continuous flow, rendered in soft matte pastel tones.',
    shortDescription: 'Endless mathematical form in soft matte finish',
    category: 'knots',
    geometryType: 'torusKnot',
    color: '#d8c8f0',
    secondaryColor: '#b8e8d0',
    material: 'matte',
    dimensions: { width: 18, height: 18, depth: 12 },
    weight: 0.8,
    inStock: true,
    featured: true,
    tags: ['infinity', 'mathematical', 'harmony', 'flow'],
  },
  {
    id: 'icosahedron-1',
    name: 'Celestial Icosahedron',
    slug: 'celestial-icosahedron',
    price: 98,
    originalPrice: null,
    description: 'Twenty identical triangular faces form this perfect platonic solid. Associated with water and flow in sacred geometry, this piece brings a sense of balance and tranquility.',
    shortDescription: 'Perfect platonic solid with translucent faces',
    category: 'platonic',
    geometryType: 'icosahedron',
    color: '#b8e8d0',
    secondaryColor: '#a8d0e6',
    material: 'translucent',
    dimensions: { width: 14, height: 14, depth: 14 },
    weight: 0.6,
    inStock: true,
    featured: false,
    tags: ['sacred geometry', 'water', 'balance', 'platonic'],
  },
  {
    id: 'blob-1',
    name: 'Morning Dew Blob',
    slug: 'morning-dew-blob',
    price: 142,
    originalPrice: 168,
    description: 'Organic, amorphous form inspired by surface tension and fluid dynamics. The metaball surface shifts and flows, capturing a moment of liquid stillness in solid form.',
    shortDescription: 'Organic metaball form capturing liquid stillness',
    category: 'organic',
    geometryType: 'blob',
    color: '#f8d8c8',
    secondaryColor: '#fef3c7',
    material: 'wax',
    dimensions: { width: 22, height: 16, depth: 18 },
    weight: 1.5,
    inStock: true,
    featured: true,
    tags: ['organic', 'fluid', 'metaball', 'surface tension'],
  },
  {
    id: 'dodecahedron-1',
    name: 'Lavender Dodecahedron',
    slug: 'lavender-dodecahedron',
    price: 112,
    originalPrice: null,
    description: 'Twelve pentagonal faces create this cosmic form. Historically associated with the universe itself, this piece features subtle faceted reflections in calming lavender tones.',
    shortDescription: 'Twelve-faced cosmic form with faceted reflections',
    category: 'platonic',
    geometryType: 'dodecahedron',
    color: '#d8c8f0',
    secondaryColor: '#e8b8d8',
    material: 'crystal',
    dimensions: { width: 16, height: 16, depth: 16 },
    weight: 0.9,
    inStock: true,
    featured: false,
    tags: ['cosmic', 'universe', 'pentagonal', 'crystal'],
  },
  {
    id: 'geode-1',
    name: 'Crystal Geode Slice',
    slug: 'crystal-geode-slice',
    price: 188,
    originalPrice: null,
    description: 'A cross-section of crystalline growth, revealing layers of mineral beauty. Each angular facet catches light differently, creating a miniature landscape of pastel crystallization.',
    shortDescription: 'Crystalline cross-section with layered facets',
    category: 'geodes',
    geometryType: 'geode',
    color: '#a8d0e6',
    secondaryColor: '#d8c8f0',
    material: 'crystal',
    dimensions: { width: 20, height: 8, depth: 18 },
    weight: 2.1,
    inStock: true,
    featured: true,
    tags: ['crystal', 'mineral', 'geode', 'facets'],
  },
  {
    id: 'sphere-cluster-2',
    name: 'Peach Blossom Spheres',
    slug: 'peach-blossom-spheres',
    price: 134,
    originalPrice: null,
    description: 'A clustering of warm peach-toned spheres, each with a subtle pearlescent finish. Arranged in natural, asymmetric harmony reminiscent of spring blossoms.',
    shortDescription: 'Pearlescent sphere cluster in warm peach tones',
    category: 'spheres',
    geometryType: 'sphereCluster',
    color: '#f8d8c8',
    secondaryColor: '#fef3c7',
    material: 'pearl',
    dimensions: { width: 16, height: 22, depth: 16 },
    weight: 1.3,
    inStock: true,
    featured: false,
    tags: ['pearl', 'spring', 'blossom', 'asymmetric'],
  },
  {
    id: 'torus-knot-2',
    name: 'Mint Torus Flow',
    slug: 'mint-torus-flow',
    price: 164,
    originalPrice: null,
    description: 'A more complex torus knot with additional windings, creating deeper shadow play. The fresh mint tone brings a breath of calm energy to the mathematical elegance.',
    shortDescription: 'Complex torus knot with deeper shadow play',
    category: 'knots',
    geometryType: 'torusKnot',
    color: '#b8e8d0',
    secondaryColor: '#a8d0e6',
    material: 'matte',
    dimensions: { width: 20, height: 20, depth: 14 },
    weight: 1.0,
    inStock: true,
    featured: false,
    tags: ['complex', 'mint', 'shadow', 'winding'],
  },
  {
    id: 'octahedron-1',
    name: 'Blue Hour Octahedron',
    slug: 'blue-hour-octahedron',
    price: 86,
    originalPrice: null,
    description: 'Eight triangular faces meeting at perfect points. This platonic solid represents air and mental clarity, rendered in the soft blue of twilight hour.',
    shortDescription: 'Eight-faced platonic solid in twilight blue',
    category: 'platonic',
    geometryType: 'octahedron',
    color: '#a8d0e6',
    secondaryColor: '#d8c8f0',
    material: 'glass',
    dimensions: { width: 15, height: 15, depth: 15 },
    weight: 0.5,
    inStock: true,
    featured: false,
    tags: ['air', 'clarity', 'twilight', 'platonic'],
  },
  {
    id: 'blob-2',
    name: 'Lavender Dream Blob',
    slug: 'lavender-dream-blob',
    price: 158,
    originalPrice: null,
    description: 'A softer, more elongated organic form with multiple lobes merging into one. The lavender hue deepens in the recesses, creating natural gradient depth.',
    shortDescription: 'Multi-lobed organic form with natural gradients',
    category: 'organic',
    geometryType: 'blob',
    color: '#d8c8f0',
    secondaryColor: '#b8e8d0',
    material: 'wax',
    dimensions: { width: 24, height: 14, depth: 20 },
    weight: 1.7,
    inStock: false,
    featured: false,
    tags: ['dream', 'multi-lobed', 'gradient', 'organic'],
  },
  {
    id: 'geode-2',
    name: 'Rose Quartz Geode',
    slug: 'rose-quartz-geode',
    price: 210,
    originalPrice: 245,
    description: 'Larger geode formation with delicate crystalline structures in rose and cream tones. The cavity sparkles with micro-facets, each catching light independently.',
    shortDescription: 'Large geode with micro-crystalline cavity',
    category: 'geodes',
    geometryType: 'geode',
    color: '#f8c8d8',
    secondaryColor: '#fefaf0',
    material: 'crystal',
    dimensions: { width: 25, height: 12, depth: 22 },
    weight: 3.2,
    inStock: true,
    featured: true,
    tags: ['rose quartz', 'micro-crystals', 'sparkle', 'cavity'],
  },
  {
    id: 'tetrahedron-1',
    name: 'Cream Tetrahedron',
    slug: 'cream-tetrahedron',
    price: 72,
    originalPrice: null,
    description: 'The simplest platonic solid — four triangular faces forming a perfect pyramid. Minimal, grounding, and timeless in warm cream matte finish.',
    shortDescription: 'Simplest platonic solid in warm cream matte',
    category: 'platonic',
    geometryType: 'tetrahedron',
    color: '#fefaf0',
    secondaryColor: '#fef3c7',
    material: 'matte',
    dimensions: { width: 14, height: 14, depth: 14 },
    weight: 0.4,
    inStock: true,
    featured: false,
    tags: ['minimal', 'pyramid', 'grounding', 'simple'],
  },
];

export function getAllProducts() {
  return products;
}

export function getProductBySlug(slug) {
  return products.find(p => p.slug === slug);
}

export function getProductById(id) {
  return products.find(p => p.id === id);
}

export function getFeaturedProducts() {
  return products.filter(p => p.featured && p.inStock);
}

export function getProductsByCategory(category) {
  return products.filter(p => p.category === category);
}

export function getInStockProducts() {
  return products.filter(p => p.inStock);
}

export function getCategories() {
  const categories = [...new Set(products.map(p => p.category))];
  return categories.map(cat => ({
    id: cat,
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: products.filter(p => p.category === cat && p.inStock).length,
  }));
}

export function formatPrice(price) {
  // Product values originated in the prototype's base catalogue. Display them
  // as fixed INR prices so every product, cart total, and shipping amount uses
  // the same India-focused pricing scale.
  const inrPrice = price * 85;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(inrPrice);
}

export function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
