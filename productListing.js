
let prodDiv = document.querySelector('.product');
let categoryListDiv = document.querySelector('.categoryList');
let allCat = [];
var finalProduct = [];
const numberPerPage = 10;
var pageNumber = 1;
var numberOfPages = 10;
let displayProducts = async (allCheckCat = [])=> {
    prodDiv.innerHTML = "";
    try{
        let product = await fetch('https://fakestoreapi.com/products');
        finalProduct = await product.json();
        document.querySelector('.listLength').innerHTML = finalProduct.length + '  Products';
        finalProduct.forEach(element => {
            console.log(element.category);
           if(!allCat.includes(element.category)) {
                categoryListDiv.innerHTML +=`<label>
                    <input type="checkbox" value="${element.category}" onclick="categoryFilters()"> ${element.category}
                    </label>`;
                allCat.push(element.category);
           }
        });
        let itemList = finalProduct;
        itemList = finalProduct.slice(0,10);
        itemList.forEach(element => {
           if(allCheckCat.length == 0) {
            allCheckCat=allCat;
           }
           if(allCheckCat.includes(element.category)) {
               createProductList(element);
           } 
        });
    } catch(error) {
        alert('Error while calling api');
    }
}
displayProducts();

//filtering
let categoryFilters = ()=> {
    let checkInput = document.querySelectorAll("input[type='checkbox']");
    let checkData = [];
    checkInput.forEach((e) => {
        if(e.checked) {
            checkData.push(e.value);
        }
    });
    prodDiv.innerHTML = "";
    finalProduct.forEach(element => {
        if(checkData.length == 0) {
            checkData=allCat;
        }
        if(checkData.includes(element.category)) {
            createProductList(element);
        } 
     });
};

//sorting
let sortItems = ()=> {
    var sortVal = document.getElementById("sorting").value;
    prodDiv.innerHTML = '';
    var list =finalProduct;
    var sortField = sortVal.split('-');
    list = sortList(sortField[0], sortField[1]);
    finalProduct = list || [];
    document.querySelector('.listLength').innerHTML = finalProduct.length + '  Products';
    if(finalProduct.length) {
        productListDisplay();
    }
}

let sortList = (field, order) => {
    var list = [];
    if(order == 'dsc') {
        if(field == 'rate') {
            list = finalProduct.sort((a, b) => parseFloat(b.rating[field]) - parseFloat(a.rating[field]));
        } else {
            list = finalProduct.sort((a, b) => parseFloat(b[field]) - parseFloat(a[field]));
        }
    } else {
        if(field == 'rate') {
            list = finalProduct.sort((a, b) => parseFloat(a.rating[field]) - parseFloat(b.rating[field]));
        } else {
            list = finalProduct.sort((a, b) => parseFloat(a[field]) - parseFloat(b[field]));
        }
    }
    return list;
}

//searching
async function searchItemVal() {
    let checkInput = document.querySelector(".searchBlock");
    let data = [];
    if(checkInput.value) {
        data = finalProduct.filter((res) => {
           return (res['title'].includes(checkInput.value) || res['description'].includes(checkInput.value));
        });
    }
    if(data.length) {
        finalProduct = data;
    } else {
        let product = await fetch('https://fakestoreapi.com/products');
        finalProduct = await product.json();
    }
    prodDiv.innerHTML = '';
    document.querySelector('.listLength').innerHTML = finalProduct.length + '  Products';
    if(finalProduct.length) {
        productListDisplay();
    }
}

let productListDisplay = () => {
    let itemList = finalProduct;
    itemList.forEach(element => {
        createProductList(element);
    });
}

function onClickOfHambergMenu() {
    var x = document.querySelector(".filterBox");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
}

var modal = document.querySelector(".itemModal");
var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
  modal.style.display = "none";
}
let onClickOfItem = (element) => {
    document.querySelector('.modal-content > p').innerHTML = `<div>
        <h3>Selected Item</h3>
        <br/>
        <p>${element}</p>
    </div>`;
    modal.style.display = "block";
}
const prev = document.querySelector('.prev');
prev.addEventListener('click', (e) => {
   e.preventDefault();
   if (pageNumber > 1) {
      pageNumber--;
      prodDiv.innerHTML = '';
      let itemList = finalProduct.slice(0, numberOfPages);
      itemList.forEach(element => {
        createProductList(element);
    });
   }
});

const next = document.querySelector(".next");
next.addEventListener("click", (e) => {
    e.preventDefault();
    if (pageNumber < numberOfPages) {
        pageNumber++;
        prodDiv.innerHTML = '';
        let itemList = finalProduct.slice((finalProduct.length-numberOfPages), finalProduct.length);
        itemList.forEach(element => {
            createProductList(element);
        });
    }
});

let createProductList = (element) => {
    prodDiv.innerHTML +=  `<div class="productItems" onclick="onClickOfItem('${element.title}')">
        <img src="${element.image }">
        <h4>${element.category}</h4>
        <h4>${element.title}</h4>
        <p> $${element.price} | ${element.rating.rate}</p>
        <p><i class="fa fa-heart-o"></i></p>
        <p class="description">${element.description}</p>
    </div>`;  
}