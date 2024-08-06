import { animate, style, transition, trigger } from "@angular/animations";

export let fadeIn = trigger('fadeInAnimation', [
  transition(':enter', [
    style({opacity: 0}),
    animate('.3s', style({opacity: 1}))
  ])
]);
