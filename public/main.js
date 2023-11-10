// setting variables globally so functions have access
let rightNow = new Date();

// used for fetch request
let dateVal = new Date();
let dateParam = $.datepicker.formatDate( "yy-mm-dd", dateVal);
let departParam;
let arrivalParam;

// count for scheduled ferry sailings
let timesCount;

// for checkTime() and addFerryTime()
let timePassed = false;

// where ferry times are rendered
const ferryTimes = document.getElementById('ferry-times');

// to view the current date
console.log(`The current date is ${dateVal}`);
// console.log(`The time is ${rightNow.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`);

// drop down selection
// const terminalsList = document.getElementById('routes-list');
// terminalsList.addEventListener('change', function() {
//     renderSchedule(this.value);
// });

// HTML date picker
// const datePicker = document.getElementById('date-picker');
// datePicker.addEventListener('change', function() {
//     dateParam = this.value;
//     console.log(this.value);
// });
$("#date-picker").val($.datepicker.formatDate( "mm/dd/yy", rightNow));

$("#date-picker").datepicker({
    onSelect: function() {
        dateVal = $(this).datepicker('getDate');
        dateParam = $.datepicker.formatDate( "yy-mm-dd", dateVal)
        console.log(dateParam);
    },
});

$("#routes-menu").selectmenu();
$("#routes-menu").on('selectmenuchange', function() {
    // console.log($("#routes-menu").val())
    renderSchedule($("#routes-menu").val())
});

// terminal ID's:
// fetch(`/api/terminals/${dateParam}`)
// .then(response => response.json())
// .then(data => console.log(data));

function renderSchedule(terminals) {
    console.log(terminals);
    switch(terminals) {
        case 'Bainbridge to Seattle':
            fetchFerries(3, 7);
            break;
        case 'Bremerton to Seattle':
            fetchFerries(4, 7);
            break;
        case 'Edmonds to Kingston':
            fetchFerries(8, 12);
            break;
        case 'Fauntleroy to Southworth':
            fetchFerries(9, 20);
            break;
        case 'Kingston to Edmonds':
            fetchFerries(12, 8);
            break;
        case 'Seattle to Bainbridge':
            fetchFerries(7, 3);
            break;
        case 'Seattle to Bremerton':
            fetchFerries(7, 4);
            break;
        case 'Southworth to Fauntleroy':
            fetchFerries(20, 9);
            break;
    }
}

function fetchFerries(departingID, arrivingID) {
    timesCount = 0;
    fetch(`/api/${dateParam}/${departingID}/${arrivingID}`)
    .then(response => response.json())
    .then(data => {
        dateParam = dateVal.toLocaleDateString('en-us', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});
        const message = `${dateParam} \n${data.TerminalCombos[0].DepartingTerminalName} -> ${data.TerminalCombos[0].ArrivingTerminalName}`;
        renderDate(message);
        console.log(data);
        // console.log(data.TerminalCombos[0].Times);
        // reset #ferry-times
        ferryTimes.classList.remove('hidden');
        ferryTimes.innerHTML = '';
        $("#main-header").removeClass('hidden');
        $("#ferry-friend-logo").removeClass('hidden');
        for (let i = 0; i < data.TerminalCombos[0].Times.length; i++) {
            const arrString = data.TerminalCombos[0].Times[i].DepartingTime;
            // console.log(arrString);
            const replString = arrString.replaceAll(/[^-0-9]+/g, '');
            console.log('replString: ' + replString);
            const unixString = new Date(parseInt(replString));
            const sailingTime = unixString.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            checkTime(unixString);
            addFerryTime(sailingTime);
            timesCount++;
        }
        console.log(`timesCount is ${timesCount}`)
        if (timesCount >= 12) {
            ferryTimes.classList.add('col2')
        } else {
            ferryTimes.classList.remove('col2')
        }
    });
}

function renderDate(text) {
    const dateRender = document.getElementById('date-render');
    dateRender.classList.remove('hidden');
    dateRender.innerText = text;
}

function addFerryTime(time) {
    const newFerryTime = document.createElement('li');
    // if timePassed true then add class to make it strikethrough
    if (timePassed) {
        // console.log('It is passed this scheduled sailing.');
        newFerryTime.innerHTML = `<i>${time}</i>`;
        timePassed = false;
    } else {
        newFerryTime.innerText = time;
    }
    ferryTimes.appendChild(newFerryTime);
}

function checkTime(schedTime) {
    // console.log(`schedTime.getHours(): ${schedTime.getHours()}`);
    // console.log(`schedTime.getMinutes(): ${schedTime.getMinutes()}`);
    // console.log(`rightNow.getHours(): ${rightNow.getHours()}`);
    // console.log(`rightNowgetMinutes(): ${rightNow.getMinutes()}`);
    if ((schedTime.getHours() > 2) && ((rightNow.getHours() > schedTime.getHours()) || (rightNow.getHours() == schedTime.getHours() && rightNow.getMinutes() >= schedTime.getMinutes()))) {
        timePassed = true;
    }
}
