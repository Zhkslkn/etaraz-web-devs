import {Observable, Subscriber} from 'rxjs';

export const VOID = new Observable<void>((subscriber: Subscriber<void>) => {
  subscriber.next();
  subscriber.complete();
});
