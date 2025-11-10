import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective, ColComponent, FormDirective, FormFeedbackComponent, FormLabelDirective, ModalModule, PageItemDirective, PageLinkDirective, PaginationComponent, RowDirective, TableDirective } from '@coreui/angular';
import { PermissionDto, RoleDto, UserCreateFormData, UserDto } from 'src/app/dto/base/UserDto';
import { ApiResult, createApiResult } from 'src/app/dto/api-result'; // تغییر از baseResponse
import { ListRequest } from 'src/app/dto/ListRequestDto';
import { UserManageService } from 'src/app/services/base/userManage/user-manage.service';
import { ToastService } from 'src/app/services/utilities/toast.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule, TableDirective, PaginationComponent, PageItemDirective, PageLinkDirective,
    ButtonDirective, ColComponent, FormDirective, FormFeedbackComponent,
    FormLabelDirective, RowDirective, ModalModule,
    FormsModule, ReactiveFormsModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {

  // داده‌های فرم ایجاد
  roles: RoleDto[] = [];
  permissions: PermissionDto[] = [];

  // لیست کاربران
  _request = new ListRequest();
  _objectsView: UserDto[] = [];
  _baseResponse: ApiResult<UserDto> = createApiResult<UserDto>();

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
    private ObjectService: UserManageService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDataTable();
    this.loadCreateFormData();
  }

  // ---------------------------
  // فرم
  // ---------------------------
  initForm() {
    this.ObjectForm = this.fb.group({
      id: [null],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      Password: ['', this.editMode ? [] : Validators.required],
      fullName: ['', Validators.required],
      roleIds: [[]]
    });
  }

  // ---------------------------
  // بارگذاری لیست کاربران
  // ---------------------------
  loadDataTable(): void {
    this._request.pageSize = 5;
    this.ObjectService.getRecords(this._request).subscribe({
      next: (res: ApiResult<UserDto>) => {
        if (res.isSucceeded) {
          this._baseResponse = res;
          this._objectsView = res.data || [];
        } else {
          this.toastService.error(res.message || 'خطا در بارگذاری کاربران');
        }
      },
      error: (err) => {
        console.error('خطا در دریافت کاربران:', err);
        this.toastService.error('خطای ارتباط با سرور');
      }
    });
  }

  // ---------------------------
  // بارگذاری نقش‌ها برای فرم ایجاد
  // ---------------------------
  loadCreateFormData(): void {
    this.ObjectService.getCreateForm().subscribe({
      next: (res: ApiResult<UserCreateFormData>) => {
        if (res.isSucceeded && res.data) {
          // حالا res.data یک شیء تک است: { roles: [...] }
          const formData = res.data as UserCreateFormData;
  
          this.roles = formData.roles ?? [];
          this.permissions = [];
  
          console.log('فرم ایجاد بارگذاری شد:', formData);
        } else {
          this.toastService.error(res.message || 'خطا در دریافت فرم ایجاد');
        }
      },
      error: (err) => {
        console.error('خطا در دریافت فرم ایجاد:', err);
        this.toastService.error('خطای ارتباط با سرور');
      }
    });
  }

  // ---------------------------
  // انتخاب نقش
  // ---------------------------
  toggleRole(event: Event, roleId: number): void {
    const input = event.target as HTMLInputElement;
    const roleIds = this.ObjectForm.get('roleIds')?.value || [];

    if (input.checked && !roleIds.includes(roleId)) {
      roleIds.push(roleId);
    } else if (!input.checked) {
      const index = roleIds.indexOf(roleId);
      if (index > -1) roleIds.splice(index, 1);
    }

    this.ObjectForm.get('roleIds')?.setValue(roleIds);
  }

  // ---------------------------
  // ایجاد / ویرایش
  // ---------------------------
  onSubmit1() {
    if (this.ObjectForm.valid) {
      const data: UserDto = this.ObjectForm.value;

      const request$ = this.editMode && this.editingId != null
        ? this.ObjectService.updateRecord(data)
        : this.ObjectService.insertRecord(data);

      request$.subscribe({
        next: (res: ApiResult<any>) => {
          if (res.isSucceeded) {
            this.afterSubmit();
            this.toastService.success(
              this.editMode ? 'کاربر با موفقیت ویرایش شد' : 'کاربر با موفقیت ایجاد شد'
            );
          } else {
            this.toastService.error(res.message || 'خطا در عملیات');
          }
        },
        error: (err) => {
          console.error('خطا در ذخیره کاربر:', err);
          this.toastService.error('خطای ارتباط با سرور');
        }
      });
    }
  }

  afterSubmit() {
    this.loadDataTable();
    this.closeModal();
  }

  closeModal() {
    this.showModal = false;
    this.ObjectForm.reset({
      id: null,
      username: '',
      fullName: '',
      email: '',
      Password: '',
      roleIds: []
    });
    this.editMode = false;
    this.editingId = null;
    this.initForm(); // بازسازی فرم با ولیداتورهای درست
  }

  // ---------------------------
  // ویرایش
  // ---------------------------
  onEdit(id: number) {
    this.editMode = true;
    this.editingId = id;

    // حذف ولیداتور رمز عبور در حالت ویرایش
    const passwordControl = this.ObjectForm.get('Password');
    passwordControl?.clearValidators();
    passwordControl?.updateValueAndValidity();

    this.ObjectService.getRecordById(id).subscribe({
      next: (res: ApiResult<UserDto>) => {
        if (res.isSucceeded && res.singleData) {
          const user = res.singleData;
          this.ObjectForm.patchValue({
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            Password: '',
            roleIds: user.roleIds || []
          });
          this.showModal = true;
        } else {
          this.toastService.error('کاربر پیدا نشد');
        }
      },
      error: () => {
        this.toastService.error('خطا در دریافت اطلاعات کاربر');
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
    this.ObjectService.deleteRecords(this.selectedIds).subscribe({
      next: (res: ApiResult<any>) => {
        if (res.isSucceeded) {
          this.afterSubmit();
          this.selectedIds = [];
          this.toastService.success('کاربران انتخاب‌شده حذف شدند');
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