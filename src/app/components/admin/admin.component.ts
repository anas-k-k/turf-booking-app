import { Component, inject } from '@angular/core';
import { BookingService, Booking } from '../../services/booking.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const START_HOUR = 7;
const END_HOUR = 23;

function pad(n: number) {
  return n < 10 ? '0' + n : n;
}

function getSlots() {
  const slots: string[] = [];
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    slots.push(`${pad(h)}:00`);
    slots.push(`${pad(h)}:30`);
  }
  return slots;
}

@Component({
  selector: 'admin-page',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  imports: [CommonModule, FormsModule],
})
export class AdminComponent {
  today = new Date();
  selectedDate = this.today.toISOString().slice(0, 10);
  slots = getSlots();
  bookingService = inject(BookingService);

  get bookingsForSelectedDate(): Booking[] {
    return this.bookingService.getBookingsForDate(this.selectedDate);
  }

  getSlotBooking(slot: string): Booking | undefined {
    return this.bookingsForSelectedDate.find((b) => b.slots.includes(slot));
  }

  to12HourFormat(time: string): string {
    const [hourStr, minStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const min = minStr;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
    return `${hour}:${min} ${ampm}`;
  }

  get totalSlots(): number {
    return this.slots.length;
  }

  get availableSlots(): number {
    return this.slots.filter((slot) => !this.getSlotBooking(slot)).length;
  }

  get bookedSlots(): number {
    return this.slots.filter((slot) => this.getSlotBooking(slot)).length;
  }
}
