import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import { Http, Response } from '@angular/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';

@Injectable()
export class DishService {

  constructor(private http: Http,
              private processHTTPMsgService: ProcessHttpmsgService) { }

  getDishes(): Observable<Dish[]> {
  	return this.http.get(baseURL + 'dishes')
                    .map(res => { return this.processHTTPMsgService.extractData(res); } )
                    .catch(error => {return this.processHTTPMsgService.handleError(error)} );    
  }

  getDish(id: number): Observable<Dish> {
    return this.http.get(baseURL + 'dishes/' + id)
               .map(res => {return this.processHTTPMsgService.extractData(res)} )
               .catch(error => { return this.processHTTPMsgService.handleError(error) });   
  }

  getFeaturedDish(): Observable<Dish> {
    return this.http.get(baseURL + 'dishes?featured=true')
               .map(res=> {return this.processHTTPMsgService.extractData(res)[0]; } )
               .catch(error => {return this.processHTTPMsgService.handleError(error)} );     
  }

  getDishIds(): Observable<number[]> {
    return this.getDishes()
           .map( dishes => {return dishes.map(dish => dish.id )} )
           .catch(error => {return Observable.of(error);} ); 
  }

}
