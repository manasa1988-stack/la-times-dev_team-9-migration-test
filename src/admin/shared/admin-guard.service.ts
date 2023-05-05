import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { StorageService } from '../../app/shared/storage.service';

@Injectable()
export class AdminGuardService implements CanActivate {
    constructor(private router: Router,
        private storageService: StorageService) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        if (this.storageService.getUserInfo().IsAdmin === true) {
            return true;
        }
        this.router.navigate(['/dashboard']);
        return false;
    }
}
