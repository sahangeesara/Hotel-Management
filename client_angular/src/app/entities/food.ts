import {ItemCategory} from "./ItemCategory";
import {FoodStatus} from "./foodStatus";

export class Food{
  id?:number;
  name?:string;
  quantity?:number;
  food_amount?:number;
  image?:any;
  image_url?:any;
  item_category?:ItemCategory;
  food_status?:FoodStatus;


}
