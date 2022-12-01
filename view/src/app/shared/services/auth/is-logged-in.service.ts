import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInService {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (state.url === '/sessions/404' || localStorage.getItem('currentUser') === null) {
      return true;
    } else {
      this.router.navigate(['dashboard']);
    }
  }
}
