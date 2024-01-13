const express = require('express');
const dotenv=require('dotenv')

const hostname = "0.0.0.0";
let port = 3000


dotenv.config()

const server = express();

server.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`)
})