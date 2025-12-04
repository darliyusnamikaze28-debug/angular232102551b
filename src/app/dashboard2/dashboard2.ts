import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Footer } from "../footer/footer";
import { Sidebar } from "../sidebar/sidebar";
import { Header } from "../header/header";

@Component({
  selector: 'app-dashboard2',
  imports: [RouterModule, Footer, Sidebar, Header],
  templateUrl: './dashboard2.html',
  styleUrl: './dashboard2.css'
})
export class Dashboard2 {

}
