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
