import {
    trigger,
    state,
    style,
    animate,
    transition
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
