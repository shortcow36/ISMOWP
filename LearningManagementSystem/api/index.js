const express = require('express')
const cors = require('cors')
const fs = require('fs');
const csv = require('csv-parser');
const { parse } = require("csv-parse");

const app = express()

app.use(cors());
app.use(express.json());

app.post('/submit-form', async (req, res) => {
    const formData = req.body;
    //console.log(formData);
    const csvRow = formData.class +','+ formData.name +',' + formData.assignment +',' + formData.type +',' + formData.grade +'\n';
    fs.appendFile('data.csv', csvRow, (err) => {
        if(err){
            console.log('error branch hit');
            res.status(500).json({err: 'Failed to save data: '+ err});
        } 
    })
    res.json(formData);
})

app.get('/grades', (req, res) => {
    const results = [];
    
    fs.createReadStream("data.csv")
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
            results.push(row);
        })
        .on("error", function (error) {
            console.log('Error:', error);
        })
        .on("end", function () {
            res.json(results);
        });
});

app.listen(3000)
