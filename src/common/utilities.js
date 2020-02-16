/***
 * Returns a random integer {0-max} (inclusive)
 * @param max
 * @returns {number}
 */
export function getRandomInt(max: number = 9) {
    return Math.round(Math.random() * max);
}

/**
 * Return a random element from a given array
 * @param array
 * @returns {*}
 */
export function getRandomFromArray(array) {
    return array[Math.floor((Math.random() * array.length))];
}

export const emptyFunction = () => {
};

/**
 * Returns an array that is filled with integers from 1(inclusive) to count(inclusive)
 * @param count
 * @returns {number[]}
 */
export function getRange(count = 1) {
    return [...Array(count + 1).keys()].slice(1);
}

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getUniqueEntries(list, count) {
    const cloneList = list.slice();
    const validEntries = [];
    while (validEntries.length < count && cloneList.length > 0) {
        const validEntry = getRandomFromArray(cloneList);
        cloneList.splice(cloneList.indexOf(validEntry), 1);
        validEntries.push(validEntry);
    }
    return validEntries;
}

export function getDistance(a, b) {
    return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

export function getDirection(a, b) {
    return Math.atan2(a[1] - b[1], a[0] - b[0]);
}

export function getFromEnd(list, index = 0) {
    return list[list.length - 1 - index];
}

