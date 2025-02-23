import {Gender} from "./gender";
import {Guide} from "./guide";
import {User} from "./user";

export class Customer{
  id?:number;
  user_id?:number;
  address?:any;
  city?:string;
  nic?:string;
  tel_no?:string;
  gender_id?:Gender;
  country?:string;
  image?:any;
}
