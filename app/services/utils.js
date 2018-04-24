'use strict';

let addDays = function (date, numberOfDays) {
    return new Date(date.setDate(date.getDate() + numberOfDays));
};

module.exports = {
    addDays: addDays
};