import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit{
  @Input() moduleName: string = "";
  username: string = "";

  ngAfterViewInit() {
    this.renderer.removeClass(document.body, 'sidebar-open');
    this.renderer.addClass(document.body, 'sidebar-closed');
    //this.renderer.addClass(document.body, 'sidebar-collapse');
  }

  ngOnInit(): void {
    this.username = this.cookieService.get('userId');
  }

  constructor(private renderer: Renderer2, private cookieService: CookieService) {}
}