import { getPictures } from "./services/apiService";
import imgCard from './templates/imgCard.hbs';
import * as basicLightbox from 'basiclightbox';
import { alert } from '../node_modules/@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
    form: document.querySelector('#search-form'),
    searchButton: document.querySelector('#search-button'),
    loadMoreButton: document.querySelector('#load-more'),
    gallery: document.querySelector('.gallery'),
}

const state = {
    page: 1,
    value: '',
};

const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
}

refs.loadMoreButton.style.visibility = "hidden";

refs.form.addEventListener('submit', onSearch);
refs.loadMoreButton.addEventListener('click', onLoadMore);
refs.gallery.addEventListener('click', onGalleryImgClick);

async function onSearch(e) {
    e.preventDefault();
    refs.loadMoreButton.style.visibility = "hidden";

    if(!e.currentTarget.elements.query.value.trim()) {
        return;
    }

    try {
        state.value = e.currentTarget.elements.query.value;
        const pictures = await getPictures(state.value, state.page);
        refs.gallery.innerHTML = imgCard(pictures);

        if (pictures.length > 11) {
            refs.loadMoreButton.style.visibility = "visible";
        }

        if (!pictures.length) {
            alert({
                text: 'Oops! No pictures found!🥺'
              });
        }
    } catch(error) {
        console.log(error.message)
    }
}

async function onLoadMore(e) {
    state.page +=1;
    const pictures = await getPictures(state.value, state.page);
    refs.gallery.insertAdjacentHTML('beforeend', imgCard(pictures));

    if (state.page === 2) {
        const observer = new IntersectionObserver(onLoadMore, options);
        observer.observe(refs.loadMoreButton);
    }
   
//     refs.gallery.scrollIntoView({
//     behavior: 'smooth',
//     block: 'end',
// });
}

function onGalleryImgClick(e) {
    if (e.target.nodeName !== "IMG") {
        return;
    };

    const instance = basicLightbox.create(`
    <img src="${e.target.dataset.source}" width="800" height="600">
    `);

    instance.show();
}

