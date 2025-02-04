import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  private readonly snackBar = inject(MatSnackBar);

  constructor(

  ) {}

  showSuccess(message: string) {
    this.showNotification(message, 'success-snackbar');
  }

  showError(message: string) {
    this.showNotification(message, 'error-snackbar');
  }

  private showNotification(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
}
