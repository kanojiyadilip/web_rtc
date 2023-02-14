import { Injectable } from '@angular/core';
import {Router,CanActivate,ActivatedRouteSnapshot,RouterStateSnapshot} from '@angular/router';

@Injectable()
export class AuthguardService implements CanActivate{
  isLoggedin: boolean;
  constructor(private router:Router) { }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('adminId')) {
    	console.log("********TRUE**********");
        return true;
    }

    this.router.navigate(['/login']);
    console.log("********FALSE**********");
    return false;
  }


	isLoggedIn() {
	    if (localStorage.getItem("adminId") == null) {
	        this.isLoggedin = false;
	        return this.isLoggedin;
	    }
	    else {
	        this.isLoggedin = true;
	        return this.isLoggedin;
	    }
	}

}
