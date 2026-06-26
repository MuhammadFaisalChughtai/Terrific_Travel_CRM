export interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
  isEmailVerified: boolean;
  createdAt: string;
  agentId?: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDTO;
}

export type BookingStatus = 'DRAFT' | 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface FlightDTO {
  id: string;
  flightNumber: string;
  airline: {
    name: string;
    code: string;
  };
  departureAirport: {
    name: string;
    code: string;
    city: string;
  };
  arrivalAirport: {
    name: string;
    code: string;
    city: string;
  };
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
}

export interface HotelDTO {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  rating: number;
}

export interface RoomDTO {
  id: string;
  hotelId: string;
  roomType: string;
  price: number;
  maxOccupancy: number;
  isAvailable: boolean;
}

export interface TourDTO {
  id: string;
  name: string;
  description: string;
  durationDays: number;
  price: number;
  imageKey?: string;
  category: string;
  destination: {
    name: string;
    country: string;
  };
}
