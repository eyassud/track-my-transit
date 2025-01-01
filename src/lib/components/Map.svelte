<script lang="ts">
  import { onMount } from 'svelte';
  import { GOOGLE_API_KEY } from '$env/static/private';

  let map: google.maps.Map;
  let google: typeof google;
  interface Station {
    name: string;
    lat: number;
    lng: number;
  }

  let stations: Station[] = [
    { name: 'Station A', lat: 37.7749, lng: -122.4194 }, // Example San Francisco
    { name: 'Station B', lat: 34.0522, lng: -118.2437 }, // Example Los Angeles
    // Add more stations here
  ];

  onMount(async () => {
    // Load the Google Maps API
    try {
      await loadGoogleMapsScript();
      google = window.google;

      map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: stations[0].lat, lng: stations[0].lng }, // Center on the first station
        zoom: 10, // Adjust zoom level as needed
      });

      // Add markers for each station
      stations.forEach(station => {
        const marker = new google.maps.Marker({
          position: { lat: station.lat, lng: station.lng },
          map: map,
          title: station.name,
          // You can customize the icon:
          // icon: {
          //   url: "path/to/your/icon.png", // Path to your custom icon
          //   scaledSize: new google.maps.Size(30, 30), // Adjust size as needed
          // },
        });

        // Add info windows (optional)
        const infowindow = new google.maps.InfoWindow({
          content: `<h3>${station.name}</h3>`
        });

        marker.addListener("click", () => {
          infowindow.open({
            anchor: marker,
            map,
            shouldFocus: false,
          });
        });
      });
    } catch (error) {
      console.error("Error loading Google Maps:", error);
      // Handle the error appropriately, e.g., display an error message to the user.
    }
  });

  function loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve(); // Google Maps is already loaded
        return;
      }
      const script = document.createElement('script');
      // Replace YOUR_API_KEY with your actual Google Maps API key
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onerror = () => reject(new Error('Error loading Google Maps script'));
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }
</script>

<div id="map" style="height: 400px; width: 100%;"></div>

<style>
  /* Optional: Style the map container */
  #map {
    border: 1px solid gray;
  }
</style>