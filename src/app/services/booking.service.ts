import { Injectable } from '@angular/core';

export interface Booking {
  name: string;
  phone: string;
  date: string; // YYYY-MM-DD
  slots: string[]; // e.g., ['07:00', '08:00']
}

// In-memory slot status for fast lookup and future migration to a table
export interface SlotStatus {
  [date: string]: {
    [slot: string]: 'available' | 'booked';
  };
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private bookings: Booking[] = [];
  private slotStatus: SlotStatus = {};

  getBookingsForDate(date: string): Booking[] {
    return this.bookings.filter((b) => b.date === date);
  }

  addBooking(booking: Booking) {
    this.bookings.push(booking);
    // Mark slots as booked in slotStatus
    if (!this.slotStatus[booking.date]) {
      this.slotStatus[booking.date] = {};
    }
    for (const slot of booking.slots) {
      this.slotStatus[booking.date][slot] = 'booked';
    }
  }

  isSlotBooked(date: string, slot: string): boolean {
    return this.slotStatus[date]?.[slot] === 'booked';
  }

  // For future: cancelBooking, etc.
}
