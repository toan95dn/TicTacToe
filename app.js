const boardModal = (() => {

    const chessboard = new Array(9);

    const getIndexOfTile = (x, y) => { return x + y * 3; }

    //return tie, untie, or continue the game
    const checkGameStatus = () => {

        //check col
        for (let x = 0; x < 3; x++) {
            if (chessboard[getIndexOfTile(x, 0)] !== '' &&
                chessboard[getIndexOfTile(x, 0)] === chessboard[getIndexOfTile(x, 1)]
                && chessboard[getIndexOfTile(x, 1)] === chessboard[getIndexOfTile(x, 2)]) {
                return chessboard[getIndexOfTile(x, 0)];
            }
        }
        //check row
        for (let y = 0; y < 3; y++) {
            if (chessboard[getIndexOfTile(0, y)] !== '' &&
                chessboard[getIndexOfTile(0, y)] === chessboard[getIndexOfTile(1, y)]
                && chessboard[getIndexOfTile(1, y)] === chessboard[getIndexOfTile(2, y)]) {

                return chessboard[getIndexOfTile(0, y)];
            }
        }
        //check diagnoal
        if (chessboard[getIndexOfTile(0, 0)] !== '' &&
            chessboard[getIndexOfTile(0, 0)] === chessboard[getIndexOfTile(1, 1)]
            && chessboard[getIndexOfTile(1, 1)] === chessboard[getIndexOfTile(2, 2)]) {

            return chessboard[getIndexOfTile(1, 1)];
        }
        if (chessboard[getIndexOfTile(0, 2)] !== '' &&
            chessboard[getIndexOfTile(0, 2)] === chessboard[getIndexOfTile(1, 1)]
            && chessboard[getIndexOfTile(1, 1)] == chessboard[getIndexOfTile(2, 0)]) {

            return chessboard[getIndexOfTile(1, 1)];
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
        for (let i = 0; i < chessboard.length; i++) {
            chessboard[i] = '';
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
    const getBestIndexToMove = () => {
        let bestScore = -Infinity;
        let bestIndexToMove;

        for (let i = 0; i < chessboard.length; i++) {
            if (chessboard[i] === '') {
                chessboard[i] = 'O';
                let currScore = minimax(chessboard, 0, false);
                chessboard[i] = '';
                if (currScore > bestScore) {
                    bestScore = currScore;
                    bestIndexToMove = i;
                }
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
            else { return currGameStatus === 'O' ? 100 : -100; }
        }

        if (isMaximizingPlayer) {
            let maxScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let currScore = minimax(board, depth + 1, false);
                    maxScore = Math.max(currScore, maxScore);
                    board[i] = '';
                }
            }
            return maxScore;
        }
        else {
            let minScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let currScore = minimax(board, depth + 1, true);
                    minScore = Math.min(currScore, minScore);
                    board[i] = '';
                }
            }
            return minScore;
        }

    }



    return { checkGameStatus, getAClearTitleIndex, fillTitleAt, resetBoardModal, getAClearTitleIndex, getBestIndexToMove };

})();


const boardView = (() => {


    const setView = (title, value) => {
        title.innerText = value;
    }

    const getTitleViewAtIndex = (index) => {
        let allTitles = document.querySelectorAll('.title');
        return allTitles[index];
    }

    const resetBoardView = () => {
        let allTitleViews = document.querySelectorAll('.title');
        allTitleViews.forEach(
            (titleView) => {
                titleView.innerText = '';
            }
        )
    }

    return { setView, getTitleViewAtIndex, resetBoardView };
})()

const controller = (() => {
    let first_Player = 'X';
    let second_Player = 'O';
    let currPlayer = first_Player;
    let Mode_PvP = 'Mode_PvP';
    let Mode_PvC = 'Mode_PvC';
    let Mode_PvAI = 'Mode_PvAI';
    let currMode = Mode_PvAI;

    boardModal.resetBoardModal();


    (function addEventListernersForallTitle() {
        let allTitles = document.querySelectorAll('.title');
        allTitles.forEach((title) => {
            title.addEventListener('click', () => {

                if (boardModal.fillTitleAt(parseInt(title.dataset.indexNum), currPlayer)) {
                    boardView.setView(title, currPlayer);
                    if (boardModal.checkGameStatus() === currPlayer) {
                        showWinner(currPlayer);
                        return;
                    }
                    else if (boardModal.checkGameStatus() === 'tie') {
                    }
                    changeTurn();
                }

                if (currMode !== Mode_PvP && currPlayer === second_Player) {
                    let pickTitleIndex = currMode === Mode_PvAI ? boardModal.getBestIndexToMove() : boardModal.getAClearTitleIndex();
                    if (pickTitleIndex !== undefined) {
                        boardModal.fillTitleAt(pickTitleIndex, second_Player);
                        boardView.setView(boardView.getTitleViewAtIndex(pickTitleIndex), currPlayer);
                        if (boardModal.checkGameStatus() === currPlayer) {
                            showWinner(currPlayer);
                            return;
                        }
                        else if (boardModal.checkGameStatus() === 'tie') {
                            console.log('tie');
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
        console.log(winner);
        if (winner === first_Player) {

        }
        else {

        }
        let popup = document.querySelector('#popup');
        popup.style.visibility = 'visible';
    }

    function resetGame() {
        boardModal.resetBoardModal();
        boardView.resetBoardView();
    }

    (function addEventListenerForButtonsThatChangePlayMode() {
        const pvpButton = document.querySelector('#pvpMode');
        const pvcButton = document.querySelector('#pvcMode');
        const pvAiButton = document.querySelector('#pvAiMode');

        pvAiButton.style.color = 'black';//default mode


        function changeButtonColor(turnOnButton, turnOffButton_1, turnOffButton_2) {
            turnOnButton.style.color = 'black';
            turnOffButton_1.style.color = 'white';
            turnOffButton_2.style.color = 'white';
        }

        pvpButton.addEventListener('click', () => {
            currMode = Mode_PvP;
            changeButtonColor(pvpButton, pvcButton, pvAiButton);
            resetGame();
        })

        pvcButton.addEventListener('click', () => {
            currMode = Mode_PvC;
            changeButtonColor(pvcButton, pvpButton, pvAiButton);
            resetGame();
        })

        pvAiButton.addEventListener('click', () => {
            currMode = Mode_PvAI;
            changeButtonColor(pvAiButton, pvcButton, pvpButton);
            resetGame();
        })
    })()



})()