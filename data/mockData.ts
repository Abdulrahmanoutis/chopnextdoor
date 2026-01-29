
import { Kitchen } from '../types';

export const MOCK_KITCHENS: Kitchen[] = [
  {
    id: 'k1',
    name: "Sadiya's Spicy Bites",
    ownerName: "Sadiya",
    avatar: "https://picsum.photos/seed/sadiya/200",
    coverImage: "https://picsum.photos/seed/sadiya_cover/800/400",
    rating: 4.9,
    tags: ["Masa & Suya Expert", "Spicy"],
    isLive: true,
    isFollowing: true,
    stories: [
      { id: 's1', kitchenId: 'k1', image: 'https://picsum.photos/seed/masa/600/1000', foodName: 'Fresh Masa & Yaji', timestamp: '10:00 AM' },
      { id: 's2', kitchenId: 'k1', image: 'https://picsum.photos/seed/suya/600/1000', foodName: 'Grilled Suya Platter', timestamp: '11:30 AM' }
    ],
    menu: [
      { id: 'm1', name: 'Masa & Yaji Extra Spice', price: 2500, description: 'Traditional rice cakes with spicy peanut powder.', image: 'https://picsum.photos/seed/m1/400' },
      { id: 'm2', name: 'Zobo Drink (Large)', price: 800, description: 'Chilled hibiscus tea with ginger and clove.', image: 'https://picsum.photos/seed/m2/400' }
    ]
  },
  {
    id: 'k2',
    name: "Musa's Charcoal Grill",
    ownerName: "Musa",
    avatar: "https://picsum.photos/seed/musa/200",
    coverImage: "https://picsum.photos/seed/musa_cover/800/400",
    rating: 4.8,
    tags: ["BBQ", "Roasts"],
    isLive: true,
    isFollowing: false,
    stories: [
      { id: 's3', kitchenId: 'k2', image: 'https://picsum.photos/seed/grill/600/1000', foodName: 'Whole Roasted Chicken', timestamp: '12:00 PM' }
    ],
    menu: [
      { id: 'm3', name: 'Charcoal Grilled Chicken', price: 5500, description: 'Slow-roasted over charcoal for 4 hours.', image: 'https://picsum.photos/seed/m3/400' }
    ]
  },
  {
    id: 'k3',
    name: "Mama G's Soul Food",
    ownerName: "Mama G",
    avatar: "https://picsum.photos/seed/mamag/200",
    coverImage: "https://picsum.photos/seed/mamag_cover/800/400",
    rating: 5.0,
    tags: ["Home Cooked", "Tuwo"],
    isLive: false,
    isFollowing: false,
    stories: [],
    menu: [
      { id: 'm4', name: 'Tuwo Shinkafa & Miyan Kuka', price: 3000, description: 'The ultimate comfort food.', image: 'https://picsum.photos/seed/m4/400' }
    ]
  }
];
