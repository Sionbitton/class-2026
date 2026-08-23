'use strict'

function trackDosage(medicationName, initialDosage) {
    const reiquiredPin = 1234;
    let currentDosage = initialDosage;
    return {

        getInstructions () {
            return `Take ${currentDosage}mg of ${medicationName}`;

        },

        adjustDosage(doctorPin, newDosage){

            if(doctorPin === reiquiredPin && newDosage > 0){
                currentDosage = newDosage;
            }else{
                console.error('invalid PIN or dosage');
            }
        }
    };
}

const aspirin = trackDosage('Aspirin', 50);

console.log(aspirin.getInstructions());

aspirin.adjustDosage(1234,75);


console.log(aspirin.getInstructions());


aspirin.adjustDosage(43985, 100);
aspirin.adjustDosage(1234, -130);

console.log(aspirin.medicationName);
console.log(aspirin.currentDosage); 
console.log(aspirin.requiredPin);  