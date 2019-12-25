

import axios from 'axios';


class Search {

    constructor(query){
        this.query = query;
    }

    async getResults(){

        try{
            const res = await axios.get(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
    
            this.recipes = res.data.recipes;
            // console.log(this.recipes);
        
        }catch(err){
            alert(err);
        }
       
    }
}

export default Search;