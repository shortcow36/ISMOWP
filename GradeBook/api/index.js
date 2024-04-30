const express = require('express')
const cors = require('cors')
const fs = require('fs');

const app = express()

app.use(cors());
app.use(express.json());

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
