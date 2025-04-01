/* HOST */
export const HOSTNAME = "http://192.168.1.37:8080";

/* ROUTES */
export const HOME = 'home';
export const SETTINGS = 'settings';
export const POST = 'post'
export const SHOP = 'shop'
export const ITEM_DETAILS = 'itemDetails';

/* HTTP METHODS */
export const GET = 'get';

/* EXTENSION FILES */
export const JSON = 'json';

/* STRINGS */
export const EMPTY = '';

/* LOGIN */
export const LOGIN = 'login';
export const SIGN_UP = 'signup'

/* SHOP */
export const PROVINCES = [
    "All Spain", "Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga",
    "Murcia", "Palma", "Bilbao", "Alicante", "Córdoba", "Valladolid", "Vigo",
    "Gijón", "Granada", "Elche", "Oviedo", "Badalona", "Cartagena"
];

export const ORDER_OPTIONS = [
    { name: "Price: Low to High", code: "price_asc" },
    { name: "Price: High to Low", code: "price_desc" },
    { name: "Newest First", code: "newest" },
    { name: "Oldest First", code: "oldest" },
    { name: "Most Popular", code: "popular" },
    { name: "Least Popular", code: "less_popular" }
];

export const CATEGORIES = [
    { name: 'Others', code: 'Others' },
    { name: 'Shoes', code: 'Shoes' },
    { name: 'Shirts', code: 'Shirts' },
    { name: 'Jackets', code: 'Jackets' },
    { name: 'Hoodies', code: 'Hoodies' },
    { name: 'Pants', code: 'Pants' },
    { name: 'Accessories', code: 'Accessories' }
]