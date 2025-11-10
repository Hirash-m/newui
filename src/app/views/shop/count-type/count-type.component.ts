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
import { CountTypeDto } from 'src/app/dto/shop/CountTypeDto';
import { CountTypeService } from 'src/app/services/shop/countType/count-type.service';
import { ToastService } from 'src/app/services/utilities/toast.service';

// ---------------------------
// Component Definition
// ---------------------------
@Component({
  selector: 'app-count-type',
  standalone: true,
  imports: [
    CommonModule, TableDirective, PaginationComponent, PageItemDirective, PageLinkDirective,
    ButtonDirective, ColComponent, FormDirective, FormFeedbackComponent,
    FormLabelDirective, RowDirective, ModalModule,
    FormsModule, ReactiveFormsModule,
  ],
  templateUrl: './count-type.component.html',
  styleUrl: './count-type.component.scss'
})
export class CountTypeComponent implements OnInit {

  // درخواست لیست
  _request = new ListRequest();
  _objectsView: CountTypeDto[] = [];
  _baseResponse: ApiResult<CountTypeDto> = createApiResult<CountTypeDto>();

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
    private countTypeService: CountTypeService,
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
    });
  }

  // ---------------------------
  // بارگذاری لیست
  // ---------------------------
  loadDataTable(): void {
    this._request.pageSize = 5;
    this.countTypeService.getRecords(this._request).subscribe({
      next: (res: ApiResult<CountTypeDto>) => {
        if (res.isSucceeded) {
          this._baseResponse = res;
          this._objectsView = res.data || [];
        } else {
          this.toastService.error(res.message || 'خطا در بارگذاری انواع شمارش');
        }
      },
      error: (err) => {
        console.error('خطا در دریافت لیست:', err);
        this.toastService.error('خطای ارتباط با سرور');
      }
    });
  }

  // ---------------------------
  // ایجاد / ویرایش
  // ---------------------------
  onSubmit1() {
    if (this.ObjectForm.valid) {
      const data: CountTypeDto = this.ObjectForm.value;

      const request$ = this.editMode && this.editingId != null
        ? this.countTypeService.updateRecord(data)
        : this.countTypeService.insertRecord(data);

      request$.subscribe({
        next: (res: ApiResult<any>) => {
          if (res.isSucceeded) {
            this.afterSubmit();
            this.toastService.success(
              this.editMode ? 'نوع شمارش با موفقیت ویرایش شد' : 'نوع شمارش با موفقیت ایجاد شد'
            );
          } else {
            this.toastService.error(res.message || 'خطا در عملیات');
          }
        },
        error: (err) => {
          console.error('خطا در ذخیره:', err);
          this.toastService.error('خطای ارتباط با سرور');
        }
      });
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
  onEdit(id: number) {
    this.editMode = true;
    this.editingId = id;

    this.countTypeService.getRecordById(id).subscribe({
      next: (res: ApiResult<CountTypeDto>) => {
        if (res.isSucceeded && res.data) {
          this.ObjectForm.patchValue(res.data);
          this.showModal = true;
        } else {
          this.toastService.error('مورد پیدا نشد');
        }
      },
      error: (err) => {
        this.toastService.error('خطا در دریافت اطلاعات');
      }
    });
  }

  // ---------------------------
  // صفحه‌بندی
  // ---------------------------
  changePage(pageNumber: number) {
    this._request.pageNumber = pageNumber;
    this.loadDataTable();
  }

  // ---------------------------
  // حذف گروهی
  // ---------------------------
  isSelected(id: number): boolean {
    return this.selectedIds.includes(id);
  }

  toggleSelection(id: number): void {
    const index = this.selectedIds.indexOf(id);
    if (index > -1) {
      this.selectedIds.splice(index, 1);
    } else {
      this.selectedIds.push(id);
    }
  }

  deleteSelectedRecords(): void {
    this.countTypeService.deleteRecords(this.selectedIds).subscribe({
      next: (res: ApiResult<any>) => {
        if (res.isSucceeded) {
          this.afterSubmit();
          this.selectedIds = [];
          this.toastService.success('انواع انتخاب‌شده حذف شدند');
        } else {
          this.toastService.error(res.message || 'خطا در حذف');
        }
        this.showDeleteConfirm = false;
      },
      error: () => {
        this.toastService.error('خطا در حذف گروهی');
      }
    });
  }
}