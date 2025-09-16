import { Component } from '@angular/core';
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


@Component({
  selector: 'app-checkout',
  imports: [
    HeaderComponent, CommonModule, RouterModule,
    ReactiveFormsModule, FormsModule, 
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

  bandejaList: Producto[] = [];
  fechaHoy: string = new Date().toISOString().split('T')[0];
  randomNum:number = 0;
  isbandejaList:boolean = false;
  iva:number = 12;
  public identity:any;
   public localId!:string;
  //DATA
  public radio_postal:any;
  public medio_postal : any = {};
  public data_cupon:any;
  public id_direccion = '';
  public direccion : any;
  public data_direccion : any = {};
  public data_detalle : Array<any> = [];
  public data_venta : any = {};
  public info_cupon_string = '';
  public error_stock = false;
  public date_string:any;
  public carrito : Array<any> = [];
  public subtotal : any = 0;
  public cupon:any;
  public msm_error_cupon=false;
  public msm_success_cupon=false;
  public precio_envio:any;
  public msm_error = '';

  public socket = io(environment.soketServer);
  public data_direccionLocal : any = {};

  public no_direccion = 'no necesita direccion';
  public paypal:any;

  public url!:string;
  public postales:any;

  tienda!:any;

  selectedMethod: string = 'Selecciona un método de pago';
  public clienteSeleccionado: any;

   habilitacionFormTransferencia:boolean = false;
  habilitacionFormCheque:boolean = false;

  paymentMethods:PaymentMethod[] = []; //array metodos de pago para transferencia (dolares, bolivares, movil)
  paymentSelected!:PaymentMethod; //metodo de pago seleccionado por el usuario para transferencia
  paymentMethodinfo!:PaymentMethod; //metodo de pago seleccionado por el usuario para transferencia


   formTransferencia = new FormGroup({
    metodo_pago: new FormControl(this.paymentMethodinfo,Validators.required),
    bankName: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    referencia: new FormControl('',Validators.required),
    name_person: new FormControl('', Validators.required),
    phone: new FormControl('',Validators.required),
    paymentday: new FormControl('', Validators.required)
  });

  formCheque = new FormGroup({
    amount: new FormControl('', Validators.required),
    name_person: new FormControl(''),
    ncheck: new FormControl('', Validators.required),
    phone: new FormControl('',Validators.required),
    paymentday: new FormControl('', Validators.required)
  });

  
    constructor(
      private _trasferencias: TransferenciasService,
    private _pagoCheque: PagochequeService,
    private _tipoPagosService: TiposdepagoService,
    private _carritoService:CarritoService,
    private _tiendaService :TiendaService,
     private _ventaService :VentaService,
     private _productoService : ProductoService,
     private _router : Router,
     private _postalService :PostalService,
    ) {
      window.scrollTo(0,0);
      // obtenemos el cliente del localstorage
    const cliente = localStorage.getItem('cliente');
       // Si el cliente existe, lo parseamos de JSON a un objeto
    if (cliente) {
        this.clienteSeleccionado = JSON.parse(cliente);
    } else {
        this.clienteSeleccionado = null; // O maneja el caso en que no hay cliente
    }


    }
    ngOnInit(){
      this.loadBandejaListFromLocalStorage();
      this.geneardorOrdeneNumero();
      this.obtenerMetodosdePago();
      this.total();
      let USER = localStorage.getItem('user');
      if(USER){
        this.identity = JSON.parse(USER);
        // console.log(this.identity);
      }

      let TIENDA = localStorage.getItem('tiendaSelected');
      if(TIENDA){
        this.tienda = JSON.parse(TIENDA);
        // console.log(this.tienda);

        this.data_direccionLocal = this.tienda;
        this.localId = this.tienda._id;

      }

       this.direccionTienda();
      
      // this.listar_carrito();
    }

    private listAndIdentify(){
    // this.listar_direcciones();
    // this.listar_postal();
    this.listar_carrito();
    this.obtenerMetodosdePago();
    
    if(this.clienteSeleccionado){
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
    else{
      this._router.navigate(['/']);
    }
  }


    loadBandejaListFromLocalStorage() {
    const storedItems = localStorage.getItem('bandejaItems');
    if (storedItems) {
      this.bandejaList = JSON.parse(storedItems);
      
    }
    if(this.bandejaList.length > 0){
      this.isbandejaList = true;
    }

    this.bandejaList ;
        this.subtotal = 0;
        this.bandejaList.forEach(element => {
          this.subtotal = Math.round(this.subtotal + (element.precio_ahora * element.cantidad));
          this.data_detalle.push({
            producto : element,
            cantidad: element.cantidad,
            precio: Math.round(element.precio_ahora),
            color: '#fff',
            selector : 'unico'
          })
          // console.log(this.carrito);

        });
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



  private obtenerMetodosdePago(){
    this._trasferencias.getPaymentsActives().subscribe(data => {
      this.paymentMethods = data.paymentMethods;
      // console.log('metodos de pago: ',this.paymentMethods)
    });
  }

  // metodo para el cambio del select 'tipo de transferencia'
  onChangePayment(event:Event){
    const target = event.target as HTMLSelectElement; //obtengo el valor
    // console.log(target.value)

    // guardo el metodo seleccionado en la variable de clase paymentSelected
    this.paymentSelected = this.paymentMethods.filter(method => method._id===target.value)[0]
  }

   // Método que se llama cuando cambia el select
  onPaymentMethodChange(event: any) {
    this.selectedMethod = event.target.value;
    console.log('metodo de pago seleccionado: ',this.selectedMethod)
    this.getPaymentMbyName(this.selectedMethod);
    
    if(this.selectedMethod==='paypal' || this.selectedMethod==='card'){
      // transferencia bancaria => abrir formulario (en un futuro un modal con formulario)
      // this.renderPayPalButton(); // Renderiza el botón de nuevo según la opción seleccionada
      this.habilitacionFormTransferencia = false;
      this.habilitacionFormCheque = false;
    }
    if(this.selectedMethod==='Transferencia Dólares' || this.selectedMethod==='Transferencia Bolivares'
      || this.selectedMethod==='pagomovil' || this.selectedMethod==='zelle'
    ){
      // transferencia bancaria => abrir formulario (en un futuro un modal con formulario)
      this.habilitacionFormTransferencia = true;
      this.habilitacionFormCheque = false;
    }
    else if(this.selectedMethod==='cheque'){
      // cheque
      this.habilitacionFormCheque = true;
      
      this.habilitacionFormTransferencia = false;
      
      
    }
  }

  getPaymentMbyName(selectedMethod:string){
    this.selectedMethod = selectedMethod
    this._tipoPagosService.getPaymentMethodByName(selectedMethod).subscribe((resp:any)=>{
      this.paymentMethodinfo = resp[0];
      console.log(this.paymentMethodinfo);
      // Update the form control value with the selected payment method info
      this.formTransferencia.get('metodo_pago')?.setValue(this.paymentMethodinfo);
      this.formTransferencia.get('name_person')?.setValue(this.identity.first_name +''+ this.identity.last_name,);
    })
  }

  sendFormTransfer(){
    
    if(this.formTransferencia.valid){

      const data = {
        localId: this.localId,
        ...this.formTransferencia.value
      }


      // llamo al servicio
      this._trasferencias.createTransfer(data).subscribe(resultado => {
        // console.log('resultado: ',resultado);
        this.verify_dataComplete(Number(this.formTransferencia.value.amount));
        if(resultado.ok || resultado.status === 200){
          // transferencia registrada con exito
          // console.log(resultado.payment);
          // alert('Transferencia registrada con exito');
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Transferencia registrada con exito',
            showConfirmButton: false,
            timer: 1500,
          });
          this.onItemRemoved();
          this._router.navigate(['/my-account/ordenes']);
        }
        else{
          // error al registar la transferencia
          // alert('Error al registrar la transferencia');
          // console.log(resultado.msg);
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'Error al registrar la transferencia' ,  
            text: resultado.msg,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    }
  }

  sendFormCheque(){
    if(this.formCheque.valid){
      console.log(this.formCheque.value)

      this._pagoCheque.registro(this.formCheque.value).subscribe(
        resultado => {
          console.log('resultado: ',resultado);

          if(resultado.ok){
            // console.log(resultado.pago_efectivo);
            this.verify_dataComplete(Number(this.formCheque.value.amount));
            Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'pago Cheque registrada con exito',
            showConfirmButton: false,
            timer: 1500,
          });

            // eliminar carrito luego de haber realzado la compra con transferencia exitosa
            this.remove_carrito();
          }
          else{
            Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'Error al registrar pago Cheque' ,  
            text: resultado.msg,
            showConfirmButton: false,
            timer: 1500,
          });
            console.log(resultado.msg);
          }
          
        }
      );
    }
  }

  remove_carrito(){
    this.carrito.forEach((element,index) => {
        this._carritoService.remove_carrito(element._id).subscribe(
          (response:any) =>{
            this.listar_carrito();
            this.onItemRemoved();
          },
          error=>{
            console.log(error);
          }
        );
    });

    
  }

  onItemRemoved() {
   localStorage.removeItem('bandejaItems');
    // this.saveBandejaListToLocalStorage();
    this.ngOnInit();
  }

  saveBandejaListToLocalStorage() {
    try {
      localStorage.setItem('bandejaItems', JSON.stringify(this.bandejaList));
    } catch (e) {
      console.error('Error saving bandejaList to localStorage', e);
    }
  }

  listar_carrito(){
    this._carritoService.preview_carrito(this.identity.uid ?? '').subscribe(
      (response:any) =>{
        console.log(response)
        this.carrito = response;
        this.subtotal = 0;
        this.carrito.forEach(element => {
          this.subtotal = Math.round(this.subtotal + (element.precio * element.cantidad));
          this.data_detalle.push({
            producto : element,
            cantidad: element.cantidad,
            precio: Math.round(element.precio),
            color: element.color,
            selector : element.selector
          })
          // console.log(this.carrito);

        });
        this.subtotal = Math.round(this.subtotal + parseInt(this.precio_envio));

      },
      error=>{
        console.log(error);

      }
    );
  }

 

  carrito_real_time(){
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

  direccionTienda(){
    this._tiendaService.getTiendaById(this.localId).subscribe(
      tienda =>{
        this.data_direccionLocal = tienda;
        console.log('direccion del local', this.data_direccionLocal);
      }
    );

  }

   verify_dataComplete(total_pagado: number){debugger
    if(this.localId){
      this.msm_error = '';



      if(this.data_cupon){
        if(this.data_cupon.categoria){
          this.info_cupon_string = this.data_cupon.descuento + '% de descuento en ' + this.data_cupon.categoria.nombre;
        }else if(this.data_cupon.subcategoria){
          this.info_cupon_string = this.data_cupon.descuento + '% de descuento en ' + this.data_cupon.subcategoria;
        }
      }

      var fecha = new Date();

      var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Deciembre"];
      fecha.setDate(fecha.getDate() + parseInt(this.medio_postal.dias));
      this.date_string =  fecha.getDate() +' de ' + months[fecha.getMonth()] + ' del ' + fecha.getFullYear();


      this.data_venta = {
        user : this.identity.uid,
        total_pagado : total_pagado,
        codigo_cupon : this.cupon,
        info_cupon :  this.info_cupon_string,
        idtransaccion : null,
        metodo_pago : this.selectedMethod,
        // metodo_pago : 'Paypal',

        tipo_envio: "Pickup",
        precio_envio: "0",
        tiempo_estimado: this.fechaHoy,

        direccion: this.data_direccionLocal.direccion,
        destinatario: this.identity.first_name +''+ this.identity.last_name,
        detalles:this.data_detalle,
        referencia: this.data_direccionLocal.local,
        pais: this.data_direccionLocal.pais,
        ciudad: this.data_direccionLocal.ciudad,
        zip: this.data_direccionLocal.zip,
      }

      console.log(this.data_venta);

      this.saveVenta();

    }else{
      this.msm_error = "Seleccione una dirección de envio.";
    }

  }

  saveVenta(){
    this._ventaService.registro(this.data_venta).subscribe(response =>{
      this.data_venta.detalles.forEach((element: { producto: { _id: any; }; cantidad: any; }) => {
        console.log(element);
        this._productoService.aumentar_ventas(element.producto._id).subscribe(
          response =>{
          },
          error=>{
            console.log(error);

          }
        );
          this._productoService.reducir_stock(element.producto._id,element.cantidad).subscribe(
            response =>{
              this.remove_carrito();
              this.listar_carrito();
              this.socket.emit('save-carrito', {new:true});
              this.socket.emit('save-stock', {new:true});
              // this._router.navigate(['/dashboard/ventas/modulo']);
            },
            error=>{
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



  get_data_cupon(event: Event, cupon: string): void {
    // this.data_keyup = this.data_keyup + 1;

    // if (cupon) {
    //   if (cupon.length == 13) {
    //     console.log('siii');

    //     this._cuponService.get_cuponCode(cupon).subscribe(
    //       (response: CuponResponse) => {
    //         this.data_cupon = response;
    //         console.log(this.data_cupon);

    //         this.msm_error_cupon = false;
    //         this.msm_success_cupon = true;

    //         this.carrito.forEach((element: CarritoProducto, indice: number) => {
    //           if (response.tipo == 'subcategoria') {
    //             if (response.subcategoria == element.producto.subcategoria) {

    //               if (this.data_keyup == 0 || this.data_keyup == 1) {

    //                 let new_subtotal = element.precio - ((element.precio * response.descuento) / 100);
    //                 console.log(new_subtotal);
    //                 element.precio = new_subtotal;

    //                 this.subtotal = 0;
    //                 this.carrito.forEach((element: CarritoProducto) => {
    //                   this.subtotal = Math.round(this.subtotal + (element.precio * element.cantidad));
    //                 });

    //               }
    //             }
    //           }
    //           if (response.tipo == 'categoria') {
    //             if (response.categoria == element.producto.categoria) {

    //               if (this.data_keyup == 0 || this.data_keyup == 1) {

    //                 let new_subtotal = element.precio - ((element.precio * response.descuento) / 100);
    //                 console.log(new_subtotal);
    //                 element.precio = new_subtotal;

    //                 this.subtotal = 0;
    //                 this.carrito.forEach((element: CarritoProducto) => {
    //                   this.subtotal = Math.round(this.subtotal + (element.precio * element.cantidad));
    //                 });

    //               }

    //             }
    //           }
    //         });

    //       },
    //       (error: any) => {
    //         this.data_keyup = 0;
    //         this.msm_error_cupon = true;

    //         this.msm_success_cupon = false;
    //         this.listar_carrito();
    //         this.listar_postal();
    //       }
    //     );
    //   } else {
    //     console.log('nooo');

    //     this.data_keyup = 0;
    //     this.msm_error_cupon = false;
    //     this.msm_success_cupon = false;
    //     this.listar_carrito();

    //   }
    // } else {
    //   this.data_keyup = 0;
    //   this.msm_error_cupon = false;
    //   this.msm_success_cupon = false;
    //   this.listar_carrito();

    // }

  }

  geneardorOrdeneNumero(){
    //creamos una suma de 1 a 1000 para ordenes nuevas
    const max = 1000;
    const min = 1;
    const random = Math.floor(Math.random() * (max - min + 1)) + min
    this.randomNum = random;
    // return random;
  }

}
