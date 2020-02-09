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
