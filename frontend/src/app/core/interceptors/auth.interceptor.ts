import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get the auth token from the service.
  // For now, we'll just pass the request through.
  // In a real app, you would inject an AuthService and get the token.
  // const authToken = inject(AuthService).getToken();

  // Clone the request and replace the original headers with
  // cloned headers, updated with the authorization.
  // const authReq = req.clone({
  //   setHeaders: {
  //     Authorization: `Bearer ${authToken}`
  //   }
  // });

  // return next(authReq);
  return next(req);
};
