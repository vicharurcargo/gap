const express = require('express')
var admin = require('./api/directory_v1/admin');

const app = express();

app.use(function(req,res,next){
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "authorization,Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use('/admin',admin);

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(8080, () => console.log('Example app listening on port 8080!'))
