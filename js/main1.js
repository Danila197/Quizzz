//--Ждем загрузку Дом-дерева
document.addEventListener('DOMContentLoaded', function () {
  //--Используем строгий режим разработки
  'use strict';

  //***********************************
  //*            Переменные           *
  //***********************************
  
  //---Находим элемент оверлей
  const overlay = document.querySelector('.overlay');
  //---Находим элемент квиз
  const quiz = document.querySelector('.quiz');
  //---Находим кнопку запускающую квиз
  const passTestButton = document.querySelector('.pass-test__button');
  //---Находим форму
  const form = document.querySelector('.quiz-body__form');
   //---Находим все fieldset в форме
  const fieldsetItems = form.querySelectorAll('fieldset');
  //---Находим все кнопочки "далее" в квизе
  const btnsNext = form.querySelectorAll('.form-button__btn-next');
  //---Находим все кнопочки "назад" в квизе
  const btnsPrev = form.querySelectorAll('.form-button__btn-prev');
  //---Создаем объект в который будем сливать все выбранные ответы и заполненность с формы заказа
  const answersObj = {
    step0: {
      question: '',
      answers: []
    },
    step1: {
      question: '',
      answers: []
    },
    step2: {
      question: '',
      answers: []
    },
    step3: {
      question: '',
      answers: []
    },
    step4: {
      name: '',
      phone: '',
      email: '',
      call: '',
    },
  }

  //---Переберем все кнопочки "далее" в квизе
  btnsNext.forEach((btn, btnIndex) => {
    //---и будем все их "слушать"
    btn.addEventListener('click', (event) => {
      //---Убираем стандартный обработчик события браузера при нажатии на кнопку
      event.preventDefault();
      //---ПРи нажатии на кнопочку скрываем текущий fieldset и открываем следующий
      fieldsetItems[btnIndex].style.display = 'none';
      fieldsetItems[btnIndex + 1].style.display = 'block';
    });

    btn.disabled = true

  });

  //---Переберем все кнопочки "назад" в квизе
  btnsPrev.forEach((btn, btnIndex) => {
    //---и будем все их "слушать"
    btn.addEventListener('click', (event) => {
      //---Убираем стандартный обработчик события браузера при нажатии на кнопку
      event.preventDefault();
      //---ПРи нажатии на кнопочку скрываем текущий fieldset и открываем предыдущий
      fieldsetItems[btnIndex + 1].style.display = 'none';
      fieldsetItems[btnIndex].style.display = 'block';
    })
  })

  // for (let i = 0; i < btnsPrev.length; i++){
  //   btnsPrev[i].addEventListener('click', (event) => {
  //     event.preventDefault();
  //     fieldsetItems[i + 1].style.display = 'none';
  //     fieldsetItems[i].style.display = 'block';
  //   })
  // }

  //---Переберем все fieldset и выставим первый экран квиза Item- элемент дом дерева, Index - номер элемента дом дерева
  fieldsetItems.forEach((fieldsetItem, fieldsetItemIndex) => {
    

    //---Если номер элемента fieldset первый
    if (fieldsetItemIndex === 0) {
      //---то открываем его
      fieldsetItem.style.display = 'block'
    } else {
      //---Скроем все остальные fieldset
      fieldsetItem.style.display = 'none'
    }

      //---Если номер элемента fieldset не последний
    if (fieldsetItemIndex !== fieldsetItems.length - 1) {
      //---Находим все input в fieldset
      const inputs = fieldsetItem.querySelectorAll('input');
      //---Находим все заголовки в fieldset
      const itemTitle = fieldsetItem.querySelector('.form__title');
      //---И заносим это в наш объект
      answersObj[`step${fieldsetItemIndex}`].question = itemTitle.textContent;
      //---И переберем их
      inputs.forEach(input => {
        //---Получим родителя 
        const parent = input.parentNode;
        //-- и удалим активный класс у него, если он есть, а так же сбросим выбранные чекбоксы
        input.checked = false;
        parent.classList.remove('active-radio');
        parent.classList.remove('active-checkbox');
      });
    }

    //---Выбор радио и чекбокс
    fieldsetItem.addEventListener('change', (event) => {
      const target = event.target;
      //---Находим все input в состоянии checked
      const inputsChecked = fieldsetItem.querySelectorAll('input:checked');

      if (fieldsetItemIndex !== fieldsetItems.length - 1) {
        answersObj[`step${fieldsetItemIndex}`].answers.length = 0;
        inputsChecked.forEach((inputChecked) => {
          answersObj[`step${fieldsetItemIndex}`].answers.push(inputChecked.value)
        })
        
        if (inputsChecked.length > 0) {
          //---Разблокируем кнопку далее, если что то выбрано
          btnsNext[fieldsetItemIndex].disabled = false
        } else {
          //---заблокируем кнопку далее, если что то выбрано
          btnsNext[fieldsetItemIndex].disabled = true
        }
        //---Находим все radio в fieldset c классом form__radio
        if (target.classList.contains('form__radio')) {
          //---Находим все radio кнопки в fieldset
          const radios = fieldsetItem.querySelectorAll('.form__radio')
          //---И переберем их
          radios.forEach(input => {
            //---И если выбрали, то вешаем активный класс на данную кнопку
            if (input === target) {
              input.parentNode.classList.add('active-radio');
            } else {
              input.parentNode.classList.remove('active-radio');
            }
          })
          //---Находим все check в fieldset c классом form__input
        } else if (target.classList.contains('form__input')) {
          target.parentNode.classList.toggle('active-checkbox')
        } else {
          return
        }
      }
    })

  })

  const sendForm = () => {
    const lastFieldset = fieldsetItems[fieldsetItems.length - 1]
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      answersObj.step4.name = document.getElementById('quiz-name').value
      answersObj.step4.phone = document.getElementById('quiz-phone').value
      answersObj.step4.email = document.getElementById('quiz-email').value
      answersObj.step4.call = document.getElementById('quiz-call').value

      // for (let key in answersObj.step4) {
      //   if (answersObj.step4[key].value === "") {
      //     alert("Введите данные во все поля");
      //   }
      // }


      if (document.getElementById('quiz-policy').checked === true) {
        postData(answersObj).then((res) => res.json()).then((res) => {
          if (res["status"] === 'ok') {
            overlay.style.display = 'none';
            quiz.style.display = 'none';
            form.reset();
            alert(res["message"])
          } else if (res["status"] === 'error') {
            alert(res["message"])
          }
        });
      } else {
        alert('Дайте согласие на обработку персональных данных')
      }

    });
  }

  

  //--Функция отправки
  const postData = (body) => {
    return fetch('./server.php', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify(body),
    })
  }




  //---Меняем стили элементов оверлей и квиз. Скрываем квиз и оверлей
  overlay.style.display = 'none';
  quiz.style.display = 'none';


  //***********************************
  //*            События              *
  //***********************************
  //---Ловим клик по нашей кнопке запуска квиза
  passTestButton.addEventListener('click', () => {
    fieldsetItems.forEach((formItem, ))
    //---Меняем стили элементов оверлей и квиз. Показываем квиз и оверлей
    overlay.style.display = 'block';
    quiz.style.display = 'block';
  })
  sendForm()
});