let express = require('express');
let fs = require('fs');
let path = require('path');
let bodyParser = require('body-parser');
let chart_data = require(__dirname + '/chart_data.json');
let port = process.env.PORT || 5000;
let app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.listen(port, ()=>{
  console.log('Server on running on port 5000');
});

app.get('/', function(req, res){
  fs.createReadStream(__dirname + '/index.html').pipe(res);
});
app.post('/', function(req, res){
  let index = +req.body.value;
  res.status(200).json(chart_data[index]);
});