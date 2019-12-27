
class Likes{
    constructor(){
        this.likes = [];
    }

    addLike(id, title, author, img){
        const like = {id, title, author, img};
        this.likes.push(like);

        //persist data to localstorage
        this.persistData();
        return like;

    }

    deleteLike(id){
        this.likes = this.likes.filter(elem => elem.id !== id);

        //persist data to localstorage
        this.persistData();


    }

    isLiked(id){
        return this.likes.findIndex(elem => elem.id === id) !== -1;
    }

    getNumLikes(){
        return this.likes.length;
    }

    persistData(){
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage(){
        const storage = JSON.parse(localStorage.getItem('likes'));

        //restoring likes from localStorage
        if (storage){
            this.likes = storage;
        }
    }
}

export default Likes;