var User = require("./User");
var user = new User();

console.log(user.get("money")); // 0

user.recharge(12);
user.recharge(3);
console.log(user.get("money")); // 15

user.deduct(5);
console.log(user.get("money")); // 10
