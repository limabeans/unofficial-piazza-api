var http = require('http');
var express = require('express');
var app = express();


var email = process.env.PIAZZA_EMAIL;
var password = process.env.PIAZZA_PASS;
var port = process.env.PORT || 8000;


function build_POST(headers) {
    return {
        'host': 'piazza.com',
        'method': 'POST',
        'path': '/logic/api',
        'headers': headers
    };
}


// gets user profile info (like all classes signed up for, etc)
function user_profile_info(sess_key) {
    var get_profile = JSON.stringify({
	'method': 'user_profile.get_profile',
	'params': { '':'' } });
    var options = {
	'host': 'piazza.com',
	'method': 'POST',
	'path': '/logic/api',
	headers: {
	    'Content-Type': 'application/json',
	    'Content-Length': Buffer.byteLength(get_profile),
	    'Cookie': sess_key
	}};
    var req = http.request(options, (res) => {
	var body = '';
	res.on('data', (data) => {
	    body += data;
	});
	res.on('end', () => {
	    console.log(body);
            console.log('got user_profile_info');
	});
    });
    req.write(get_profile);
    req.end();
}



// host with Express.js

//app.use(express.static('views'));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/views/home.html');
});

app.post('/auth', (req,res) => {
    console.log(Object.keys(req))
    console.log(req.params)
    var session_key = "";

    // authenticate POST request.
    var email_pass = JSON.stringify({
        'method': 'user.login',
        'params': {'email':email, 'pass':password}});
    var POST_options = build_POST({
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(email_pass)
    });
    var POST_req = http.request(POST_options, (POST_res) => {
        session_key = POST_res.headers['set-cookie'][0].slice(0,-7);
        res.send(session_key);
    });
    POST_req.write(email_pass);
    POST_req.end();
});


app.listen(port, () => {
    console.log('listening on port ' + port + '...');
});

