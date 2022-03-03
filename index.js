const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const app = express();

// API Endpoint to get insurance output
app.post('/get-insurance', jsonParser, function(req, res) {
    const body = req.body;
    let productPrice = body["product_price"];

     // Check if Invalid product price
    if ((typeof productPrice != 'number') || productPrice <= 0) {
        return res.status(422).json({ "error": "Invalid product price. Please provide valid price" });
    }

    const insuranceMatrix = body["insurance_price_matrix"];
    // Check if Invalid insurance price matrix
    if (!Array.isArray(insuranceMatrix) || insuranceMatrix.length < 5) {
        return res.status(422).json({ "error": "Invalid insurance price matrix" });
    }

    let productMatrix;
    if (productPrice <= 50) {
        productMatrix = insuranceMatrix[0];
    } else if (productPrice <= 100) {
        productMatrix = insuranceMatrix[1];
    } else if (productPrice <= 200) {
        productMatrix = insuranceMatrix[2];
    } else if (productPrice <= 500) {
        productMatrix = insuranceMatrix[3];
    } else {
        productMatrix = insuranceMatrix[4];
    }

    // Check if Invalid values provided for product matrix
    if (!Array.isArray(productMatrix) || productMatrix.length < 6) {
        return res.status(422).json({ "error": "Invalid values provided for product matrix" });
    }

    const minPrice = productMatrix[0];
    // Check if Invalid minimum price provided
    if (typeof minPrice != 'number') {
        return res.status(422).json({ "error": "Invalid minimum product price!" });
    }

    const resArray = [];
    for (let i=1; i<6; i++) {
        const percentageValue = productMatrix[i];
        if (typeof percentageValue == 'number') {
            let value = minPrice;
            // If value > percentageValue of year; then output is minimum price
            if (value < percentageValue) {
                value = Number.parseFloat(productPrice * percentageValue/100).toFixed(2);
            }
            resArray.push(parseFloat(value));
        } else {
            resArray.push(null);
        }
    }

    res.status(200).json({ "output": resArray });
})


const port = process.env.PORT || 3000;

console.log("Server starting at port: ", port);
app.listen(port);