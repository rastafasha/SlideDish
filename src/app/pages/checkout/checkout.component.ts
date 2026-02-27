import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { PagochequeService } from '../../services/pagocheque.service';
import { TiposdepagoService } from '../../services/tiposdepago.service';
import { PaymentMethod } from '../../models/paymenthmethod.model';
import { TransferenciasService } from '../../services/transferencias.service';
import { CarritoService } from '../../services/carrito.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import io from "socket.io-client";
import { TiendaService } from '../../services/tienda.service';
import { VentaService } from '../../services/venta.service';
import { ProductoService } from '../../services/product.service';
import { PostalService } from '../../services/postal.service';
import { Tienda } from '../../models/tienda.model';
import { Producto } from '../../models/product';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { NgxPayPalModule } from 'ngx-paypal';
import { CartItemModel } from '../../models/cart-item-model';
import { Color } from '../../models/color.model';
import { ColorService } from '../../services/color.service';
import { SelectorService } from '../../services/selector.service';

declare var $: any;
// declare var paypal;

@Component({
  selector: 'app-checkout',
  imports: [
    HeaderComponent, CommonModule, RouterModule,
    ReactiveFormsModule, FormsModule, NgxPayPalModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

  bandejaList: Producto[] = [];
  fechaHoy: string = new Date().toISOString().split('T')[0];
  randomNum: number = 0;
  isbandejaList: boolean = false;
  iva: number = 12;
  public identity: any;
  public localId!: string;
  paypal: boolean = false;
  //DATA
  public radio_postal: any;
  public medio_postal: any = {};
  public data_cupon: any;
  public id_direccion = '';
  public direccion: any;
  public data_direccion: any = {};
  public data_detalle: Array<any> = [];
  public data_venta: any = {};
  public info_cupon_string = '';
  public error_stock = false;
  public date_string: any;
  public carrito: Array<any> = [];
  public subtotal: any = 0;
  public cupon: any;
  public msm_error_cupon = false;
  public msm_success_cupon = false;
  public precio_envio: any;
  public msm_error = '';
  color!: Color;
  nombre_selector!: string;

  private _colorService = inject(ColorService);
  private _selectorService = inject(SelectorService);

  public socket = io(environment.soketServer);
  public data_direccionLocal: any = {};

  public no_direccion = 'no necesita direccion';

  public payPalConfig?: IPayPalConfig;
  cartItems: any[] = [];

  public url!: string;
  public postales: any;
  tiendaSelect: any;

  tienda!: any;

  selectedMethod: string = 'Selecciona un método de pago';
  public clienteSeleccionado: any;

  habilitacionFormTransferencia: boolean = false;
  habilitacionFormCheque: boolean = false;

  paymentMethods: PaymentMethod[] = []; //array metodos de pago para transferencia (dolares, bolivares, movil)
  paymentSelected!: PaymentMethod; //metodo de pago seleccionado por el usuario para transferencia
  paymentMethodinfo!: PaymentMethod; //metodo de pago seleccionado por el usuario para transferencia




  constructor(
    private _trasferencias: TransferenciasService,
    private _tipoPagosService: TiposdepagoService,
    private _carritoService: CarritoService,
    private _tiendaService: TiendaService,
    private _ventaService: VentaService,
    private _productoService: ProductoService,
    private _router: Router,
  ) {
    window.scrollTo(0, 0);
    // obtenemos el cliente del localstorage
    const cliente = localStorage.getItem('cliente');
    // Si el cliente existe, lo parseamos de JSON a un objeto
    if (cliente) {
      this.clienteSeleccionado = JSON.parse(cliente);
    } else {
      this.clienteSeleccionado = null; // O maneja el caso en que no hay cliente
    }


  }
  ngOnInit() {
    this.loadBandejaListFromLocalStorage();
    this.geneardorOrdeneNumero();
    this.obtenerMetodosdePago();
    this.total();
    let USER = localStorage.getItem('user');
    if (USER) {
      this.identity = JSON.parse(USER);
      // console.log(this.identity);
    }

    let TIENDA = localStorage.getItem('tiendaSelected');
    if (TIENDA) {
      this.tienda = JSON.parse(TIENDA);
      console.log(this.tienda);

      this.data_direccionLocal = this.tienda;
      this.localId = '68752e382f5855586a14b20f';

    }

    // Initialize formTransferencia after identity is set
    this.formTransferencia = new FormGroup({
      metodo_pago: new FormControl(this.paymentMethodinfo, Validators.required),
      bankName: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      referencia: new FormControl('', Validators.required),
      name_person: new FormControl(this.identity ? (this.identity.first_name + ' ' + this.identity.last_name) : '', Validators.required),
      phone: new FormControl(this.identity ? this.identity.telefono : '', Validators.required),
      paymentday: new FormControl('', Validators.required)
    });

    this.direccionTienda();
    // this.loadTiendaFromLocalStorage();

    this.listar_carrito();
  }

  loadTiendaFromLocalStorage() {
    const storedLocal = localStorage.getItem('tiendaSelected');
    if (storedLocal) {
      this.tiendaSelect = JSON.parse(storedLocal);

    }
  }

  direccionTienda() {
    this._tiendaService.getTiendaById(this.localId).subscribe(
      tienda => {
        this.data_direccionLocal = tienda;
      }
    );

  }

  private listAndIdentify() {
    // this.listar_direcciones();
    // this.listar_postal();
    this.listar_carrito();
    this.obtenerMetodosdePago();

    if (this.clienteSeleccionado) {
      this.socket.on('new-carrito', (data: any) => {
        this.listar_carrito();
      });

      // paypal.Buttons({

      //   createOrder: (data: any,actions: { order: { create: (arg0: { purchase_units: { description: string; amount: { currency_code: string; value: number; }; }[]; }) => any; }; })=>{
      //     //VALIR STOCK DE PRODUCTOS
      //     this.data_venta.detalles.forEach((element: { producto: { stock: number; }; }) => {
      //         if(element.producto.stock == 0){
      //           this.error_stock = true;
      //         }else{
      //           this.error_stock = false;
      //         }

      //     });

      //     if(!this.error_stock){
      //       return actions.order.create({
      //         purchase_units : [{
      //           description : 'Compra en Linea',
      //           amount : {
      //             currency_code : 'USD',
      //             value: Math.round(this.subtotal),
      //           }

      //         }]
      //       });
      //     }else{
      //       this.error_stock = true;
      //       this.listar_carrito();
      //     }
      //   },
      //   onApprove : async (data: any,actions: { order: { capture: () => any; }; })=>{
      //     const order = await actions.order.capture();
      //     console.log(order);
      //     this.data_venta.idtransaccion = order.purchase_units[0].payments.captures[0].id;
      //     this._ventaService.registro(this.data_venta).subscribe(
      //       response =>{
      //         this.data_venta.detalles.forEach((element: { producto: { _id: any; }; cantidad: any; }) => {
      //           console.log(element);
      //           this._productoService.aumentar_ventas(element.producto._id).subscribe(
      //             response =>{
      //             },
      //             error=>{
      //               console.log(error);

      //             }
      //           );
      //             this._productoService.reducir_stock(element.producto._id,element.cantidad).subscribe(
      //               response =>{
      //                 this.remove_carrito();
      //                 this.listar_carrito();
      //                 this.socket.emit('save-carrito', {new:true});
      //                 this.socket.emit('save-stock', {new:true});
      //                 this._router.navigate(['/app/cuenta/ordenes']);
      //               },
      //               error=>{
      //                 console.log(error);

      //               }
      //             );
      //         });

      //       },
      //       error=>{
      //         console.log(error);

      //       }
      //     );
      //   },
      //   onError : err =>{
      //     console.log(err);

      //   }
      // }).render(this.paypalElement.nativeElement);
      //
      this.url = environment.baseUrl;

      this.carrito_real_time();

    }
    else {
      this._router.navigate(['/']);
    }
  }

  formTransferencia!: FormGroup;


  async loadBandejaListFromLocalStorage() {
    const storedItems = localStorage.getItem('bandejaItems');
    if (storedItems) {
      this.bandejaList = JSON.parse(storedItems);

    }
    if (this.bandejaList.length > 0) {
      this.isbandejaList = true;
    }

    this.bandejaList;
    this.subtotal = 0;

    for (const element of this.bandejaList) {
      this.subtotal = Math.round(this.subtotal + (element.precio_ahora * element.cantidad));

      // Process color - ensure it's an object with _id
      let colorObj: any = null;
      if (element.color) {
        if (typeof element.color === 'object' && element.color._id) {
          colorObj = element.color;
        } else if (element._id) {
          // Fetch color from service if it's a string or missing _id
          try {
            const colorRes: any = await this._colorService.colorByProduct(element._id).toPromise();
            if (colorRes && colorRes._id) {
              colorObj = colorRes;
            } else if (colorRes && colorRes.color && colorRes.color._id) {
              colorObj = colorRes.color;
            }
          } catch (error) {
            console.error('Error fetching color:', error);
          }
        }
      }

      // Process selector - ensure it's an object with _id
      let selectorObj: any = null;
      if (element.selector) {
        if (typeof element.selector === 'object' && element.selector._id) {
          selectorObj = element.selector;
        } else if (element._id) {
          // Fetch selector from service if it's a string or missing _id
          try {
            const selectorRes: any = await this._selectorService.selectorByProduct(element._id).toPromise();
            if (selectorRes && selectorRes._id) {
              selectorObj = selectorRes;
            } else if (selectorRes && selectorRes.selector && selectorRes.selector._id) {
              selectorObj = selectorRes.selector;
            }
          } catch (error) {
            console.error('Error fetching selector:', error);
          }
        }
      }

      this.data_detalle.push({
        producto: element,
        cantidad: element.cantidad,
        precio: Math.round(element.precio_ahora),
        color: colorObj,
        selector: selectorObj
      });
    }
  }

  total() {
    const total = this.bandejaList.reduce((sum, item) =>
      sum + item.precio_ahora * item.cantidad, 0
    );
    return total;
  }

  totalWithIva() {
    const baseTotal = this.total();
    const ivaAmount = baseTotal * this.iva / 100;
    return baseTotal + ivaAmount;
  }



  private obtenerMetodosdePago() {
    this._trasferencias.getPaymentsActives().subscribe(data => {
      this.paymentMethods = data.paymentMethods;
      // console.log('metodos de pago: ',this.paymentMethods)
    });
  }

  // metodo para el cambio del select 'tipo de transferencia'
  onChangePayment(event: Event) {
    const target = event.target as HTMLSelectElement; //obtengo el valor
    console.log(target.value)

    // guardo el metodo seleccionado en la variable de clase paymentSelected
    this.paymentSelected = this.paymentMethods.filter(method => method._id === target.value)[0]
    console.log(this.paymentSelected)
  }


  // Método que se llama cuando cambia el select
  // onPaymentMethodChange(event: any) {
  //   this.selectedMethod = event.target.value;
  //   console.log('metodo de pago seleccionado: ',this.selectedMethod)
  //   this.getPaymentMbyName(this.selectedMethod);

  //   if(this.selectedMethod==='paypal' || this.selectedMethod==='card'){
  //     // transferencia bancaria => abrir formulario (en un futuro un modal con formulario)
  //     // this.renderPayPalButton(); // Renderiza el botón de nuevo según la opción seleccionada
  //     this.habilitacionFormTransferencia = false;
  //     this.habilitacionFormCheque = false;
  //   }
  //   if(this.selectedMethod==='Transferencia Dólares' || this.selectedMethod==='Transferencia Bolivares'
  //     || this.selectedMethod==='pagomovil' || this.selectedMethod==='zelle'
  //   ){
  //     // transferencia bancaria => abrir formulario (en un futuro un modal con formulario)
  //     this.habilitacionFormTransferencia = true;
  //     this.habilitacionFormCheque = false;
  //   }
  //   else if(this.selectedMethod==='cheque'){
  //     // cheque
  //     this.habilitacionFormCheque = true;

  //     this.habilitacionFormTransferencia = false;


  //   }
  // }

  // Método que se llama cuando cambia el select
  onPaymentMethodChange(event: any) {
    this.selectedMethod = event.target.value;
    this.renderPayPalButton(); // Renderiza el botón de nuevo según la opción seleccionada
  }

  getPaymentMbyName(selectedMethod: string) {
    this.selectedMethod = selectedMethod
    this._tipoPagosService.getPaymentMethodByName(selectedMethod).subscribe((resp: any) => {
      this.paymentMethodinfo = resp[0];
      // Update the form control value with the selected payment method info
      this.formTransferencia.get('metodo_pago')?.setValue(this.paymentMethodinfo);
      // Auto-fill name_person and phone from identity if available
      if (this.identity) {
        this.formTransferencia.get('name_person')?.setValue(this.identity.first_name + ' ' + this.identity.last_name);
        this.formTransferencia.get('phone')?.setValue(this.identity.telefono);
      }
    })
  }

  sendFormTransfer() {

    const data = {
      localId: this.localId,
      ...this.formTransferencia.value
    }


    // llamo al servicio
    this._trasferencias.createTransfer(data).subscribe(resultado => {
      // console.log('resultado: ',resultado);
      this.verify_dataComplete(Number(this.formTransferencia.value.amount));
      if (resultado.ok || resultado.status === 200) {

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Transferencia registrada con exito',
          showConfirmButton: false,
          timer: 1500,
        });
        this._carritoService.clearCart(); // Limpia el carrito después de la compra
        this._router.navigate(['/my-account/ordenes']);
      }
      else {
        Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: 'Error al registrar la transferencia',
          text: resultado.msg,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  }



  remove_carrito() {
    this.carrito.forEach((element, index) => {
      this._carritoService.remove_carrito(element._id).subscribe(
        (response: any) => {
          this.listar_carrito();
          this.onItemRemoved();
        },
        error => {
          console.log(error);
        }
      );
    });


  }

  onItemRemoved() {
    localStorage.removeItem('bandejaItems');
    this.saveBandejaListToLocalStorage();
    this.ngOnInit();
  }

  saveBandejaListToLocalStorage() {
    try {
      localStorage.setItem('bandejaItems', JSON.stringify(this.bandejaList));
    } catch (e) {
      console.error('Error saving bandejaList to localStorage', e);
    }
  }

  async listar_carrito() {
    this._carritoService.preview_carrito(this.identity.uid ?? '').subscribe(
      (response: any) => {
        this.carrito = response;
        this.subtotal = 0;

        // Process each item and ensure color/selector have _id
        this.carrito.forEach(async (element: any) => {
          this.subtotal = Math.round(this.subtotal + (element.precio * element.cantidad));

          // Process color - ensure it's an object with _id
          let colorObj: any = null;
          if (element.color) {
            if (typeof element.color === 'object' && element.color._id) {
              colorObj = element.color;
            } else if (element.producto?._id) {
              try {
                const colorRes: any = await this._colorService.colorByProduct(element.producto._id).toPromise();
                if (colorRes && colorRes._id) {
                  colorObj = colorRes;
                } else if (colorRes && Array.isArray(colorRes) && colorRes.length > 0) {
                  colorObj = colorRes[0];
                }
              } catch (error) {
                console.error('Error fetching color:', error);
              }
            }
          }

          // Process selector - ensure it's an object with _id
          let selectorObj: any = null;
          if (element.selector) {
            if (typeof element.selector === 'object' && element.selector._id) {
              selectorObj = element.selector;
            } else if (element.producto?._id) {
              try {
                const selectorRes: any = await this._selectorService.selectorByProduct(element.producto._id).toPromise();
                if (selectorRes && selectorRes._id) {
                  selectorObj = selectorRes;
                } else if (selectorRes && Array.isArray(selectorRes) && selectorRes.length > 0) {
                  selectorObj = selectorRes[0];
                }
              } catch (error) {
                console.error('Error fetching selector:', error);
              }
            }
          }

          this.data_detalle.push({
            producto: element,
            cantidad: element.cantidad,
            precio: Math.round(element.precio),
            color: colorObj,
            selector: selectorObj
          });
          console.log(this.data_detalle);

        });
        this.subtotal = Math.round(this.subtotal + parseInt(this.precio_envio));

      },
      error => {
        console.log(error);

      }
    );
  }



  carrito_real_time() {
    // this.socket.on('new-carrito', function (data:any) {
    //   this.subtotal = 0;

    //   this._carritoService.preview_carrito(this.clienteSeleccionado.uid).subscribe(
    //     response =>{
    //       this.carrito = response;

    //       this.carrito.forEach(element => {
    //         this.subtotal = Math.round(this.subtotal + (element.precio * element.cantidad));
    //       });

    //     },
    //     error=>{
    //       console.log(error);

    //     }
    //   );

    // }.bind(this));
  }



  verify_dataComplete(total_pagado: number) {

    if (this.localId) {
      this.msm_error = '';

      if (this.data_cupon) {
        if (this.data_cupon.categoria) {
          this.info_cupon_string = this.data_cupon.descuento + '% de descuento en ' + this.data_cupon.categoria.nombre;
        } else if (this.data_cupon.subcategoria) {
          this.info_cupon_string = this.data_cupon.descuento + '% de descuento en ' + this.data_cupon.subcategoria;
        }
      }

      var fecha = new Date();

      var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Deciembre"];
      fecha.setDate(fecha.getDate() + parseInt(this.medio_postal.dias));
      this.date_string = fecha.getDate() + ' de ' + months[fecha.getMonth()] + ' del ' + fecha.getFullYear();


      this.data_venta = {
        user: this.identity.uid,
        local: this.data_direccionLocal._id,
        total_pagado: total_pagado,
        codigo_cupon: this.cupon,
        info_cupon: this.info_cupon_string,
        idtransaccion: null,
        metodo_pago: this.selectedMethod,
        // metodo_pago : 'Paypal',

        tipo_envio: "Pickup",
        precio_envio: "0",
        tiempo_estimado: this.fechaHoy,

        direccion: this.data_direccionLocal.direccion,
        destinatario: this.identity.first_name + '' + this.identity.last_name,
        detalles: this.data_detalle,
        referencia: this.data_direccionLocal.local,
        pais: this.data_direccionLocal.pais,
        ciudad: this.data_direccionLocal.ciudad,
        zip: this.data_direccionLocal.zip,
      }

      console.log(this.data_venta);

      this.saveVenta();

    } else {
      this.msm_error = "Seleccione una dirección de envio.";
    }

  }

  saveVenta() {

    this._ventaService.registro(this.data_venta).subscribe(response => {
      this.data_venta.detalles.forEach((element: { producto: { _id: any; }; cantidad: any; }) => {
        console.log(element);
        this._productoService.aumentar_ventas(element.producto._id).subscribe(
          response => {


          },
          error => {
            console.log(error);

          }
        );
        this._productoService.reducir_stock(element.producto._id, element.cantidad).subscribe(
          response => {
            this.remove_carrito();
            this.listar_carrito();
            this.socket.emit('save-carrito', { new: true });
            this.socket.emit('save-stock', { new: true });
            // this._router.navigate(['/dashboard/ventas/modulo']);


          },
          error => {
            console.log(error);

          }
        );


      });

      // Enviar mensaje de WhatsApp a la tienda
      // if(this.tienda && this.tienda.telefono){
      //   const message = `Haz recibido una compra ${this.randomNum}, favor verifica y, procesala pronto !`;
      //   const url = `https://wa.me/${this.tienda.telefono}?text=${encodeURIComponent(message)}`;
      //   window.open(url, '_blank');
      // }

    },)
  }



  geneardorOrdeneNumero() {
    //creamos una suma de 1 a 1000 para ordenes nuevas
    const max = 1000;
    const min = 1;
    const random = Math.floor(Math.random() * (max - min + 1)) + min
    this.randomNum = random;
    // return random;
  }


  private renderPayPalButton() {
    // Primero, limpiar el contenedor anterior
    // this.paypalElement.nativeElement.innerHTML = '';

    if (this.selectedMethod === 'card' || this.selectedMethod === 'paypal') {
      // deshabilitar el formulario de pago con transferencia
      this.habilitacionFormTransferencia = false;
      this.paypal = true;
      // Cargar el botón de PayPal con las opciones seleccionadas
      this.initPayPalConfig();
    }
    else if (this.selectedMethod === 'transferencia') {
      // transferencia bancaria => abrir formulario (en un futuro un modal con formulario)
      this.habilitacionFormTransferencia = true;
      this.paypal = false;
    }
    else {
      this.paypal = false;
      this.habilitacionFormTransferencia = false;
    }
  }

  private initPayPalConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: environment.clientIdPaypal,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: Math.round(this.subtotal).toString(),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: Math.round(this.subtotal).toString(),
              }
            }
          },
          items: this.getItemsList()
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.data_venta.idtransaccion = data.id;
        this.saveVenta();
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  getItemsList(): any[] {

    const items: any[] = [];
    let item = {};
    this.cartItems.forEach((it: CartItemModel) => {
      item = {
        name: it.productName,
        unit_amount: {
          currency_code: 'USD',
          value: it.productPrice,
        },
        quantity: it.quantity,
        category: it.category,
      };
      items.push(item);
    });
    return items;
  }

}
