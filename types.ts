
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface Story {
  id: string;
  kitchenId: string;
  image: string;
  foodName: string;
  timestamp: string;
}

export interface Kitchen {
  id: string;
  name: string;
  ownerName: string;
  avatar: string;
  coverImage: string;
  rating: number;
  tags: string[];
  isLive: boolean;
  isFollowing: boolean;
  menu: MenuItem[];
  stories: Story[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  kitchenId: string;
}
