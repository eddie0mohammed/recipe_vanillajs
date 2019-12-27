
import uniqid from 'uniqid';

class List{
    constructor(){
        this.items = [];

    }

    addItem(count, unit, ingredient){
        const item = {
            id: uniqid(),
            count: count,
            unit: unit,
            ingredient: ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        this.items = this.items.filter(elem => elem.id !== id);
            // const index = this.items.findIndex(elem => elem.id == id);
            // console.log(index);
            // if (index){
            //     this.items.splice(this.items.findIndex(index), 1);
            // }
    }

    updateCount(id, newCount){
        this.items.find(el => el.id == id).count = newCount;

    }
}

export default List;