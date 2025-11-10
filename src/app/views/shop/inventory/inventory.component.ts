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
  PaginationComponent, RowDirective, TableDirective
} from '@coreui/angular';

// DTOs & Services
import { ApiResult, createApiResult } from 'src/app/dto/api-result'; // تغییر از baseResponse
import { ListRequest } from 'src/app/dto/ListRequestDto';
import { InventoryDto } from 'src/app/dto/shop/InventoryDto';
import { InventoryService } from 'src/app/services/shop/inventory/inventory.service';
import { ToastService } from 'src/app/services/utilities/toast.service';

@Component({
  selector: 'app-inventory',
  imports: [
    CommonModule, TableDirective, PaginationComponent, PageItemDirective, PageLinkDirective,
    ButtonDirective, ColComponent, FormDirective, FormFeedbackComponent,
    FormLabelDirective, RowDirective, ModalModule,
    FormsModule, ReactiveFormsModule
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
  standalone: true
})
export class InventoryComponent implements OnInit {

  // درخواست لیست
  _request = new ListRequest();
  _objectsView: InventoryDto[] = [];
  _baseResponse: ApiResult<InventoryDto> = createApiResult<InventoryDto>();

  // فرم
  ObjectForm!: FormGroup;
  showModal = false;

  // ویرایش
  editMode = false;
  editingId: number | null = null;

  // حذف گروهی
  selectedIds: number[] = [];
  showDeleteConfirm = false;

  constructor(
    private fb: FormBuilder,
    private ObjectService: InventoryService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDataTable();
  }

  // ---------------------------
  // فرم
  // ---------------------------
  initForm() {
    this.ObjectForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      active: [true, Validators.required]
    });
  }

  // ---------------------------
  // بارگذاری لیست
  // ---------------------------
  loadDataTable(): void {
    this._request.pageSize = 5;
    this.ObjectService.getRecords(this._request).subscribe((res: ApiResult<InventoryDto>) => {
      if (res.isSucceeded) {
        this._baseResponse = res;
        this._objectsView = res.data || [];
      } else {
        this.toastService.error(res.message || 'خطا در بارگذاری انبارها');
      }
    });
  }

  // ---------------------------
  // ایجاد / ویرایش
  // ---------------------------
  onSubmit1() {
    if (this.ObjectForm.valid) {
      const ObjectData: InventoryDto = this.ObjectForm.value;

      if (this.editMode && this.editingId != null) {
        this.ObjectService.updateRecord(ObjectData).subscribe((res: ApiResult<any>) => {
          if (res.isSucceeded) {
            this.afterSubmit();
            this.toastService.success('انبار با موفقیت ویرایش شد');
          } else {
            this.toastService.error(res.message || 'خطا در ویرایش');
          }
        });
      } else {
        this.ObjectService.insertRecord(ObjectData).subscribe((res: ApiResult<any>) => {
          if (res.isSucceeded) {
            this.afterSubmit();
            this.toastService.success('انبار با موفقیت ایجاد شد');
          } else {
            this.toastService.error(res.message || 'خطا در ایجاد');
          }
        });
      }
    }
  }

  afterSubmit() {
    this.loadDataTable();
    this.showModal = false;
    this.ObjectForm.reset();
    this.editMode = false;
    this.editingId = null;
  }

  // ---------------------------
  // ویرایش
  // ---------------------------
  onEdit(ObjectId: number) {
    this.editMode = true;
    this.editingId = ObjectId;

    this.ObjectService.getRecordById(ObjectId).subscribe((res: ApiResult<InventoryDto>) => {
      if (res.isSucceeded && res.singleData) {
        const obj = res.singleData;
        this.ObjectForm.patchValue({
          id: obj.id,
          name: obj.name,
          active: obj.active
        });
        this.showModal = true;
      } else {
        this.toastService.error('مورد پیدا نشد یا خطا در دریافت اطلاعات!');
      }
    });
  }

  // ---------------------------
  // صفحه‌بندی
  // ---------------------------
  changePage(pagenumber: number) {
    this._request.pageNumber = pagenumber;
    this.loadDataTable();
  }

  // ---------------------------
  // حذف گروهی
  // ---------------------------
  isSelected(objectId: number): boolean {
    return this.selectedIds.includes(objectId);
  }

  toggleSelection(ObjectId: number): void {
    const index = this.selectedIds.indexOf(ObjectId);
    if (index > -1) {
      this.selectedIds.splice(index, 1);
    } else {
      this.selectedIds.push(ObjectId);
    }
  }

  deleteSelectedRecords(): void {
    this.ObjectService.deleteRecords(this.selectedIds).subscribe((res: ApiResult<any>) => {
      if (res.isSucceeded) {
        this.afterSubmit();
        this.selectedIds = [];
        this.toastService.success('انبارهای انتخاب‌شده حذف شدند');
      } else {
        this.toastService.error(res.message || 'خطا در حذف گروهی');
      }
      this.showDeleteConfirm = false;
    });
  }
}