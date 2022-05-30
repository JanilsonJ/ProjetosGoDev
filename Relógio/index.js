/* Função responsavel por colocar os horarios de 1 a 12 no relógio*/
function clockNums(){
    var nums = '';
    
    for (let i = 1; i <= 12; i++) {
        nums += `
<div class="number number-${i}">
    <div class="rotacao-${i}">${i}</div>
</div>`
    }

    return nums;
}

/* Função responsavel por colocar os marcadoes de segundos no relógio */
function clockMarks(){
    var nums = '';
    
    for (let i = 1; i <= 60; i++) {
        if (i % 5 === 0 )
            nums += `<div class="marcadores marcadores-${i}">&#10074;</div>`
        else
            nums += `<div class="marcadores marcadores-${i}">|</div>`
    }

    return nums;
}

/* Função responsavel por normalizar strings*/
function normalizeString(str){
    str = str.replace(' ', '').toLowerCase();
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/* Função responsavel por criar um novo relógio*/
const locais = new Array();;
function newClock(local){
    locais.push(local);
    const normalizeLocale = normalizeString(local)

    $(document).ready(function() {
        $('.clocks').append(`
            <div class="relogio">
                <div class="clock">
                    <div class="insideClock">
                        <h2>${local}</h2>
                        <div class="digitalClock">
                            <span id="hours${normalizeLocale}">00</span>
                            <span>:</span>
                            <span id="minutes${normalizeLocale}">00</span>
                            <span>:</span>
                            <span id="seconds${normalizeLocale}">00</span>
                            <span id="session${normalizeLocale}">AM</span>
                        </div>
                    </div>
                    
                    
                    <div class="hand seconds ${normalizeLocale}"></div>
                    <div class="hand minutes ${normalizeLocale}"></div>
                    <div class="hand hour ${normalizeLocale}"></div>
        
                    ${clockNums()}
        
                    ${clockMarks()}
                </div>
            </div>`
        );
    });    
}

const setRotation = (element, rotationPercentage) => {
    element.style.setProperty("--rotation", rotationPercentage * 360);
}

/* Manipulação do relogio de Londres e Brasília*/
function pointerManipulation(local, fuso = 0){
    $(document).ready(function() {
        /* Relógio Analógico */
        const hourHand = document.querySelector(`.hand.hour.${normalizeString(local)}`);
        const minutesHand = document.querySelector(`.hand.minutes.${normalizeString(local)}`);
        const secondsHand = document.querySelector(`.hand.seconds.${normalizeString(local)}`);
        
        
        const setClock = () => {
            const currentDate = new Date();
        
            const secondsPercentage = currentDate.getSeconds() / 60;
            const minutesPercentage = (secondsPercentage + currentDate.getMinutes()) / 60;
            const hoursPercentage = (minutesPercentage + currentDate.getHours() + fuso) / 12;
        
            setRotation(secondsHand, secondsPercentage);
            setRotation(minutesHand, minutesPercentage);
            setRotation(hourHand, hoursPercentage);

            /* Relógio Digital */
            var hrs = currentDate.getHours() + fuso;
            var min = currentDate.getMinutes();
            var sec = currentDate.getSeconds();
            var session = document.getElementById(`session${normalizeString(local)}`);

            if( hrs > 24 ) hrs = hrs - 24;

            if( hrs < 0 ) hrs = hrs + 24;

            if(hrs >= 12 && hrs <= 24)
                session.innerHTML = '&nbspPM'
            else
                session.innerHTML = '&nbspAM'

            if (hrs < 10 ) hrs = '0' + hrs;
            if (min < 10 ) min = '0' + min;
            if (sec < 10 ) sec = '0' + sec;

            document.getElementById(`hours${normalizeString(local)}`).innerHTML = hrs;
            document.getElementById(`minutes${normalizeString(local)}`).innerHTML = min;
            document.getElementById(`seconds${normalizeString(local)}`).innerHTML = sec;
        }
        
        setClock();
        
        setInterval(setClock, 10);
    });
}

/* Criação dos relógios de Londres e Brasília*/
newClock('Brasília');
newClock('Londres');
newClock('Nova York');
newClock('Tóquio');

/* Altualizar o relógio */
pointerManipulation('Brasília');
pointerManipulation('Londres', 4);
pointerManipulation('Nova York', -1);
pointerManipulation('Tóquio', 12);