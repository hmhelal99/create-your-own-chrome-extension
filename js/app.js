/*
 * Title: Information Handler 
 * Description: Handle the IP address information
 * Author: Helal Hafiz
 * Date: 7/7/2021
 */

// Dependencies



// Scaffolding
const app = {};


// Get the user IP and define it to app{}
fetch('https://api.ipify.org/?format=json', {
		method: 'get'
	})
	.then(res => res.json())
	.then(data => app.userIp = data.ip)
	.catch((error) => error)



// Getting the IP information
app.getData = (ip, callback) => {

	if (typeof(ip === 'string')) {
		const apiKey = 'e2c0d02bcd844023b4bcfa79bc3410dc';
		const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`;

		let data = {};

		fetch(url, {
				method: 'get'
			})
			.then(res => res.json())
			.then(data => callback(200, data))
			.catch(err => {
				if (err) {
					callback(500, err)
				}
			})

	} else {
		callback(409, {
			message: 'Invalid IP address!'
		})
	}
}


// Shift the needed data
app.filterData = (data, callback) => {
	const dataToFilter = ['ip', 'district', 'city', 'state_prov', 'country_name', 'isp', 'organization'];

	const dataToShow = (({
		ip,
		district,
		city,
		state_prov,
		country_name,
		isp,
		organization
	}) => ({
		ip,
		district,
		city,
		state_prov,
		country_name,
		isp,
		organization
	}))(data);

	callback(200, dataToShow);
}

// OutPut
app.output = (ipInformation, callback) => {

	const data = ipInformation;
	const ipAddress = document.querySelector('#ipAddress');
	ipAddress.append(data.ip);
	//fetching object
	var i = 0;
	const fieldName = ['IP Address', 'District', 'City', 'State', 'Country', 'ISP', 'Organization'];

	Object.keys(data).forEach((key) => {
		let dataList = document.querySelector('#infoList');
		let createdElement = document.createElement('li');
		createdElement.innerText = fieldName[i] + ": ";
		i++;

		let createdSpan = document.createElement('span');
		createdSpan.className = 'content';
		createdSpan.innerText = data[key];

		createdElement.appendChild(createdSpan);
		dataList.appendChild(createdElement);
	})

	callback(true)
}

// Click Handler
const userBtn = document.getElementById('getInfo');
const appShadow = document.querySelector('.appShadow');
userBtn.addEventListener('click', (event) => {
	if (app.userIp) {
		app.getData(app.userIp, (statusCode, payload) => {
			if (statusCode === 200) {
				app.filterData(payload, (statusCode, payload) => {
					app.output(payload, (callback) => {
						if (!callback()) {
							console.log('Ops! Cannot Show Data. try again please!');
						} else {

						}
					})
				})
			} else {
				appShadow.style.display = 'none';
				console.log(statusCode, payload)
			}
		})
	} else {
		// Get the user IP and define it to app{}
		fetch('https://api.ipify.org/?format=json', {
				method: 'get'
			})
			.then(res => res.json())
			.then(data => app.userIp = data.ip)
			.catch((error) => error);


		userBtn.click();
	}


})



// Copy to clipboard

let toolTip = document.querySelector('.tooltip');
let ipAddress = document.querySelector('#ipAddress');
let toolTipText = document.querySelector('.tooltiptext');
toolTip.addEventListener('click', (e) => {
	let textToCopy = ipAddress.innerText;
	let onlyIp = textToCopy.replace(/[^\d.-]/g, '')

	let copied = copyText(onlyIp)
	if (copied) {
		toolTipText.innerText = 'Copied';
		setTimeout(() => {
			toolTipText.innerText = 'Copy IP';
		}, 2000)
	}
	return;
})


const copyText = (textToCopy) => {
	let text = textToCopy;
	let textArea = document.createElement('textarea');
	textArea.setAttribute('readonly', '');
	textArea.style.position = 'absolute';
	textArea.style.left = '-345434%';
	textArea.value = text;
	document.body.appendChild(textArea)
	textArea.select();
	textArea.setSelectionRange(0, 99999) //for mobile
	document.execCommand('copy');

	document.body.removeChild(textArea);

	return true;
}