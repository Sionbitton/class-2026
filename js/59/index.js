'use strict';

function multiply(firstnumber, secondnumber) {
    return firstnumber * secondnumber;
}

console.log(multiply(5,2));
console.log(multiply(6,7));
console.log(multiply(8,9340));

function getmultiplier() {
    return function (firstnumber,secondnumber){
        return firstnumber * secondnumber;
    };
}

const multiplier = getmultiplier();


console.log(multiplier(5,6));

function getmultiplier2(firstnumber) {
    return function (secondnumber){
        return firstnumber * secondnumber;
    };
}

const multiplybyfive = getmultiplier2(5);
const multiplybysix = getmultiplier2(6);

console.log(multiplybyfive(2));
console.log(multiplybyfive(20));

console.log(multiplybysix(2));
console.log(multiplybysix(20));





