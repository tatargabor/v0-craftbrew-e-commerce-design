/**
 * Default search-palette fixtures.
 *
 * These are *design-time defaults* — used by the v0.app preview and as
 * fallback data when the component is mounted without explicit `products`/
 * `stories` props. In production, the consumer passes real data fetched
 * from the search API as props (see SearchPalette `products`/`stories`).
 */

export interface SearchProduct {
  id: string
  name: string
  origin: string
  price: number
  image: string
  rating: number
  href: string
}

export interface SearchStory {
  id: string
  title: string
  category: string
  readTime: string
  image: string
  href: string
}

export const DEFAULT_SEARCH_PRODUCTS: SearchProduct[] = [
  {
    id: '1',
    name: 'Ethiopia Yirgacheffe',
    origin: 'Etiópia',
    price: 4990,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=80&h=80&fit=crop',
    rating: 4.8,
    href: '/kavek/ethiopia-yirgacheffe',
  },
  {
    id: '2',
    name: 'Colombia Huila',
    origin: 'Kolumbia',
    price: 3990,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=80&h=80&fit=crop',
    rating: 4.6,
    href: '/kavek/colombia-huila',
  },
  {
    id: '3',
    name: 'Kenya AA',
    origin: 'Kenya',
    price: 5490,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=80&h=80&fit=crop',
    rating: 4.9,
    href: '/kavek/kenya-aa',
  },
  {
    id: '4',
    name: 'Chemex 6 csészés',
    origin: 'Eszközök',
    price: 18990,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&h=80&fit=crop',
    rating: 4.9,
    href: '/eszkozok/chemex-6',
  },
  {
    id: '5',
    name: 'V60 Pour Over szett',
    origin: 'Eszközök',
    price: 12990,
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=80&h=80&fit=crop',
    rating: 4.7,
    href: '/eszkozok/v60-szett',
  },
  {
    id: '6',
    name: 'CraftBrew póló',
    origin: 'Merch',
    price: 7990,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&h=80&fit=crop',
    rating: 4.5,
    href: '/merch/craftbrew-polo',
  },
  {
    id: '7',
    name: 'Guatemala Antigua',
    origin: 'Guatemala',
    price: 4290,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=80&h=80&fit=crop',
    rating: 4.5,
    href: '/kavek/guatemala-antigua',
  },
]

export const DEFAULT_SEARCH_STORIES: SearchStory[] = [
  {
    id: '1',
    title: 'A kávé útja a cserjétől a csészéig',
    category: 'Tudástár',
    readTime: '8 perc',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=80&h=80&fit=crop',
    href: '/sztorik/kave-utja',
  },
  {
    id: '2',
    title: 'Pour over technikák haladóknak',
    category: 'Elkészítés',
    readTime: '6 perc',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&h=80&fit=crop',
    href: '/sztorik/pour-over-technikak',
  },
  {
    id: '3',
    title: 'Etióp kávéfarmok története',
    category: 'Eredet',
    readTime: '10 perc',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=80&h=80&fit=crop',
    href: '/sztorik/etiop-kavefarmok',
  },
  {
    id: '4',
    title: 'Cold brew készítése otthon',
    category: 'Elkészítés',
    readTime: '5 perc',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=80&h=80&fit=crop',
    href: '/sztorik/cold-brew-otthon',
  },
]
