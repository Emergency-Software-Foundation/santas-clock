const express = require('express');
const { find } = require('geo-tz/now')
var moment = require('moment-timezone');
const api = express();
const APIPort = 3000;

let art = `
		  	   Santa's Clock
		  ::Emergency Software Foundation::
			      (c) 2024
`;


api.get('/api/v1/timezone/', (req, res) => {
	if (!req.query.hasOwnProperty('lat') || !req.query.hasOwnProperty('lng')) {
		res.status(400).json({
			"error": 400,
			"message": "Missing lat or lng from request."
		});
	}
	let tz = find(req.query.lat, req.query.lng);
	let offset = moment("2024-12-25").tz(tz[0]).format('Z'); // -05:00
	let rawoffset = parseInt(offset.split(":")[0]);
	let resp = {
		"timezone": tz[0],
		"offset": offset,
		"rawoffset": rawoffset
	};
	console.log("CLIENT > [200] Found "+req.query.lat+","+req.query.lng+" in "+tz[0]);
	res.status(200).json(resp);
});

//Error handling
api.use((req, res, next) => {
	console.log("CLIENT > [404] Attempted to access non-existant endpoint: "+req.path+"; NOT FOUND");
	res.status(404).json({
		"error": 404,
		"message": "That endpoint does not exist."
	});
});
api.use((err, req, res, next) => {
	console.log("CLIENT > [500] An unknown error has occured trying to access the endpoint: "+req.path);
	console.log("SERVER > Server ERROR Details:");
	console.error(err.stack);
	res.status(500).json({
		"error": 500,
		"message": "A server error has occured."
	});
});

api.listen(APIPort, () => {
	console.log('SERVER > API Started.');
	console.log('SERVER > Ready.')
	console.log(art);
});