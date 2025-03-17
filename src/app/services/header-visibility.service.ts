import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class HeaderVisibilityService {
  private _showHeader = new BehaviorSubject<boolean>(true);
  showHeader$ = this._showHeader.asObservable();

  show() {
    this._showHeader.next(true);
  }

  hide() {
    this._showHeader.next(false);
  }
}
