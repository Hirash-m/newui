export class ProductViewDto {
  id!:number;
  productCode!:string;
  name!:string;
  price!:number;


}



export class ProductCreateDto {


  id!:number;
  productCode!:string;
  name!:string;
  price!:number;
  countTypeId!:number;

}
