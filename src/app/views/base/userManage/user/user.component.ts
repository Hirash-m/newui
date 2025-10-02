import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective, ColComponent, FormDirective, FormFeedbackComponent, FormLabelDirective, ModalModule, PageItemDirective, PageLinkDirective, PaginationComponent, RowDirective, TableDirective } from '@coreui/angular';
import { UserDto } from 'src/app/dto/base/UserDto';
import { baseResponse } from 'src/app/dto/baseResponse';
import { ListRequest } from 'src/app/dto/ListRequestDto';
import { UserManageService } from 'src/app/services/base/userManage/user-manage.service';
import { ToastService } from 'src/app/services/utilities/toast.service';

@Component({
  selector: 'app-user',
  imports: [
 // UI modules
 CommonModule, TableDirective, PaginationComponent, PageItemDirective, PageLinkDirective,
 ButtonDirective, ColComponent, FormDirective, FormFeedbackComponent,
 FormLabelDirective, RowDirective, ModalModule,

 // Form modules
 FormsModule, ReactiveFormsModule,

  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {


  
  constructor(
    private fb: FormBuilder,
    private ObjectService: UserManageService ,
    private toastService: ToastService
  ) {}


    // ---------------------------
  // Properties
  // ---------------------------

  _request = new ListRequest();
  _objectsView: UserDto[] = [];
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
      username: ['', Validators.required],
      email: ['', Validators.required ],
      Password: ['', Validators.required],
      fullName: ['', Validators.required],
     
      
    });
  }

 // ---------------------------
  // CRUD Methods
  // ---------------------------

  // دریافت لیست داده‌ها (Table)
  loadDataTable(): void {
    this._request.pageSize = 5;

    this.ObjectService.getRecords(this._request).subscribe((res) => {
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
      const ObjectData: UserDto = this.ObjectForm.value;

      if (this.editMode && this.editingId != null) {
        // در حالت ویرایش
        this.ObjectService.updateRecord(ObjectData).subscribe(res => {
          if (res.isSucceeded) {
            this.toastService.showToast.success({ message: res.message });
            this.afterSubmit();
          } else {
            this.toastService.showToast.error({ message: res.message });
          }
        });
      } else {
        // در حالت ایجاد
        this.ObjectService.insertRecord(ObjectData).subscribe(res => {
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

    this.ObjectService.getRecordById(ObjectId).subscribe(res => {
      if (res.isSucceeded && res.singleData) {
        const Object = res.singleData;

        this.ObjectForm.patchValue({
          id: Object.id,
          username : Object.username ,
          fullname: Object.fullName,
          email : Object.email,
          Password : Object.Password

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
    this.ObjectService.deleteRecords(this.selectedIds).subscribe(res => {
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
