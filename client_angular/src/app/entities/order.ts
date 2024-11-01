import {Room} from "./room";
import {Gender} from "./gender";
import {OrderStatus} from "./OrderStatus";

export class Order{
  id?:number;
  r_id?:Room;
  guest_id?:Gender;
  order_date?:any;
  order_amount?:number;
  oder_status_id?:OrderStatus;
}
