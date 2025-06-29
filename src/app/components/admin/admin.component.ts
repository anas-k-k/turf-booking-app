import { Component, inject } from '@angular/core';
import { BookingService, Booking } from '../../services/booking.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

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
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
  ],
})
export class AdminComponent {
  today = new Date();
  selectedDate = this.today.toISOString().slice(0, 10);
  slots = getSlots();
  bookingService = inject(BookingService);

  // For Material datepicker: keep a Date object for selection
  selectedDateObj = new Date();

  // Dates with at least one booking
  get datesWithBookings(): string[] {
    return this.bookingService.getDatesWithBookings();
  }

  showCancelConfirm: { slot: string; booking: Booking } | null = null;

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

  // Get all upcoming bookings (after the currently selected date)
  get futureBookingsCount(): number {
    const selectedStr = this.selectedDate;
    return this.bookingService
      .getAllBookings()
      .filter((b) => b.date > selectedStr)
      .reduce((acc, b) => acc + b.slots.length, 0);
  }

  ngOnInit() {
    this.selectedDateObj = new Date(this.selectedDate);
  }

  onDateChange(event: any) {
    if (event.value) {
      const d = event.value;
      // Format as YYYY-MM-DD
      this.selectedDate = d.toISOString().slice(0, 10);
    }
  }

  // Highlight dates with bookings in the calendar
  dateClass = (d: Date) => {
    const dateStr = d.toISOString().slice(0, 10);
    return this.datesWithBookings.includes(dateStr) ? 'mat-booked-date' : '';
  };

  confirmCancelSlot() {
    if (this.showCancelConfirm) {
      this.bookingService.cancelSlot(
        this.selectedDate,
        this.showCancelConfirm.slot
      );
      this.showCancelConfirm = null;
    }
  }

  cancelCancelSlot() {
    this.showCancelConfirm = null;
  }
}
