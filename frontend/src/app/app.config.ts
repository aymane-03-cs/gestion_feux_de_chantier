import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])), // ✅ Updated function-based interceptor
    provideRouter(routes), // ✅ Routing
  ]
};
