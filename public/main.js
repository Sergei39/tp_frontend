console.log('hello');
// alert лучше не использовать
// alert блокирует исполнение кода после него

// события (~200) https://developer.mozilla.org/en-US/docs/Web/Events
// слушатели https://developer.mozilla.org/ru/docs/Web/API/EventTarget/addEventListener
// три фазы обработки события
//  -стадия перехвата. События сначала идут сверху вниз
//  -стадия цели. События достигло целевого элемента
//  -стадия всплытия. Событие начинает всплывать

import {createBack} from './utils/back.js'
import {BoardComponent} from './components/Board/Board.js'
const HttpModule = window.HttpModule;
const application = document.getElementById('app')

const config = {
    menu: {
        href: '/menu',
        text: 'Меню',
        open: menuPage,
    },
    signup: {
        href: '/signup',
        text: 'Зарегистрироваться',
        open: signupPage,
    },
    login: {
        href: '/login',
        text: 'Авторизоваться',
        open: loginPage
    },
    profile: {
        href: '/profile',
        text: 'Профиль',
        open: profilePage
    },
    leaders: {
        href: '/leaders',
        text: 'Рейтинг',
        open: leaderboardPage,
    }
}

function leaderboardPage (users) {
    application.innerHTML = '';

    const leaderboardSection = document.createElement('section');
    leaderboardSection.dataset.sectionName = 'leaderboard';

    const header = document.createElement('h1');
    header.textContent = 'Рейтинг';

    const back = createBack();

    leaderboardSection.appendChild(header);
    leaderboardSection.appendChild(document.createElement('br'));

    if (users) {
        const Board = new BoardComponent({
            parent: leaderboardSection,
            data: users,
        });
        Board.render();
    } else {
        const em = document.createElement('em');
        em.textContent = 'Loading';
        leaderboardSection.appendChild(em);

        HttpModule.get({
            url: '/users',
            callback: function (_, response) {
                const users = JSON.parse(response);
                leaderboardPage(users);
            },
        })
    }

    leaderboardSection.appendChild(document.createElement('br'));
    leaderboardSection.appendChild(back);
    application.appendChild(leaderboardSection);
}


function menuPage() {
    application.innerHTML = '';

    // TODO диструктуризация почитать
    Object
        .entries(config)
        .map(([menuKey, {text, href}]) => { 
            const menuItem = document.createElement('a');
            menuItem.href = href;
            menuItem.textContent = text;
            menuItem.dataset.section = menuKey;

            return menuItem;
        })
        .forEach(element => application.appendChild(element))
    ;
}

function signupPage() {
    application.innerHTML = '<h1>Регистрация!<h1>';

    const form = document.createElement('form');

    const emailInput = createInput('email', 'Емайл', 'email');
    const passwordInput = createInput('password', 'Пароль', 'password');
    const ageInput = createInput('number', 'Возраст', 'age');

    const submitBtn = document.createElement('input');
    submitBtn.type = 'submit';
    submitBtn.value = 'Зарегистрироваться';

    const back = createBack();

    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(ageInput);
    form.appendChild(submitBtn);
    form.appendChild(back);

    application.appendChild(form);
}

function createInput(type, text, name) {
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.placeholder = text; // ???

    return input;
}

function loginPage() {
    application.innerHTML = '';
    const form = document.createElement('form');

    const emailInput = createInput('email', 'Емайл', 'email');
    const passwordInput = createInput('password', 'Пароль', 'password');

    const submitBtn = document.createElement('input');
    submitBtn.type = 'submit';
    submitBtn.value = 'Авторизоваться';

    const back = createBack();

    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(submitBtn);
    form.appendChild(back);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        HttpModule.post({
            url: '/login',
            body: {email, password},
            callback: (status, response) => {
                if (status === 200) {
                    profilePage();
                } else {
                    const {error} = JSON.parse(response);
                    alert(error);
                }
            },
        })
    });

    application.appendChild(form);
}

function profilePage() {
    application.innerHTML = '';

    HttpModule.get({
        url: '/me',
        callback: (status, responseText) => {
            let isAuthorized = false;
    
            if (status === 200) {
                isAuthorized = true;
            }
    
            if (status === 401) {
                isAuthorized = false;
            }
    
            if (isAuthorized) {
                const responseBody = JSON.parse(responseText);
    
                const span = document.createElement('span');
                span.innerHTML = `Мне ${responseBody.age} у меня ${responseBody.score} очков`;
            
                application.appendChild(span);
    
                const back = createBack();
    
                application.appendChild(back);
    
    
                const {images} = responseBody;
    
                if (images && Array.isArray(images)) {
                    const div = document.createElement('div');
                    application.appendChild(div);
    
                    images.forEach((imageSrc) => {
                        div.innerHTML += `<img src="${imageSrc}" width="600" />`;
                    });
                }
    
                return;
            }
    
                alert('НЕТ АВТОРИЗАЦИИ');
        
                loginPage();
        },
    });

}

menuPage();

application.addEventListener('click', e => {
    const {target} = e;

    if (target instanceof HTMLAnchorElement) {
        e.preventDefault()
        config[target.dataset.section].open();
    }
});
