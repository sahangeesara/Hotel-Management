import {Organizer} from "./organizer";
import {Room} from "./room";
import {Hotel} from "./Hotel";
import {BookStatusEntity} from "./bookStatusEntity";
import {EventEntity} from "./EventEntity";
import {EventTypeEntity} from "./eventTypeEntity";

export class HotelEvent {
  id?: number;
  event_no?: string;
  event_id?: EventEntity;
  event_type_id?: EventTypeEntity;
  event_date?: string;
  start_time?: string;
  end_time?: string;
  passengers?: number;
  hotel_id?: Hotel;
  room_id?: Room;
  organizer_id?: Organizer;
  book_status_id?: BookStatusEntity;
  requests?: string;
  additional_services?: string;
}
