
import { Product, Category, User, Currency, EstablishmentDetails, UserRole } from './types';

export const TVA_RATE_REDUCED = 0.10; // 10%
export const TVA_RATE_STANDARD = 0.20; // 20%

export const CATEGORIES: Category[] = [
  { id: 'cat_salades', name: 'NOS SALADES', color: 'bg-green-500', imageUrl: '' },
  { id: 'cat_grillades', name: 'NOS GRILLADES', color: 'bg-red-600', imageUrl: '' },
  { id: 'cat_sandwichs', name: 'NOS SANDWICHS', color: 'bg-yellow-500', imageUrl: '' },
  { id: 'cat_pizzas', name: 'NOS PIZZAS', color: 'bg-orange-500', imageUrl: '' },
  { id: 'cat_paninis', name: 'NOS PANINIS', color: 'bg-amber-600', imageUrl: '' },
  { id: 'cat_desserts', name: 'NOS DESSERTS', color: 'bg-pink-500', imageUrl: '' },
  { id: 'cat_menu_enfants', name: 'MENU ENFANTS', color: 'bg-purple-500', imageUrl: '' },
];

export const PRODUCTS: Product[] = [
  // NOS SALADES
  { id: 'prod_salade_fes_inn', name: 'Salade FES INN', price: 70.00, imageUrl: '', category: 'cat_salades', stock: 50, vatRate: TVA_RATE_REDUCED },
  { id: 'prod_salade_quinoa', name: 'Salade Quinoa (Avocat/Mangue)', price: 70.00, imageUrl: '', category: 'cat_salades', stock: 50, vatRate: TVA_RATE_REDUCED },
  // NOS GRILLADES
  { id: 'prod_filet_boeuf', name: 'Filet de Bœuf', price: 120.00, imageUrl: '', category: 'cat_grillades', stock: 50, vatRate: TVA_RATE_REDUCED },
  { id: 'prod_entrecote', name: 'Entrecôte Grillée', price: 90.00, imageUrl: '', category: 'cat_grillades', stock: 50, vatRate: TVA_RATE_REDUCED },
  { id: 'prod_broch_viande', name: 'Brochettes Viande Hachée', price: 70.00, imageUrl: '', category: 'cat_grillades', stock: 50, vatRate: TVA_RATE_REDUCED },
  { id: 'prod_saucisses_grillees', name: 'Saucisses Viande Grillées', price: 80.00, imageUrl: '', category: 'cat_grillades', stock: 50, vatRate: TVA_RATE_REDUCED },
  { id: 'prod_cuisse_poulet', name: 'Cuisse de Poulet', price: 60.00, imageUrl: '', category: 'cat_grillades', stock: 50, vatRate: TVA_RATE_REDUCED },
  { id: 'prod_pilons_poulet', name: 'Pilons de Poulet', price: 60.00, imageUrl: '', category: 'cat_grillades', stock: 50, vatRate: TVA_RATE_REDUCED },
  { id: 'prod_broch_volaille', name: 'Brochettes de Volaille', price: 60.00, imageUrl: '', category: 'cat_grillades', stock: 50, vatRate: TVA_RATE_REDUCED },
  { id: 'prod_filet_poulet_marine', name: 'Filet de Poulet Mariné', price: 60.00, imageUrl: '', category: 'cat_grillades', stock: 50, vatRate: TVA_RATE_REDUCED },
  // NOS SANDWICHS
  { id: 'prod_sand_volaille', name: 'Sandwich de Volaille', price: 60.00, imageUrl: '', category: 'cat_sandwichs', stock: 50, vatRate: TVA_RATE_REDUCED },
  { id: 'prod_sand_fromage', name: 'Sandwich de Fromage', price: 40.00, imageUrl: '', category: 'cat_sandwichs', stock: 50, vatRate: TVA_RATE_REDUCED },
  { id: 'prod_sand_thon', name: 'Sandwich au Thon', price: 60.00, imageUrl: '', category: 'cat_sandwichs', stock: 50, vatRate: TVA_RATE_REDUCED },
  // NOS PIZZAS
  { id: 'prod_pizza_margarita', name: 'Pizza Margarita', price: 50.00, imageUrl: '', category: 'cat_pizzas', stock: 50, vatRate: TVA_RATE_REDUCED },
  { id: 'prod_pizza_quatre_saisons', name: 'Pizza Quatre Saisons', price: 70.00, imageUrl: '', category: 'cat_pizzas', stock: 50, vatRate: TVA_RATE_REDUCED },
  { id: 'prod_pizza_fruits_mer', name: 'Pizza Fruits de Mer', price: 70.00, imageUrl: '', category: 'cat_pizzas', stock: 50, vatRate: TVA_RATE_REDUCED },
  { id: 'prod_pizza_bolognaise', name: 'Pizza Bolognaise', price: 60.00, imageUrl: '', category: 'cat_pizzas', stock: 50, vatRate: TVA_RATE_REDUCED },
  { id: 'prod_pizza_vegetarienne', name: 'Pizza Végétarienne', price: 55.00, imageUrl: '', category: 'cat_pizzas', stock: 50, vatRate: TVA_RATE_REDUCED },
  // NOS PANINIS
  { id: 'prod_panini_viande', name: 'Panini Viande Hachée', price: 40.00, imageUrl: '', category: 'cat_paninis', stock: 50, vatRate: TVA_RATE_REDUCED },
  { id: 'prod_panini_poulet', name: 'Panini Poulet', price: 40.00, imageUrl: '', category: 'cat_paninis', stock: 50, vatRate: TVA_RATE_REDUCED },
  { id: 'prod_panini_mixte', name: 'Panini Mixte', price: 50.00, imageUrl: '', category: 'cat_paninis', stock: 50, vatRate: TVA_RATE_REDUCED },
  { id: 'prod_panini_charcuterie', name: 'Panini Charcuterie', price: 50.00, imageUrl: '', category: 'cat_paninis', stock: 50, vatRate: TVA_RATE_REDUCED },
  // NOS DESSERTS
  { id: 'prod_salade_fruits', name: 'Salade de Fruits', price: 30.00, imageUrl: '', category: 'cat_desserts', stock: 50, vatRate: TVA_RATE_REDUCED },
  { id: 'prod_coupe_glace', name: 'Coupe de Glace', price: 35.00, imageUrl: '', category: 'cat_desserts', stock: 50, vatRate: TVA_RATE_REDUCED },
  { id: 'prod_creme_caramel', name: 'Crème Caramel', price: 30.00, imageUrl: '', category: 'cat_desserts', stock: 50, vatRate: TVA_RATE_REDUCED },
  // MENU ENFANTS
  { id: 'prod_menu_enfant_burger', name: 'Menu Enfant (Burger/Nuggets)', price: 70.00, imageUrl: '', category: 'cat_menu_enfants', stock: 50, vatRate: TVA_RATE_REDUCED },
];

export const USERS: User[] = [
    { id: 'user_admin_01', name: 'Admin', email: 'admin@pos.com', role: UserRole.Admin },
    { id: 'user_cashier_01', name: 'Marie', email: 'marie@pos.com', role: UserRole.Cashier },
];

export const CURRENCIES: Currency[] = [
    { code: 'MAD', symbol: 'DH' },
    { code: 'EUR', symbol: '€' },
    { code: 'USD', symbol: '$' },
];

export const INITIAL_ESTABLISHMENT_DETAILS: EstablishmentDetails = {
  name: "Votre Établissement",
  logoUrl: "", // Empty by default
  address1: "Votre Adresse, Ligne 1",
  address2: "Ville, Code Postal",
  tel: "+212 0 00 00 00 00",
  tvaNumber: "TVA N°",
  iceNumber: "ICE N°",
  pointOfSaleName: "CAISSE PRINCIPALE",
  currency: CURRENCIES[1], // Default to Euro
  welcomeMessage: "Bienvenue !",
  thankYouMessage: "Merci de votre visite !",
  footerNote1: "Conservez ce ticket.",
  footerNote2: "A bientot !",
};


export const QUICK_ACTION_BUTTONS_CONFIG = [
  { id: 'new_invoice', label: 'Nouvelle Facture', icon: 'PlusCircleIcon', color: 'bg-orange-500 hover:bg-orange-600', isLarge: true },
  { id: 'print_receipt', label: 'Impression Ticket', icon: 'PrintIcon', color: 'bg-blue-500 hover:bg-blue-600' },
  { id: 'hold', label: 'Mettre en attente', icon: 'PauseIcon', color: 'bg-yellow-500 hover:bg-yellow-600' },
  { id: 'retrieve', label: 'Récupérer ticket', icon: 'RetrieveIcon', color: 'bg-green-500 hover:bg-green-600' },
  { id: 'discount', label: 'Réduction', icon: 'DiscountIcon', color: 'bg-purple-500 hover:bg-purple-600' },
  { id: 'pay', label: 'Valider et Payer', icon: 'CheckIcon', color: 'bg-teal-500 hover:bg-teal-600 text-white' },
  { id: 'cancel', label: 'Annuler', icon: 'CancelIcon', color: 'bg-red-500 hover:bg-red-600' },
];

export const PAYMENT_METHODS = [
    { id: 'cash', label: 'Espèce' },
    { id: 'room_transfer', label: 'Transfert Chambre', requiresRoomNumber: true },
    { id: 'card', label: 'Carte Crédit' },
    { id: 'gratuit', label: 'Gratuité' },
    { id: 'cheque', label: 'Chèque' },
];
