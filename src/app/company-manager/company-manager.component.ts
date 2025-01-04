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
  selector: 'app-company-manager',
  templateUrl: './company-manager.component.html',
  styleUrl: './company-manager.component.scss',
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

export class CompanyManagerComponent implements OnInit {

  ngOnInit() {}

}
