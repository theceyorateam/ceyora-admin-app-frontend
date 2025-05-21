import { User } from '../../types/auth.types';

// Mock Users
const users: User[] = [
  {
    id: '1',
    email: 'admin@ceyora.com',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'manager@ceyora.com',
    name: 'Manager User',
    role: 'manager',
  },
];

export default users;