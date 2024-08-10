import {Gender} from "./gender";
import {Guide} from "./guide";

export class Guest{
  id?:number;
  name?:string;
  address?:any;
  email?:any;
  city?:string;
  nic?:string;
  tel_no?:string;
  guest_type?:string;
  gender_id?:Gender;
  guide_id?:Guide;
  country?:string;
}
