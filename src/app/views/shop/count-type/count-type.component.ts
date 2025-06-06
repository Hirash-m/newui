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
import { baseResponse } from 'src/app/dto/baseResponse';
import { ListRequest } from 'src/app/dto/ListRequestDto';
import { CountTypeDto } from 'src/app/dto/shop/CountTypeDto';
import { CountTypeService } from 'src/app/services/shop/countType/count-type.service';
import { ToastService } from 'src/app/services/utilities/toast.service';

// ---------------------------
// Component Definition
// ---------------------------
@Component({
  selector: 'app-count-type',
  imports: [
    // UI modules
    CommonModule, TableDirective, PaginationComponent, PageItemDirective, PageLinkDirective,
    ButtonDirective, ColComponent, FormDirective, FormFeedbackComponent,
    FormLabelDirective, RowDirective, ModalModule,

    // Form modules
    FormsModule, ReactiveFormsModule,
  ],
  templateUrl: './count-type.component.html',
  styleUrl: './count-type.component.scss'
})
export class CountTypeComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private countTypeService: CountTypeService,
    private toastService: ToastService
  ) {}

  // ---------------------------
  // Properties
  // ---------------------------

  _request = new ListRequest();
  _objectsView: CountTypeDto[] = [];
  _baseResponse = new baseResponse;

  // فرم
  ObjectForm!: FormGroup;

  // وضعیت مدال
  showModal = false;

  // وضعیت ویرایش
  editMode = false;
  editingId: number | null = null;

  // آیتم‌های انتخاب‌شده
  selectedIds: number[] = [];

  // نمایش تایید حذف
  showDeleteConfirm = false;

  // ---------------------------
  // Lifecycle
  // ---------------------------
  ngOnInit(): void {
    this.initForm();
    this.loadDataTable();
  }

  // ---------------------------
  // Init Form
  // ---------------------------
  initForm() {
    this.ObjectForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
    });
  }

  // ---------------------------
  // CRUD Methods
  // ---------------------------

  // دریافت لیست داده‌ها (Table)
  loadDataTable(): void {
    this._request.pageSize = 2;

    this.countTypeService.getRecords(this._request).subscribe((res) => {
      if (res.isSucceeded) {
        this._baseResponse = res;
        this._objectsView = res.data;
        console.log(this._baseResponse);
        // this.toastService.showToast.success({message:this._baseResponse.message})
      }
    });
  }

  // ایجاد / ویرایش داده
  onSubmit1() {
    if (this.ObjectForm.valid) {
      const ObjectData: CountTypeDto = this.ObjectForm.value;

      if (this.editMode && this.editingId != null) {
        // در حالت ویرایش
        this.countTypeService.updateRecord(ObjectData).subscribe(res => {
          if (res.isSucceeded) {
            this.toastService.showToast.success({ message: res.message });
            this.afterSubmit();
          } else {
            this.toastService.showToast.error({ message: res.message });
          }
        });
      } else {
        // در حالت ایجاد
        this.countTypeService.insertRecord(ObjectData).subscribe(res => {
          if (res.isSucceeded) {
            this.toastService.showToast.success({ message: res.message });
            this.afterSubmit();
          } else {
            this.toastService.showToast.error({ message: res.message });
          }
        });
      }
    }
  }

  // عملیات پس از ثبت یا ویرایش
  afterSubmit() {
    this.loadDataTable();
    this.showModal = false;
    this.ObjectForm.reset();
    this.editMode = false;
    this.editingId = null;
  }

  // دریافت و نمایش اطلاعات جهت ویرایش
  onEdit(ObjectId: number) {
    this.editMode = true;
    this.editingId = ObjectId;

    this.countTypeService.getRecordById(ObjectId).subscribe(res => {
      if (res.isSucceeded && res.singleData) {
        const Object = res.singleData;

        this.ObjectForm.patchValue({
          id: Object.id,
          name: Object.name,
        });

        this.showModal = true;
      } else {
        this.toastService.showToast.error({ message: 'مورد پیدا نشد یا خطا در دریافت اطلاعات!' });
      }
    });
  }

  // ---------------------------
  // Pagination
  // ---------------------------
  changePage(pagenumber: number) {
    this._request.pageNumber = pagenumber;
    this.loadDataTable();
  }

  // ---------------------------
  // Selection for Delete
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

  // ---------------------------
  // Delete Operation
  // ---------------------------
  deleteSelectedRecords(): void {
    this.countTypeService.deleteRecords(this.selectedIds).subscribe(res => {
      if (res.isSucceeded) {
        this.toastService.showToast.success({ message: res.message });
        this.afterSubmit(); // ریست فرم و بارگذاری مجدد
        this.selectedIds = [];
      } else {
        this.toastService.showToast.error({ message: 'خطا در حذف گروهی' });
      }
      this.showDeleteConfirm = false;
    });
  }

}
