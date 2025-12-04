import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.html',
  styleUrl: './logout.css',
})
export class Logout {
  constructor(private CookieService: CookieService, private router: Router) {}
  ngOnInit(): void {
    this.CookieService.deleteAll();

    this.router.navigate(['/login']);
  }

}