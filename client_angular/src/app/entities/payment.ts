import {Guest} from "./guest";
import {Customer} from "./customer";
import {Order} from "./order";
import {RoomBook} from "./roomBook";
import {HotelEvent} from "./hotelEvent";
import {RestaurantEvent} from "./restaurantEvent";
import {WeddingEvent} from "./weddingEvent";
import {Currency} from "./currency";
import {PaymentStatus} from "./PaymentStatus";
import {PaymentMethod} from "./PaymentMethod";

export class Payment {
  id?: number;
  payment_no?: string;

  customer_id?: Customer | null;
  guest_id?: Guest | null;
  order_id?: Order | null;
  room_book_id?: RoomBook | null;
  hotel_event_id?: HotelEvent | null;
  restaurant_event_id?: RestaurantEvent | null;
  wedding_event_id?: WeddingEvent | null;

  payment_status_id?: PaymentStatus | null;
  payment_method_id?: PaymentMethod | null;
  currencies_id?: Currency | null;

  payment_date?: string;
  amount?: number;
  payment_type?: string | null;
  payment_note?: string | null;
}

