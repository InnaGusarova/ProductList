import './scss/app.scss';

const nameInput = document.querySelector('#name');
const descriptionInput = document.querySelector('#description');
const urlInput = document.querySelector('#url');
const priceInput = document.querySelector('#price');
const deleteProd = document.querySelectorAll('.deleteProd');
const regUrl = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/;
const regPrice = /(?<![-.])\b[0-9]+\b(?!\.[0-9])/;

const btnAdd = document.querySelector('.btnAdd');
const sortVars = document.querySelector('.sortVars');
const sort = document.querySelector('.sort');
const productList = document.querySelector('.productList');

const startApp = () => {
  sort.addEventListener('click',  () => {
    sort.classList.toggle('open');
  });
  sortVars.addEventListener('click',  (e) => {
    sort.children.item(0).innerHTML = e.target.innerText;
    customSort(e.target.innerText)
  });
  for (let i = 0; i < deleteProd.length; i++) {
    deleteProd[i].addEventListener('click', deleteProduct);
  }
  nameInput.addEventListener('blur', validateInput);
  nameInput.addEventListener('input', validateInput);
  urlInput.addEventListener('blur', validateInput);
  urlInput.addEventListener('input', validateInput);
  priceInput.addEventListener('blur', validateInput);
  priceInput.addEventListener('input', validateInput);
  btnAdd.addEventListener('click', addNew);
};

function deleteProduct()  {
  productList.removeChild(this.parentElement);
}

const checkAll = () => {
  const isName = nameInput.value;
  const isUrl = urlInput.value;
  const isPrice = priceInput.value;

  if (!isName || !isUrl || !isPrice) {
    btnAdd.classList.add('btnAddOff');
  } else {
    btnAdd.classList.remove('btnAddOff');
  }
}

const addNew = () => {
  if (btnAdd.classList.contains('btnAddOff')) {
    return false;
  }

  const product = document.createElement('div');
  product.className = 'product';
  for (let i = 0; i < productList.length; i++ ) {
    product.id = productList.length - 1;
  }

  const img = document.createElement('img');
  img.src = urlInput.value;
  img.className = 'productImg';
  img.alt = 'productPhoto';

  const imgDel = document.createElement('img');
  imgDel.src = '../img/delete.png';
  imgDel.className = 'imgDel';
  imgDel.alt = 'del';

  const wrapper = document.createElement('div');
  wrapper.className = 'text';

  const name = document.createElement('h2');
  name.innerHTML = nameInput.value;
  const description  = document.createElement('p');
  description.className = 'aboutProduct';
  description.innerHTML = descriptionInput?.value || '';
  const price = document.createElement('p');
  price.className = 'price';

  const formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  
  });
  price.innerHTML = `${formatter.format(priceInput.value).split(',')[0]} руб.`;

  const btnDel = document.createElement('button');
  btnDel.addEventListener('click', deleteProduct);
  btnDel.className = 'deleteProd';

  wrapper.append(name, description, price);
  product.id = productList.children.length;
  product.append(img, wrapper, btnDel);
  productList.prepend(product);
  btnDel.append(imgDel);
};

const customSort = (sign) => {

  const productList = document.querySelector('.productList');
  const produceArray = [...productList.children];

  if (sign === 'По цене min') {
    produceArray.sort((a, b) => {
      return parseInt(a.children[1].children[2].innerHTML, 10) - parseInt(b.children[1].children[2].innerHTML, 10)
    })
  } else if (sign === 'По цене max') {
    produceArray.sort((a, b) => {
      return parseInt(b.children[1].children[2].innerHTML, 10) - parseInt(a.children[1].children[2].innerHTML, 10)
    })
  } else if (sign === 'По наименованию') {
    produceArray.sort((a, b) => {
      if (b.children[1].children[0].innerHTML > a.children[1].children[0].innerHTML) {
        return -1;
      }
    })
  } else {
    produceArray.sort((a, b) => {
      console.log(b)
     if (b.id < a.id) {
       return -1;
     }
  })
  }
  productList.remove();

  const newProductList = document.createElement('div');
  newProductList.className = 'productList';
  produceArray.forEach(item => {
    newProductList.append(item);
  })

  document.querySelector('.products').append(newProductList);
}

const validateInput = e => {
  const { value } = e.target;
  if (!value) {
    e.target.classList.add('error');
    e.target.parentElement.children[2].classList.add('commentError');
    checkAll();
    return true;
  }

  if (value) {
    if ( e.target.id === 'url' && !regUrl.test(value)) {
      e.target.classList.add('error');
      return;
    } else if ( e.target.id === 'price' && !regPrice.test(value)) {
      e.target.classList.add('error');
      return
    } else if (e.target.classList.contains('error')) {
      e.target.classList.remove('error');
      e.target.parentElement.children[2].classList.remove('commentError');
      checkAll();
    }
  }
  checkAll()
  return false;
}

document.addEventListener('DOMContentLoaded',  () => startApp())