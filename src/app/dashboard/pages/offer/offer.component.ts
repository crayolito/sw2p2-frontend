import { CommonModule, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OffersListService } from '../offers-list/offers-list.service';
import { Oferta, OfferService, statusOffer } from './offer.service';

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.css'
})
export default class OfferComponent implements OnInit {
  public offerService = inject(OfferService);
  public offersListService = inject(OffersListService);
  public formBuilder = inject(FormBuilder);
  public router = inject(Router);
  public location = inject(Location);
  // READ : ESTADO DE IMAGEN Y URL DE IMAGEN
  public imageEmpresa = signal<string>("assets/subirImagen.png");
  public estadoImagen = signal<boolean>(false);
  public http = inject(HttpClient);
  // READ : VECTOR DE TIPOS DE HABITACIONES
  public valueSelectHabitacion = "";
  public habitacionOffer: string[] = [];
  public habitacionesAuxiliares: string[] = [
    'Habitación Individual Estandar',
    'Habitación Doble Estandar',
    'Habitación Triple Estandar',
    'Habitación Individual Superior',
    'Habitación Doble Superior',
    'Habitación Triple Superior',
    'Habitación Individual Deluxe',
    'Habitación Doble Deluxe',
    'Habitación Triple Deluxe',
    'Habitación Suite Junior',
    'Habitación Suite Execuite',
    'Habitación Cuádruple',
    'Habitación Estudio',
    'Habitación Doble Twin',
    'Habitación Cama King',
    'Habitación Cama Queen',
    'Habitación Cama King Size',
    'Habitación Dos Camas Dobles',
    'Habitación Cama Individual Extra',
    'Habitación Cama Murphy',
    'Habitación Económica'
  ];
  // READ : VECTORES DE ESTADOS DE OFERTA
  public valueSelectEstado = "";
  public difEstadoOffer: string[] = [
    'Vendida',
    'Disponible',
    'Reservado',
  ];

  // NOTE: ACTUALIZAR EL VALOR DEL ESTADO DE LA OFERTA
  updateSelectEstado(value: string) {
    this.valueSelectEstado = value;
  }


  // NOTE: ACTUALZAR EL VALOR DE LA HABITACION SELECCIONADA
  updateSelectHabitacion(value: string) {
    this.valueSelectHabitacion = value;
  }

  // NOTE: AÑADIR HABITACION A LA LISTA DE HABITACIONES DE LA OFERTA
  addHabitacionOffer() {
    if (this.valueSelectHabitacion == "") return;
    this.habitacionOffer.push(this.valueSelectHabitacion);
  }

  // NOTE: ELIMINAR HABITACION DE LA LISTA DE HABITACIONES DE LA OFERTA
  deleteHabitacionOffer(index: number) {
    this.habitacionOffer.splice(index, 1);
  }


  // NOTE: FORMULARIO DE OFERTA
  public formOffer: FormGroup = this.formBuilder.group({
    titulo: ['', [Validators.required]],
    precio: [0, [Validators.required]],
    descuento: [0, [Validators.required]],
    nroCamas: [0, [Validators.required]],
    descripcionServicioHabitaciones: ['', [Validators.required]],
  });

  // NOTE: OBTENER VALOR DE UN CAMPO DEL FORMULARIO
  getValueFormOffer(value: string) {
    return this.formOffer.get(value)?.value;
  }

  // READ: METODOS DEL MANEJO DE LA IMAGEN
  // NOTE: SUBIR IMAGEN DE EMPRESA
  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.uploadToCloudinary(file);
    }
  }
  // NOTE: SUBIR IMAGEN A CLOUDINARY
  uploadToCloudinary(file: any) {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'fqw7ooma');
    data.append('cloud_name', 'da9xsfose');

    this.http.post(`https://api.cloudinary.com/v1_1/da9xsfose/image/upload`, data)
      .subscribe({
        next: (response: any) => {
          // console.log(response.secure_url);
          // alert('Imagen subida con éxito');
          this.imageEmpresa.set(response.secure_url);
          this.estadoImagen.set(true);
        },
        error: (e: any) => {
          console.log(e);
        }
      }
      );
  }

  // NOTE: PROCESAR FORMULARIO (CREAR O EDITA)
  procesarFormulario() {
    if (this.offerService.statusOffer() == statusOffer.Crear) {
    } else {
      this.offersListService.ofertaEditada(
        new Oferta(
          this.offerService.objectOffer().id,
          this.getValueFormOffer('titulo'),
          this.getValueFormOffer('precio'),
          this.getValueFormOffer('descuento'),
          this.imageEmpresa(),
          this.getValueFormOffer('nroCamas'),
          this.getValueFormOffer('descripcionServicioHabitaciones'),
          this.habitacionOffer,
          this.valueSelectEstado
        )
      );
      this.location.back();
    }
  }

  ngOnInit(): void {
    if (this.offerService.statusOffer() == statusOffer.Crear) return;
    this.valueSelectEstado = this.offerService.objectOffer().estado;
    this.estadoImagen.set(true);
    this.imageEmpresa.set(this.offerService.objectOffer().imagen);
    this.habitacionOffer = this.offerService.objectOffer().tipoHabitaciones;
    this.formOffer.setValue(
      {
        titulo: this.offerService.objectOffer().titulo,
        precio: this.offerService.objectOffer().precio,
        descuento: this.offerService.objectOffer().descuento,
        nroCamas: this.offerService.objectOffer().cantidad_camas,
        descripcionServicioHabitaciones: this.offerService.objectOffer().descripcionServicios
      }
    )
  }
}
