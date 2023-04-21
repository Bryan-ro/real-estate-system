const bcrypt = require("bcrypt");

(async () => {
    console.log(await bcrypt.hash("Qweasd123", 15));
})();
