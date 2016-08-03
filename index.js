var http = require('http');

var email = process.env.PIAZZA_EMAIL;
var password = process.env.PIAZZA_PASS;


var email_pass = JSON.stringify({
	'method': 'user.login',
	'params': {'email':email, 'pass':password}});

var options = {
	'host': 'piazza.com',
	'method': 'POST',
	'path': '/logic/api',
    headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(email_pass)
    }
};

var session_key = "";

var req = http.request(options, (res) => { 
	var tmp = res.headers['set-cookie'][0];
	session_key = tmp.slice(0,-7);
	user_profile_info(session_key);
});

req.write(email_pass);
req.end();



// gets user profile info (like all classes signed up for, etc)
function user_profile_info(sess_key) {
	console.log(sess_key);
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
		});
	});
	req.write(get_profile);
	req.end();
}
