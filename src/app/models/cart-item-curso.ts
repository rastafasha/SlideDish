import { Categoria } from "./categoria.model";
import { Curso } from "./curso.model";

export class CartItemCurso {

  cursoId: string;
  cursoName: string;
  cursoPrice:number;
    description:string;
    quantity:number;
    category_name!:Categoria;
    categoria:Categoria;
    img:string;

    constructor(curso: Curso){
      this.cursoId= curso._id;
      this.cursoName = curso.titulo;
      this.categoria = curso.categoria;
      this.description = curso.detalle;
      this.cursoPrice = curso.precio_ahora;
      this.img = curso.img;
      this.quantity = 1;
    }


}
