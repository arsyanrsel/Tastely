//Test database
const DB = {
  users: JSON.parse(localStorage.getItem("tastely_db")) || [],

  saveUser(user) {
      this.users.push(user);
      localStorage.setItem("tastely_db", JSON.stringify(this.users));
  },

  findUser(username) {
      return this.users.find(u => u.username === username);
  },

  updateUser(username, newData) {
      const user = this.findUser(username);
      if (user) {
          Object.assign(user, newData);
          localStorage.setItem("tastely_db", JSON.stringify(this.users));
      }
  }
};


const FOOD_DB = {
  chinese: {
      happy: ["Sweet and Sour Pork", "Dim Sum Platter", "Pineapple Fried Rice"],
      stressed: ["Wonton Soup", "Congee", "Steamed Dumplings"],
      sad: ["Hot Pot", "Mapo Tofu", "Braised Noodles"]
  },
  italian: {
      happy: ["Tiramisu", "Margherita Pizza", "Truffle Pasta"],
      stressed: ["Creamy Risotto", "Minestrone Soup", "Bruschetta"],
      sad: ["Lasagna", "Fettuccine Alfredo", "Gelato"]
  },
  japanese: {
      happy: ["Sushi Platter", "Takoyaki", "Matcha Ice Cream"],
      stressed: ["Miso Soup", "Onigiri", "Udon Noodles"],
      sad: ["Ramen", "Tempura", "Mochi"]
  },
  korean: {
      happy: ["Korean BBQ", "Tteokbokki", "Bingsu"],
      stressed: ["Kimchi Stew", "Japchae", "Seaweed Soup"],
      sad: ["Army Stew", "Bibimbap", "Hotteok"]
  },
  indian: {
      happy: ["Biryani", "Gulab Jamun", "Butter Chicken"],
      stressed: ["Dal Tadka", "Masala Chai", "Samosa"],
      sad: ["Paneer Butter Masala", "Naan Bread", "Kheer"]
  },
  american: {
      happy: ["Cheeseburger", "Apple Pie", "Fried Chicken"],
      stressed: ["Mac & Cheese", "Mashed Potatoes", "Chicken Soup"],
      sad: ["Chocolate Chip Cookies", "Ice Cream", "Grilled Cheese"]
  },
  thai: {
      happy: ["Pad Thai", "Mango Sticky Rice", "Green Curry"],
      stressed: ["Tom Yum Soup", "Spring Rolls", "Papaya Salad"],
      sad: ["Massaman Curry", "Khao Soi", "Sticky Rice"]
  },
  french: {
      happy: ["Croissant", "Ratatouille", "Crème Brûlée"],
      stressed: ["French Onion Soup", "Quiche", "Baguette"],
      sad: ["Chocolate Soufflé", "Coq au Vin", "Potato Gratin"]
  },
  mexican: {
      happy: ["Tacos", "Churros", "Guacamole"],
      stressed: ["Enchiladas", "Quesadilla", "Tortilla Soup"],
      sad: ["Nachos", "Burrito", "Flan"]
  },
  mediterranean: {
      happy: ["Hummus", "Baklava", "Greek Salad"],
      stressed: ["Falafel", "Tzatziki", "Dolma"],
      sad: ["Moussaka", "Shawarma", "Pita Bread"]
  }
};

const MOOD_KEYWORDS = {
  happy: ["happy", "joyful", "excited", "good", "great"],
  stressed: ["stressed", "anxious", "tired", "overwhelmed"],
  sad: ["sad", "depressed", "lonely", "down", "unhappy"]
};

function detectMood(text) {
  text = text.toLowerCase();
  for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
      if (keywords.some(keyword => text.includes(keyword))) {
          return mood;
      }
  }
  return "happy";
}

function signOut() {
  localStorage.removeItem('current_user');
  localStorage.removeItem('current_mood');
  window.location.href = 'index.html';
}

function createFoodCard(food, cuisine) {
  const foodCard = document.createElement('div');
  foodCard.className = 'food-card';
  foodCard.innerHTML = `
      <img src="assets/placeholder-food.jpg" alt="${food}" class="food-img">
      <div class="food-info">
          <h3 class="food-name">${food}</h3>
          <p class="food-cuisine">${cuisine}</p>
      </div>
  `;
  return foodCard;
}

function checkAuth() {
  const currentUser = localStorage.getItem('current_user');
  const protectedPages = ['feeling.html', 'mood.html', 'suggestion.html', 'settings.html'];
  const currentPage = window.location.pathname.split('/').pop();
  
  if (!currentUser && protectedPages.includes(currentPage)) {
      window.location.href = 'index.html';
      return false;
  }
  
  return true;
}

document.addEventListener('DOMContentLoaded', function() {n
  if (!checkAuth()) return;
  
  // Index page
  if (document.getElementById('home')) {
      const currentUser = localStorage.getItem('current_user');
      const welcomeText = document.getElementById('welcome-text');
      const authButtons = document.getElementById('auth-buttons');
      const actionButtons = document.getElementById('action-buttons');
      
      if (currentUser) {
          welcomeText.textContent = `Welcome back, ${currentUser}! Today you should eat`;
          authButtons.style.display = 'none';
          actionButtons.style.display = 'block';
      } else {
          welcomeText.textContent = 'Discover food for your mood. Today you should eat ';
          authButtons.style.display = 'flex';
          actionButtons.style.display = 'none';
          authButtons.innerHTML = `
              <button onclick="window.location.href='login.html'" class="btn">Login</button>
              <button onclick="window.location.href='signup.html'" class="btn btn-secondary">Sign Up</button>
          `;
      }
      
      const suggestionInput = document.querySelector('.suggestion-input');
      suggestionInput.focus();
      
      suggestionInput.addEventListener('input', function() {
          if (this.textContent === '') {
              this.innerHTML = '';
          }
      });

      if (document.getElementById('get-suggestions-btn')) {
          document.getElementById('get-suggestions-btn').addEventListener('click', function() {
              window.location.href = 'feeling.html';
          });
      }
  }
  
  if (document.getElementById('login-btn') && !document.getElementById('home')) {
      document.getElementById('login-btn').addEventListener('click', function() {
          const username = document.getElementById('username').value.trim();
          const password = document.getElementById('password').value.trim();
          const user = DB.findUser(username);

          if (user && user.password === password) {
              localStorage.setItem('current_user', username);
              window.location.href = user.cuisines ? 'index.html' : 'mood.html';
          } else {
              document.getElementById('error').textContent = 'Invalid username or password';
          }
      });
  }

  if (document.getElementById('signup-btn') && !document.getElementById('home')) {
      const checkUsername = () => {
          const username = document.getElementById('username').value.trim();
          const errorElement = document.getElementById('username-error');
          const isTaken = DB.users.some(user => user.username === username);

          if (isTaken) {
              errorElement.textContent = 'Username taken';
              return false;
          } else {
              errorElement.textContent = '';
              return true;
          }
      };

      const updateButton = () => {
          const usernameValid = document.getElementById('username').value.trim() && checkUsername();
          const emailValid = document.getElementById('email').value.trim();
          const passwordValid = document.getElementById('password').value.trim();
          document.getElementById('signup-btn').disabled = !(usernameValid && emailValid && passwordValid);
      };

      document.getElementById('username').addEventListener('input', checkUsername);
      document.querySelectorAll('input').forEach(input => input.addEventListener('input', updateButton));

      document.getElementById('signup-btn').addEventListener('click', function() {
          const user = {
              username: document.getElementById('username').value.trim(),
              email: document.getElementById('email').value.trim(),
              password: document.getElementById('password').value.trim()
          };
          DB.saveUser(user);
          localStorage.setItem('current_user', user.username);
          window.location.href = 'mood.html';
      });
  }

  if (document.getElementById('save-btn')) {
      const cuisineBtns = document.querySelectorAll('.cuisine-btn');
      const saveBtn = document.getElementById('save-btn');
      const username = localStorage.getItem('current_user');
      const user = DB.findUser(username);
      let selectedCuisines = user?.cuisines || [];

      cuisineBtns.forEach(btn => {
          if (selectedCuisines.includes(btn.dataset.cuisine)) {
              btn.classList.add('selected');
          }
          
          const flag = document.createElement('div');
          flag.className = 'cuisine-flag';
          btn.appendChild(flag);
      });

      cuisineBtns.forEach(btn => {
          btn.addEventListener('click', function() {
              this.classList.toggle('selected');
              const cuisine = this.dataset.cuisine;
              
              if (this.classList.contains('selected')) {
                  if (!selectedCuisines.includes(cuisine)) {
                      selectedCuisines.push(cuisine);
                  }
              } else {
                  const index = selectedCuisines.indexOf(cuisine);
                  if (index > -1) selectedCuisines.splice(index, 1);
              }
          });
      });

      saveBtn.disabled = false;

      saveBtn.addEventListener('click', function() {
          DB.updateUser(username, { cuisines: selectedCuisines });
          window.location.href = 'index.html';
      });
  }

  if (document.getElementById('suggest-btn')) {
      document.getElementById('suggest-btn').addEventListener('click', function() {
          const mood = document.getElementById('mood-input').value.trim();
          if (mood) {
              localStorage.setItem('current_mood', mood);
              window.location.href = 'suggestion.html';
          } else {
              alert('Please describe your mood!');
          }
      });
  }

  if (document.getElementById('mood-text')) {
      const username = localStorage.getItem('current_user');
      const user = DB.findUser(username);
      const moodText = localStorage.getItem('current_mood');
      const moodCategory = detectMood(moodText);
      
      document.getElementById('mood-text').textContent = moodText;

      const suggestionsContainer = document.getElementById('suggestions-container');
      
      if (user?.cuisines) {
          let allSuggestions = [];
          
          user.cuisines.forEach(cuisine => {
              if (FOOD_DB[cuisine]?.[moodCategory]) {
                  FOOD_DB[cuisine][moodCategory].forEach(food => {
                      allSuggestions.push({ food, cuisine });
                  });
              }
          });

          for (let i = 0; i < allSuggestions.length; i += 2) {
              const rowDiv = document.createElement('div');
              rowDiv.style.display = 'flex';
              rowDiv.style.justifyContent = 'center';
              rowDiv.style.gap = '2rem';
              rowDiv.style.marginBottom = '2rem';
              rowDiv.style.width = '100%';

              if (allSuggestions[i]) {
                  const foodCard = createFoodCard(allSuggestions[i].food, allSuggestions[i].cuisine);
                  rowDiv.appendChild(foodCard);
              }

              if (allSuggestions[i + 1]) {
                  const foodCard = createFoodCard(allSuggestions[i + 1].food, allSuggestions[i + 1].cuisine);
                  rowDiv.appendChild(foodCard);
              } else if (allSuggestions.length % 2 !== 0 && i === allSuggestions.length - 1) {
                  rowDiv.style.justifyContent = 'center';
              }

              suggestionsContainer.appendChild(rowDiv);
          }
      }

      if (suggestionsContainer.children.length === 0) {
          const defaultFoods = {
              happy: ["Chocolate Cake", "Ice Cream", "Fresh Fruit Salad"],
              stressed: ["Warm Soup", "Herbal Tea", "Yogurt"],
              sad: ["Mac and Cheese", "Mashed Potatoes", "Chocolate"]
          };

          const rowDiv = document.createElement('div');
          rowDiv.style.display = 'flex';
          rowDiv.style.justifyContent = 'center';
          rowDiv.style.gap = '2rem';
          rowDiv.style.marginBottom = '2rem';
          rowDiv.style.width = '100%';

          defaultFoods[moodCategory].forEach((food, index) => {
              const foodCard = createFoodCard(food, 'Comfort Food');
              
              if (index % 2 === 0) {
                  rowDiv.appendChild(foodCard);
                  
                  if (index === defaultFoods[moodCategory].length - 1) {
                      rowDiv.style.justifyContent = 'center';
                  }
              } else {
                  rowDiv.appendChild(foodCard);
                  suggestionsContainer.appendChild(rowDiv.cloneNode(true));
                  rowDiv.innerHTML = '';
              }
          });

          if (rowDiv.children.length > 0) {
              suggestionsContainer.appendChild(rowDiv);
          }
      }
  }

  if (document.getElementById('username') && !document.getElementById('home')) {
      const username = localStorage.getItem('current_user');
      const user = DB.findUser(username);

      if (user) {
          document.getElementById('username').textContent = user.username;
          document.getElementById('email').textContent = user.email || 'Not set';

          const cuisinesContainer = document.getElementById('cuisines');
          cuisinesContainer.innerHTML = '';
          if (user.cuisines) {
              user.cuisines.forEach(cuisine => {
                  const tag = document.createElement('span');
                  tag.className = 'tag';
                  tag.textContent = cuisine;
                  cuisinesContainer.appendChild(tag);
              });
          }
      }

      if (document.getElementById('sign-out')) {
          document.getElementById('sign-out').addEventListener('click', signOut);
      }
  }
});