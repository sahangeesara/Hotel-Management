import { Component } from '@angular/core';
import {
  ButtonDirective,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,FormTextDirective,
  RowComponent, TableDirective
} from "@coreui/angular";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { IconDirective } from '@coreui/icons-angular';
import {ActivatedRoute, Router} from "@angular/router";
import {AllServiceService} from "../../../../../services/all-service.service";
import {ToastrService} from "ngx-toastr";
import {FoodStatus} from "../../../../../entities/foodStatus";
import {ItemCategory} from "../../../../../entities/ItemCategory";

@Component({
  selector: 'app-item-category',
  standalone: true,
  imports: [
    FormTextDirective,
    IconDirective,
    ButtonDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    FormsModule,
    ReactiveFormsModule,
    RowComponent,
    TableDirective
  ],
  templateUrl: './item-category.component.html',
  styleUrl: './item-category.component.scss'
})
export class ItemCategoryComponent {

  itemCategories: any[] = [];
  formData = new FormData();
  itemCategoryForm: FormGroup;

  constructor(   private route:ActivatedRoute,
                 private allServe: AllServiceService,
                 private router:Router,
                 private toastr: ToastrService,
                 private fb: FormBuilder,
  ) {

    this.itemCategoryForm = this.fb.group({

      id: [''],
      name: ['', [Validators.required]],
    });

  }

  get itemCateIdField(): FormControl {
    return this.itemCategoryForm.controls['id'] as FormControl;
  }


  get itemCateNameField(): FormControl {
    return this.itemCategoryForm.controls['name'] as FormControl;
  }

  clearForm() {
    this.itemCateNameField.setValue("");

  }
  async onSubmit() {
    this.formData = new FormData();
    if (this.itemCategoryForm.valid) {

      let itemCate = new ItemCategory();

      itemCate.name= this.itemCateNameField.value;
      console.log(itemCate)
      this.formData.append('form', JSON.stringify(itemCate));
      console.log(this.formData);
      await this.allServe.submitItemCategory(this.formData);
      this.getItemCate();
      this.clearForm();
      this.toastr.success("Item Category Successfully submit ");
    }
  }

  itemCategoryUpdate() {
    this.formData = new FormData();
    let $id;
    if (this.itemCategoryForm.valid) {

      let itemCate = new ItemCategory();

      $id = this.itemCateIdField.value;

      itemCate.name = this.itemCateNameField.value;

      console.log(itemCate,$id)
      this.formData.append('form', JSON.stringify(itemCate));
      console.log(this.formData)
      this.allServe.updateItemCategory(this.formData, $id);

      this.getItemCate();
      this.toastr.success("Item Category Successfully submit ");
    }
  }

  itemCategoryDelete(id:any){
    this.allServe.deleteItemCategory(id).subscribe(
      (data: any) => {
        this.getItemCate();
      },
      (error) => {
        console.error('Error fetching Item Category:', error);
      }
    );

  }

  getItemCateById(id:any) {
    this.allServe.getItemCategoryById(id).subscribe(
      (itemCategory:any) => {

        this.itemCateIdField.setValue(itemCategory.id);
        this.itemCateNameField.setValue(itemCategory.name);
      },
      (error) => {
        console.error('Error fetching item Category:', error);
      }
    );
  }


  getItemCate() {
    this.allServe.getItemCategory().subscribe(
      (response: any) => {
        this.itemCategories = response.data;
      },
      (error) => {
        console.error('Error fetching food status:', error);
      }
    );
  }


  ngOnInit() {
    this.getItemCate();
  }
}
