export const ROUTES = {
  // Public pages
  home: '/',
  coffees: '/kavek',
  equipment: '/eszkozok',
  merch: '/merch',
  bundles: '/csomagok',
  subscription: '/elofizetes',
  subscriptionNew: '/elofizetes/uj',
  stories: '/sztorik',
  cart: '/kosar',
  checkout: '/penztar',
  search: '/kereses',

  // Auth pages
  login: '/belepes',
  register: '/regisztracio',
  passwordReset: '/jelszo-csere',

  // Account pages
  account: '/fiokom',
  accountProfile: '/fiokom/adataim',
  accountAddresses: '/fiokom/cimek',
  accountSubscriptions: '/fiokom/elofizetesek',
  accountWishlist: '/fiokom/kedvencek',
  orders: '/rendeleseink',

  // Info pages
  about: '/rolunk',
  shipping: '/szallitas',
  contact: '/kapcsolat',
  faq: '/gyik',
  returns: '/visszakuldes',
  wholesale: '/nagykereskedelem',

  // Legal pages
  terms: '/aszf',
  privacy: '/adatvedelem',
  cookies: '/cookie',

  // Admin pages
  admin: '/admin',
  adminProducts: '/admin/termekek',
  adminOrders: '/admin/rendelesek',
  adminDeliveries: '/admin/szallitasok',
  adminSubscriptions: '/admin/elofizetesek',
  adminCoupons: '/admin/kuponok',
  adminPromos: '/admin/akcio-napok',
  adminGiftCards: '/admin/ajandekkartyak',
  adminReviews: '/admin/ertekelesek',
  adminStories: '/admin/sztorik',
  adminReturns: '/admin/visszakuldesek',
  adminUsers: '/admin/felhasznalok',
  adminSettings: '/admin/beallitasok',
  adminEmailTemplates: '/admin/email-templates',
  adminComponents: '/admin/komponensek',
} as const

export type RouteKey = keyof typeof ROUTES
export type Route = (typeof ROUTES)[RouteKey]
