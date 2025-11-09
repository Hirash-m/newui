import { ToastService } from './../../../services/utilities/toast.service';
import { ListRequest } from './../../../dto/ListRequestDto';
import { baseResponse } from './../../../dto/baseResponse';
import { ProductService } from '../../../services/shop/product/product.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,  Validators,  ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AccordionButtonDirective, AccordionComponent, AccordionItemComponent, ButtonDirective, ColComponent,
      FormDirective, FormFeedbackComponent, FormLabelDirective,     ModalModule, PageItemDirective, PageLinkDirective,
       PaginationComponent, RowDirective, TableDirective, TemplateIdDirective } from '@coreui/angular';


import { CommonModule } from '@angular/common';
import { ProductCreateDto, ProductViewDto } from '../../../dto/shop/ProductDto';




@Component({

  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  imports :[TableDirective,CommonModule,PaginationComponent, PageItemDirective,PageLinkDirective
    ,ButtonDirective,  ColComponent,
  FormDirective,  FormFeedbackComponent,  FormLabelDirective,  RowDirective,
   FormsModule, ReactiveFormsModule,
   ModalModule,
    AccordionComponent,    AccordionItemComponent,    TemplateIdDirective,    AccordionButtonDirective
  ]
})
export class ProductComponent implements OnInit   {

  _request = new ListRequest();
  _productsView: ProductViewDto[]=[];
  _baseResponse = new baseResponse;








  constructor ( private fb: FormBuilder,private productService : ProductService , private toastService: ToastService){}


  ngOnInit(): void {

    this.initForm();
    this.loadProducts();


  }



  //table of list

  loadProducts(): void {
    this._request.pageSize = 5;
    this.productService.getRecords(this._request).subscribe((res)=>{
      if(res.isSucceeded){
        this._baseResponse = res ;
        this._productsView = res.data;

      }
     else {
      
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
          
          this.afterSubmit();
        } else {
         
        }
      });
    } else {
      // ایجاد
      this.productService.insertRecord(productData).subscribe(res => {
        if (res.isSucceeded) {
         
          this.afterSubmit();
        } else {
       

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
        console.log(res);
      this.productForm.patchValue({
        id: product.id,
        name: product.name,
        productCode: product.productCode,
        price: product.price,
        countTypeId: product.countTypeId
      });

      this.showModal = true;
    } else {
      this.toastService.error('محصول پیدا نشد یا خطا در دریافت اطلاعات!');

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
     
      this.afterSubmit(); // ریست فرم و بارگذاری مجدد
      this.selectedProductIds = [];
    } else {
      this.toastService.error('خطا در حذف گروهی');
    }
    this.showDeleteConfirm = false;
  });
}


searchData = {
  pageNumber: 1,
  pageSize: 3,
  sortBy: 'Id',
  sortDirection: true,
  name: '',
  minPrice: 0,
  maxPrice: 0
};

onSearch() {
  this.productService.searchProducts(this.searchData).subscribe(
    (result) => {
      if(result.isSucceeded){
        this._baseResponse = result;
        this._productsView = result.data;
        console.log('نتایج جستجو:', this._productsView);
      } else {
        this.toastService.error('خطا در جستجو');
      }
    },
    (error) => {
      console.error('خطا در جستجو', error);
      this.toastService.error('خطای ارتباط با سرور');
    }
  );
}
}
