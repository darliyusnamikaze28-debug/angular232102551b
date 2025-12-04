import { Component } from '@angular/core';
import { Footer } from "../footer/footer";
import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard3',
  imports: [ RouterModule,Footer, Header, Sidebar],
  templateUrl: './dashboard3.html',
  styleUrl: './dashboard3.css'
})
export class Dashboard3 {

}
