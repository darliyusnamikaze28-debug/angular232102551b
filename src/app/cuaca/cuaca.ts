import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- 1. WAJIB IMPORT INI
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { Footer } from '../footer/footer';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

declare const $: any;
declare const moment: any;
declare const L: any;

@Component({
  selector: "app-cuaca",
  standalone: true,
  // 2. Tambahkan CommonModule di sini untuk memperbaiki error *ngIf dan | number
  imports: [CommonModule, Header, Sidebar, Footer, RouterModule], 
  templateUrl: './cuaca.html',
  styleUrl: './cuaca.css',
})
export class Cuaca implements AfterViewInit {
  private table1: any;
  private map: any;
  
  // Variabel publik agar bisa diakses oleh HTML
  public cityData: any;
  public currentWeather: any;
  public todayDate: any;

  constructor(private renderer: Renderer2, private http: HttpClient) {
    this.renderer.removeClass(document.body, "sidebar-open");
    this.renderer.addClass(document.body, "sidebar-closed");
  }

  ngAfterViewInit(): void {
    this.table1 = $("#table1").DataTable({
      columnDefs: [
        {
          targets: 0,
          render: function (data: string) {
            const waktu = moment(data + " UTC");
            return waktu.local().format("YYYY-MM-DD") + "<br />" + waktu.local().format("HH:mm") + " Local";
          },
        },
        {
          targets: 1,
          render: function (data: string) {
            return "<img src='" + data + "' style='filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.7));' />";
          },
        },
        {
          targets: 2,
          render: function (data: string) {
            const array = data.split("||");
            const cuaca = array[0];
            const description = array[1];
            return "<strong>" + cuaca + "</strong> <br />" + description;
          },
        },
      ],
    });
  }

  handleEnter(event: any) {
    const cityName = event.target.value;
    if (cityName == "") {
      this.table1.clear();
      this.table1.draw(false);
    }
    this.getData(cityName);
  }

  getData(city: string): void {
    city = encodeURIComponent(city);
    this.http
      .get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=9253cf14f9239acd1037a885af0b0cc1`)
      .subscribe((data: any) => {
        
        // Simpan data untuk ditampilkan di widget atas (HTML)
        this.cityData = data.city;
        
        if (data.list.length > 0) {
            this.currentWeather = data.list[0];
            // Update suhu langsung di object agar HTML bisa langsung pakai angka Celcius
            this.currentWeather.main.temp_celcius = this.kelvinToCelcius(this.currentWeather.main.temp);
            this.currentWeather.main.temp_min_celcius = this.kelvinToCelcius(this.currentWeather.main.temp_min);
            this.currentWeather.main.temp_max_celcius = this.kelvinToCelcius(this.currentWeather.main.temp_max);
            
            this.todayDate = moment(this.currentWeather.dt_txt + ' UTC').local().format('MMM DD, hh:mma');

            // Inisialisasi Peta
            setTimeout(() => {
                if (this.cityData && this.cityData.coord) {
                    this.initMap(this.cityData.coord.lat, this.cityData.coord.lon);
                }
            }, 100);
        }

        // Proses Data Table
        let list = data.list;
        this.table1.clear();

        list.forEach((element: any) => {
          const weather = element.weather[0];
          const iconUrl = "https://openweathermap.org/img/wn/" + weather.icon + "@2x.png";
          const cuacaDeskripsi = weather.main + "||" + weather.description;

          const main = element.main;
          const tempMin = this.kelvinToCelcius(main.temp_min);
          const tempMax = this.kelvinToCelcius(main.temp_max);
          const temp = tempMin + "°C - " + tempMax + "°C";

          const row = [element.dt_txt, iconUrl, cuacaDeskripsi, temp];
          this.table1.row.add(row);
        });

        this.table1.draw(false);
      }, (error: any) => {
        alert(error.error.message || "Terjadi kesalahan");
        this.table1.clear();
        this.table1.draw(false);
      });
  }

  // --- FUNGSI PETA ---
  private initMap(lat: number, lon: number): void {
    if (this.map) {
      this.map.remove();
    }
    this.map = L.map('map-container').setView([lat, lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
    L.marker([lat, lon]).addTo(this.map).bindPopup(this.cityData.name).openPopup();
  }

  // --- FUNGSI HELPER (Untuk memperbaiki Error HTML) ---
  
  // 3. Fungsi konversi Kelvin ke Celcius
  kelvinToCelcius(kelvin: any): number {
    let celcius = kelvin - 273.15;
    return Math.round(celcius * 100) / 100;
  }

  // 4. Fungsi mendapatkan Icon (Memperbaiki error 'getWeatherIconUrl')
  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  // 5. Fungsi arah angin (Memperbaiki error 'getWindDirection')
  getWindDirection(deg: number): string {
    const directions = ['Utara', 'Timur Laut', 'Timur', 'Tenggara', 'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'];
    // Logika sederhana membagi 360 derajat menjadi 8 arah
    const index = Math.round(deg / 45) % 8; 
    return directions[index];
  }
}