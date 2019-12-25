
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

export const renderResults = (recipes) => {
    recipes.forEach(elem => {
        renderRecipe(elem);
    })
}

export const clearSearchInput = () => {
    domElements.searchInput.value = '';
}

export const clearExistingResults = () => {
    domElements.resultsList.innerHTML = '';
}