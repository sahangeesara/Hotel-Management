import {EmployeeType} from "./employeeTypee";
import {Gender} from "./gender";

export class Employee{
  id?:number;
  emp_no?:string;
  name?:string;
  address?:any;
  email?:any;
  city?:string;
  nic?:string;
  tel_no?:string;
  employee_type_id?:EmployeeType;
  gender_id?:Gender;
}
