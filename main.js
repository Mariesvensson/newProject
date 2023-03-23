
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
      options: {
        animationEnabled: true,
        title:{
          text: "Vue.js Basic Column Chart"
        },

        data: [{
          type: "column",
          dataPoints: [
            { label: "apple",  y: 10 },
            { label: "orange", y: 15 },
            { label: "banana", y: 25 },
            { label: "mango",  y: 30 },
            { label: "grape",  y: 28 }
          ]
        }]
      },



      // showDiagram: false,

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

  mounted(){

    this.favoriteRecepies.forEach((r,index)=> this.drawDiagram(r,index) );
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
      console.log(data.hits);
    },

    saveRecepie(recepie) {

      this.selectedIndex = this.result.indexOf(recepie)

      if (this.favoriteRecepies.includes(recepie)) {

        return;
      }
      else {

        this.favoriteRecepies.push(recepie)
        localStorage.setItem('favoriteRecepies', JSON.stringify(this.favoriteRecepies))
        console.log(this.result)
      }
    },

    removeRecepie(index) {

      this.result.splice(index, 1)
    },

    showFavories() {

      this.result = [];
      this.showFavorites = true;
      this.selectedClasses['recepie-container'] = true;
      // this.recepieClasses['hideContent'] = false;
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
      // console.log(ingredietsArray);

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
        console.log(ingredientsInfo)
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

      if(this.showDiagram === false){

        this.showDiagram = true;
      }
      else{

        this.showDiagram = false.
        return;
      }
   

      let protein = favorit.protein
      let carbs = favorit.carbs
      let fat = favorit.fat
      let totalWeight = favorit.totalWeight

      let proteinPercent = Math.round(protein / totalWeight * 100)
      let carbsPercent = Math.round(carbs / totalWeight * 100)
      let fatPercent = Math.round(fat / totalWeight * 100)

      const canvas = document.getElementById('canvas-' + index);
      const c = canvas.getContext('2d');

      let data = [protein, carbs, fat];
      let total = protein + carbs + fat;
      let colors = ['#000', 'green', 'blue'];
      let lastEnd = 0;

      data.forEach((d, index)=> {

        c.fillStyle = colors[index];
        c.beginPath();
        c.moveTo(canvas.width / 2 , canvas.height / 2);
        c.arc( 
          canvas.width/ 2,
          canvas.height / 2,
          canvas.height / 2,
          lastEnd,
          lastEnd + Math.PI * 2 * (d/total),
          false
        )

        c.lineTo(canvas.width / 2 , canvas.height / 2);
        c.fill();
        lastEnd += Math.PI * 2 * (d/total);
      })


      // const w = canvas.width
      // const h = canvas.height

      // const proteinHeight = h * (proteinPercent / 100);
      // const carbsHeight = h * (carbsPercent / 100);
      // const fatHeight = h * (fatPercent / 100);

      // c.fillStyle = 'lightpink';

      // c.font = '12px Arial';
      // c.textAlign = 'center';
      // c.fillText('Protein', w / 6, h - proteinHeight - 5);
      // c.fillRect(35, h - proteinHeight, 70, proteinHeight);

      // c.fillStyle = 'lightcoral';
      // c.fillText('Carbs', w / 2, h - carbsHeight - 5);
      // c.fillRect(140, h - carbsHeight, 70, carbsHeight);

      // c.fillStyle = 'palevioletred';
      // c.fillText('Fat', 5 * w / 6, h - fatHeight - 5);
      // c.fillRect( 245, h - fatHeight, 70, fatHeight);
    },

    showShoppingList() {

      this.showUserShoppingList = true;
      this.selectedClasses['selected-recepie'] = true;
      this.showlistClass['showList'] = true
      this.showlistClass['hideList'] = false
      this.contentVisability['showContent'] = false
      this.contentVisability['hideContent'] = true
    },

    newmethod(){




    }
  },
}).mount('#app');




