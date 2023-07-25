import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { EmployeeService } from './services/employee.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';
import { CoreService } from './core/core.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{


  public form: FormGroup;
  unsubcribe: any

  public fields: any[] = [
    {
      type: 'text',
      name: 'name',
      label: 'Name',
      value: '',
      required: true,
    },
    {
      type: 'text',
      name: 'designation',
      label: 'Designation',
      value: '',
      required: true,
    },
    {
      type: 'text',
      name: 'salary',
      label: 'Salary',
      value: '',
      required: true,
    },

  ];
  empForm: FormGroup<{ name: FormControl<string | null>;
    designation: FormControl<string | null>;
    salary: FormControl<string | null>; }>;


  displayedColumns: string[] = [
    'id', 'name', 'designation', 'salary','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  name= '';
  designation = '';
  salary = '';

  constructor(private _fb:FormBuilder,
     private _empService:EmployeeService,
     private _dialog:MatDialog,
     private _coreService:CoreService

     ) {
    this.form = new FormGroup({
      fields: new FormControl(JSON.stringify(this.fields))
    })
    this.unsubcribe = this.form.valueChanges.subscribe((update) => {
      console.log(update);
      this.fields = JSON.parse(update.fields);
    });
    empForm : FormBuilder;
this.empForm = this._fb.group({
  name: '',
  designation: '',
  salary: ''

  })
  }

ngOnInit(): void {
    this.getEmployeeList();

}


onFormSubmit() {
  if(this.empForm.valid) {
  this._empService.addEmployee(this.empForm.value).subscribe({
    next: (val:any)=> {
      this._coreService.openSnackBar('Employee Added Successfully','done');
      this.getEmployeeList();
      this.handleClear();
    },
    error:(err:any) => {
      console.log(err)
    }
  })
  }
}

getEmployeeList() {
  this._empService.getEmployeeList().subscribe({
    next:(res)=> {
    this.dataSource = new MatTableDataSource(res);
    this.dataSource.sort=this.sort;
    this.dataSource.paginator=this.paginator;
    },
    error: console.log
    })

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEmployee(id:number) {
    if(
      window.confirm('Are you sure you want to delete this employee'))
    this._empService.deleteEmployee(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Employee deleted Successfully','done');
        this.getEmployeeList();
    },
    error: console.log});
  }

  handleClear(){
    this.name = '';
    this.designation = '';
    this.salary = '';
  }

openAddEditEmpForm(data:any) {
const dialogRef = this._dialog.open(EmpAddEditComponent);
dialogRef.afterClosed().subscribe({
  next: (val) => {
    if(val) {
      this.getEmployeeList();
    }
}
});
}

  openEditForm(data:any) {
    const dialogRef=this._dialog.open(EmpAddEditComponent,{
     data,
     });
     dialogRef.afterClosed().subscribe({
      next: (val) => {
        if(val) {
          this.getEmployeeList();
        }
    }
    });
   }
}
