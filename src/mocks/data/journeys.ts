import { Journey } from '../../types/journey.types';

// Mock Journeys data
const journeys: Journey[] = [
  {
    id: '1',
    title: 'Spiritual Retreat in Kandy',
    subtitle: 'Discover Inner Peace in the Hills of Sri Lanka',
    summary: 'A transformative journey through the spiritual heart of Sri Lanka, exploring ancient temples and meditation practices.',
    description: 'Immerse yourself in the sacred city of Kandy, home to the Temple of the Tooth Relic and surrounded by misty mountains. This spiritual retreat offers a unique opportunity to learn meditation techniques from local monks, explore ancient temples, and connect with the spiritual traditions that have shaped Sri Lankan culture for thousands of years. Wake up to the sounds of nature, participate in traditional ceremonies, and discover a deeper sense of mindfulness and peace.',
    locationId: '1', // Assuming location ID for Kandy
    priceLKR: 45000,
    priceUSD: 150, // Auto-calculated based on exchange rate
    tagIds: ['1', '9'], // Assuming IDs for 'Cultural' and 'Spiritual' tags
    baseImage: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2033&q=80',
    otherImages: [
      'https://images.unsplash.com/photo-1540202404-a2f29016b523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2033&q=80',
      'https://images.unsplash.com/photo-1540202404-a2f29016b523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2033&q=80'
    ],
    hostId: '1', // Assuming host ID
  },
  {
    id: '2',
    title: 'Beach Adventure in Mirissa',
    subtitle: 'Sun, Surf, and Marine Life Exploration',
    summary: 'An exciting coastal adventure combining beach relaxation with whale watching and water sports.',
    description: 'Experience the best of Sri Lanka\'s southern coastline in this exciting beach adventure. Mirissa offers pristine sandy beaches, crystal-clear waters, and amazing marine biodiversity. Start your mornings with yoga by the ocean, spend your days snorkeling in vibrant coral reefs or learning to surf with experienced instructors. The highlight of this journey is an unforgettable whale watching expedition where you might spot blue whales, sperm whales, and playful dolphins in their natural habitat. End your evenings with fresh seafood dinners under the stars.',
    locationId: '3', // Assuming location ID for Mirissa
    priceLKR: 60000,
    priceUSD: 200, // Auto-calculated based on exchange rate
    tagIds: ['1', '8'], // Assuming IDs for 'Beach' and 'Adventure' tags
    baseImage: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2033&q=80',
    otherImages: [
      'https://images.unsplash.com/photo-1540202404-a2f29016b523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2033&q=80',
      'https://images.unsplash.com/photo-1540202404-a2f29016b523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2033&q=80'
    ],
    hostId: '2', // Assuming host ID
  },
  {
    id: '3',
    title: 'Culinary Tour of Colombo',
    subtitle: 'Taste the Authentic Flavors of Sri Lanka',
    summary: 'A gastronomic adventure exploring the diverse and flavorful cuisine of Sri Lanka.',
    description: 'Discover the rich culinary heritage of Sri Lanka in this immersive food journey through Colombo. From street food stalls to high-end restaurants, you\'ll experience the full spectrum of Sri Lankan cuisine. Learn to prepare traditional curries, hoppers, and sambols in hands-on cooking classes with local chefs. Visit bustling markets to select fresh spices and produce, understanding the ingredients that make Sri Lankan cuisine so distinctive. This journey includes visits to tea plantations, spice gardens, and coconut estates to understand the farm-to-table process that shapes the nation\'s food culture.',
    locationId: '5', // Assuming location ID for Colombo
    priceLKR: 35000,
    priceUSD: 117, // Auto-calculated based on exchange rate
    tagIds: ['4', '9'], // Assuming IDs for 'Culinary' and 'Cultural' tags
    baseImage: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2033&q=80',
    otherImages: [
      'https://images.unsplash.com/photo-1540202404-a2f29016b523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2033&q=80',
      'https://images.unsplash.com/photo-1540202404-a2f29016b523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2033&q=80'
    ],
    hostId: '3', // Assuming host ID
  }
];

export default journeys;