import { Component, OnInit, ViewChild, } from '@angular/core';
import { DatatableComponent, SelectionType, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { UserService } from '@core/service/user.service';
import {User} from '@core/models/user';

@Component({
  selector: 'app-team-manager',
  templateUrl: './team-manager.component.html',
  styleUrls: ['./team-manager.component.sass'],
  standalone: true,
  imports: [
    RouterLink,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule,
  ],
  providers: []

})
export class TeamManagementComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent;
  rows = [];
  scrollBarHorizontal = window.innerWidth < 1200;
  selectedRowData!: selectRowInterface;
  newUserImg = 'assets/images/users/user-2.png';
  data: any[] = [];
  filteredData: any[] = [];
  editForm: UntypedFormGroup;
  register!: UntypedFormGroup;
  loadingIndicator = true;
  isRowSelected = false;
  selectedOption!: string;
  reorderable = true;
  public selected: number[] = [];
  columns = [
    { name: 'First Name' },
    { name: 'Last Name' },
    { name: 'User name' },
    { name: 'Email' },
    { name: 'Status' },
    { name: 'Role' },
    { name: 'Date Created' },
    { name: 'Last Login' },

  ];
  genders = [
    { id: '1', value: 'male' },
    { id: '2', value: 'female' },
  ];
  public statusType = [
    { id: true, value: 'Active' },
    { id: false, value: 'In Active' },
  ];
  public designationType = [
    { id: true, value: 'Admin' },
    { id: false, value: 'User' },
  ];

  @ViewChild(DatatableComponent, { static: false }) table2!: DatatableComponent;
  selection!: SelectionType;
  constructor(
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private userService: UserService
  ) {
    this.editForm = this.fb.group({
      id: new UntypedFormControl(),
      //img: new UntypedFormControl(),
      first_name: new UntypedFormControl(),
      last_name: new UntypedFormControl(),
      username: new UntypedFormControl(),
      email: new UntypedFormControl(),
      status: new UntypedFormControl(),
      designation: new UntypedFormControl(),
      //dateCreated: new UntypedFormControl(),
      //lastLogin: new UntypedFormControl(),
    });
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1200;
    };
    this.selection = SelectionType.checkbox;
  }
  // select record using check box
  onSelect({ selected }: { selected: any }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);

    if (this.selected.length === 0) {
      this.isRowSelected = false;
    } else {
      this.isRowSelected = true;
    }
  }
  deleteSelected() {
    Swal.fire({
      title: 'Are you sure?',
      showCancelButton: true,
      confirmButtonColor: '#8963ff',
      cancelButtonColor: '#fb7823',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        this.selected.forEach((row) => {
          this.deleteRecord(row);
        });
        this.deleteRecordSuccess(this.selected.length);
        this.selected = [];
        this.isRowSelected = false;
      }
    });
  }
  ngOnInit() {
    this.fetch((data: any) => {
      this.data = data.results;
      this.filteredData = this.data;
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 500);
    });
    this.register = this.fb.group({
      id: [''],
      //img: [''],
      first_name: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      last_name: [''],
      username: [''],
      email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
      designation: ['', [Validators.required]],
      status: ['', [Validators.required]],
      date_created: [''],
      last_login: [''],
    });
  }

  // fetch data
  fetch(cb: any) {

    this.userService.getAllUsers().subscribe({
      next: (data) => {
        //this.data = data;
        cb(data);
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      },
    });

  }
  // add new record
  addRow(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.register.patchValue({
      id: this.getId(10, 100),
      //img: this.newUserImg,
    });
  }
  // edit record
  editRow(row: any, rowIndex: number, content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.editForm.setValue({
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      username: row.username,
      designation: this.getDesignationValue(row.is_superuser),
      email: row.email,
      status: this.getStatusValue(row.is_active),
    });
    this.selectedRowData = row;
  }
  // delete single row
  deleteSingleRow(row: any) {
    Swal.fire({
      title: 'Are you sure?',
      showCancelButton: true,
      confirmButtonColor: '#8963ff',
      cancelButtonColor: '#fb7823',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        this.deleteRecord(row);
        this.deleteRecordSuccess(1);
      }
    });
  }

  deleteRecord(row: any) {
    this.data = this.arrayRemove(this.data, row.id);
  }
  arrayRemove(array: any[], id: any) {
    return array.filter(function (element) {
      return element.id !== id;
    });
  }

  onAddRowSave(form: UntypedFormGroup) {
    // Prepare the new user data from the form
    const newUser: User = {
      is_active: this.getBooleanFromStatus(form.value.status),
      is_superuser: this.getBooleanFromDesignation(form.value.designation),
      password: 'password123', // Default password for new users
      is_staff: true, // Default value for new users
      first_name: form.value.first_name,
      username: form.value.username,
      last_name: form.value.last_name,
      email: form.value.email,
    };
  


    // Call the UserService to save the user to the database
    this.userService.createUser(newUser).subscribe({
      next: (createdUser) => {
        // Add the created user to the local data array
        this.data.push(createdUser);
        this.data = [...this.data]; // Trigger change detection
        this.table.recalculate();  // Refresh the table view
  
        // Close the modal and reset the form
        this.modalService.dismissAll();
        form.reset();
  
        // Show success notification
        this.addRecordSuccess();
      },
      error: (error) => {
        console.error('Error adding user:', error);
      },
    });
  }
 
  onEditSave(form: UntypedFormGroup) {
    console.log("in onEditSave");
    // Prepare the updated user data without the password field
    const updatedUser: Partial<User> = {
      id: form.value.id, // Include ID for PUT request
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      username: form.value.username,
      email: form.value.email,
      is_active: this.getBooleanFromStatus(form.value.status),
      is_superuser: this.getBooleanFromDesignation(form.value.designation),
      is_staff: true, // Default value or dynamic if needed
    };
  
    // Call the UserService to update the user
    this.userService.updateUser(updatedUser).subscribe({
      next: (updatedUserFromDb) => {
        // Update local data and UI
        this.data = this.data.map((user) =>
          user.id === updatedUserFromDb.id ? updatedUserFromDb : user
        );
        this.data = [...this.data];
        this.table.recalculate(); // Refresh the table view
  
        this.modalService.dismissAll();
        form.reset();
        this.editRecordSuccess();
      },
      error: (error) => {
        console.error('Error updating user:', error);
      },
    });
  }
  
  
  // onEditSave(form: UntypedFormGroup) {
  //   // Prepare the updated user data from the form
  //   const updatedUser: User = {
  //     id: form.value.id, // Ensure the ID is included for the update
  //     first_name: form.value.first_name,
  //     last_name: form.value.last_name,
  //     username: form.value.username,
  //     email: form.value.email,
  //     is_active: this.getBooleanFromStatus(form.value.status),
  //     is_superuser: this.getBooleanFromDesignation(form.value.designation),
  //     password: '', // Typically not updated during an edit; keep empty
  //     is_staff: true, // Assume staff status doesn't change in the edit
  //   };
  
  //   // Call the UserService to update the user in the database
  //   this.userService.updateUser(updatedUser.id, updatedUser).subscribe({
  //     next: (updatedUserFromDb) => {
  //       // Update the local data array with the updated user
  //       this.data = this.data.map((user) =>
  //         user.id === updatedUserFromDb.id ? updatedUserFromDb : user
  //       );
  //       this.data = [...this.data]; // Trigger change detection
  //       this.table.recalculate();  // Refresh the table view
  
  //       // Close the modal and reset the form
  //       this.modalService.dismissAll();
  //       form.reset();
  
  //       // Show success notification
  //       this.editRecordSuccess();
  //     },
  //     error: (error) => {
  //       console.error('Error updating user:', error);
  //     },
  //   });
  // }
    
  // onEditSave(form: UntypedFormGroup) {
  //   // Update the data array
  //   this.data = this.data.map((item) => {
  //     if (item.id === form.value.id) {
  //       return {
  //         ...item,
  //         first_name: form.value.first_name,
  //         username: form.value.username,
  //         last_name: form.value.last_name,
  //         is_active: this.getBooleanFromStatus(form.value.status),
  //         is_superuser: this.getBooleanFromDesignation(form.value.designation),
  //         email: form.value.email,
  //       };
  //     }
  //     return item;
  //   });
  
  //   // Update the reference to trigger change detection
  //   this.data = [...this.data];
  
  //   // Recalculate table view
  //   this.table.recalculate(); 
  
  //   // Close modal and show success notification
  //   this.modalService.dismissAll();
  //   this.editRecordSuccess();
  // }



  // filter table data
  filterDatatable(event: any) {
    // Get the value of the key pressed and make it lowercase
    const val = event.target.value.toLowerCase();
    // Get the number of columns in the table
    const colsAmt = this.columns.length;
    // Get the key names of each column in the dataset
    const keys = Object.keys(this.filteredData[0]);
    // Assign filtered matches to the active datatable
  
    this.data = this.filteredData.filter((item) => {
      // Iterate through each row's column data
      for (let i = 0; i < colsAmt; i++) {
        const fieldValue = item[keys[i]];
        // Check if the field value is not null or undefined before converting to string
        if (
          (fieldValue != null && fieldValue.toString().toLowerCase().indexOf(val) !== -1) ||
          !val
        ) {
          // Found match, return true to add to result set
          return true;
        }
      }
      return false;
    });
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  
  // get random id
  getId(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  addRecordSuccess() {
    this.toastr.success('Add Record Successfully', '');
  }
  editRecordSuccess() {
    this.toastr.success('Edit Record Successfully', '');
  }
  deleteRecordSuccess(count: number) {
    this.toastr.error(count + ' Records Deleted Successfully', '');
  }

  getStatusValue(isTrue: boolean): string {
    const status = this.statusType.find(status => status.id === isTrue);
    return status ? status.value : 'Unknown';
  }

  getDesignationValue(isTrue: boolean): string {
    const status = this.designationType.find(status => status.id === isTrue);
    return status ? status.value : 'Unknown';
  }

  getBooleanFromStatus(statusValue: string): boolean  {
    const status = this.statusType.find(status => status.value === statusValue);
    return status ? status.id : false; // Return null if the string doesn't match any value
  }

  getBooleanFromDesignation(designationValue: string): boolean  {
    const designation = this.designationType.find(designation => designation.value === designationValue);
    return designation ? designation.id : false; // Return null if the string doesn't match any value
  }

}
export interface selectRowInterface {
  //img: string;
  id: BigInteger;
  first_name: string;
  last_name: string;
}
