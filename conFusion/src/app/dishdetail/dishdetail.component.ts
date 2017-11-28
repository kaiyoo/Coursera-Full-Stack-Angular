import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { DISHES } from '../shared/dishes';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {
  dishIds: number[];
  prev: number;
  next: number;
  dish: Dish;
  errMess: string;
  commentForm: FormGroup;
  comment: Comment;

  formErrors = {
    'author': '',
    'comment': ''  
  };

  validationMessages = {
    'author': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
      'minlength':     'Comment must be at least 1 characters long.'      
    }
  };

  constructor(private dishservice: DishService,
    		  private route: ActivatedRoute,
    		  private location: Location,
          private fb: FormBuilder,
          @Inject('BaseURL') private BaseURL) { this.createForm(); }

  ngOnInit() {
  	//let id = +this.route.snapshot.params['id'];
  	this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds );
    this.route.params.switchMap((params:Params) => this.dishservice.getDish(+params['id']))
        .subscribe(dish => {this.dish = dish; this.setPrevNext(dish.id)},
                   errMess => this.errMess = <any>errMess );
  }

  goBack(): void {
    this.location.back();
  }

  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating: "5",
      comment: ['', [Validators.required, Validators.minLength(1)]]     
    });

     this.commentForm.valueChanges
         .subscribe(data => this.onValueChanged(data));

     this.onValueChanged(); // (re)set validation messages now
   }

   onValueChanged(data?: any) {
      if (!this.commentForm) { return; }
      const form = this.commentForm;
      for (const field in this.formErrors) { 
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            this.formErrors[field] += messages[key] + ' ';
          }
        }
      }      
   }

  onSubmit() {
    var date = new Date();    
    //this.commentForm.get('date').setValue(date.toISOString());
    this.comment = this.commentForm.value;
    this.comment.date = date.toISOString();
    this.dish.comments.push(this.comment);
    
    this.commentForm.reset({
      name: '',
      rating: "5",
      comment: ''     
    });
  }

}
