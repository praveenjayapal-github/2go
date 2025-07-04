# 2Go Real-Time Bus Viewer

This is a browser-based web app that fetches real-time bus data from OVAPI using a TimingPointCode.

## Features

- Enter a TimingPointCode to fetch real-time buses
- Displays stop name and upcoming buses sorted by arrival time
- Shows countdown in minutes
- Auto-refreshes every 30 seconds
- Displays stop location on a map using Leaflet

## How to Use

1. Open `index.html` in your browser.
2. Enter a TimingPointCode (e.g., 58650680).
3. Click "Fetch Buses" to view upcoming buses.

## GitHub Pages Deployment

1. Create a new GitHub repository.
2. Upload all files from this folder.
3. Go to **Settings > Pages**.
4. Under **Source**, select the root of the `main` branch.
5. Your app will be live at `https://<your-username>.github.io/<repo-name>/`
