import {Hotel} from "./Hotel";
import {Room} from "./room";
import {Organizer} from "./organizer";
import {BookStatusEntity} from "./bookStatusEntity";

export class WeddingEvent {
  id?: number;
  event_no?: string;
  bride_name?: string;
  groom_name?: string;
  email?: string;
  phone?: string;
  event_date?: string;
  event_time?: string;
  passengers?: number;
  hotel_id?: Hotel;
  room_id?: Room;
  organizer_id?: Organizer;
  additional_services?: string;
  book_status_id?: BookStatusEntity;
  requests?: string;
}
