import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy {

  title?: string;
  tituloSubscribe$?: Subscription;

  constructor(private router: Router) {
    this.tituloSubscribe$ = this.getArgumentosRuta().subscribe(({ titleParameter }) => {
                            this.title = titleParameter;
                            document.title = `AdminPro - ${titleParameter}`
                          });
  }
  ngOnDestroy(): void {
    this.tituloSubscribe$?.unsubscribe();
  }

  getArgumentosRuta() {
    return this.router.events
      .pipe(
        filter((event): event is ActivationEnd => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild === null),
        map((event: ActivationEnd) => event.snapshot.data)
      );
  }


}
