$(document).ready(function () {
  console.log('conected');
  // document.querySelectorAll('.card')
  let getCard = document.getElementsByClassName('product');
  console.log(getCard);
  
  for (let i = 0; i < getCard.length; i++) {
    const element = getCard[i];
    element.addEventListener('mouseenter', () => {
      element.classList.add('hover')
    });

    element.addEventListener('mouseleave', () => {
      element.classList.remove('hover')
    });
    
  }
  
});
