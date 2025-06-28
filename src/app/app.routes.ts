import { BookingCalendarComponent } from './components/booking-calendar/booking-calendar.component';
import { AdminComponent } from './components/admin/admin.component';

// No routes needed for this app
export const routes = [
  { path: '', component: BookingCalendarComponent },
  { path: 'admin', component: AdminComponent },
];
