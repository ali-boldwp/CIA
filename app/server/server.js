const express = require('express');
const cors = require('cors');


const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type','Authorization'],
}));

app.use(express.json());

const port = config.port || 5200;
app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`));