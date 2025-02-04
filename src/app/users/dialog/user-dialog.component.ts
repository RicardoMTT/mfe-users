import { Component, Inject } from "@angular/core";

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from "../model/user.interface";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
   ],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss'
})
export class UserDialogComponent {


  userForm: FormGroup;
  isEditing: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: User
  ) {
    this.isEditing = !!data;
    this.userForm = this.fb.group({
      first_name: [data?.first_name || '', [Validators.required]],
      last_name: [data?.last_name || '', [Validators.required]],
      email: [data?.email || '', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }

}
