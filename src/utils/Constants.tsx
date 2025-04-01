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
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "popular", label: "Most Popular" },
    { value: "less_popular", label: "Least Popular" }
];

export const CATEGORIES = [
    "Others",
    "Shoes",
    "Shirts",
    "Jackets",
    "Hoodies",
    "Pants",
    "Accessories"
]