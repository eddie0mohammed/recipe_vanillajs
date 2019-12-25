// Global app controller

import Search from './models/Search';

import {domElements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';


//Global State of app
    // Search Object
    // Current Recipe Object
    // Shopping List Object
    // Liked Recipes

const state = {};


//search function for form
const controlSearch = async () => {
    //1. get query from view
    let query = searchView.getInput();

   if (query){
       //2. new search object and add it to state
       state.search = new Search(query);

       //3. Prepare UI for results
       //clear input field
       searchView.clearSearchInput();

       //clear existing list of recipes
       searchView.clearExistingResults();
       
       //insert loading spinner
       renderLoader(domElements.resultSection);
       

       //4. Perform search
        await state.search.getResults();

       //5. render results on UI
        clearLoader();
        searchView.renderResults(state.search.recipes);

        


    
   }
    
    
}

//event listener for the search form
domElements.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    controlSearch();
});






// const search = new Search('pizza');
// console.log(search);
// search.getResults();




