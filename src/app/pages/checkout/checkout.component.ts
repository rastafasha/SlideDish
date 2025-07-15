import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { PagochequeService } from '../../services/pagocheque.service';
import { TiposdepagoService } from '../../services/tiposdepago.service';
import { PaymentMethod } from '../../models/paymenthmethod.model';
import { TransferenciasService } from '../../services/transferencias.service';

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

  bandejaList: any[] = [];
  fechaHoy: string = new Date().toISOString().split('T')[0];
  randomNum:number = 0;
  isbandejaList:boolean = false;

  iva:number = 12;

  public cupon:any;
  public msm_error_cupon=false;
  public msm_success_cupon=false;


  selectedMethod: string = 'Selecciona un método de pago';

   habilitacionFormTransferencia:boolean = false;
  habilitacionFormCheque:boolean = false;

  paymentMethods:PaymentMethod[] = []; //array metodos de pago para transferencia (dolares, bolivares, movil)
  paymentSelected!:PaymentMethod; //metodo de pago seleccionado por el usuario para transferencia
  paymentMethodinfo!:PaymentMethod; //metodo de pago seleccionado por el usuario para transferencia


   formTransferencia = new FormGroup({
    metodo_pago: new FormControl('',Validators.required),
    bankName: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    referencia: new FormControl('',Validators.required),
    name_person: new FormControl('', Validators.required),
    phone: new FormControl('',Validators.required),
    paymentday: new FormControl('', Validators.required)
  });

  formCheque = new FormGroup({
    amount: new FormControl('', Validators.required),
    name_person: new FormControl('', Validators.required),
    ncheck: new FormControl('', Validators.required),
    phone: new FormControl('',Validators.required),
    paymentday: new FormControl('', Validators.required)
  });

  
    constructor(
      private _trasferencias: TransferenciasService,
    private _pagoCheque: PagochequeService,
    private _tipoPagosService: TiposdepagoService
    ) {
      window.scrollTo(0,0);
    }
    ngOnInit(){
      this.loadBandejaListFromLocalStorage();
      // this.geneardorOrdeneNumero();
      this.obtenerMetodosdePago();

    }

    loadBandejaListFromLocalStorage() {
    const storedItems = localStorage.getItem('carrito');
    if (storedItems) {
      this.bandejaList = JSON.parse(storedItems);
      
    }
    if(this.bandejaList.length > 0){
      this.isbandejaList = true;
    }
  }

  total() {
    const total = this.bandejaList.reduce((sum, item) => 
      sum + item.price * item.quantity, 0
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
      // console.log('metodos de pago: ',data.paymentMethods)
      this.paymentMethods = data.paymentMethods;
      console.log('metodos de pago: ',this.paymentMethods)
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
      // console.log(this.paymentMethodinfo);
    })
  }

  sendFormTransfer(){
    if(this.formTransferencia.valid){
      // llamo al servicio
      this._trasferencias.createTransfer(this.formTransferencia.value).subscribe(resultado => {
        // console.log('resultado: ',resultado);
        // this.verify_dataComplete();
        if(resultado.ok){
          // transferencia registrada con exito
          // console.log(resultado.payment);
          // alert('Transferencia registrada con exito');
          // Swal.fire({
          //   position: 'top-end',
          //   icon: 'success',
          //   title: 'Transferencia registrada con exito',
          //   showConfirmButton: false,
          //   timer: 1500,
          // });
        }
        else{
          // error al registar la transferencia
          alert('Error al registrar la transferencia');
          // console.log(resultado.msg);

          
          // Swal.fire({
          //   position: 'top-end',
          //   icon: 'warning',
          //   title: 'Error al registrar la transferencia' ,  
          //   text: resultado.msg,
          //   showConfirmButton: false,
          //   timer: 1500,
          // });
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
            // this.verify_dataComplete();
          //   Swal.fire({
          //   position: 'top-end',
          //   icon: 'success',
          //   title: 'pago Cheque registrada con exito',
          //   showConfirmButton: false,
          //   timer: 1500,
          // });

            // eliminar carrito luego de haber realzado la compra con transferencia exitosa
            // this.remove_carrito();
          }
          else{
          //   Swal.fire({
          //   position: 'top-end',
          //   icon: 'warning',
          //   title: 'Error al registrar pago Cheque' ,  
          //   text: resultado.msg,
          //   showConfirmButton: false,
          //   timer: 1500,
          // });
            console.log(resultado.msg);
          }
          
        }
      );
    }
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

}
