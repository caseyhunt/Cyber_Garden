//using https://robkendal.co.uk/blog/how-to-build-a-restful-node-js-api-server-using-json-files for reference
//https://github.com/bpk68/api-server-starter
const express = require('express');
const bodyParser = require("body-parser");

const app = express();

const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const routes = require('./routes/routes.js')(app,fs);

const server = app.listen(3001, () => {
  console.log('listening on port %s...', server.address().port);
});
