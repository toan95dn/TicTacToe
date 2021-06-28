const boardModal = (() => {

    const chessboard = new Array(9);

    const getIndexOfTile = (x, y) => { return y + x * 3; }

    //return tie, untie, or continue the game
    const checkGameStatus = () => {

        //check row
        for (let x = 0; x < 3; x++) {
            if (chessboard[getIndexOfTile(x, 0)] === chessboard[getIndexOfTile(x, 1)]
                && chessboard[getIndexOfTile(x, 1)] === chessboard[getIndexOfTile(x, 2)]
                && chessboard[getIndexOfTile(x, 0)] !== '') {
                return 'untie';
            }
        }
        //check col
        for (let y = 0; y < 3; y++) {
            if (chessboard[getIndexOfTile(0, y)] === chessboard[getIndexOfTile(1, y)]
                && chessboard[getIndexOfTile(1, y)] === chessboard[getIndexOfTile(2, y)]
                && chessboard[getIndexOfTile(0, y)] !== '') {
                return 'untie';
            }
        }
        //check diagnoal
        if (chessboard[getIndexOfTile(0, 0)] === chessboard[getIndexOfTile(1, 1)]
            && chessboard[getIndexOfTile(1, 1)] === chessboard[getIndexOfTile(2, 2)]
            && chessboard[getIndexOfTile(0, 0)] !== '') {
            return 'untie';
        }
        if (chessboard[getIndexOfTile(0, 2)] === chessboard[getIndexOfTile(1, 1)]
            && chessboard[getIndexOfTile(1, 1)] == chessboard[getIndexOfTile(2, 0)]
            && chessboard[getIndexOfTile(0, 2)] !== '') {
            return 'untie';
        }
        //Check if the board is full
        if (isTheBoardFull()) {
            return 'tie';
        }

        return 'continue';
    }

    const fillTitleAt = (index, value) => {
        if (chessboard[index] === '') {
            chessboard[index] = value;
            return true;
        }
        return false;
    }

    const resetBoardModal = () => {
        for (let row = 0; row < 3; row++) {
            for (col = 0; col < 3; col++) {
                chessboard[getIndexOfTile(row, col)] = '';
            }
        }
    }

    const isTheBoardFull = () => {
        for (let i = 0; i < 9; i++) {
            if (chessboard[i] === '') {
                return false;
            }
        }
        return true;
    }

    const getboard = () => chessboard;//REMEMBER TO REMOVE THIS

    //setters
    const setValueOfTitle = (index, value) => { chessboard[index] = value; }

    //getters
    const getAClearTitleIndex = () => {
        let clearTitles = [];
        for (let row = 0; row < 3; row++) {
            for (col = 0; col < 3; col++) {
                let currTile = chessboard[getIndexOfTile(row, col)];
                if (currTile === '') {
                    clearTitles.push(getIndexOfTile(row, col));
                }
            }
        }

        return clearTitles[Math.floor(Math.random() * clearTitles.length)];
    }

    return { checkGameStatus, setValueOfTitle, getboard, fillTitleAt, resetBoardModal, getAClearTitleIndex };

})();


const boardView = (() => {


    const setView = (title, value) => {
        title.firstChild.innerText = value;
    }

    const getTitleAtIndex = (index) => {
        let allTitles = document.querySelectorAll('.title');
        return allTitles[index];
    }

    return { setView, getTitleAtIndex };
})()

const controller = (() => {
    let first_Player = 'radio_button_unchecked'; //use google icons
    let second_Player = 'clear'; //use google icons
    let currPlayer = first_Player;
    let Mode_PvP = 'Mode_PvP';
    let Mode_PvC = 'Mode_PvC';
    let currMode = Mode_PvP;

    boardModal.resetBoardModal();


    (function addEventListernersForallTitle() {
        let allTitles = document.querySelectorAll('.title');
        allTitles.forEach((title) => {
            title.addEventListener('click', () => {

                if (boardModal.fillTitleAt(parseInt(title.dataset.indexNum), currPlayer)) {
                    boardView.setView(title, currPlayer);
                    if (boardModal.checkGameStatus() === 'untie') {
                        showWinner(currPlayer);
                    }
                    changeTurn();
                }

                if (currMode === Mode_PvC && currPlayer === second_Player) {
                    let pickTitleIndex = boardModal.getAClearTitleIndex(); //Will check pick title smart depends on
                    boardModal.fillTitleAt(pickTitleIndex);
                    boardView.setView(boardView.getTitleAtIndex(pickTitleIndex), currPlayer);
                    if (boardModal.checkGameStatus() === 'untie') {
                        showWinner(currPlayer);
                    }
                    changeTurn();
                }

            })
        })
    })()

    function changeTurn() {
        currPlayer = currPlayer === first_Player ? second_Player : first_Player;
    }

    function showWinner(winner) {
        if (winner === first_Player) {

        }
        else {

        }
        let popup = document.querySelector('#popup');
        popup.style.visibility = 'visible';
    }
})()