import { ListRequest } from './../../../dto/ListRequestDto';
import { baseResponse } from './../../../dto/baseResponse';
import { ProductService } from './../../../services/shop/product.service';
import { Component, OnInit, Injector } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormControlDirective, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonDirective, ColComponent, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, FormDirective, FormFeedbackComponent, FormLabelDirective, FormSelectDirective, GutterDirective, InputGroupComponent, InputGroupTextDirective, ModalModule, PageItemDirective, PageLinkDirective, PaginationComponent, RowDirective, TableDirective } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { ProductCreateDto, ProductViewDto } from '../../../dto/shop/ProductDto';
import { ToastService } from '../../../services/utilities/toast.service';

@Component({

  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  imports :[TableDirective,CommonModule,PaginationComponent, PageItemDirective,PageLinkDirective
    ,ButtonDirective,  ColComponent,  FormCheckComponent,  FormCheckInputDirective,  FormCheckLabelDirective,
  FormDirective,  FormFeedbackComponent,  FormLabelDirective,  FormSelectDirective,  GutterDirective,  InputGroupComponent,  InputGroupTextDirective, RowDirective,
   FormsModule, ReactiveFormsModule,
   ModalModule
  ]
})
export class ProductComponent implements OnInit   {

  _request = new ListRequest();
  _productsView: ProductViewDto[]=[];
  _baseResponse = new baseResponse;






  constructor (private toastService: ToastService , private fb: FormBuilder,private productService : ProductService){}


  ngOnInit(): void {

    this.initForm();
    this.loadProducts();
      setInterval(() => {
    this.toastService.show('با موفقیت ثبت شد', 'success');
  }, 10000);

  }


  //table of list

  loadProducts(): void {
    this._request.pageSize = 2;
    this.productService.getRecords(this._request).subscribe((res)=>{
      if(res.isSucceeded){
        this._baseResponse = res ;
        this._productsView = res.data;
        console.log(this._baseResponse);
      }

    })
  }




//form create
    showModal = false;
    productForm!: FormGroup;

    initForm() {
  this.productForm = this.fb.group({
    id: [null],
    name:['',Validators.required],
    productCode:['',Validators.required],
    price:[0,Validators.required],
    countTypeId:[0,Validators.required],
  });}


onSubmit1() {
  if (this.productForm.valid) {

     const productData : ProductCreateDto = this.productForm.value;
    if (this.editMode && this.editingProductId != null) {
      // ویرایش
      this.productService.updateRecord( productData).subscribe(res => {
        if (res.isSucceeded) {
          console.log('ویرایش انجام شد');
          this.afterSubmit();
        } else {
          console.log('خطا در ویرایش');
        }
      });
    } else {
      // ایجاد
      this.productService.insertRecord(productData).subscribe(res => {
        if (res.isSucceeded) {
          console.log('ایجاد انجام شد');
          this.afterSubmit();
        } else {
          console.log('خطا در ایجاد');
        }
      });
    }
  }
}


afterSubmit() {
  this.loadProducts();
  this.showModal = false;
  this.productForm.reset();
  this.editMode = false;
  this.editingProductId = null;
}

// edit product



editMode = false;
editingProductId: number | null = null;


onEdit(productId: number) {
  this.editMode = true;
  this.editingProductId = productId;

  this.productService.getRecordById(productId).subscribe(res => {
    if (res.isSucceeded && res.singleData) {
      const product = res.singleData;

      this.productForm.patchValue({
        id: product.id,
        name: product.name,
        productCode: product.productCode,
        price: product.price,
        countTypeId: product.countTypeId
      });

      this.showModal = true;
    } else {
      console.error('محصول پیدا نشد یا خطا در دریافت اطلاعات!');
    }
  });
}






//change page
  changePage(pagenumber: number){
    this._request.pageNumber = pagenumber;
    this.loadProducts();

  }



  //remove products
  selectedProductIds: number[] = [];

isSelected(productId: number): boolean {
  return this.selectedProductIds.includes(productId);
}

toggleSelection(productId: number): void {
  const index = this.selectedProductIds.indexOf(productId);
  if (index > -1) {
    this.selectedProductIds.splice(index, 1);
  } else {
    this.selectedProductIds.push(productId);
  }
}


showDeleteConfirm = false;

deleteSelectedProducts(): void {
  this.productService.deleteRecords(this.selectedProductIds).subscribe(res => {
    if (res.isSucceeded) {
      console.log('محصولات حذف شدند.');
      this.afterSubmit(); // ریست فرم و بارگذاری مجدد
    } else {
      console.error('خطا در حذف گروهی');
    }
    this.showDeleteConfirm = false;
  });
}

}
