'use strict';

// a
const checking = {
    balance: 100,
    performTransaction(amount) {
        this.balance += amount;
    }
};

const savings = {
    balance: 500,
    performTransaction(amount) {
        this.balance += amount;
    }
};

checking.performTransaction(50);
savings.performTransaction(-100);

console.log(checking.balance);
console.log(savings.balance);

// b
const checking2 = { balance: 100 };
const savings2 = { balance: 500 };

function transaction(amount) {
    this.balance += amount;
}

transaction.call(checking2, 50);
transaction.apply(savings2, [-100]);

console.log(checking2.balance);
console.log(savings2.balance);

// c
const depositFiftyInSavings = savings.performTransaction.bind(savings, 50);

depositFiftyInSavings();
console.log(savings.balance);

depositFiftyInSavings();
console.log(savings.balance);
