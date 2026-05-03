// ---------------------------
// Import Dependencies
// ---------------------------
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// CoreUI components & directives
import {
  ButtonDirective, ColComponent,
  FormDirective, FormFeedbackComponent, FormLabelDirective, ModalModule,
  PageItemDirective, PageLinkDirective,
  PaginationComponent, RowDirective, TableDirective,
  AccordionButtonDirective, AccordionComponent, AccordionItemComponent, TemplateIdDirective
} from '@coreui/angular';

// DTOs & Services
import { ListRequest } from 'src/app/dto/ListRequestDto';
import { ListDataResult, SingleDataResult, StatusResult } from 'src/app/dto/result';
import { ProductCreateDto, ProductViewDto } from 'src/app/dto/shop/ProductDto';
import { ProductService } from 'src/app/services/shop/product/product.service';
import { ToastService } from 'src/app/services/utilities/toast.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  imports: [
    CommonModule, TableDirective, PaginationComponent, PageItemDirective, PageLinkDirective,
    ButtonDirective, ColComponent, FormDirective, FormFeedbackComponent,
    FormLabelDirective, RowDirective, FormsModule, ReactiveFormsModule, ModalModule,
    AccordionComponent, AccordionItemComponent, TemplateIdDirective, AccordionButtonDirective
  ],
  standalone: true
})
export class ProductComponent implements OnInit {

  // درخواست لیست
  _request = new ListRequest();
  _productsView: ProductViewDto[] = [];
  _baseResponse: ListDataResult<ProductViewDto> = OkList<ProductViewDto>();

  // فرم
  showModal = false;
  productForm!: FormGroup;

  // ویرایش
  editMode = false;
  editingProductId: number | null = null;

  // حذف گروهی
  selectedProductIds: number[] = [];
  showDeleteConfirm = false;

  // جستجو
  searchData = {
    pageNumber: 1,
    pageSize: 3,
    sortBy: 'Id',
    sortDirection: true,
    name: '',
    minPrice: 0,
    maxPrice: 0
  };

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
  }

  // ---------------------------
  // فرم
  // ---------------------------
  initForm() {
    this.productForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      productCode: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      countTypeId: [0, Validators.required],
    });
  }

// بارگذاری لیست
loadProducts(): void {
  this._request.pageSize = 5;
  this.productService.getRecords(this._request).subscribe({
    next: (res: ListDataResult<ProductViewDto>) => {
      if (res.status < 300) {
        this._baseResponse = res;
        this._productsView = res.listData || [];
      } else {
        this.toastService.error(res.messages?.join() || 'خطا در بارگذاری محصولات');
      }
    },
    error: (error) => {
      console.error('خطا در دریافت لیست محصولات:', error);
      this.toastService.error('خطا در ارتباط با سرور');
    }
  });
}

  // ---------------------------
  // ایجاد / ویرایش
  // ---------------------------
  onSubmit1() {
    if (this.productForm.valid) {
      const productData: ProductCreateDto = this.productForm.value;

      if (this.editMode && this.editingProductId != null) {
        this.productService.updateRecord(productData).subscribe((res: StatusResult) => {
          if (res.status<300) {
            this.afterSubmit();
            this.toastService.success('محصول با موفقیت ویرایش شد');
          } else {
            this.toastService.error(res.messages?.join() || 'خطا در ویرایش');
          }
        });
      } else {
        this.productService.insertRecord(productData).subscribe((res: StatusResult) => {
          if (res.status < 300) {
            this.afterSubmit();
            this.toastService.success('محصول با موفقیت ایجاد شد');
          } else {
            this.toastService.error(res.messages?.join() || 'خطا در ایجاد');
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

  // ---------------------------
  // ویرایش
  // ---------------------------
  onEdit(productId: number) {
    this.editMode = true;
    this.editingProductId = productId;

    this.productService.getRecordById(productId).subscribe((res: SingleDataResult<ProductCreateDto>) => {
      if (res.status < 300 && res.data) {
        const product = res.data;
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

  // ---------------------------
  // صفحه‌بندی
  // ---------------------------
  changePage(pageNumber: number) {
    this._request.pageNumber = pageNumber;
    this.loadProducts();
  }

  // ---------------------------
  // حذف گروهی
  // ---------------------------
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

  deleteSelectedProducts(): void {
    this.productService.deleteRecords(this.selectedProductIds).subscribe((res: StatusResult) => {
      if (res.status < 300) {
        this.afterSubmit();
        this.selectedProductIds = [];
        this.toastService.success('محصولات انتخاب‌شده حذف شدند');
      } else {
        this.toastService.error(res.messages?.join() || 'خطا در حذف گروهی');
      }
      this.showDeleteConfirm = false;
    });
  }

  // ---------------------------
  // جستجو
  // ---------------------------
  onSearch() {
    this.productService.searchProducts(this.searchData).subscribe(
      (result: ListDataResult<ProductViewDto>) => {
        if (result.status<2) {
          this._baseResponse = result;
          this._productsView = result.listData || [];
          console.log('نتایج جستجو:', this._productsView);
        } else {
          this.toastService.error(result.messages?.join() || 'خطا در جستجو');
        }
      },
      (error) => {
        console.error('خطا در جستجو', error);
        this.toastService.error('خطای ارتباط با سرور');
      }
    );
  }
}

function OkList<T>(): ListDataResult<ProductViewDto> {
  throw new Error('Function not implemented.');
}
