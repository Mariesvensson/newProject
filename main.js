Vue.createApp({


  data() {

    return {

      selectedIndex: null,
      favoriteRecepies: [],
      removeClass: true,
      showFavorites: false,
      showUserShoppingList: false,
      shoppingList: [],

      filteredShoppingDictionary: {

        Value: '',
        key: ''
      },


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
        ingredientLines: hit.recipe.ingredientLines,

      }));

      this.recepieClasses['showContent'] = true;
      this.recepieClasses['hideContent'] = false;


      console.log(data.hits);

    },



    saveRecepie(recepie) {

      this.selectedIndex = this.result.indexOf(recepie)
      this.favoriteRecepies.push(recepie)

      console.log(this.favoriteRecepies)

    },

    removeRecepie(index) {

      this.result.splice(index, 1)

    },

    showShoppingList() {

      this.result = [];
    },

    showFavories() {

      this.result = [];
      this.showFavorites = true;
      this.selectedClasses['recepie-container'] = true;
      this.recepieClasses['hideContent'] = false;


    },

    removeFavorite(index) {

      this.favoriteRecepies.splice(index, 1)

      console.log(this.favoriteRecepies)

    },



    AddtoShoppingList(recepie) {

      console.log(recepie)

      let ingredietsArray = recepie.ingredients;

      console.log(ingredietsArray);



      for (let i = 0; i < ingredietsArray.length; i++) {

        let measure = ingredietsArray[i].measure;

        if (measure === '' || measure === '<unit>') {

          measure = null;
        }



        let ingredientsInfo = {

          name: ingredietsArray[i].food.toLowerCase(),
          measure: measure,
          quantity: ingredietsArray[i].quantity,


        }
        this.shoppingList.push(ingredientsInfo)
        console.log(ingredientsInfo)
      }



      
      this.filterShoppinglist(this.shoppingList);

    },



    filterShoppinglist(shoppinglist) {

      this.filteredShoppingDictionary = shoppinglist.reduce((dict, ingredient) => {
  
        if (dict.hasOwnProperty(ingredient.name)) {
  
          dict[ingredient.name] += ingredient.quantity
  
        }
        else {
  
          dict[ingredient.name] = ingredient.quantity;
  
  
        }
  
        return dict;
      }, {})
  
      console.log(this.filteredShoppingDictionary)
  
  
  
  
  
  
      //  checkShoppingList(filteredShoppingDictionary);
  
    },



    // console.log(this.shoppingList)

  },



  // showShoppingList(shoppingList) {



  //   console.log(this.shoppingList)

  // }










}).mount('#app');




