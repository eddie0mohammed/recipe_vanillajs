
import {domElements} from '../views/base';

export const getInput = () => {
    return domElements.searchInput.value;
}


const renderRecipe = (recipe) => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${recipe.title}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;

    domElements.resultsList.insertAdjacentHTML('beforeend', markup);

}

//button markup for pagination
const createButtonMarkup = (page, type) => {
    return `
        <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
            <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
        </button>
    `;
}

//render pagination buttons
const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if (page === 1 && pages > 1){
        // only button to go to next page
        button = createButtonMarkup(page, 'next');
    }else if (page < pages){
        //both buttons
        button = `
        ${createButtonMarkup(page,'prev')} 

        ${createButtonMarkup(page,'next')}
        `;
    }else if (page === pages && pages > 1){
        //only button to go to prev page
        button = createButtonMarkup(page, 'prev');
    }
    return button;
}


//render results including pagination
export const renderResults = (recipes, page = 1, resPerPage = 10) => {

    //pagination
    const start = (page - 1) * resPerPage;
    const end = (page * resPerPage);

    //render pagination buttons and insert into page
    domElements.buttonsPagination.insertAdjacentHTML('beforeend',renderButtons(page, recipes.length, resPerPage));


    recipes.slice(start, end).forEach(elem => {
        renderRecipe(elem);
    })
}

export const clearSearchInput = () => {
    domElements.searchInput.value = '';
}

export const clearExistingResults = () => {
    domElements.resultsList.innerHTML = '';
    //clear pagination buttons
    domElements.buttonsPagination.innerHTML = '';
}

export const highlightSelected = (id) => {
        Array.from(document.querySelectorAll('.results__link')).forEach(elem => {
        elem.classList.remove('results__link--active');
    })

    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');

}
