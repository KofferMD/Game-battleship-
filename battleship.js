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
            locations: ["06", "16", "26"],
            hits: ["", "", ""]
        },
        {
            locations: ["24", "34", "44"],
            hits: ["", "", ""]
        },
        {
            locations: ["10", "11", "12"],
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
    }

};

var controller = {
    guesses: 0,

    processGuess: function (guess) {
        var location = parseGuess(guess);
        //массив с буквами
        var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
        //проверка введенных данных
        if (guess === null || guess.length !== 2) {
            alert("Enter a letter and a number on the board.");
        } else {
            //Извлекаем первый символ из строки
            firstChar = guess.chartAt(0);
            //При помощи метода получаем цифру от 0 до 6
            var row = alphabet.indexOf(firstChar);
            //Добавляется код для второго символа
            var column = guess.chartAt(1);
            if (isNaN(row) || isNaN(column)) {
                alert("Oops, that isn't on the board");
            } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
                alert("Oops, that's off the board");
            } else {
                //Здесь все проверки пройдены поэтому метод может вернуть результат
                return row + column;
            }
        }
        //Если управление передано в эту точку, значит, какая-то проверка не прошла
        return null;
    }
};