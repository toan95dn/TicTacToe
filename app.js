const boardModal = (() => {

    const chessboard = new Array(9);

    const getIndexOfTile = (x, y) => { return y + x * 3; }

    //return tie, untie, or continue the game
    const checkGameStatus = (currPlayer) => {

        //check row
        for (let x = 0; x < 3; x++) {
            if (chessboard[getIndexOfTile(x, 0)] !== '' &&
                chessboard[getIndexOfTile(x, 0)] === chessboard[getIndexOfTile(x, 1)]
                && chessboard[getIndexOfTile(x, 1)] === chessboard[getIndexOfTile(x, 2)]) {
                return currPlayer;
            }
        }
        //check col
        for (let y = 0; y < 3; y++) {
            if (chessboard[getIndexOfTile(0, y)] !== '' &&
                chessboard[getIndexOfTile(0, y)] === chessboard[getIndexOfTile(1, y)]
                && chessboard[getIndexOfTile(1, y)] === chessboard[getIndexOfTile(2, y)]) {
                return currPlayer;
            }
        }
        //check diagnoal
        if (chessboard[getIndexOfTile(0, 0)] !== '' &&
            chessboard[getIndexOfTile(0, 0)] === chessboard[getIndexOfTile(1, 1)]
            && chessboard[getIndexOfTile(1, 1)] === chessboard[getIndexOfTile(2, 2)]) {
            return currPlayer;
        }
        if (chessboard[getIndexOfTile(0, 2)] !== '' &&
            chessboard[getIndexOfTile(0, 2)] === chessboard[getIndexOfTile(1, 1)]
            && chessboard[getIndexOfTile(1, 1)] == chessboard[getIndexOfTile(2, 0)]) {
            return currPlayer;
        }
        //Check if the board is full
        if (isTheBoardFull()) {
            return 'tie';
        }

        return 'continue';
    }

    const fillTitleAt = (index, value) => {
        if (chessboard[index] !== 'X' && chessboard[index] !== 'O') {
            chessboard[index] = value;
            return true;
        }
        return false;
    }

    const resetBoardModal = () => {
        for (let i = 0; i < chessboard.length; i++) {
            chessboard[i] = '';
        }
    }

    const isTheBoardFull = () => {
        for (let i = 0; i < 9; i++) {
            if (chessboard[i] !== 'X' && chessboard[i] !== 'Y') {
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
        let clearTitles = _getClearIndexes();
        return clearTitles[Math.floor(Math.random() * clearTitles.length)];
    }

    const _getClearIndexes = () => {
        let clearIndexes = [];
        for (let i = 0; i < chessboard.length; i++) {
            if (chessboard[i] === '') {
                clearIndexes.push(i);
            }
        }
        return clearIndexes;
    }

    //
    const getBestMove = () => {
        let bestScore = Number.NEGATIVE_INFINITY;
        let bestIndexToMove;
        let clearIndexes = _getClearIndexes();

        clearIndexes.forEach(index => {
            chessboard[i] = 'O';
            currScore = minimax(chessboard, 0, false);
            if (currScore > bestScore) {
                bestScore = currScore;
                bestIndexToMove = index;
            }
            chessboard[i] = '';
        })



        for (let i = 0; i < chessboard.length; i++) {
            if (chessboard[i] !== 'X' && chessboard[i] !== 'O') {
                chessboard[i] = 'O'; //O is for AI
                currScore = minimax(chessboard, 0, false);
                if (currScore > bestScore) {
                    currScore = bestScore;
                    bestIndexToMove = i;
                }
                chessboard[i] = '';
            }
        }
        return bestIndexToMove;
    }

    const minimax = (board, depth, isMaximizingPlayer) => {

        let currGameStatus = checkGameStatus();
        if (currGameStatus !== 'continue') {
            if (currGameStatus === 'tie') {
                return 0;
            }
            else {
                return checkGameStatus === 'O' ? 100 : -100;
            }
        }

        let clearIndexes = _getClearIndexes();

        if (isMaximizingPlayer) {
            let maxScore = Number.NEGATIVE_INFINITY;
            clearIndexes.forEach(index => {
                currScore = minimax(board, depth, false);
                maxScore = Math.max(currScore, maxScore);
                board[index] = '';
            });
            return maxScore;
        }
        else {
            let minScore = Number.POSITIVE_INFINITY;
            clearIndexes.forEach(index => {
                currScore = minimax(board, depth, false);
                maxScore = Math.min(currScore, maxScore);
                board[index] = '';
            });
            return minScore;
        }
    }
    return { checkGameStatus, setValueOfTitle, getboard, fillTitleAt, resetBoardModal, getAClearTitleIndex };

})();


const boardView = (() => {


    const setView = (title, value) => {
        title.firstChild.innerText = value;
    }

    const getTitleViewAtIndex = (index) => {
        let allTitles = document.querySelectorAll('.title');
        return allTitles[index];
    }

    return { setView, getTitleViewAtIndex };
})()

const controller = (() => {
    let first_Player = 'X';
    let second_Player = 'O';
    let currPlayer = first_Player;
    let Mode_PvP = 'Mode_PvP';
    let Mode_PvC = 'Mode_PvC';
    let currMode = Mode_PvC;

    boardModal.resetBoardModal();


    (function addEventListernersForallTitle() {
        let allTitles = document.querySelectorAll('.title');
        allTitles.forEach((title) => {
            title.addEventListener('click', () => {

                if (boardModal.fillTitleAt(parseInt(title.dataset.indexNum), currPlayer)) {
                    boardView.setView(title, currPlayer);
                    if (boardModal.checkGameStatus(currPlayer) === currPlayer) {
                        showWinner(currPlayer);
                    }
                    changeTurn();
                }

                if (currMode === Mode_PvC && currPlayer === second_Player) {
                    let pickTitleIndex = boardModal.getAClearTitleIndex(); //Will check pick title smart depends on
                    console.log(pickTitleIndex);
                    if (pickTitleIndex) {
                        boardModal.fillTitleAt(pickTitleIndex, second_Player);
                        boardView.setView(boardView.getTitleViewAtIndex(pickTitleIndex), currPlayer);
                        if (boardModal.checkGameStatus() === currPlayer) {
                            showWinner(currPlayer);
                        }
                        changeTurn();
                    }
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