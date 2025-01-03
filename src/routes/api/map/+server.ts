import { type RequestHandler } from '@sveltejs/kit';
import { GOOGLE_API_KEY } from '$env/static/private';

const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/js';

export const GET: RequestHandler = async () => {
 console.log(GOOGLE_API_KEY)
    const url = `${GOOGLE_MAPS_API_URL}?key=${GOOGLE_API_KEY}&loading=async&libraries=places`;
    console.log(url)
    const response = await fetch(url);
    const script = await response.text();

    return new Response(script, {
        headers: {
            'Content-Type': 'application/javascript'
        }
    });
};