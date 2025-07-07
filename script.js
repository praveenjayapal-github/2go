const stops = {
  home: "58650680",
  school: "58650430"
};
const timeCntLimit = 600;
const apiInterval = 30000;

function fetchBusData(tab) {
  const tpc = stops[tab];
  const list = document.getElementById(`busList-${tab}`);
  const stopName = document.getElementById(`stopName-${tab}`);
  list.innerHTML = "<li>Loading...</li>";
  stopName.textContent = "";

  const apiUrl = "http://v0.ovapi.nl/tpc/" + tpc;
  const proxyUrl = "https://api.allorigins.win/get?url=" + encodeURIComponent(apiUrl);

  fetch(proxyUrl)
    .then(response => response.json())
    .then(data => {
      const parsed = JSON.parse(data.contents);
      const stopData = parsed[tpc];
      const passes = stopData?.Passes;
      const stop = stopData?.Stop;

      list.innerHTML = "";

      if (stop?.TimingPointName) {
        stopName.textContent = "Stop: " + stop.TimingPointName;
      }

      if (!passes) {
        list.innerHTML = "<li>No bus data found.</li>";
        return;
      }

      const sorted = Object.values(passes).sort((a, b) =>
        new Date(a.TargetArrivalTime) - new Date(b.TargetArrivalTime)
      );

      sorted.forEach(bus => {
        const arrival = new Date(bus.TargetArrivalTime);
        const now = new Date();
        const minutes = Math.round((arrival - now) / 60000);
		const sec = Math.round((arrival - now)/1000);
        const li = document.createElement("li");
		if (Math.sign(sec)!=1) return;
		if (bus.LinePublicNumber!="M4") return;
		li.innerHTML = `${bus.LinePublicNumber} → ${bus.DestinationName50} at ${arrival.toLocaleTimeString()} (${minutes} min)`;
		if (sec<timeCntLimit) {
			li.innerHTML=li.innerHTML + "<span class='timeCounter'>"+sec+"</span>";
		}				
		list.appendChild(li);
      });
    })
    .catch(error => {
      list.innerHTML = "<li>Error fetching data.</li>";
      console.error("Fetch error:", error);
    });
}

function setupTabs() {
  const buttons = document.querySelectorAll(".tab-button");
  const contents = document.querySelectorAll(".tab-content");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(btn => btn.classList.remove("active"));
      contents.forEach(content => content.classList.remove("active"));

      button.classList.add("active");
      document.getElementById(button.dataset.tab).classList.add("active");
    });
  });
}

setupTabs();
fetchBusData("home");
fetchBusData("school");


setInterval(() => {
  fetchBusData("home");
  fetchBusData("school");
}, apiInterval);

	
function updateCountdowns() {

  const activeTab = document.querySelector(".tab-content.active");
  if (!activeTab) return;

  const counters = document.querySelectorAll(".timeCounter");

  counters.forEach(counter => {
    let seconds = parseInt(counter.textContent, 10);
    if (isNaN(seconds)) return;

    if (seconds > 0) {
      seconds -= 1;
      counter.textContent = seconds;

      // Update background color class
      counter.classList.remove("urgent", "soon", "later");
      if (seconds <= 60) {
        counter.classList.add("urgent");
      } else if (seconds <= 180) {
        counter.classList.add("soon");
      } else {
        counter.classList.add("later");
      }

      // 🔔 Play bell at exactly 60 seconds
      if (seconds === 60 && !counter.dataset.bellPlayed) {
        playBell();
        counter.dataset.bellPlayed = "true"; // mark as played
      }

    } else {
      counter.textContent = "Departed";
      counter.classList.remove("urgent", "soon", "later");
    }
  });
  
	var currentDate = new Date();
	var hours = currentDate.getHours();
	var minutes = currentDate.getMinutes();
	var seconds = currentDate.getSeconds();
	hours = hours < 10 ? "0" + hours : hours;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;
	var timeString = hours + ":" + minutes + ":" + seconds;
	document.getElementById("liveTime").innerHTML = timeString;
}


function playBell() {
  const bell = document.getElementById("bellSound");
  if (bell) {
    bell.currentTime = 0;
    bell.play();
  }
}


// Start the countdown updater
setInterval(updateCountdowns, 1000);
