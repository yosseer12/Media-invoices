import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent{

registerForm:FormGroup;

constructor(private fb:FormBuilder, private router:Router){

this.registerForm=this.fb.group({

name:['',Validators.required],
email:['',[Validators.required,Validators.email]],
password:['',Validators.required]

})

}

register(){

if(this.registerForm.valid){

console.log(this.registerForm.value)

this.router.navigate(['/login'])

}

}

}