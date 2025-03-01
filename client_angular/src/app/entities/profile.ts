import {Gender} from "./gender";

export class Profile{
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
