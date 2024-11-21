const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(cors()); // Allow CORS
app.use(bodyParser.json());

// Routes for fetching and saving orders
app.get("/orders", (req, res) => {
    fs.readFile("data/orders.json", "utf8", (err, data) => {
        if (err) {
            res.status(500).send("Error reading orders file.");
        } else {
            res.send(JSON.parse(data));
        }
    });
});

app.post("/orders", (req, res) => {
    const newOrder = req.body;

    fs.readFile("data/orders.json", "utf8", (err, data) => {
        if (err) {
            res.status(500).send("Error reading orders file.");
        } else {
            const orders = JSON.parse(data);
            orders.push(newOrder);

            fs.writeFile("data/orders.json", JSON.stringify(orders, null, 2), (err) => {
                if (err) {
                    res.status(500).send("Error saving new order.");
                } else {
                    res.send("Order saved successfully!");
                }
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
