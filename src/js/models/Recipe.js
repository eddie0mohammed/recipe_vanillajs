
import axios from 'axios';

class Recipe {
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            // console.log(res);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        }catch(err){
            console.log(err);
            alert('Something went wrong');
        }
    }

    calcTime(){
        //assuming we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        this.time =  Math.ceil(numIng / 3) * 5;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients(){

        const unitLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'lbs'];

        const newIngredients = this.ingredients.map(elem => {
            //1. uniform units
            let ingredient = elem.toLowerCase();
            unitLong.forEach((elem, i) => {
                ingredient = ingredient.replace(elem, unitShort[i]);
            })

            //2. remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

            //3. parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(elem1 => unitShort.includes(elem1));
            // console.log(unitIndex);

            let objIng;
            if (unitIndex > -1){
                //there is a unit
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1){
                    count = eval(arrIng[0].replace('-', '+'));
                }else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count: count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };
            }else if (parseInt(arrIng[0], 10)){
                //there is no unit but 1st element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }else if (unitIndex === -1){
                //there is no unit and no number
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient: ingredient
                }

            }


            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type){

        //update servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;


        //update ingredients
        this.ingredients.forEach(elem => {
            elem.count *= (newServings / this.servings);
        })


        this.servings = newServings;
    }
}

export default Recipe;