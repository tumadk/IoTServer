
	TODO
	- Devices folder til hver devices type der understøttes
		* class/funktions liste så der findes en connect/fetch-config/sensor-reading til hver devices
		* ex: /devices/wemos/wemos.js
		* ex: /devices/arduino/arduino.js
	- Mobile App
		* Mulighed for at tilføje enheder m.
			- Unikt ID som er gemt på enheden
			- Vælge device type
		* Til enheden mulighed for at tilføje 
			- sensorer 
			- LED's 
			- mv.
		* Til enheden og opsætte triggers
			- Ex. er X > Y - så tænd for gadget Z
		* Bonus: Trigger X på enhed A, så skal enhed B gøre Y
	- Oprette config.js fil, der ikke er en del af git - så der kan lægges mysql password osv der i.
	- Databasestruktur
		* Devices
		* DeviceTypes
		* DeviceEnhedsTyper
		* DeviceEnheder
		* Triggers
		* noget niveau på så man har en / flere brugere der kan få adgang til en enhed. Ex. som udgangspunkt kun den der opretter enheden...


