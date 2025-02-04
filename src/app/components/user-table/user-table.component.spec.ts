import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserTableComponent } from './user-table.component';
import { UsersService } from '../../services/user.service';
import { User } from '../../model/user.interface';

const MOCK_USERS_WITHOUT_PAGINATE = [{"id":1,"email":"george.bluth@reqres.in","first_name":"George","last_name":"Bluth","avatar":"https://reqres.in/img/faces/1-image.jpg"},{"id":2,"email":"janet.weaver@reqres.in","first_name":"Janet","last_name":"Weaver","avatar":"https://reqres.in/img/faces/2-image.jpg"},{"id":3,"email":"emma.wong@reqres.in","first_name":"Emma","last_name":"Wong","avatar":"https://reqres.in/img/faces/3-image.jpg"},{"id":4,"email":"eve.holt@reqres.in","first_name":"Eve","last_name":"Holt","avatar":"https://reqres.in/img/faces/4-image.jpg"},{"id":5,"email":"charles.morris@reqres.in","first_name":"Charles","last_name":"Morris","avatar":"https://reqres.in/img/faces/5-image.jpg"},{"id":6,"email":"tracey.ramos@reqres.in","first_name":"Tracey","last_name":"Ramos","avatar":"https://reqres.in/img/faces/6-image.jpg"}];

const TOTAL_USERS_PAGINATE = {"page":1,"per_page":6,"total":12,"total_pages":2,"data":[{"id":1,"email":"george.bluth@reqres.in","first_name":"George","last_name":"Bluth","avatar":"https://reqres.in/img/faces/1-image.jpg"},{"id":2,"email":"janet.weaver@reqres.in","first_name":"Janet","last_name":"Weaver","avatar":"https://reqres.in/img/faces/2-image.jpg"},{"id":3,"email":"emma.wong@reqres.in","first_name":"Emma","last_name":"Wong","avatar":"https://reqres.in/img/faces/3-image.jpg"},{"id":4,"email":"eve.holt@reqres.in","first_name":"Eve","last_name":"Holt","avatar":"https://reqres.in/img/faces/4-image.jpg"},{"id":5,"email":"charles.morris@reqres.in","first_name":"Charles","last_name":"Morris","avatar":"https://reqres.in/img/faces/5-image.jpg"},{"id":6,"email":"tracey.ramos@reqres.in","first_name":"Tracey","last_name":"Ramos","avatar":"https://reqres.in/img/faces/6-image.jpg"}],"support":{"url":"https://contentcaddy.io?utm_source=reqres&utm_medium=json&utm_campaign=referral","text":"Tired of writing endless social media content? Let Content Caddy generate it for you."}};


describe('UserTableComponent', () => {

  let component: UserTableComponent;
  let fixture: ComponentFixture<UserTableComponent>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    mockUsersService = jasmine.createSpyObj('UsersService', [
      'getUsers',
      'createUser',
      'updateUser',
      'deleteUser',
    ]);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);


    await TestBed.configureTestingModule({
      imports: [
        UserTableComponent, MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatDialogModule,
        MatSnackBarModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(UserTableComponent);

    component = fixture.componentInstance;

    mockUsersService.getUsers.and.returnValue(of({
      page: 1,
      per_page: 10,
      total: 0,
      total_pages: 0,
      data: []
    }));
    fixture.detectChanges();
  });


  it('should create the app', () => {
    const fixture = TestBed.createComponent(UserTableComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });


  it('should get a list of users', () => {
    // Arrange
    mockUsersService.getUsers.and.returnValue(of(TOTAL_USERS_PAGINATE));

    // Act
    component.loadUsers();

    // Assert
    expect(component.users().length).toEqual(6);

  });


  it('should create a new user', () => {
    // Arrange
    const newUser:User = { id: 1, first_name: 'Test User',email:'',last_name:'',  avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7vEOmVXrEdo0DYjt5CC78I7_3i_nhL9ivHg&s' };
    mockUsersService.createUser.and.returnValue(of(newUser));
    component.users.set(MOCK_USERS_WITHOUT_PAGINATE)

    // Act
    component.createUser(newUser);

    // Assert
    expect(component.users().length).toEqual(7);

  });

  it('should update an existing user', () => {
    // Arrange
    const updatedUser: User = { id: 1, first_name: 'Updated', last_name: 'User', email: 'updated@example.com', avatar: 'https://example.com/avatar.jpg' };//+
    mockUsersService.updateUser.and.returnValue(of(updatedUser));
    component.users.set(MOCK_USERS_WITHOUT_PAGINATE)
    component.dataSource.data = [{ id: 1, first_name: 'Old User', avatar: '',email:'',last_name:'' }];

    // Act
    component.updateUser(1, updatedUser);

    // Assert
    expect(component.users()[0].first_name).toEqual('Updated');
  });



  it('should delete a user', () => {
    // Arrange
    const userToDelete: User = { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', avatar: 'url' };
    component.users.set(MOCK_USERS_WITHOUT_PAGINATE);
    mockUsersService.deleteUser.and.returnValue(of(undefined));
    spyOn(window, 'confirm').and.returnValue(true);

    // Act
    component.deleteUser(userToDelete);

    // Assert
    expect(component.users().length).toEqual(5);

  });


  it('should handle error when loading users', () => {
    // Arrange
    mockUsersService.getUsers.and.returnValue(throwError(() => new Error('Error')));

    // Act
    component.ngOnInit();

    // Assert
    expect(mockUsersService.getUsers).toHaveBeenCalledWith(1);
  });


});
