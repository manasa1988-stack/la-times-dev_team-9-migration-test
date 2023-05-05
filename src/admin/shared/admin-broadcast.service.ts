
import {map, filter} from 'rxjs/operators';
import {Subject, Observable} from 'rxjs';
import { Injectable } from "@angular/core";



interface AdminBroadcastEvent {
  key: any;
  data?: any;
}

@Injectable()
export class AdminBroadcaster {
  private _eventBus: Subject<AdminBroadcastEvent>;

  constructor() {
    this._eventBus = new Subject<AdminBroadcastEvent>();
  }

  broadcast(key: any, data?: any) {
    this._eventBus.next({key, data});
  }

  on<T>(key: any): Observable<T> {
    return this._eventBus.asObservable().pipe(
      filter(event => event.key === key),
      map(event => <T>event.data),);
  }
}