var app = require('express')();

app.get("/", (req, res) => {
    res.send("connected !");
});

app.listen(4000, () => {
    console.log("server started at 4000");
});
