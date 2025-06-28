import { Component, inject } from '@angular/core';
import { BookingService } from '../../services/booking.service';
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
  selector: 'booking-calendar',
  standalone: true,
  templateUrl: './booking-calendar.component.html',
  styleUrl: './booking-calendar.component.scss',
  imports: [CommonModule, FormsModule],
})
export class BookingCalendarComponent {
  today = new Date();
  selectedDate = this.today.toISOString().slice(0, 10);
  slots = getSlots();
  selectedSlots: string[] = [];
  name = '';
  phone = '';
  showConfirm = false;

  bookingService = inject(BookingService);

  isBooked(slot: string) {
    return this.bookingService.isSlotBooked(this.selectedDate, slot);
  }

  toggleSlot(slot: string) {
    if (this.isBooked(slot)) return;
    if (this.selectedSlots.includes(slot)) {
      this.selectedSlots = this.selectedSlots.filter((s) => s !== slot);
    } else {
      this.selectedSlots.push(slot);
    }
  }

  book() {
    if (!this.name || !this.phone || this.selectedSlots.length === 0) return;
    this.showConfirm = true;
  }

  confirmBooking() {
    this.bookingService.addBooking({
      name: this.name,
      phone: this.phone,
      date: this.selectedDate,
      slots: [...this.selectedSlots],
    });
    this.selectedSlots = [];
    this.name = '';
    this.phone = '';
    this.showConfirm = false;
  }

  cancelConfirm() {
    this.showConfirm = false;
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
}
