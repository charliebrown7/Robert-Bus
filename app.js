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
      return document.getElementById(doc).innerHTML = "<strong>"+depart.slice(9,11)+"h"+depart.slice(11,13)+"</strong> dans <strong>"+timeLeft+"</strong> minutes !</p>";
}

function save(stop) {

	var scheduleN = [];
	var scheduleT = [];

	let request = 'https://opendata.stif.info/service/api-stif-horaires/stop_areas/'+stop+'/lines/line%3A0%3A016096001%3A14/departures?count=200&apikey=810bbc8b4a96f25b28f1f45112762a585233e89c5f0eb9bb0bf1f580';
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

let request = 'https://opendata.stif.info/service/api-stif-horaires/stop_areas/'+stop+'/lines/line%3A0%3A016096001%3A14/departures?count=5&apikey=810bbc8b4a96f25b28f1f45112762a585233e89c5f0eb9bb0bf1f580';
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
      return document.getElementById(doc).innerHTML = "<strong>"+depart.slice(9,11)+"h"+depart.slice(11,13)+"</strong> dans <strong>"+timeLeft+"</strong> minutes !";
})
  .catch(err => {
      return document.getElementById(doc).innerHTML = "Aucunes infos.";
  })

}

function accurate(stop, direction0) {

let doc;
let direct;
if(direction0 == "GARE D'ERMONT-EAUBONNE (Ermont)") {
  doc = "back";
  direct = "A"; }
if (direction0 == "GARE D'ENGHIEN-LES-BAINS (Enghien-les-Bains)") {
  doc = "go";
  direct = "R"; }

let request = "https://api-lab-trone-stif.opendata.stif.info/service/tr-vianavigo/departures?line_id=016096001%3A14&stop_point_id="+stop+"&apikey=103bd4c9f914fdd20ee0c4367c84630d52260ff00a81694c36cec7b2";
console.log(request);

fetch(request)
    .then(response => {
        return response.json()
    })
    .then(data => {
      let sched = [];
      for (let i=0; i<4; i++) {
          if (data[i]['sens'] === direct){
              sched.push(data[i]['time']); }
       }
       return document.getElementById(doc).innerHTML = "Prochains : <strong>"+sched[0]+"</strong> et <strong>"+sched[1]+"</strong> minutes !";
     })
     .catch(err => {
       console.log(err);
      })

}
