
// Import secret variable with secrets files
const myClientSecret = require('./filesToIgnore/secret')
console.log("MY SECRET", myClientSecret);

/* #1 webserver setup (with EXPRESS)*/
const express = require('express');
const app = express();

//find views in the /views
app.set('views', __dirname + '/views');
//use the ejs template engine
app.set('view engine', 'ejs');

var access_token = "";

//show at "/" endpoint the index view which is in pages
app.get('/', function(req, res) {
  //res.send("Hello World!");
   res.render('pages/index',{client_id: clientID});
});
 //port's configuration for access to the web server
const port = process.env.PORT || 2400;
app.listen(port , () => console.log('App listening on port ' + port));
/* #2 github connection to the webserver */
// add  the axios library, to make HTTP requests
const axios = require('axios')
// This is the client ID  from gitHub
const clientID = 'f4c89e6062f5a8b7c3ac'

//  callback route
app.get('/github/callback', (req, res) => {

  // The req.query object has the query params that were sent to this route.
  const requestToken = req.query.code
  
  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    //the content type header, so that we get the response in JSON
    headers: {
         accept: 'application/json'
    }
  }).then((response) => {
    access_token = response.data.access_token
    res.redirect('/success');
  })
})

app.get('/success', function(req, res) {

  axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      Authorization: 'token ' + access_token
    }
  }).then((response) => {
    res.render('pages/success',{ userData: response.data });
  })
});