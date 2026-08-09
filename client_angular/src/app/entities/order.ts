import {Room} from "./room";
import {Gender} from "./gender";
import {OrderStatus} from "./OrderStatus";
import {Customer} from "./customer";

export class Order{
  id?:number;
  order_no?:string;
  r_id?:Room;
  customer_id?:Customer;
  order_date?:any;
  order_amount?:number;
  order_status_id?:OrderStatus;
}
