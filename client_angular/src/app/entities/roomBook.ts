import { Room } from "./room";
import { Guest } from "./guest";
import { Package } from "./package";

export class RoomBook {
  id?: number;
  r_id?: Room;
  guest_id?: Guest;
  package_id?: Package;
  booking_no?: string;
  r_book?: string;
  max_guests?: number;
  number_of_room?: number;
  booking_Date?: Date | string;
  cancel_Date?: Date | string | null;
  is_active?: boolean;
}
