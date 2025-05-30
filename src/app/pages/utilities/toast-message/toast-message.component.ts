import { Component, OnInit } from '@angular/core';
import { ToastService, ToastData } from '../../../services/utilities/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-message',
  templateUrl: './toast-message.component.html',
  styleUrls: ['./toast-message.component.scss'],
  imports:[CommonModule]
})
export class ToastMessageComponent implements OnInit {
  toast: ToastData | null = null;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toastState$.subscribe(data => {
      this.toast = data;
    });
  }
}
