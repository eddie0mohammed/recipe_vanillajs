// Global app controller

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

import {domElements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';


//Global State of app
    // Search Object
    // Current Recipe Object
    // Shopping List Object
    // Liked Recipes

const state = {};
window.state = state;


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
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(hashID));

        }catch(err){
            console.log(err);
            alert(err);
        }
       


    }
  
    
}


//LIST CONTROLLER
const controlList = () => {
    //create a new list IF there is none yet
    if (!state.list){
        state.list = new List();
    }
    
    //add ingredients to the list
    state.recipe.ingredients.forEach(elem => {
        const item = state.list.addItem(elem.count, elem.unit, elem.ingredient);

        //add item to UI
        listView.renderItem(item);
    })
}


//LIKES CONTROLLER

const controlLike = () => {
    if (!state.likes){
        state.likes = new Likes();
    }
    
    const currentID = state.recipe.id;
    //user has not yet liked current recipe
    if (!state.likes.isLiked(currentID)){
        //add Like to the state
        const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img)

        //Toggle the like button
        likesView.toggleLikeBtn(true);

        //add like to the ui list
        likesView.renderLike(newLike);
        // console.log(state.likes);


    }else{
        //remove Like from state
        state.likes.deleteLike(currentID);

        //toggle like button
        likesView.toggleLikeBtn(false);


        // remove like from ui list
        likesView.deleteLike(currentID)
        // console.log(state.likes);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}






// //event listener for hash change (url)
    // window.addEventListener('hashchange', controlRecipe);
// //event listener when window load and there is a hash
    // window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(elem => {
    window.addEventListener(elem, controlRecipe);
})


//restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    //restore likes
    state.likes.readStorage();
    //toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    //render the existing likes
    state.likes.likes.forEach(elem => likesView.renderLike(elem));
})


//handle delete and updatelist item events
domElements.shopping.addEventListener('click', (e) => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle delete
    if (e.target.matches('.shopping__delete, .shopping__delete *')){
        //delete from state
        state.list.deleteItem(id);

        //delete from UI
        listView.deleteItem(id);

        //handle count update
    }else if (e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});


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
    }else if (e.target.matches('.btn__recipe--add, .btn__recipe--add *')){
        //add ingredients to shopping list
        controlList();
        
    }else if (e.target.matches('.recipe__love, .recipe__love *')){
        //like controller
        controlLike();
    }
    // console.log(state.recipe);
})


