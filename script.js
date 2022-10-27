let player = (sign) => {
    let _sign = sign;

    let getSign = () => {
        return _sign;
    };

    return { getSign };
};

const gameBoard = (() => {
    const _board = ['', '', '', '', '', '', '', '', ''];

    let setField = (index, player) => {
        _board[index] = player.getSign();
    };

    let getField = (index) => {
        return _board[index];
    };

    let reset = () => {
        _board.fill('');
    };

    return { setField, getField, reset };
})();

const gameController = (() => {
    const playerOne = player('X');
    const playerTwo = player('O');
    let _turn = 1;
    let _isGameOver = false;

    let playRound = (index) => {
        if (gameBoard.getField(index) === '' && _isGameOver === false) {
            if (_turn % 2 !== 0) {
                displayController.turnInfo(playerTwo);
                gamePlay(index, playerOne);
            } else {
                displayController.turnInfo(playerOne);
                gamePlay(index, playerTwo);
            }
            _turn++;
        }
    };

    let gamePlay = (index, player) => {
        gameBoard.setField(index, player);
        displayController.updateBoard(index, player);
        if (winnerConditionCheck(index, player)) {
            _isGameOver = true;
            displayController.updateWinnerDrawMessage(_isGameOver, _turn, player);
            return;
        } else if (_turn === 9 && winnerConditionCheck(index, player) === false) {
            _isGameOver = true;
            displayController.updateWinnerDrawMessage(_isGameOver, _turn, player);
            return;
        }
    };

    let winnerConditionCheck = (index, player) => {
        const winnerCondition = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winnerCondition.filter((combo) =>
            combo.includes(index)).some((possibleCombo) =>
                possibleCombo.every((idx) =>
                    gameBoard.getField(idx) === player.getSign()
                )
            );
    };

    let reset = () => {
        _turn = 1;
        _isGameOver = false;
    };

    return { playRound, reset };
})();

const displayController = (() => {
    let startMenu = document.querySelector('.start-menu');
    let start = document.querySelector('.start');
    let gameBoardContainer = document.querySelector('.gameboard');
    let resultMessage = document.querySelector('.result-turn-text');
    let btns = document.querySelectorAll('.board-square');    

    start.addEventListener('click', () => {
        start.style.transform = 'scale(0)';
        resultMessage.style.opacity = 1;
        resultMessage.style.transform = 'scale(1)';
        start.style.opacity = 0;
        gameBoardContainer.style.opacity = 1;
        gameBoardContainer.style.transform = 'scale(1)';
        startMenu.style.top = '120px';
    });

    btns.forEach((btn) =>
        btn.addEventListener('click', () => {
            gameController.playRound(btn.id - 1);
        })
    )

    let updateBoard = (index, player) => {
        let box = document.querySelector(`.board-square:nth-child(${index + 1})`)
        box.textContent = player.getSign();
    };

    let updateWinnerDrawMessage = (isGameOver, turn, player) => {
        resultMessage.style.textAlign = 'center';
        if (isGameOver === true && turn === 9) {
            resultMessage.textContent = `Draw!`;
        } else if (isGameOver === true && turn < 9) {
            let sign = player.getSign();
            resultMessage.textContent = `${sign} Won!!!!`
        }
        gameRestart();
    };

    let turnInfo = (player) => {
        let sign = player.getSign();
        if (sign === 'X') {
            resultMessage.style.textAlign = 'left';
        } else {
            resultMessage.style.textAlign = 'right';
        }
        resultMessage.textContent = `${sign}'s turn!!`
    };

    let gameRestart = () => {
        let restartBtn = document.querySelector('.restart');
        restartBtn.style.opacity = 1;
        restartBtn.style.transform = 'scale(1)';

        restartBtn.addEventListener('click', () => {
            gameController.reset();
            gameBoard.reset();

            resultMessage.textContent = 'X\'s turn!!';
            resultMessage.style.textAlign = 'left';

            btns.forEach((btn) =>
                btn.textContent = ''
            )

            restartBtn.style.opacity = 0;
            restartBtn.style.transform = 'scale(0)';
        });
    };
    return { updateBoard, updateWinnerDrawMessage, turnInfo };
})();