// toast-container.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ToasterComponent,
  ToastComponent,
  ToastHeaderComponent,
  ToastBodyComponent,
} from '@coreui/angular';
import { ToastService } from './../../../services/utilities/toast.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [
    CommonModule,
    ToasterComponent,
    ToastComponent,
    ToastHeaderComponent,
    ToastBodyComponent,
    NgFor,
  ],
  template: `
    <c-toaster [placement]="'top-end'" class="p-3" position="fixed">
      <c-toast
        *ngFor="let toast of toastService.toasts()"
        [autohide]="true"
        [delay]="toast.duration"
        [color]="mapTypeToColor(toast.type)"
        [visible]="true"
        (visibleChange)="onVisibleChange(toast.id, $event)"
      >
        <c-toast-header>
          <strong class="me-auto">{{ toast.title }}</strong>
        </c-toast-header>
        <c-toast-body>
          {{ toast.message }}
        </c-toast-body>
      </c-toast>
    </c-toaster>
  `,
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  mapTypeToColor(type: string) {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'danger';
      case 'warning': return 'warning';
      default: return 'info';
    }
  }

  onVisibleChange(id: number, visible: boolean) {
    if (!visible) {
      this.toastService.removeToast(id);
    }
  }
}
