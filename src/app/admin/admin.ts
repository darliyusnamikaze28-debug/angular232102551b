import { Component } from '@angular/core';
import { Dashboard } from "../dashboard/dashboard";
import { Sidebar } from "../sidebar/sidebar";
import { Content } from "../content/content";
import { Footer } from "../footer/footer";
import { RouterModule } from '@angular/router';
import { Header } from "../header/header";

@Component({
  selector: 'app-admin',
  imports: [Dashboard, Sidebar, Content, Footer, RouterModule, Header],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {

}