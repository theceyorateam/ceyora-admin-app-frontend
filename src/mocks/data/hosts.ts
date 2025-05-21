import { Host } from '../../types/host.types';

// Mock Hosts data
const hosts: Host[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    locationId: '1', // Maldives
    address: '123 Palm Street, Male',
    description: 'Experienced tour guide with expertise in water sports and diving excursions.',
    registerDate: '2024-01-15',
    contactNumber1: '+960 123-4567',
    email: 'john.doe@example.com',
    languages: ['English', 'Dhivehi'],
    profilePhoto: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    locationId: '2', // Switzerland
    address: '45 Alpine Road, Zurich',
    description: 'Mountain hiking expert with knowledge of Swiss Alps and local cultures.',
    registerDate: '2024-02-20',
    contactNumber1: '+41 76 123 45 67',
    contactNumber2: '+41 76 987 65 43',
    email: 'sarah.johnson@example.com',
    languages: ['English', 'German', 'French'],
    profilePhoto: 'https://drive.google.com/file/d/2hijklmn/view'
  },
  {
    id: '3',
    firstName: 'Miguel',
    lastName: 'Garcia',
    locationId: '4', // Bali
    address: '78 Beach Road, Kuta',
    description: 'Specializes in cultural tours and traditional Balinese experiences.',
    registerDate: '2024-03-10',
    contactNumber1: '+62 812 3456 7890',
    email: 'miguel.garcia@example.com',
    languages: ['English', 'Indonesian', 'Spanish'],
    profilePhoto: 'https://drive.google.com/file/d/3opqrstu/view'
  },
  {
    id: '4',
    firstName: 'Akira',
    lastName: 'Tanaka',
    locationId: '3', // Tokyo
    address: '56 Sakura Avenue, Shibuya',
    description: 'Expert in Japanese history, cuisine and modern Tokyo nightlife.',
    registerDate: '2024-04-05',
    contactNumber1: '+81 90 1234 5678',
    email: 'akira.tanaka@example.com',
    languages: ['English', 'Japanese'],
    profilePhoto: 'https://drive.google.com/file/d/4vwxyzab/view'
  },
  {
    id: '5',
    firstName: 'Olivia',
    lastName: 'Williams',
    locationId: '5', // England
    address: '34 Cobblestone Street, London',
    description: 'Specialist in historical tours of London with focus on architecture and royal history.',
    registerDate: '2024-05-12',
    contactNumber1: '+44 7700 900123',
    contactNumber2: '+44 7700 900456',
    email: 'olivia.williams@example.com',
    languages: ['English', 'French'],
    profilePhoto: 'https://drive.google.com/file/d/5cdefghi/view'
  }
];

export default hosts;