import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { StatusSubcripcion, Subcripcion } from '../serviciosPayments/offers/offers.component';

@Injectable({
  providedIn: 'root',
})
export class PaymentStripeService {
  private http = inject(HttpClient);
  private paymentApiUrl = environment.apiURL_payment;
  private stripeKey = environment.stripeKey;
  constructor() { }


  procesarPago(select: Subcripcion) {
    var body = {

    }
    if (select.estado == StatusSubcripcion.premium) {
      body = {
        currency: 'BOB',
        items: [
          {
            name: select.titulo,
            price: 290,
            quantity: 1,
            image: 'https://res.cloudinary.com/da9xsfose/image/upload/v1718291613/e7vj1snjneklw97nnnot.png'
          }
        ]
      };
    } else if (select.estado == StatusSubcripcion.onPremises) {
      body = {
        currency: 'BOB',
        items: [
          {
            name: select.titulo,
            price: 2792,
            quantity: 1,
            image: 'https://res.cloudinary.com/da9xsfose/image/upload/v1718291633/q5wjgt0rbaneds2ohwkh.png'
          }
        ]
      };
    }
    return this.http
      .post(this.paymentApiUrl + '/create-payment-session', body)
      .pipe(
        map((res: any) => {
          // Extrae la URL de la respuesta
          const url = res.url;
          // Redirige al usuario a la URL
          window.location.href = url;
        })
      )
      .subscribe({
        error: (err) => console.error('Error', err),
      });
  }

}
