const categoryContainer = document.getElementById('categoryContainer');
const cardContainer = document.getElementById('cardContainer');
const cartContainer = document.getElementById('cartContainer');

let cart = []

const totalPrice = document.getElementById('totalPrice');
const cartItems = document.getElementById('cartItems');
const cartTotalPrice = document.getElementById('cartTotalPrice');

const separateTaka = document.getElementById("cartTotalPrice");
separateTaka.textContent = totalPrice;


const modalContainer = document.getElementById('modalContainer');
const treeDetailModal = document.getElementById('treeDetailModal');

const loadCategory = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => {
      const categories = data.categories;
      showCategory(categories);
    })
    .catch((err) => {
      console.log(err);
    });
};

const showCategory = (categories) => {
  categories.forEach((cat) => {
    categoryContainer.innerHTML += `
            <li id="${cat.id}" class="hover:bg-[#28a745] hover:text-white py-3 flex justify-center items-center cursor-pointer"> ${cat.category_name} </li>
        `;
  });

  categoryContainer.addEventListener("click", (e) => {
    const allLi = document.querySelectorAll("#categoryContainer li");
    allLi.forEach((li) => {
      li.classList.remove("bg-[#15803d]");
    });

    if (e.target.localName === "li") {
        showLoading();
    //   showLoading()
      e.target.classList.add("bg-[#15803d]");
      loadCardByCategory(e.target.id);
    }
  });

};
loadCategory();

const loadCardByCategory = (categoryID) => {
  fetch(`https://openapi.programming-hero.com/api/category/${categoryID}`)
  .then((res) => res.json())
  .then (data => {
    console.log(data.plants);
    showCardByCategory(data.plants);
})
.catch(err => {
  console.log(err)
})
}

const showCardByCategory = (plants) => {
  // console.log(plants);
  cardContainer.innerHTML = '';
  plants.forEach(p => {
    cardContainer.innerHTML += `
    <div class="card bg-base-100 w-[350px] lg:w-80 h-[450px] shadow-sm">
            <figure class="h-[186px] flex justify-center items-center">
              <img class="rounded-xl w-[311px] h-[186px] p-4 object-cover" src="${p.image}" alt="Shoes" />
            </figure>
            <div id="${p.id}" class="card-body">
              <h2 class="card-title treeName cursor-pointer" data-id="${p.id}">${p.name}</h2>
              <p class="text-left text-xs w-full text-[#1F2937]">${p.description}</p>
              
          
              <div class="card-actions justify-between items-center">
                <div class="badge badge-outline bg-[#dcfce7] border-none rounded-full text-sm p-4 text-[#15803d]">${p.category}</div>
                <div><p class="text-sm font-bold">৳ ${p.price}</p></div>
              </div>

              <div class="card-actions-2">
                <button class="btn btn-primary btn-block bg-[#15803d] rounded-full mt-2">Add to Cart</button>
              </div>
            </div>
          </div>
          `
  });
};


const showDetailsModal = (plant) => {

  treeDetailModal.showModal();

  modalContainer.innerHTML = `
    <h1 class="font-bold text-lg">${plant.name}</h1>
    <img src="${plant.image}" alt="It's a plant image" class="w-full rounded-lg my-3"/>
    <p class="py-2 text-sm">${plant.description}</p>
    <p class="font-semibold">Category: ${plant.category}</p>
    <p class="font-semibold">Price: ৳${plant.price}</p>
  `;
   
};


cardContainer.addEventListener('click', (e) => {
  
  if(e.target.innerText === 'Add to Cart') {
    handleCart(e);
  }

  if (e.target.classList.contains('treeName')) {
    const plantId = e.target.getAttribute('data-id');
    handleModal(plantId);
  }

})

const handleModal = (plantId) => {

  
  fetch(`https://openapi.programming-hero.com/api/plant/${plantId}`)
  .then(res=> res.json())
  .then(data => {
      const plant = data.data;
      console.log(plant);
      showDetailsModal(plant);
    })
  .catch(err => {
    console.log(err)
  })
};

const handleCart = (e) => {
  const title = e.target.parentNode.parentNode.children[0].innerText;
    const price = e.target.parentNode.parentNode.children[2].children[1].innerText;
    const idOfCard = e.target.parentNode.parentNode.id;


    cart.push({
      id: idOfCard,
      title: title,
      price: price
    });

    showCart(cart);
};

  

const showCart = (cart) => {
  cartContainer.innerHTML = '';
  let sumOfCart = 0;

  cart.forEach((c) => {

    const numericPrice = parseFloat(c.price.substring(1).trim());
    sumOfCart += numericPrice;

    cartContainer.innerHTML += `<div class="eachCart bg-[#F0FDF4] m-2 flex justify-between items-center p-3 rounded-lg my-2">
              <div class="text-left pl-2">
                <h6 class="pb-2 font-bold">${c.title}</h6>
                <p class="  text-[#1F2937]">${c.price} x 1 </p>
              </div>

              <div>
                <button onclick="deleteCartItem('${c.id}')">❌</button>
              </div>
            </div>`
  });

cartTotalPrice.innerText = sumOfCart;
};

const deleteCartItem = (id) => {
  const filteredCart = cart.filter(c => c.id !== id);
  cart = filteredCart;
  showCart(cart);
}

loadCardByCategory("1");

const showLoading = () => {
    cardContainer.innerHTML = `<span class="loading loading-dots loading-xl"></span>`;
}
