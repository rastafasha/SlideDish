import { Categoria } from "./categoria.model";
import { Producto } from "./producto.model";

export class CartItemModel {

    productId?: string;
    productName: string;
    productPrice:number;
    description:string;
    quantity:number;
    category!:Categoria;
    category_name:Categoria;
    img!:string;

    constructor(product: Producto){
      this.productId= product._id;
      this.productName = product.titulo;
      this.category_name = product.categoria;
      this.description = product.detalle;
      this.productPrice = product.precio_ahora;
      this.quantity = 1;
    }



}
