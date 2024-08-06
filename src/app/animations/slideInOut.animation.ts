import { animate, group, query, style, transition, trigger } from "@angular/animations";

export let slideInOut = trigger('slideInOutAnimation', [
  transition(':enter', [
    style({height: '!'}),
    query(':enter', style({transform: 'translateX(100%)'})),
    query(':enter, :leave', style({position: 'absolute', top: 0, left: 0, right: 0})),
    group([
      query(':leave', [animate('0.3s cubic-bezier(.35, 0, .25, 1)', style({transform: 'translateX(-100%)'}))]),
      query(':enter', [animate('0.3s cubic-bezier(.35, 0, .25, 1)', style({transform: 'translateX(0)'}))])
    ])
  ]),
  transition(':leave', [
    style({height: '!'}),
    query(':enter', style({transform: 'translateX(-100%)'})),
    query(':enter, :leave', style({position: 'absolute', top: 0, left: 0, right: 0})),
    group([
      query(':leave', [animate('0.3s cubic-bezier(.35, 0, .25, 1)', style({transform: 'translateX(100%)'}))]),
      query(':enter', [animate('0.3s cubic-bezier(.35, 0, .25, 1)', style({transform: 'translateX(0)'}))])
    ])
  ])
]);
