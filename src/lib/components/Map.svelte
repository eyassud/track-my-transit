<script lang="ts">
	import { mount, onMount } from 'svelte';

	const coord = [
		{ lng: -76.0737569858854, lat: 39.5580211998852 },
		{ lng: -76.07502659823263, lat: 39.55765020355985 },
		{ lng: -76.07542681565802, lat: 39.55753203013149 },
		{ lng: -76.07558415917329, lat: 39.55748431287599 },
		{ lng: -76.0756752716993, lat: 39.55745523177015 },
		{ lng: -76.07583825034635, lat: 39.55739691645963 },
		{ lng: -76.07606214734608, lat: 39.55732211884168 },
		{ lng: -76.07636395612872, lat: 39.55722218493712 },
		{ lng: -76.105573566924, lat: 39.544565949018775 },
		{ lng: -76.10514192642998, lat: 39.545010751198284 },
		{ lng: -76.10468232677106, lat: 39.54548612598574 },
		{ lng: -76.10444844140368, lat: 39.54572058934383 },
		{ lng: -76.10425360400508, lat: 39.545910654441506 },
		{ lng: -76.10399484338916, lat: 39.546155568540875 },
		{ lng: -76.10377235315117, lat: 39.54635819247758 },
		{ lng: -76.10354988986263, lat: 39.54655868854831 },
		{ lng: -76.1030912415196, lat: 39.54695744570759 },
		{ lng: -76.1028717130271, lat: 39.54714306379986 },
		{ lng: -76.10258286783234, lat: 39.5473749766184 },
		{ lng: -76.10224408259597, lat: 39.547642689494886 },
		{ lng: -76.1019997821612, lat: 39.547830245964605 },
		{ lng: -76.10178609631129, lat: 39.547988239594154 },
		{ lng: -76.1014614559474, lat: 39.54822413388903 },
		{ lng: -76.10124510030448, lat: 39.54837572002956 },
		{ lng: -76.10100103792325, lat: 39.54854412197966 },
		{ lng: -76.10080141609745, lat: 39.54867668167932 },
		{ lng: -76.10054913323305, lat: 39.54884289196861 },
		{ lng: -76.1002664486845, lat: 39.54902163854984 },
		{ lng: -76.0999726870102, lat: 39.549206685207906 },
		{ lng: -76.0996291990933, lat: 39.54941050686463 },
		{ lng: -76.09931069332448, lat: 39.549595362694724 },
		{ lng: -76.09904204585057, lat: 39.549750802602546 },
		{ lng: -76.09878180570938, lat: 39.54989353662171 },
		{ lng: -76.09851601308144, lat: 39.550040485200775 },
		{ lng: -76.09818386729334, lat: 39.550216720571015 },
		{ lng: -76.09791270902821, lat: 39.550352984882785 },
		{ lng: -76.09768855511031, lat: 39.550468325099736 },
		{ lng: -76.09738149747145, lat: 39.55061708306713 },
		{ lng: -76.09710214477428, lat: 39.55074902580598 },
		{ lng: -76.09682284507772, lat: 39.55087671193211 },
		{ lng: -76.09656017409539, lat: 39.5509938833465 },
		{ lng: -76.09625330330611, lat: 39.55112774193689 },
		{ lng: -76.09591610988444, lat: 39.55126775100657 },
		{ lng: -76.09573647647204, lat: 39.55134086370181 },
		{ lng: -76.09520595661806, lat: 39.5515496218238 },
		{ lng: -76.09470591749998, lat: 39.551739456927166 },
		{ lng: -76.09423358422191, lat: 39.551912477576245 },
		{ lng: -76.09381655392768, lat: 39.552060381189285 },
		{ lng: -76.09333063363093, lat: 39.55222052345615 },
		{ lng: -76.09295516389331, lat: 39.55234320393658 },
		{ lng: -76.09253559765503, lat: 39.55247405733548 },
		{ lng: -76.09222370528333, lat: 39.552569557580874 }
	];

	let map: google.maps.Map;
	let google: typeof google;
	let stations: { name: string; lat: number; lng: number }[] = [];
	let googleApiKey: string;
	let pennLine: any[] = [];
	let points: any[] = $state([]);
	let mounted = false;

	onMount(async () => {
		try {
			const response = await fetch('/api/map');
			const data = await response.json();

			stations = data.body.stations;
			googleApiKey = data.body.googleApiKey;
			pennLine = data.body.pennLine;

			await loadGoogleMapsScript();
			google = window.google;

			map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
				center: { lat: stations[12].lat, lng: stations[12].lng },
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

				if (!mounted) {
					// Add click event listener to the map
					map.addListener('click', (event: google.maps.MapMouseEvent) => {
						if (event.latLng) {
							const clickedCoordinates: any = [event.latLng.lat(), event.latLng.lng()];
							points.push(clickedCoordinates);
							console.log(points);
						}
					});
					mounted = true;
				}

				polyline.setMap(map);
			});
		} catch (error) {
			console.error('Error loading Google Maps:', error);
		}
	});

	function loadGoogleMapsScript(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (window.google && window.google.maps) {
				resolve();
				return;
			}
			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`;
			script.async = true;
			script.defer = true;
			script.onerror = () => reject(new Error('Error loading Google Maps script'));
			script.onload = () => resolve();
			document.head.appendChild(script);
		});
	}
</script>

<div class="flex flex-row">
	<div class="map-container">
		<div id="map"></div>
		<div class="m-5 h-auto bg-slate-300 p-4 w-2/5">
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
