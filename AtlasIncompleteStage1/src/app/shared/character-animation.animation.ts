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
        state('0, -1', style({
            transform: 'translateX(-20vw)'
        })),
        state('1', style({
            transform: 'translateX(-6vw)'
        })),
        state('2', style({
            transform: 'translateX(0vw)'
        })),
        state('3', style({
            transform: 'translateX(8vw)'
        })),
        state('4', style({
            transform: 'translateX(16vw)'
        })),
        state('5', style({
            transform: 'translateX(24vw)'
        })),
        state('6', style({
            transform: 'translateX(32vw)'
        })),
        state('7', style({
            transform: 'translateX(40vw)'
        })),
        state('8', style({
            transform: 'translateX(48vw)'
        })),
        state('9', style({
            transform: 'translateX(56vw)'
        })),
        state('10', style({
            transform: 'translateX(64vw)'
        })),
        state('11', style({
            transform: 'translateX(72vw)'
        })),
        state('12', style({
            transform: 'translateX(80vw)'
        })),
        state('13', style({
            transform: 'translateX(88vw)'
        })),
        state('14, 15', style({
            transform: 'translateX(100vw)'
        })),
        transition('-1 => 14, 15 => 0, 0 <=> 14', []),
        transition('1 => 14, 2 => 14, 13 => 0, 12 => 0', animate('1500ms ease-in')),
        transition('3 => 14, 4 => 14, 11 => 0, 10 => 0', animate('1250ms ease-in')),
        transition('5 => 14, 6 => 14, 9 => 0, 8 => 0', animate('1s ease-in')),
        transition('7 => 14, 8 => 14, 7 => 0, 6 => 0', animate('750ms ease-in')),
        transition('9 => 14, 10 => 14, 5 => 0, 4 => 0', animate('625ms ease-in')),
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
