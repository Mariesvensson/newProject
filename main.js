Vue.createApp({


    data() {

        return {

            selectedIndex: null,
            selectedRecepies: [],
            removeClass: true,

            recepieClasses: {

                'recepie-grid': false,
                'mainContent': true,
            
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

            this.recepieClasses['recepie-grid'] = true;
            this.recepieClasses['mainContent'] = false;

            console.log(data.hits);

        },

        selectRecepie( index){

        this.selectedIndex = index;

        console.log(this.isSelected)
      },

      saveRecepie(recepie){

        this.selectedIndex = this.result.indexOf(recepie)
        this.selectedRecepies.push(recepie)

        console.log(this.selectedRecepies)

      },

      removeRecepie(index){

         this.result.splice(index, 1)
        
      }
    }
   
    
    
}).mount('#app');




