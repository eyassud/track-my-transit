import { type RequestHandler } from '@sveltejs/kit';
import { GOOGLE_API_KEY } from '$env/static/private';

const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/js';

export const GET: RequestHandler = async () => {
    const url = `${GOOGLE_MAPS_API_URL}?key=${GOOGLE_API_KEY}&loading=async&libraries=places`;

    const response = await fetch(url);
    const script = await response.text();

    return new Response(script, {
        headers: {
            'Content-Type': 'application/javascript'
        }
    });
};