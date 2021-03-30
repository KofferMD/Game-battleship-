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


var model = {
    boardSize: 7, //Длинна игрового поля
    numShips: 3, //Кол-во кораблей
    shipLength: 3, // Длинна корабля
    shipSunk: 0, // Кол-во потопленных кораблей
    //ships соддержит массив объектов ship, 
    ships: [{
            locations: [0, 0, 0],
            hits: ["", "", ""]
        },
        {
            locations: [0, 0, 0],
            hits: ["", "", ""]
        },
        {
            locations: [0, 0, 0],
            hits: ["", "", ""]
        }
    ],
    //guess - координаты выстрела
    fire: function (guess) {
        //перебирает массив ships
        for (var i = 0; i < this.numShips; i++) {
            //Получаем объект ship
            var ship = this.ships[i];
            //Массив locations из объекта ship
            // locations = ship.locations;
            //Затем индекс клетки в locations
            // var index = locations.indexOf(guess);
            //СЦЕПЛЕНИЕ
            var index = ship.locations.indexOf(guess);

            if (index >= 0) {
                ship.hits[index] = "hit";
                //Оповещение о том, что в клетке guess следует вывести маркуер попадания
                view.displayHit(guess);
                //Выводим сообщение
                view.displayMessage("HIT!");
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my buttleship!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false;
    },
    //метод с именем isSunk получает объект корабля и возвращает true 
    //если корабль потоплен, иначе false
    isSunk: function (ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== 'hit') {
                return false; //если есть хотя бы одна клетка, в которую еще не попал, то корабль еще жив
            }
        }
        return true;
    },

    generateShipLocations: function () {
        var locations;
        //Для каждого корабля генерируется набор позиций
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip(); //генерируем новый набор позиций
            } while (this.collision(locations)); //и проверяем, перекрываются ли они с сущ-ми кораблями
            //полученные позиции без перекрываний сохраняются в свойстве locations
            this.ships[i].locations = locations;
        }
    },

    generateShip: function () {
        var direction = Math.floor(Math.random() * 2);
        var row, col;
        //Если он равен 1, создается горизонтальный, иначе вертикальный
        if (direction === 1) {
            //генерирует начальную позицию корабля
            row = Math.floor(Math.random() * this.boardSize);
            //При выборе первого стобца нужно оставить место для 2х других клеток.
            //Поэтому мы уменьшаем размер доски(7) на 3, чтобы начальный столбец всегда лежал
            // в диапазоне от 4 до boardSize
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                //row - данные состоят из строки(начальной, вычисленной выше)
                //(col +i) - скобки гарантируют что значение i будет прибавленно к col ДО преобразования результатовв строку
                //и столбца + i. При первой итерации i равно 0 и сумма обозначает первый столбец
                // При второй итерации происходит переход к следующему столбцу, а при третьей - к следущему 
                // Так в массиве генерируются серии элементов 01 02 03
                newShipLocations.push(row + "" + (col + i)); // знак + выполняет конкатенацию
            } else {
                //Для вертикального 31 41 51 
                newShipLocations.push((row + i) + "" + col);
            }
            //Заполнив массив позициями нового кораблся, мы возвращаем его
            // вызывающему методу generateShipLocations
            return newShipLocations;
        }
    },

    //locations - массив позиций нового корабля, который мы собираемся разместить на игровом поле
    collision: function (locations) {
        for (var i = 0; i < this.numShips; i++) {
            // Для каждого корабля, уже находящиегося на поле
            var ship = this.ships[i];
            //...проверить, встречаются ли какая-лио из позиций массива locations 
            //нового корабля в массиве locations существующих кораблей 
            for (var j = 0; j < locations.length; j++) {
                //метод indexOf проверяет, прсутствует ли заданная позиция в массиве
                //Таким образом если полученный индекс больще или равно 0, мы знаем
                //что клетка уже занята, поэтому метод возвращает true
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }

};

var controller = {
    guesses: 0,

    processGuess: function (guess) {
        //метод parseGuess будет использоваться для проверки введенных данныхя
        var location = parseGuess(guess);
        if (location) {
            this.guesses++; // Игрок ввел правильные координаты, счетчик увеличивается
            var hit = model.fire(location);
            //Если кол-во потопленных кораблей равно кол-ву кораблей в игре
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all mybattleship, in " + this.guesses + " guesses");
            }
        }
    }
};

function parseGuess(guess) {
    //массив с буквами
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    //проверка введенных данных
    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and anumber on the board.");
    } else {
        //Извлекаем первый символ из строки
        var firstChar = guess.charAt(0);
        //При помощи метода получаем цифру от 0 до 6
        var row = alphabet.indexOf(firstChar);
        //Добавляется код для второго символа
        var column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board.");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert("Oops, that's off the board!");
        } else {
            //Здесь все проверки пройдены поэтому метод может вернуть результат
            return row + column;
        }
    }
    //Если управление передано в эту точку, значит, какая-то проверка не прошла
    return null;
}
//Будет вызываться при каждом нажатии на кнопку Fire!
function handlerFireButton() {
    var guessInput = document.getElementById("guessInput");
    //Извлекаем данные введенные пользователем, координаты хранятся в свойсвтве value элемента input
    var guess = guessInput.value.toUppperCase();
    //Координаты выстрела передаются конроллеру 
    controller.processGuess(guess);
    //Удаляет содержимое элемента input формы, заменяя пустой строкой 
    guessInput.value = "";
}

function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    e = e || window.event;
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

function init() {
    //Получаем ссылку на кнопку
    var fireButton = document.getElementById("fireButton");
    //Назначем обработчик события
    fireButton.onclick = handlerFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}

window.onload = init;







// controller.processGuess("A0");

// controller.processGuess("A6");
// controller.processGuess("B6");
// controller.processGuess("C6");

// controller.processGuess("C4");
// controller.processGuess("D4");
// controller.processGuess("E4");

// controller.processGuess("B0");
// controller.processGuess("B1");
// controller.processGuess("B2");