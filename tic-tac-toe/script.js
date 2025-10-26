const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status-text');
const restartBtn = document.getElementById('restart-button');

let boardState = ["", "", "", "", "", "", "", "", ""]
let currentPlayer = "X";
let isGameActive = true;

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8]
]


function handleCellClick(event){
    const clickedCell = event.target;
    const clickedCellIndex = clickedCell.getAttribute('data-index');

    if (boardState[clickedCellIndex] !=="" || !isGameActive){
        return;
    }

    updateBoard(clickedCell, clickedCellIndex);

    checkGameStatus();
}


function updateBoard(clickedCell, clickedCellIndex){
    boardState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
}


function switchPlayer(){
    currentPlayer = (currentPlayer === "X") ? "O":"X";
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
}


function checkGameStatus(){
    let roundWon = false;

    for (let i=0; i<winConditions.length; i++){
        const condition = winConditions[i];

        const cellA = boardState[condition[0]];
        const cellB = boardState[condition[1]];
        const cellC = boardState[condition[2]];

        if (cellA === "" || cellB === "" || cellC === ""){
            continue;
        }


        if (cellA === cellB && cellB == cellC){
            roundWon = true;
            break;
        }
    }

    if (roundWon){
        statusText.textContent = `Player ${currentPlayer} Wins!`;
        isGameActive = false;
        return;
    }

    if (!boardState.includes("")){
        statusText.textContent = `Draw Game`;
        isGameActive = false;
        return;
    }

    switchPlayer();
}


function handleRestartGame(){
    boardState = ["", "", "", "", "", "", "", "", ""]
    currentPlayer = "X";
    isGameActive = true;

    statusText.textContent = `Player ${currentPlayer}'s Turn`;
    cells.forEach(cell => {
        cell.textContent = "";
    })

}


cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', handleRestartGame);
statusText.textContent = `Player ${currentPlayer}'s Turn`