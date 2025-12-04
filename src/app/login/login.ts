import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';

declare const $: any;

@Component({
  selector: 'app-login',
  imports: [ RouterModule ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
constructor(
    //private renderer: Renderer2,
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  showPeringatanModal(message: string) {
    $("#peringatanModal").modal();
    $("#pm_message").html(message);
  }

  signIn(): void {
    console.log("signIn()");

    var userId = $('#idText').val();
    userId = encodeURIComponent(userId);
    var password = $('#passwordText').val();
    password = encodeURIComponent(password);

    var url = "https://stmikpontianak.cloud/011100862/login.php" +
    "?id=" + userId +
    "&password=" + password;
    console.log("URL: " + url);

    this.http.get(url).subscribe((data: any) => {
      console.log("Response:", data);

      var row = data[0];
      if(row.idCount != "1") {
        this.showPeringatanModal("ID atau Password salah!");
        return;
      }
      this.cookieService.set('userId', userId);
      console.log("Session data berhasil dibuat");
      this.router.navigate(['/dashboard']);
    });
  }
}