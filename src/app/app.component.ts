import { Component } from '@angular/core';
import { BookingCalendarComponent } from './components/booking-calendar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BookingCalendarComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'turf-booking-app';
}
