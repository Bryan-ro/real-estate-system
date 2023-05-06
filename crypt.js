const bcrypt = require("bcrypt");

bcrypt.hash("qweasd123", 15).then(hash => {
    console.log(hash);
});
