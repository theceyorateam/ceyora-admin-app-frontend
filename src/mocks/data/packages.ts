import { Package } from '../../types/package.types';

// Mock Packages data
const packages: Package[] = [
  {
    id: '1',
    journeyId: '1', // Journey: Spiritual Retreat in Kandy
    name: 'Temple Meditation Experience',
    priceLKR: 15000,
    priceUSD: 50, // Auto-calculated
    description: 'A guided meditation session in ancient temples with Buddhist monks, learning traditional mindfulness techniques.',
    durationId: '1', // 2 hours
    inclusions: ['Guided meditation', 'Temple entrance fees', 'Traditional offering materials', 'Tea ceremony'],
    maxGuests: 10
  },
  {
    id: '2',
    journeyId: '1', // Journey: Spiritual Retreat in Kandy
    name: 'Full Day Sacred Sites Tour',
    priceLKR: 25000,
    priceUSD: 83, // Auto-calculated
    description: 'Visit multiple sacred sites around Kandy, including the Temple of the Tooth Relic and meditation gardens.',
    durationId: '3', // Full day
    inclusions: ['Transportation', 'Lunch', 'All entrance fees', 'Expert spiritual guide', 'Meditation sessions'],
    maxGuests: 8
  },
  {
    id: '3',
    journeyId: '2', // Journey: Beach Adventure in Mirissa
    name: 'Whale Watching Expedition',
    priceLKR: 18000,
    priceUSD: 60, // Auto-calculated
    description: 'Early morning boat trip to spot blue whales, sperm whales, and dolphins in their natural habitat.',
    durationId: '2', // Half day
    inclusions: ['Boat ride', 'Breakfast', 'Snacks and refreshments', 'Experienced marine guide', 'Safety equipment'],
    maxGuests: 12
  },
  {
    id: '4',
    journeyId: '2', // Journey: Beach Adventure in Mirissa
    name: 'Surf Lesson Package',
    priceLKR: 12000,
    priceUSD: 40, // Auto-calculated
    description: 'Learn to surf with professional instructors on the beginner-friendly waves of Mirissa beach.',
    durationId: '1', // 2 hours
    inclusions: ['Surfboard rental', 'Professional instructor', 'Safety briefing', 'Beach refreshments'],
    maxGuests: 6
  },
  {
    id: '5',
    journeyId: '3', // Journey: Culinary Tour of Colombo
    name: 'Market to Table Cooking Experience',
    priceLKR: 9000,
    priceUSD: 30, // Auto-calculated
    description: 'Visit a local market to select fresh ingredients and learn to prepare authentic Sri Lankan dishes.',
    durationId: '2', // Half day
    inclusions: ['Market tour', 'Cooking class', 'Recipe booklet', 'Meal with local family', 'Spice sample pack'],
    maxGuests: 8
  },
  {
    id: '6',
    journeyId: '3', // Journey: Culinary Tour of Colombo
    name: 'Street Food Safari',
    priceLKR: 7500,
    priceUSD: 25, // Auto-calculated
    description: 'Guided walking tour of Colombo\'s best street food stalls and local eateries.',
    durationId: '1', // 2 hours
    inclusions: ['Food tastings at multiple locations', 'Local guide', 'Bottled water', 'Cultural insights'],
    maxGuests: 10
  }
];

export default packages;