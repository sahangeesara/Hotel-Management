import {Room} from "./room";
import {Guest} from "./guest";

export class RoomBook{
  id?:number;
  r_id?:Room;
  booking_no?:string;
  guest_id?:Guest;
  r_book?:boolean;
  booking_Date?:any;
  cancel_Date?: any;
}
