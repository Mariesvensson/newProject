Vue.createApp({


    data() {

        return {

            selectedIndex: null,
            favoriteRecepies: [],
            removeClass: true,
            showFavorites: false,
            shoppingList: [],

            recepieClasses: {

                'showContent': false,
                'hideContent': true,
            
            },

            selectedClasses: {

                'recepie-container': true,
                'selected-recepie': false,
            },

            result: [

                {
                    id: '',
                    label: '',
                    calories: '',
                    img: '',
                    ingredients: [],
                    ingredientLines: [],

                    



                }
            ]
        }
    },

   

    methods: {

        

        async usersubmit() {

            
            let input = document.querySelector('input').value;
            let recepieDiv = document.querySelector('.main-content');

            let response = await fetch('https://api.edamam.com/api/recipes/v2?type=public&q=' + input + '&app_id=b7754906&app_key=c702a1785ba3ec1968284b35d271f31c')

            let data = await response.json();
            this.result = data.hits.map(hit => ({

                id: hit.recipe.uri,
                calories: Math.round(hit.recipe.calories),
                label: hit.recipe.label,
                img: hit.recipe.images.REGULAR.url,
                ingredients: hit.recipe.ingredients,
                ingredientLines: hit.recipe.ingredientLines
                
                
            }));

            this.recepieClasses['showContent'] = true;
            this.recepieClasses['hideContent'] = false;
            

            console.log(data.hits);

        },

      //   selectRecepie( index){

      //   this.selectedIndex = index;

      //   this.result[index].selectedClasses = {

      //           'recepie-container':false,
      //           'selected-recepie': true,
      //   }
        

      //   console.log(this.selectedIndex)
      // },

      saveRecepie(recepie){

        this.selectedIndex = this.result.indexOf(recepie)
        this.favoriteRecepies.push(recepie)

        console.log(this.favoriteRecepies)

      },

      removeRecepie(index){

         this.result.splice(index, 1)
        
      },

      showShoppingList(){

        this.result = [];
      },

      showFavories(){

        this.result = [];
        this. showFavorites = true;
        this.selectedClasses['recepie-container'] = true;
        this.recepieClasses['hideContent'] = false;
        

      },

      removeFavorite(index){

        this.favoriteRecepies.splice(index, 1)

        console.log(this.favoriteRecepies)

      }


    }
   
    
    
}).mount('#app');




