import {
    trigger,
    state,
    style,
    animate,
    transition,
    keyframes
} from '@angular/animations';

export const position =
    trigger('position', [
        state('0', style({
            transform: 'translateX(-25vw)'
        })),
        state('1', style({
            transform: 'translateX(0vw)'
        })),
        state('2', style({
            transform: 'translateX(16vw)'
        })),
        state('3', style({
            transform: 'translateX(32vw)'
        })),
        state('4', style({
            transform: 'translateX(48vw)'
        })),
        state('5', style({
            transform: 'translateX(64vw)'
        })),
        state('6', style({
            transform: 'translateX(80vw)'
        })),
        state('7', style({
            transform: 'translateX(100vw)'
        })),
        transition('0 <=> 7', []),
        transition('1 => 7', animate('1500ms ease-in')),
        transition('2 => 7', animate('1250ms ease-in')),
        transition('3 => 7', animate('1s ease-in')),
        transition('4 => 7', animate('750ms ease-in')),
        transition('5 => 7', animate('625ms ease-in')),
        transition('6 => 0', animate('1500ms ease-in')),
        transition('5 => 0', animate('1250ms ease-in')),
        transition('4 => 0', animate('1s ease-in')),
        transition('3 => 0', animate('750ms ease-in')),
        transition('2 => 0', animate('625ms ease-in')),
        transition(':increment', animate('500ms ease')),
        transition(':decrement', animate('500ms ease'))
    ]);

export const direction =
    trigger('direction', [
        state('ArrowRight', style({
            transform: 'rotateY(0deg)'
        })),
        state('ArrowLeft', style({
            transform: 'rotateY(180deg)'
        }))
    ]);

export const level = trigger('level', [
    state('0', style({
        transform: 'translateY(100%)'
    })),
    state('1', style({
        transform: 'translateY(0%)'
    })),
    transition('1 => 0', animate('300ms ease-in')),
    transition('0 => 1', animate('300ms ease-out'))
]);

export const wiggle = trigger('wiggle', [
    transition(':enter', []),
    transition(':leave', []),
    transition('* => *', animate('150ms ease', keyframes([
        style({ transform: 'translateX(-4px)', offset: 0 }), // offset = 0
        style({ transform: 'translateX(8px)', offset: 0.49 }), // offset = 0.33
        style({ transform: 'translateX(-10px)', offset: 0.83 }), // offset = 0.66
        style({ transform: 'translateX(2px)', offset: 1 }) // offset = 1
    ])))
]);
