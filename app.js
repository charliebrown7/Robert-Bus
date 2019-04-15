function go(stop) {
      let date = new Date();
      let currentMinutes = date.getMinutes();
      let depart = localStorage.getItem(stop+'Enghien');
      let timeLeft = parseInt(depart.slice(11, 13));
      if (timeLeft  < currentMinutes){
          timeLeft = 60 - currentMinutes + timeLeft ;
      }
      else {
          timeLeft = timeLeft - currentMinutes;
      }
      document.getElementById("go").innerHTML = "<strong>"+depart.slice(9,11)+"h"+depart.slice(11,13)+"</strong> dans <strong>"+timeLeft+"</strong> minutes !</p>";
}

function back(stop) {
      let date = new Date();
      let currentMinutes = date.getMinutes();
      let depart = localStorage.getItem(stop+'Ermont');
      let timeLeft = parseInt(depart.slice(11, 13));
      if (timeLeft  < currentMinutes){
          timeLeft = 60 - currentMinutes + timeLeft ;
      }
      else {
          timeLeft = timeLeft - currentMinutes;
      }
      document.getElementById("back").innerHTML = "<strong>"+depart.slice(9,11)+"h"+depart.slice(11,13)+"</strong> dans <strong>"+timeLeft+"</strong> minutes !";
}

function save(stop) {

	var scheduleN = [];
	var scheduleT = [];
	var schedule = [];

	let request = 'https://opendata.stif.info/service/api-stif-horaires/stop_areas/'+stop+'/lines/line%3A0%3A016096001%3A14/departures?count=200&apikey=810bbc8b4a96f25b28f1f45112762a585233e89c5f0eb9bb0bf1f580';
	fetch(request)
	  .then(response => {
	    return response.json()
	  })
	  .then(data => {
	      let time;
	      let i = 0;
	      let y = 0;
	      let direction;
	      let depart;
	      let date = new Date();
	      let currentMinutes = date.getMinutes();
	      while (y === 0) {
		  direction = data['departures'][i]['display_informations']['direction'];
		  if (direction === "GARE D'ENGHIEN-LES-BAINS (Enghien-les-Bains)") {
		    scheduleN.push(data['departures'][i]['stop_date_time']['arrival_date_time']);
		  } 
		  else if (direction === "GARE D'ERMONT-EAUBONNE (Ermont)") {
		    scheduleT.push(data['departures'][i]['stop_date_time']['arrival_date_time']);
		  }
		  i++;    
	      }
	})
	  .catch(err => {
	      try {
		if (scheduleT != '' && scheduleN != '') {
		  localStorage.setItem(stop+'Ermont', scheduleT);
		  localStorage.setItem(stop+'Enghien', scheduleN);
		}
	      }
	      catch(error) {
		console.error(error);
	      }
	  })
}
