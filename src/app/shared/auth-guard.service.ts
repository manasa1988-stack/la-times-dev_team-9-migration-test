import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { StorageService } from "./storage.service";
import { DOCUMENT } from '@angular/common';
import { CookieService } from './cookies.service';
import { UserDetailsService } from '../pages/user-details/user-details.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router,
    private cookieService: CookieService,
    private storageService: StorageService,
    private userDetailsService: UserDetailsService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLogin(state.url);
  }

  getUserDetails() {
    this.userDetailsService.getUserDetails().subscribe((data) => {
      this.userDetailsService.storeUserDetails(data);
    });
  }

  checkLogin(url: string): boolean {
    if (this.cookieService.check('c_mId')) {
      if (this.storageService.getUserInfo() == null) {
        this.getUserDetails();
      }
      return true;
    }
    this.router.navigate(['/login'], {
      queryParams: {
        return: url
      }
    });
    return false;
  }
}
