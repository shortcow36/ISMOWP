const express = require('express')
const cors = require('cors')
const fs = require('fs');
const { parse } = require("csv-parse");

const app = express()

app.use(cors());
app.use(express.json());

// PUBLIC: Used by the frontend to get and display grades in HTML table,
// and also by our custom integration to short-poll for updates
app.get('/grades', (req, res) => {
    const results = [];
    
    fs.createReadStream("./LearningManagementSystem/database/grades.csv")
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

// PRIVATE: Used only by the frontend on form-submission
app.post('/grades', async (req, res) => {
    const formData = req.body;
    const csvRow = formData.class +','+ formData.name +',' + formData.assignment +',' + formData.type +',' + formData.grade +'\n';
    fs.appendFile('../database/grades.csv', csvRow, (err) => {
        if(err){
            console.log('error branch hit');
            res.status(500).json({err: 'Failed to save data: '+ err});
        }
    })
    res.json(formData);
})

app.listen(3000)
