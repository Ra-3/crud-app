import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { AppComponent } from '../app.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';

@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss']
})
export class EmpAddEditComponent implements OnInit {
 empForm: FormGroup;

 constructor(private _fb: FormBuilder,
  private _empService:EmployeeService,
  private _coreService:CoreService,
  private _dialogRef:MatDialogRef<EmpAddEditComponent>,
  @Inject(MAT_DIALOG_DATA) public data:any
  ) {
  this.empForm =  this._fb.group({
     name:'',
     designation:'',
     salary:''
  })
 }
  ngOnInit(): void {
    this.empForm.patchValue(this.data);
    throw new Error('Method not implemented.');

  }
 onFormSubmit(){
  if(this.empForm.valid){
    if(this.data){
      console.log(this.empForm.value);
      this._empService.updateEmployee(this.data.id,this.empForm.value).subscribe({
        next:(val:any) => {
          this._coreService.openSnackBar('Employee Updated Successfully','done');

         this._dialogRef.close(true);

        },
        error:(err:any) =>
        {
          console.log(err);
        },
      });
    }else{
      console.log(this.empForm.value);
      this._empService.addEmployee(this.empForm.value).subscribe({
        next:(val:any) => {
          this._coreService.openSnackBar('Employee Deleted Successfully','done');
         this._dialogRef.close(true);
        },
        error:(err:any) =>
        {
          console.log(err);
        }
      });
    }

  }
 }


}
