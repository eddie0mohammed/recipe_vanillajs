// Global app controller

import Search from './models/Search';

import {domElements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import Recipe from './models/Recipe';


//Global State of app
    // Search Object
    // Current Recipe Object
    // Shopping List Object
    // Liked Recipes

const state = {};


//SEARCH CONTROLLER
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
       

       try{
        //4. Perform search
        await state.search.getResults();

       //5. render results on UI
        clearLoader();
        searchView.renderResults(state.search.recipes);
       }catch(err){
           console.log(err);
           clearLoader();
           alert(err);
       }
       
    
   }
}

//event listener for the search form
domElements.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    controlSearch();
});


//event listener for pagination buttons

domElements.buttonsPagination.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-inline');
    if (btn){
        const goto = parseInt(btn.dataset.goto);

        //clear existing results display
       searchView.clearExistingResults();
       

        //go to page
        searchView.renderResults(state.search.recipes, goto);

    }
    
});




//RECIPE CONTROLLER

//controlRecipe functionality for hashChange
const controlRecipe = async () => {
    const hashID = window.location.hash.replace('#', '');

    if (hashID){
        //prepare UI for changes
        recipeView.clearExistingRecipe();
        renderLoader(domElements.recipe);


        //highlight selected recipe
        if (state.search)
            searchView.highlightSelected(hashID);

        //create new Recipe object
        state.recipe = new Recipe(hashID);

    

        try{
             //get recipe data and parseIngredients
            await state.recipe.getRecipe(hashID);
            state.recipe.parseIngredients();

            //calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //render Recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        }catch(err){
            console.log(err);
            alert(err);
        }
       


    }
  
    
}

// //event listener for hash change (url)
    // window.addEventListener('hashchange', controlRecipe);
// //event listener when window load and there is a hash
    // window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(elem => {
    window.addEventListener(elem, controlRecipe);
})


//handling recipe button clicks
domElements.recipe.addEventListener('click', (e) => {
    if (e.target.matches('.btn-decrease,  .btn-decrease *')){
        //decrease button is clicked
        if (state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }

    }else if (e.target.matches('.btn-increase,  .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    // console.log(state.recipe);
})