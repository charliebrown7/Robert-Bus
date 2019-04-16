function go(stop, direction0) {

let doc;
let direct;

if(direction0 == "GARE D'ERMONT-EAUBONNE (Ermont)") {
  doc = "back";
  direct = "Enghien";
}
else if (direction0 == "GARE D'ENGHIEN-LES-BAINS (Enghien-les-Bains)") {
  doc = "go";
  direct = "Ermont";
}

      let date = new Date();
      let currentMinutes = date.getMinutes();
      let depart = localStorage.getItem(stop + direct);
      if (depart == null) {
        return goBackOnline(stop, direction0);
      }
      let timeLeft = parseInt(depart.slice(11, 13));
      if (timeLeft  < currentMinutes){
          timeLeft = 60 - currentMinutes + timeLeft ;
      }
      else {
          timeLeft = timeLeft - currentMinutes;
      }
      document.getElementById(doc).innerHTML = "<strong>"+depart.slice(9,11)+"h"+depart.slice(11,13)+"</strong> dans <strong>"+timeLeft+"</strong> minutes !</p>";
      return null;
}

function save(stop) {

	var scheduleN = [];
	var scheduleT = [];

	let request = 'https://opendata.stif.info/service/api-stif-horaires/stop_areas/'+stop+'/lines/line%3A0%3A016096001%3A14/departures?count=200&apikey=';
        console.log(request);

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
                  if(i > 100) {
                    y++;
                  }   
	      }
              localStorage.setItem(stop+'Ermont', scheduleT);
              localStorage.setItem(stop+'Enghien', scheduleN);
              return null ;
	})
	  .catch(err => {
	    console.log("error");
	  })
}

function goBackOnline(stop, direction0) {

let doc;

if(direction0 == "GARE D'ERMONT-EAUBONNE (Ermont)") {
  doc = "back";
}
else if (direction0 == "GARE D'ENGHIEN-LES-BAINS (Enghien-les-Bains)") {
  doc = "go";
}

let request = 'https://opendata.stif.info/service/api-stif-horaires/stop_areas/'+stop+'/lines/line%3A0%3A016096001%3A14/departures?count=5&apikey=';
console.log(request);

fetch(request)
  .then(response => {
    return response.json()
  })
  .then(data => {
    // Work with JSON data here
      let timeLeft;
      let i = 0;
      let y = 0;
      let direction;
      let depart;
      let date = new Date();
      let currentMinutes = date.getMinutes();
      while (y === 0) {
          direction = data['departures'][i]['display_informations']['direction'];
          if (direction === direction0) {
              depart = data['departures'][i]['stop_date_time']['arrival_date_time'];
              y++;
          }
          else {
              i++;
          }
      }
      timeLeft = parseInt(depart.slice(11, 13));
      if (timeLeft  < currentMinutes){
          timeLeft = 60 - currentMinutes + timeLeft ;
      }
      else {
          timeLeft = timeLeft - currentMinutes;
      }
      document.getElementById(doc).innerHTML = "<strong>"+depart.slice(9,11)+"h"+depart.slice(11,13)+"</strong> dans <strong>"+timeLeft+"</strong> minutes !";
      return null ;
})
  .catch(err => {
      document.getElementById(doc).innerHTML = "Aucunes infos.";
  })

}
