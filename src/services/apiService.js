import axios from 'axios';

const API_KEY = '23192849-392e98e42aea5a2ff7de83472';
axios.defaults.baseURL = 'https://pixabay.com/api/?image_type=photo&orientation=horizontal';

export async function getPictures(query, page) {
    const { 
        data: { hits },
    } = await axios.get(`&q=${query}&page=${page}&per_page=12&key=${API_KEY}`);
    return hits;
}

