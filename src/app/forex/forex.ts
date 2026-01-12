import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { Footer } from '../footer/footer';
import { HttpClient } from '@angular/common/http';
import { formatCurrency } from '@angular/common';
import { formatDate } from '@angular/common';

declare const $: any;

@Component({
  selector: 'app-forex',
  standalone: true,
  imports: [Header, Sidebar, Footer],
  templateUrl: './forex.html',
  styleUrl: './forex.css',
})
export class Forex implements AfterViewInit {
  private _table1: any;

  constructor(private renderer: Renderer2, private HTTPClient: HttpClient) {}

  ngAfterViewInit(): void {
    this.renderer.removeClass(document.body, 'sidebar-open');
    this.renderer.addClass(document.body, 'sidebar-closed');
    this.renderer.addClass(document.body, 'sidebar-collapse');

    this._table1 = $('#table1').DataTable({
      columnsDefs: [
        {
          targets: 3,
          className: 'text-right',
        },
      ],
    });

    this.bindTable1();
  }

  bindTable1(): void {
    console.log('bindTable1()');

    const ratesUrl =
      'https://openexchangerates.org/api/latest.json?app_id=4f4aa370aee045e7bb7e63f04e710bb6';

    const currenciesUrl = 'https://openexchangerates.org/api/currencies.json';

    this.HTTPClient.get(currenciesUrl).subscribe((currencies: any) => {
      this.HTTPClient.get(ratesUrl).subscribe((data: any) => {
        $('#tanggal').html(
          'Data per Tanggal : ' +
            formatDate(new Date(data.timestamp * 1000), 'dd/MM/yyyy HH:mm', 'en-US')
        );

        const rates = data.rates;
        let index = 1;

        for (const currency in rates) {
          const currencyName = currencies[currency];

          const rate = rates.IDR / rates[currency];
          const formatRate = formatCurrency(rate, 'en-US', '', currency);

          console.log(`${currency}: ${currencyName} - ${formatRate}`);

          const row = [index++, currency, currencyName, formatRate];
          this._table1.row.add(row);
          this._table1.draw(false);
        }
      });
    });
  }
}