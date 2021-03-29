// var randomLoc = Math.floor(Math.random() * 5);
// var location1 = randomLoc;
// var location2 = location1 + 1;
// var location3 = location2 + 1;

// var guess;
// var hits = 0;
// var guesses = 0;
// var isSunk = false;

// while (isSunk != true) {
//     guess = prompt("Ready, aim, fire! (enter a number 0-6):");

//     if (guess < 0 || guess > 6) {
//         alert("Please enter a valid cell number!");
//     } else {
//         guesses = guesses + 1;
//     }

//     if (guess == location1 || guess == location2 || guess == location3) {
//         hits = hits + 1;
//         alert("HIT!");

//         if (hits == 3) {
//             isSunk = true;
//             alert("You sank my battleship!");
//         }

//     } else {
//         alert("MISS!");
//     }


// }
// var stats = "You took " + guesses + " guesses to sink the battleship, " + "which means your shooting accuracy was " + (3 / guesses);
// alert(stats);

var view = {
    // Задает свойству innerHTML сообщение переданное методу
    displayMessage: function (msg) {
        //Получаем id
        var messageArea = document.getElementById('messageArea');
        //обновляем текст элемента MessageArea 
        messageArea.innerHTML = msg;
    },

    displayHit: function (location) {
        //id созданный по введенным пользователем координатам
        var cell = document.getElementById(location);
        //Элементу задаем класс hit
        cell.setAttribute("class", "hit");
    },

    displayMiss: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

view.displayMessage("BOOM BOOM, motherf*cker!")
view.displayMiss("00");
view.displayHit("34");
view.displayMiss("55");
view.displayHit("12");
view.displayMiss("25");
view.displayHit("26");