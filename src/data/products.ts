export interface Product {
  id: number;
  name: string;
  price: string | number;
  category: number;
  category_name?: string;
  image: string;
  images: string[];
  description: string;
  sizes: string[] | string;
  colors: string[] | string;
  rating: number;
  reviews: number;
  inStock: boolean;
  in_stock?: boolean;
  featured: boolean;
  trending: boolean;
  created_at?: string;
  updated_at?: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Classic White Shirt",
    price: 89.99,
    category: 1,
    category_name: "Women",
    image: "https://images.unsplash.com/photo-1669059921524-327a4c52cff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHdoaXRlJTIwc2hpcnQlMjBtaW5pbWFsfGVufDF8fHx8MTc3Mjk4ODMyMnww&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1669059921524-327a4c52cff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHdoaXRlJTIwc2hpcnQlMjBtaW5pbWFsfGVufDF8fHx8MTc3Mjk4ODMyMnww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1720005398225-4ea01c9d2b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd29tYW4lMjBkcmVzcyUyMGZhc2hpb258ZW58MXx8fHwxNzcyODgxNjA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Elegant classic white shirt made from premium cotton. Perfect for both casual and formal occasions.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Beige"],
    rating: 4.8,
    reviews: 124,
    inStock: true,
    featured: true,
    trending: true,
  },
  {
    id: 2,
    name: "Elegant Summer Dress",
    price: 149.99,
    category: 1,
    category_name: "Women",
    image: "https://images.unsplash.com/photo-1720005398225-4ea01c9d2b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd29tYW4lMjBkcmVzcyUyMGZhc2hpb258ZW58MXx8fHwxNzcyODgxNjA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1720005398225-4ea01c9d2b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd29tYW4lMjBkcmVzcyUyMGZhc2hpb258ZW58MXx8fHwxNzcyODgxNjA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1602303894456-398ce544d90b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBkcmVzcyUyMGZhc2hpb258ZW58MXx8fHwxNzcyOTE0NDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Beautiful flowing summer dress perfect for warm weather. Made with breathable fabric.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Pink", "Blue", "White"],
    rating: 4.9,
    reviews: 98,
    inStock: true,
    featured: true,
    trending: false,
  },
  {
    id: 3,
    name: "Men's Casual Jacket",
    price: 199.99,
    category: 2,
    category_name: "Men",
    image: "https://images.unsplash.com/photo-1632934330201-a641618914d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBjYXN1YWwlMjBqYWNrZXQlMjBjbG90aGluZ3xlbnwxfHx8fDE3NzI5NTgxMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1632934330201-a641618914d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBjYXN1YWwlMjBqYWNrZXQlMjBjbG90aGluZ3xlbnwxfHx8fDE3NzI5NTgxMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Stylish casual jacket for men. Perfect for everyday wear with a modern fit.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Gray"],
    rating: 4.7,
    reviews: 156,
    inStock: true,
    featured: false,
    trending: true,
  },
  {
    id: 4,
    name: "Stylish Knit Sweater",
    price: 119.99,
    category: 1,
    category_name: "Women",
    image: "https://images.unsplash.com/photo-1764974345389-09da4244809c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHlsaXNoJTIwc3dlYXRlciUyMGtuaXR3ZWFyfGVufDF8fHx8MTc3Mjk4ODMyMXww&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1764974345389-09da4244809c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHlsaXNoJTIwc3dlYXRlciUyMGtuaXR3ZWFyfGVufDF8fHx8MTc3Mjk4ODMyMXww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Cozy knit sweater with a modern design. Warm and comfortable for cooler days.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Cream", "Brown", "Black"],
    rating: 4.6,
    reviews: 87,
    inStock: true,
    featured: true,
    trending: false,
  },
  {
    id: 5,
    name: "Premium Denim Jeans",
    price: 129.99,
    category: 2,
    category_name: "Men",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzcyOTg4MzIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzcyOTg4MzIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Classic denim jeans with a perfect fit. Made from high-quality denim fabric.",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Blue", "Black", "Gray"],
    rating: 4.8,
    reviews: 203,
    inStock: true,
    featured: false,
    trending: true,
  },
  {
    id: 6,
    name: "Leather Handbag",
    price: 249.99,
    category: 3,
    category_name: "Accessories",
    image: "https://images.unsplash.com/photo-1559563458-527698bf5295?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBiYWd8ZW58MXx8fHwxNzcyOTg4MzIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1559563458-527698bf5295?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBiYWd8ZW58MXx8fHwxNzcyOTg4MzIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Elegant leather handbag with spacious interior. Perfect for everyday use.",
    sizes: ["One Size"],
    colors: ["Brown", "Black", "Tan"],
    rating: 4.9,
    reviews: 142,
    inStock: true,
    featured: true,
    trending: false,
  },
  {
    id: 7,
    name: "Kids Fashion Set",
    price: 79.99,
    category: 4,
    category_name: "Kids",
    image: "https://images.unsplash.com/photo-1733924304841-7320116fbe69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwY2hpbGRyZW4lMjBjbG90aGluZ3xlbnwxfHx8fDE3NzI5ODgzMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1733924304841-7320116fbe69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwY2hpbGRyZW4lMjBjbG90aGluZ3xlbnwxfHx8fDE3NzI5ODgzMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Comfortable and stylish clothing set for kids. Made with soft, breathable materials.",
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
    colors: ["Blue", "Pink", "White"],
    rating: 4.7,
    reviews: 76,
    inStock: true,
    featured: false,
    trending: false,
  },
  {
    id: 8,
    name: "Premium Sneakers",
    price: 179.99,
    category: 3,
    category_name: "Accessories",
    image: "https://images.unsplash.com/photo-1722489292298-d809c370aef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwc2hvZXMlMjBzbmVha2Vyc3xlbnwxfHx8fDE3NzI5ODgzMjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1722489292298-d809c370aef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwc2hvZXMlMjBzbmVha2Vyc3xlbnwxfHx8fDE3NzI5ODgzMjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Comfortable premium sneakers for everyday wear. Modern design with superior comfort.",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["White", "Black", "Gray"],
    rating: 4.8,
    reviews: 189,
    inStock: true,
    featured: false,
    trending: true,
  },
  {
    id: 9,
    name: "Winter Coat",
    price: 299.99,
    category: 1,
    category_name: "Women",
    image: "https://images.unsplash.com/photo-1543849877-4097ae9f2b73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGNvYXQlMjB3aW50ZXIlMjBmYXNoaW9ufGVufDF8fHx8MTc3Mjk4ODMyNHww&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1543849877-4097ae9f2b73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGNvYXQlMjB3aW50ZXIlMjBmYXNoaW9ufGVufDF8fHx8MTc3Mjk4ODMyNHww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Warm and stylish winter coat. Perfect for cold weather with premium insulation.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Camel", "Navy"],
    rating: 4.9,
    reviews: 167,
    inStock: true,
    featured: true,
    trending: true,
  },
  {
    id: 10,
    name: "Fashion Model Collection",
    price: 399.99,
    category: 1,
    category_name: "Women",
    image: "https://images.unsplash.com/photo-1614252369339-5929dd28c0c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBibGFjayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzcyOTg4MzI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1614252369339-5929dd28c0c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBibGFjayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzcyOTg4MzI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1678884399113-0a2b079a31f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBjbG90aGluZyUyMHN0dWRpb3xlbnwxfHx8fDE3NzI5ODgzMTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Exclusive designer collection piece. Limited edition premium fashion statement.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "White"],
    rating: 5.0,
    reviews: 52,
    inStock: true,
    featured: true,
    trending: true,
  },
];

export const categories = [
  { id: 1, name: "Women", count: 245 },
  { id: 2, name: "Men", count: 189 },
  { id: 3, name: "Kids", count: 134 },
  { id: 4, name: "Accessories", count: 98 },
];
