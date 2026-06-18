import { create } from 'zustand';
import { FlightDTO, HotelDTO, RoomDTO, TourDTO } from '@tms/shared-types';

interface BookingCartState {
  flight: FlightDTO | null;
  hotel: HotelDTO | null;
  room: RoomDTO | null;
  tour: TourDTO | null;
  setFlight: (flight: FlightDTO | null) => void;
  setHotelRoom: (hotel: HotelDTO | null, room: RoomDTO | null) => void;
  setTour: (tour: TourDTO | null) => void;
  clearCart: () => void;
}

export const useBookingStore = create<BookingCartState>((set) => ({
  flight: null,
  hotel: null,
  room: null,
  tour: null,
  setFlight: (flight) => set({ flight }),
  setHotelRoom: (hotel, room) => set({ hotel, room }),
  setTour: (tour) => set({ tour }),
  clearCart: () => set({ flight: null, hotel: null, room: null, tour: null }),
}));
