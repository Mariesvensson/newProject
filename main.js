Vue.createApp({


    data() {

        return {

            result: [

                {
                    label: '',
                    calories: '',
                    img: '',
                    // ingredientLines: []



                }
            ]
        }
    },

    methods: {

        async usersubmit() {

            
            let input = document.querySelector('input').value;

            let response = await fetch('https://api.edamam.com/api/recipes/v2?type=public&q=' + input + '&app_id=b7754906&app_key=c702a1785ba3ec1968284b35d271f31c')

            let data = await response.json();
            this.result = data.hits.map(hit => ({

                id: hit.recipe.uri,
                calories: hit.recipe.calories,
                label: hit.recipe.label,
                img: hit.recipe.image
                // ingredientLines: hit.recipe.ingredientLines,



            }));

            console.log(this.result);

        }
    }
   
    

}).mount('#app');




