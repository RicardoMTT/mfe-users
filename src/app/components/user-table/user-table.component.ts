import { ChangeDetectionStrategy, Component, effect, inject, signal, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { catchError, EMPTY, tap } from 'rxjs';
import { UsersService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { User } from '../../model/user.interface';
import { UserDialogComponent } from '../dialog/user-dialog.component';


@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule ,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
   ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTableComponent {

  private readonly usersService = inject(UsersService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);


  dataSource = new MatTableDataSource<User>();
  displayedColumns = ['avatar', 'first_name', 'last_name', 'email', 'actions'];
  totalItems = signal(0);
  currentPage = signal(1);
  users = signal<User[]>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(){
    effect(() => {
      this.loadUsers(this.currentPage());
    });
  }
  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(page: number = 1) {
    this.usersService.getUsers(page).pipe(
      tap(response => {
        this.users.set(response.data);
        this.totalItems.set(response.total);
        this.dataSource.data = this.users();
      }),
      catchError(_ => {
        this.showError('Error al cargar usuarios');
        return EMPTY;
      })
    ).subscribe();
  }

  onPageChange(event: any) {
    this.currentPage.set(event.pageIndex + 1);
  }

  openDialog(user?: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (user) {
          this.updateUser(user.id, result);
        } else {
          this.createUser(result);
        }
      }
    });
  }

  createUser(userData: Partial<User>) {

    this.usersService.createUser(userData).pipe(
      tap((newUser:User) => {
        this.showSuccess('Usuario creado exitosamente');
        newUser.avatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7vEOmVXrEdo0DYjt5CC78I7_3i_nhL9ivHg&s";
        this.users.update((users) => [newUser, ...users]);
        console.log(this.users());
        this.dataSource.data = this.users();
      }),
      catchError(_ => {
        this.showError('Error al crear usuario');
        return EMPTY;
      })
    ).subscribe();
  }

  updateUser(id: number, userData: Partial<User>) {
    this.usersService.updateUser(id, userData).pipe(
      tap(() => {
        this.showSuccess('Usuario actualizado exitosamente');
        this.users.update((users) =>
          users.map((user) => (user.id === id ? { ...user, ...userData } : user))
        );

        const index = this.users().findIndex(user => user.id === id);
        this.users()[index] = { ...this.users()[index], ...userData };
        this.dataSource.data = this.users();
      }),
      catchError(_ => {
        this.showError('Error al actualizar usuario');
        return EMPTY;
      })
    ).subscribe();
  }

  deleteUser(user: User) {
    if (confirm(`¿Está seguro de eliminar a ${user.first_name} ${user.last_name}?`)) {
      this.usersService.deleteUser(user.id).pipe(
        tap(() => {
          this.showSuccess('Usuario eliminado exitosamente');
          this.users.update((users) => users.filter((u) => u.id !== user.id));
          this.dataSource.data = this.users();
        }),
        catchError(_ => {
          this.showError('Error al eliminar usuario');
          return EMPTY;
        })
      ).subscribe();
    }
  }

  private showSuccess(message: string) {
    this.notificationService.showSuccess(message);
  }

  public showError(message: string) {
    this.notificationService.showError(message);
  }

}
