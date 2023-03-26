
Vue.createApp({

  data() {
    return {

      selectedIndex: null,
      favoriteRecepies: [],
      shoppingList: [],
      removeClass: true,
      showFavorites: false,
      showUserShoppingList: false,
      changeColor: false,
      showRecepies: false,
      input: '',
      filteredShoppingDictionary: {},

      contentVisability: {
        'showContent': false,
        'hideContent': true,
      },

      selectedClasses: {
        'recepie-container': true,
        'selected-recepie': false,
      },

      showlistClass: {
        'showList': false,
        'hideList': true
      },

      result: [

        {
          id: '',
          label: '',
          calories: '',
          img: '',
          ingredients: [],
          ingredientLines: [],
          protein: '',
          carbs: '',
          fat: '',
          totalWeight: '',
        }
      ],
    }
  },

  created() {

    let savedData = localStorage.getItem('favoriteRecepies')
    if (savedData) {
      this.favoriteRecepies = JSON.parse(savedData)
    }
  },

  mounted() {
    this.favoriteRecepies.forEach((favorit, index) => {
      this.drawDiagram(favorit, index);
    });
  },

  methods: {

    usersubmit() {

      let input = document.querySelector('input').value;
      this.getRecepies(input)
      this.input = input;
    },

    async getRecepies(input) {

      let response = await fetch('https://api.edamam.com/api/recipes/v2?type=public&q=' + input + '&app_id=b7754906&app_key=c702a1785ba3ec1968284b35d271f31c')

      let data = await response.json();
      this.result = data.hits.map(hit => ({

        id: hit.recipe.uri,
        calories: Math.round(hit.recipe.calories),
        label: hit.recipe.label,
        img: hit.recipe.images.REGULAR.url,
        ingredients: hit.recipe.ingredients,
        ingredientLines: hit.recipe.ingredientLines,
        protein: Math.round(hit.recipe.totalNutrients.PROCNT.quantity),
        carbs: Math.round(hit.recipe.totalNutrients.CHOCDF.quantity),
        fat: Math.round(hit.recipe.totalNutrients.FAT.quantity),
        totalWeight: Math.round(hit.recipe.totalWeight)

      }));

      this.contentVisability['showContent'] = true;
      this.contentVisability['hideContent'] = false;
      this.selectedClasses['selected-recepie'] = false;
      this.showlistClass['showList'] = false

      this.showUserShoppingList = false;
      this.showRecepies = true;
    
    },

    saveRecepie(recepie) {

      this.selectedIndex = this.result.indexOf(recepie)

      if (this.favoriteRecepies.includes(recepie)) {

        return;
      }
      else {

        this.favoriteRecepies.push(recepie)
        localStorage.setItem('favoriteRecepies', JSON.stringify(this.favoriteRecepies))
      
      }
    },

    removeRecepie(index) {

      this.result.splice(index, 1)
    },

    showFavories() {

      this.result = [];
      this.showFavorites = true;
      this.selectedClasses['recepie-container'] = true;
      this.contentVisability['showContent'] = true
      this.contentVisability['hideContent'] = false

    },

    removeFavorite(index) {

      this.favoriteRecepies.splice(index, 1)
      let favoritesInStorage = JSON.parse(localStorage.getItem('favoriteRecepies'));
      favoritesInStorage.splice(index, 1);
      localStorage.setItem('favoriteRecepies', JSON.stringify(favoritesInStorage));
    },

    AddtoShoppingList(recepie) {

      console.log(recepie)
      let ingredietsArray = recepie.ingredients;

      for (let i = 0; i < ingredietsArray.length; i++) {

        let measure = ingredietsArray[i].measure;

        if (measure === '' || measure === '<unit>') {

          measure = null;
        }

        let ingredientsInfo = {

          name: ingredietsArray[i].food.toLowerCase(),
          measure: measure,
          quantity: Math.round(ingredietsArray[i].quantity, 1)

        }
        this.shoppingList.push(ingredientsInfo)
      }

      this.changeColor = true;
      this.filterShoppinglist(this.shoppingList);
    },

    filterShoppinglist(shoppinglist) {

      this.filteredShoppingDictionary = shoppinglist.reduce((filteredShoppingDictionary, ingredient) => {

        if (filteredShoppingDictionary.hasOwnProperty(ingredient.name)) {

          if (ingredient.quantity === 0 || ingredient.quantity === '0') {

            return;
          }
          else {

            filteredShoppingDictionary[ingredient.name].quantity += ingredient.quantity;
          }
        }
        else {

          if (ingredient.quantity === 0 || ingredient.quantity === '0') {

            filteredShoppingDictionary[ingredient.name] = {

              quantity: '',
              measure: ingredient.measure,
              name: ingredient.name
            };
          }
          else {

            filteredShoppingDictionary[ingredient.name] = {

              quantity: ingredient.quantity,
              measure: ingredient.measure,
              name: ingredient.name
            };
          }
        }
        return filteredShoppingDictionary;
      }, {})
    },

    drawDiagram(favorit, index) {

      const canvas = document.getElementById('canvas-' + index);

      if (!canvas) {
        setTimeout(() => this.drawDiagram(favorit, index), 10);
        return;
      }

      let protein = favorit.protein
      let carbs = favorit.carbs
      let fat = favorit.fat
      let c = canvas.getContext('2d');
      let data = [protein, carbs, fat];
      let total = protein + carbs + fat;
      let colors = ['#c54c83af', '#ec729da1', '#f4aeba9c'];
      let lastEnd = 0;

      data.forEach((d, index) => {

        c.fillStyle = colors[index];
        c.beginPath();
        c.moveTo(canvas.width / 2, canvas.height / 2);
        c.arc(
          canvas.width / 2,
          canvas.height / 2,
          canvas.height / 2,
          lastEnd,
          lastEnd + Math.PI * 2 * (d / total),
          false
        )

        c.lineTo(canvas.width / 2, canvas.height / 2);
        c.fill();
        lastEnd += Math.PI * 2 * (d / total);
      })
    },

    showShoppingList() {

      this.showUserShoppingList = true;
      this.selectedClasses['selected-recepie'] = true;
      this.showlistClass['showList'] = true
      this.showlistClass['hideList'] = false
      this.contentVisability['showContent'] = false
      this.contentVisability['hideContent'] = true
    },

  },
}).mount('#app');




