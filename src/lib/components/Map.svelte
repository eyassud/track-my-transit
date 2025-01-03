<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { MARC_STATIONS, PENN_LINE } from '$lib/utils/map-data';

	let map: google.maps.Map;
	let google: typeof google;
	let stations: { name: string; lat: number; lng: number }[] = [];
	let pennLine: any[] = PENN_LINE;
	let points = $state([]);
	let listenerAdded = false;

	onMount(async () => {
		try {
			MARC_STATIONS.forEach((line) => {
				line.stations.forEach((station) => {
					stations.push({
						name: station.name,
						lat: station.lat,
						lng: station.lng
					});
				});
			});

			const response = await fetch('/api/map');
			const scriptContent = await response.text();
			await loadGoogleMapsScript(scriptContent);
			console.log('Google Maps script loaded');

			google = window.google;

			map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
				center: { lat: stations[0].lat, lng: stations[0].lng },
				zoom: 14,
				mapTypeId: google.maps.MapTypeId.TERRAIN
			});

			stations.forEach((station) => {
				const marker = new google.maps.Marker({
					position: { lat: station.lat, lng: station.lng },
					map: map,
					title: station.name
				});

				const infowindow = new google.maps.InfoWindow({
					content: `<h3>${station.name}</h3>`
				});

				marker.addListener('click', () => {
					infowindow.open({
						anchor: marker,
						map,
						shouldFocus: false
					});
				});
			});

			// Draw the polyline
			const lineCoordinates = pennLine.map((station: any) => {
				return new google.maps.LatLng(station[0], station[1]);
			});

			const polyline = new google.maps.Polyline({
				path: lineCoordinates,
				geodesic: true,
				strokeColor: 'red', // Yellow color
				strokeOpacity: 1.0,
				strokeWeight: 3
			});

			polyline.setMap(map);

			// Add click event listener to the map if not already added
			if (!listenerAdded) {
				map.addListener('click', (event: google.maps.MapMouseEvent) => {
					if (event.latLng) {
						const clickedCoordinates = [event.latLng.lat(), event.latLng.lng()];

						points.push(clickedCoordinates);
					}
				});
				listenerAdded = true;
			}
		} catch (error) {
			console.error('Error loading map data:', error);
		}
	});

	async function loadGoogleMapsScript(scriptContent: string): Promise<void> {
		return new Promise((resolve, reject) => {
			if (window.google && window.google.maps) {
				resolve();
				return;
			}
			const script = document.createElement('script');
			script.textContent = scriptContent;
			script.async = true;
			script.defer = true;
			script.onload = () => resolve();
			script.onerror = reject;
			document.head.appendChild(script);
		});
	}
</script>

<div class="flex flex-row">
	<div class="map-container">
		<div id="map"></div>
		<div class="m-5 h-auto w-2/5 bg-slate-300 p-4">
			{#each points as point}
				<p>{`[${point}],`}</p>
			{/each}
		</div>
	</div>
</div>

<style>
	#map {
		width: calc(100% - 50%);
		height: calc(90vh - 20px);
		border-radius: 10px;
	}
</style>
