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

  constructor() {
    this.loadBookings();
  }

  private saveBookings() {
    localStorage.setItem('bookings', JSON.stringify(this.bookings));
    localStorage.setItem('slotStatus', JSON.stringify(this.slotStatus));
  }

  private loadBookings() {
    const bookings = localStorage.getItem('bookings');
    const slotStatus = localStorage.getItem('slotStatus');
    if (bookings) {
      this.bookings = JSON.parse(bookings);
    }
    if (slotStatus) {
      this.slotStatus = JSON.parse(slotStatus);
    }
  }

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
    this.saveBookings();
  }

  cancelSlot(date: string, slot: string) {
    // Remove slot from bookings
    for (const booking of this.bookings) {
      if (booking.date === date && booking.slots.includes(slot)) {
        booking.slots = booking.slots.filter((s) => s !== slot);
      }
    }
    // Remove empty bookings
    this.bookings = this.bookings.filter((b) => b.slots.length > 0);
    // Mark slot as available
    if (this.slotStatus[date]) {
      this.slotStatus[date][slot] = 'available';
    }
    this.saveBookings();
  }

  isSlotBooked(date: string, slot: string): boolean {
    return this.slotStatus[date]?.[slot] === 'booked';
  }

  getAllBookings() {
    return this.bookings;
  }

  // For future: cancelBooking, etc.
}
