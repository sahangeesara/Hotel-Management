import {Gender} from "./gender";


export class Customer{
  id?:number;
  custom_no?:string;
  name?:string;
  address?:any;
  city?:string;
  nic?:string;
  tel_no?:string;
  custom_type?:string;
  gender_id?:Gender;
  country?:string;
}
