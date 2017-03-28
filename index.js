'use strict';

const app 		    = require('express')();
const http 		    = require('http').Server(app);
const io 			= require('socket.io')(http);
const mysql      	= require('mysql');

const mysql_host     	= 'localhost';
const mysql_user     	= 'root';
const mysql_password 	= '';
const mysql_database 	= 'IoTServer';

var showLog			= true;

let boksArr = [];

//updateBoksArr();
//setInterval( () => { updateBoksArr(); }, 1000*60*15);
//setInterval( () => { fetchBoxes(); }, 1000);


app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/device/connect/', function(req, res){

	console.log("connect: "+req.query.deviceIP);
  	//console.log("deviceSerial: "+req.query.deviceSerial);
  	//console.log("deviceIP: "+req.query.deviceIP);
	//res.send(JSON.stringify({ "registered": true }));
	//res.send("/device/registered/true/\r/device/registered/false/");
	res.send("/device/registered/true/");
});

app.get('/device/fetch-config/', function(req, res){
	console.log("fetch-config: "+req.query.deviceIP);

	var sensor = "/sensor/10/A0/analogread/5000/1/";
	sensor += "\r/peripheral/1/D1/LED/1/0/100/0/";
	sensor += "\r/peripheral/2/D2/LED/1/1/250/1/";
	sensor += "\r/peripheral/4/D4/LED/1/0/500/0/";
	/*
		jeg kan ved gud ikke lige huske hvad den sidste paramtere var til....
		hvis peripheral så
		0: peripheral
		1: id (max 10, eller hvad enhed har af max)
		2: pin
		3: Type ex LED
		4: state_on 1/0
		5: toggle on/off => 1/0
		6: toggle_timer_count => toggler hvert toggle_timer_count
		7: kan det være hvor mange gange den skal toggle? Ex. 1 gang, med toggle_timer_count = 60000, for ex at have en pumpe tændt i 1min? eller er det en trigger der skal fange det?

		Hvis sensor så:
		0: sensor
		1: id (max 10, eller hvad enhed har af max)
		2: pin
		3: read type - digital/analog - pt. kun analog testet på wemos
		4: interval
		5: send stats til server

		Hvis trigger så
		0: trigger
		1: ????

	*/


	//res.send(JSON.stringify({"sensors":[{"senId":10,"pin":"A0","read":true,"delay":5000,"timer":0}],"triggers":[],"thingys":[]}));
	res.send(sensor);
	//res.send(JSON.stringify({"sensors":[],"triggers":[],"thingys":[]}));
});

app.get('/device/sensor-reading/', function(req, res){
	console.log("sensor-reading: "+req.query.value);
	res.send("OK");
	//res.send("/sensor-reading/registered/true/");
	//res.send(JSON.stringify({"sensors":[],"triggers":[],"thingys":[]}));
});


http.listen(3000, function(){
  myLog('listening on *:3000');
});

function updateBoksArr() {

	/*
	noget fra vores monitor på kontoret er lige viser mysql query via nodejs :)
	*/

	var connection = mysql.createConnection({
	  host     : mysql_host,
	  user     : mysql_user,
	  password : mysql_password,
	  database : mysql_database
	});

	connection.connect(function(err){
	if(!err) {
	    myLog("Database is connected ...");    
	} else {
	    myLog("Error connecting database ..."); 
	}
	})

	connection.query('SELECT * from boks where boksActive = 1 order by boksId desc', function(err, rows, fields) {

		if (!err) {

			for (var i = 0; i < rows.length; i++) {
				let row = rows[i];

				let fundet = false;

			    boksArr.forEach( boks2 => {

			    	if (boks2.boksId == row.boksId) {

			    		//console.log(row.boksId + " boks findes");
			    		fundet = true;
			            boks2.boksName = row.boksName;
			            boks2.boksPeriodDays = row.boksPeriodDays;
			            boks2.boksPeriodShowType = row.boksPeriodShowType;
			            boks2.boksPeriodMonths = row.boksPeriodMonths;
			            boks2.boksTypeId = row.boksTypeId;
			            boks2.boksJSONUrl = row.boksJSONUrl;
			            boks2.boksFetchRateSec = row.boksFetchRateSec;
			            //boks2.boksFetchTimer = -1;
			            boks2.boksIsServerCheck = row.boksIsServerCheck;

			    	}

			    });

			    if (!fundet) {
		    		//console.log(row.boksId + " boks findes ikke");

			        let boks = { 
			            boksId: row.boksId, 
			            boksName: row.boksName, 
			            boksPeriodDays: row.boksPeriodDays, 
			            boksPeriodShowType: row.boksPeriodShowType, 
			            boksPeriodMonths: row.boksPeriodMonths, 
			            boksTypeId: row.boksTypeId, 
			            boksJSONUrl: row.boksJSONUrl, 
			            boksFetchRateSec: row.boksFetchRateSec, 
			            boksFetchTimer: -1, 
			            boksJSON: '', 
			            boksIsServerCheck: row.boksIsServerCheck, 
			            ioRoom: io.of(`/boks${row.boksId}`)
			        };
			        boks.ioRoom.on('connection', socket => {
			        	sendJSON(socket, boks.boksId);
			            myLog(`Someone connected to room ${boks.boksId}`);
			        });   
			        //console.log(boks);
			        boksArr.push( boks );			    
			    }

			}; 

		} else {
	    	myLog('Error while performing Query.');
		}
		connection.end();
	    myLog("Database is disconnected ...");    

	 });


}

function myLog(obj) {
	if (showLog) {
		if (typeof obj == 'string') {
			var d = new Date();
			var n = d.toString();
			console.log(`${n}: ${obj}`);
		} else {
			console.log(obj);
		}
	}
}

