import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LoadingController, PopoverController } from '@ionic/angular';
import { PopoverOptions } from '@ionic/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class QmodoPopoverService {
  private popover: HTMLIonPopoverElement;
  private subs: Subscription = new Subscription();
  constructor(
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private router: Router,
  ) {}

  async openPopover(popoverOptions: Options, closeOnNavigation = true) {
    if (this.popover) {
      this.popover.dismiss();
    }
    if (closeOnNavigation) {
      this.closeOnNavigationObserver();
    }
    this.popover = await this.popoverController.create({
      ...popoverOptions,
      cssClass: popoverOptions.cssClass ? [...popoverOptions.cssClass, 'qmodo-popover-class'] : ['qmodo-popover-class'],
      backdropDismiss: false,
      mode: 'md',
    });

    // To close loading controller if we are opening pop up.
    // Both cannot be opened together
    if (this.loadingController) {
      const loader = await this.loadingController.getTop();
      if (loader) {
        loader.dismiss();
      }
    }

    await this.popover.present();
    return this.popover;
  }

  closeOnNavigationObserver() {
    this.subs = this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.closePopover();
    });
  }

  closePopover(data = {}) {
    if (this.popover) {
      this.popover.dismiss(data);
    }
    this.subs.unsubscribe();
  }
}
export interface Options extends PopoverOptions {
  cssClass?: string[];
}
