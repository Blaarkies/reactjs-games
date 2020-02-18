export const StoneSheetCutterActions = {
    stone: {
        enum: 'stone',
        display: '🧱',
        index: 0,
        defeatedByIndex: 1
    },
    sheet: {
        enum: 'sheet',
        display: '📜',
        index: 1,
        defeatedByIndex: 2
    },
    cutter: {
        enum: 'cutter',
        display: '✂',
        index: 2,
        defeatedByIndex: 0
    }
};

export const FlipStates = {
    startIdle: 'startIdle',
    forwardFlip: 'forwardFlip',
    endIdle: 'endIdle',
    backwardFlip: 'backwardFlip',
};

export const SlideStates = {
    startIdle: 'startIdle',
    forwardSlide: 'forwardSlide',
    endIdle: 'endIdle',
    backwardSlide: 'backwardSlide',
};

export const PlayerNames = [
    {
        name: 'Chappie',
        icon: '🤖'
    },
    {
        name: 'Casper',
        icon: '👻'
    },
    {
        name: 'E.T.',
        icon: '👽'
    },
    {
        name: 'Olaf',
        icon: '☃'
    },
    {
        name: 'Mr. Freeze',
        icon: '🥶'
    },
    {
        name: 'Pepe',
        icon: '🐸'
    },
    {
        name: 'Harambe',
        icon: '🦍'
    },
    {
        name: 'Sonic',
        icon: '🦔'
    },
    {
        name: 'KITT',
        icon: '🚗'
    },
    {
        name: 'Sabrina',
        icon: '🧙‍♀️'
    },
    {
        name: 'Seabiscuit',
        icon: '🏇'
    },
    {
        name: 'Stonks',
        icon: '📈'
    },
    {
        name: 'Pikachu',
        icon: '🐁'
    },
    {
        name: 'Nemo',
        icon: '🐠'
    },
    {
        name: 'Gollum',
        icon: '💍'
    },
    {
        name: 'Harry',
        icon: '⚡'
    },
];

export const PositiveAdjectives = [
    'grand',
    'mighty',
    'powerful',
    'amazing',
    'awesome',
    'better',
    'famous',
    'magnificent',
    'tactical',
];

export const NegativeAdjectives = [
    'petty',
    'weak',
    'lesser',
    'little',
    'tiny',
    'ridiculous',
    'lame',
    'daft',
];

export const KeyboardKeys = {
    ArrowUp: 'arrowup',
    ArrowDown: 'arrowdown',
    ArrowLeft: 'arrowleft',
    ArrowRight: 'arrowright',
};

export const Directions = {
    Left: 1,
    Right: 2,
};
