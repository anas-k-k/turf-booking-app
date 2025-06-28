import { BookingCalendarComponent } from './components/booking-calendar/booking-calendar.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminLoginComponent } from './components/admin/admin-login.component';

// No routes needed for this app
export const routes = [
  { path: '', component: BookingCalendarComponent },
  {
    path: 'admin',
    loadComponent: () => {
      if (
        typeof window !== 'undefined' &&
        sessionStorage.getItem('adminLoggedIn') === 'true'
      ) {
        return import('./components/admin/admin.component').then(
          (m) => m.AdminComponent
        );
      } else {
        return import('./components/admin/admin-login.component').then(
          (m) => m.AdminLoginComponent
        );
      }
    },
  },
];
