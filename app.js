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

    //getters
    const _getAClearTitleIndex = () => {
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

    const getARandomMove = () => {
        if (Math.floor(Math.random() * 3) === 1) {
            return getBestIndexToMove();
        }
        return _getAClearTitleIndex();
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
            else { return currGameStatus === 'O' ? (100 - depth) : (depth - 100); }
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

    return { checkGameStatus, getARandomMove, fillTitleAt, resetBoardModal, getBestIndexToMove };

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

    function addEventListernersForallTitles() {
        let allTitles = document.querySelectorAll('.title');
        allTitles.forEach((title) => {
            title.addEventListener('click', () => {

                //If the title is fillable, then fill it and change turn
                if (boardModal.fillTitleAt(parseInt(title.dataset.indexNum), currPlayer)) {
                    boardView.setView(title, currPlayer);
                    if (boardModal.checkGameStatus() === currPlayer) {
                        showWinner(currPlayer);
                        return;
                    }
                    else if (boardModal.checkGameStatus() === 'tie') {
                        showWinner('tie');
                    }
                    changeTurn();
                }

                if (currMode !== Mode_PvP && currPlayer === second_Player) {
                    //pick a move for computer depends on the mode
                    let pickTitleIndex = currMode === Mode_PvAI ? boardModal.getBestIndexToMove() : boardModal.getARandomMove();

                    if (pickTitleIndex !== undefined) {
                        boardModal.fillTitleAt(pickTitleIndex, second_Player);
                        boardView.setView(boardView.getTitleViewAtIndex(pickTitleIndex), currPlayer);
                        if (boardModal.checkGameStatus() === currPlayer) {
                            showWinner(currPlayer);
                            return;
                        }
                        else if (boardModal.checkGameStatus() === 'tie') {
                            showWinner('tie');
                        }
                        changeTurn();
                    }
                }
            })
        })
    }

    function changeTurn() {
        currPlayer = currPlayer === first_Player ? second_Player : first_Player;
    }

    function showWinner(winner) {
        let noticePopup = document.querySelector('#winnerNotice');

        if (winner === 'tie') {
            noticePopup.innerText = "It's a tie";
        }
        else {
            if (currMode == Mode_PvP) {
                noticePopup.innerText = `Player "${winner}" won`;
            }
            else {
                if (winner === 'X') {
                    noticePopup.innerText = 'You won';
                }
                else {
                    noticePopup.innerText = 'Computer won';
                }
            }
        }

        let popup = document.querySelector('#popup');
        popup.style.visibility = 'visible';
    }

    function addEventListenerForButtonsThatChangePlayMode() {
        const pvpButton = document.querySelector('#pvpMode');
        const pvcButton = document.querySelector('#pvcMode');
        const pvAiButton = document.querySelector('#pvAiMode');

        pvAiButton.style.color = '#89ff8e';//default mode


        function changeButtonColor(turnOnButton, turnOffButton_1, turnOffButton_2) {
            turnOnButton.style.color = '#89ff8e';
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
    }

    function resetGame() {
        boardModal.resetBoardModal();
        boardView.resetBoardView();
        const popup = document.querySelector('#popup');
        popup.style.visibility = 'hidden'; //turn off pop up
        currPlayer = first_Player;
    }


    function addEventListenerForReplayButton() {
        const replayButton = document.querySelector('#refreshButton');
        replayButton.addEventListener('click', () => {
            resetGame();
        })
    }

    function addEventListenerForStartButton() {
        const startButton = document.querySelector('#startButton');
        startButton.addEventListener('click', () => {
            const board = document.querySelector('.chessboard');
            const modes = document.querySelector('.modes');
            board.style.display = 'grid';
            modes.style.display = 'flex';
            startButton.style.display = 'none';
        })
    }

    function init() {
        addEventListernersForallTitles();
        addEventListenerForButtonsThatChangePlayMode();
        addEventListenerForReplayButton();
        addEventListenerForStartButton();
        resetGame();
    }

    return { init }
})()

controller.init();