const stops = {
  home: "58650680",
  school: "58650430"
};

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
        const li = document.createElement("li");
		console.log("|"+bus.LinePublicNumber+"|");
		if (bus.LinePublicNumber!="M4") return;
		li.textContent = `${bus.LinePublicNumber} → ${bus.DestinationName50} at ${arrival.toLocaleTimeString()} (${minutes} min)`;
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
}, 30000);
