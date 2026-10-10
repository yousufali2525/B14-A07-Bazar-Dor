export type Market = {name: string;price: number;};
export type Product = {id: string;slug: string;name: string;emoji: string;unit: string;price: number;change: number;category: string;description: string;tags: string[];markets: Market[]; min: number;max: number;avg: number;};
export type Category = {slug: string;name: string;icon: string;};
