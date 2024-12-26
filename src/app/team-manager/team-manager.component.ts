import { Component, OnInit, ViewChild, } from '@angular/core';
import { DatatableComponent, SelectionType, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { UserService } from '@core/service/user.service';

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
    { id: false,value: 'In Active' },
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
      img: new UntypedFormControl(),
      firstName: new UntypedFormControl(),
      lastName: new UntypedFormControl(),
      userName: new UntypedFormControl(),
      email: new UntypedFormControl(),
      status: new UntypedFormControl(),
      designationRole:  new UntypedFormControl(),
      dateCreated: new UntypedFormControl(),
      lastLogin: new UntypedFormControl(),
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
      this.filteredData = data;
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 500);
    });
    this.register = this.fb.group({
      id: [''],
      img: [''],
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      lastName: [''],
      userName: [''],
      email: [''],
      designation: [''],
      status: [''],
      dateCreated: [''],
      lastLogin: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
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
      img: this.newUserImg,
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
      img: row.img,
      firstName: row.firstName,
      lastName: row.lastName,
      designation: row.designation,
      email: row.email,
      status: row.status,
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
  // save add new record
  onAddRowSave(form: UntypedFormGroup) {
    this.data.push(form.value);
    this.data = [...this.data];
    form.reset();
    this.modalService.dismissAll();
    this.addRecordSuccess();
  }
  // save record on edit
  onEditSave(form: UntypedFormGroup) {
    this.data = this.data.filter((value, key) => {
      if (value.id == form.value.id) {
        value.firstName = form.value.firstName;
        value.lastName = form.value.lastName;
        value.designation = form.value.designation;
        value.email = form.value.email;
        value.status = form.value.status;
      }
      this.modalService.dismissAll();
      return true;
    });
    this.editRecordSuccess();
  }
  // filter table data
  filterDatatable(event: any) {
    // get the value of the key pressed and make it lowercase
    const val = event.target.value.toLowerCase();
    // get the amount of columns in the table
    const colsAmt = this.columns.length;
    // get the key names of each column in the dataset
    const keys = Object.keys(this.filteredData[0]);
    // assign filtered matches to the active datatable

    this.data = this.filteredData.filter((item) => {
      // iterate through each row's column data
      for (let i = 0; i < colsAmt; i++) {
        // check for a match
        if (
          item[keys[i]].toString().toLowerCase().indexOf(val) !== -1 ||
          !val
        ) {
          // found match, return true to add to result set
          return true;
        }
      }
      return false;
    });
    // whenever the filter changes, always go back to the first page
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


}
export interface selectRowInterface {
  img: string;
  firstName: string;
  lastName: string;
}
