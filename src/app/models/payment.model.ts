export class Payment{
  constructor(
      public _id: string,
      public nombreCompleto: string,
      public username: string,
      public email: string,
      public bankName: string,
      public accountNumber : string,
      public phone : string,
      public user: string,
      public type?: 'Paypal' | 'Bank Transfer' | 'Pago Movil'
  ){
  }
}
