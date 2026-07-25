import {EventEntity} from "./EventEntity";
import {EventTypeEntity} from "./eventTypeEntity";
import {Hotel} from "./Hotel";
import {Room} from "./room";
import {Section} from "./section";
import {BookStatusEntity} from "./bookStatusEntity";
import {Organizer} from "./organizer";

export class RestaurantEvent {
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
  section_id?: Section;
  seating_preferences?: string;
  organizer_id?: Organizer;
  book_status_id?: BookStatusEntity;
  requests?: string;
  additional_services?: string;
}
