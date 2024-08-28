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
import {catchError, from, throwError} from "rxjs";
import {map} from "rxjs/operators";

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
  public error=null;
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
   onSubmit() {
    this.formData = new FormData();
    if (this.itemCategoryForm.valid) {

      let itemCate = new ItemCategory();

      itemCate.name= this.itemCateNameField.value;
      this.formData.append('form', JSON.stringify(itemCate));
      const submissionObservable = from( this.allServe.submitItemCategory(this.formData));

      submissionObservable
        .pipe(
          map((data) => {
            // Handle successful submission here
            this.getItemCate();
            this.clearForm();
            return data; // If you need to return a value for further processing
          }),
          catchError((error) => {
            // Handle errors here
            this.handleError(error);
            return throwError(error); // Re-throw the error if you want to propagate it further
          })
        )
        .subscribe();

    }
  }
  handleError(error: { error: null; }){
    return  this.error=error.error;
  }

  itemCategoryUpdate() {
    this.formData = new FormData();
    let id;
    if (this.itemCategoryForm.valid) {

      let itemCate = new ItemCategory();

      id = this.itemCateIdField.value;

      itemCate.id = this.itemCateIdField.value;
      itemCate.name = this.itemCateNameField.value;

      this.formData.append('form', JSON.stringify(itemCate));
      this.formData.append('_method', 'patch');
      const submissionObservable = from( this.allServe.updateItemCategory(this.formData,id));

      submissionObservable
        .pipe(
          map((data) => {
            // Handle successful submission here
            this.getItemCate();
            this.clearForm();
            return data; // If you need to return a value for further processing
          }),
          catchError((error) => {
            // Handle errors here
            this.handleError(error);
            return throwError(error); // Re-throw the error if you want to propagate it further
          })
        )
        .subscribe();
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
