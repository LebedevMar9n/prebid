const express = require('express');
const cors=require("cors");


const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:'*', 
    credentials:true,           
    optionSuccessStatus:200,
 })) 

app.post('/', (req, res) => {
    console.log(req.body);
  })

app.use('*', (req, res) => {
    res.status(404).json('page not found');
});

app.use((err, req, res, next) => {
    res
        .status(err.status || 500)
        .json({
            error: err.message || 'Unknown error'
        });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));