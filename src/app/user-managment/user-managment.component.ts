import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UserTableComponent } from '../components/user-table/user-table.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    MatCardModule,
    UserTableComponent
   ],
  templateUrl: './user-managment.component.html',
  styleUrl: './user-managment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserManagementComponent {


}
