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

    $(document).ready(function() {
        $('.clocks').append(`
        <div class="relogio">
            <h2 class="localizacao">Horário de ${local}</h2>
            
            <div class="clock">
                <div class="hand seconds ${normalizeString(local)}"></div>
                <div class="hand minutes ${normalizeString(local)}"></div>
                <div class="hand hour ${normalizeString(local)}"></div>
    
                ${clockNums()}
    
                ${clockMarks()}

            </div>
            
            <div class="digitalClock">
                <span id="hours${normalizeString(local)}">00</span>
                <span>:</span>
                <span id="minutes${normalizeString(local)}">00</span>
                <span>:</span>
                <span id="seconds${normalizeString(local)}">00</span>
                <span id="session${normalizeString(local)}">AM</span>
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

            if( hrs > 24 )
                hrs = hrs - 24;

            if( hrs < 0 )
                hrs = hrs + 24;

            if(hrs >= 12 && hrs <= 24)
                session.innerHTML = '&nbspPM'
            else
                session.innerHTML = '&nbspAM'

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