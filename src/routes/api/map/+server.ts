import { json, type RequestHandler } from '@sveltejs/kit';
import { GOOGLE_API_KEY } from '$env/static/private';
import { MARC_STATIONS, PENN_LINE } from '$lib/utils/map-data';


export const GET: RequestHandler = async () => {
    const stations: any[] = [];
    
    // flatten the marc_stations array
    MARC_STATIONS.forEach(line => {
        line.stations.forEach(station => {
            stations.push({
                name: station.name,
                lat: station.lat,
                lng: station.lng,
                line: line.line
            });
        });
    });

    return json({
        status: 200,
        body: {
            stations: stations,
            pennLine: PENN_LINE,
            googleApiKey: GOOGLE_API_KEY
        }
    });
};