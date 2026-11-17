function Vehicle(color) { this.color = color; this.speed = 0; }
Vehicle.prototype.go = function(speed) { this.speed = speed; console.log(`now going at speed ${speed}`); };
Vehicle.prototype.print = function() { console.log(`Color: ${this.color}, speed: ${this.speed}`); };
function Plane(color) { Vehicle.call(this, color); }
Plane.prototype = Object.create(Vehicle.prototype);
Plane.prototype.constructor = Plane;
Plane.prototype.go = function(speed) { this.speed = speed; console.log(`now FLYING at speed ${speed}`); };
const vehicle = new Vehicle('blue');
const plane = new Plane('white');
vehicle.go(60); vehicle.print();
plane.go(500); plane.print();
document.querySelector('#output').textContent = `Vehicle: ${vehicle.color}, speed ${vehicle.speed}\nPlane: ${plane.color}, speed ${plane.speed}\nPlane inherits Vehicle: ${plane instanceof Vehicle}`;
export {Vehicle, Plane};
