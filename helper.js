function getDirection(){
    let direction = Math.floor(Math.random() * 4);
    switch(direction){
        case 0: direction = "NORTH";
        break;
        case 1: direction = "EAST";
        break;
        case 2: direction = "SOUTH";
        break;
        case 3: direction = "WEST";
        break; 
        default: direction = "NORTH";
    }
    return direction;
}

function fillBoard(board){
    let ships = [{
        name: "Battlecruiser",
        size: 5
    },{
        name: "Battleship",
        size: 4
    },{
        name: "Cruiser",
        size: 3
    },{
        name: "Submarine",
        size: 3
    },{
        name: "Destroyer",
        size: 2
    }]
    for(let i = 0; i < 5; i++){
        let currentship = ships.pop();
        
        
        var restart = true;
        while(restart === true){
            restart = false;
            //console.log(`looping for ${currentship.name} size: ${currentship.size}`);
            var direction = getDirection();
            var firstX = Math.floor(Math.random() * 10);
            var firstY = Math.floor(Math.random() * 10);
            let refX = firstX;
            let refY = firstY;
            //console.log("firstX " + firstX);
            //console.log("firstY " + firstY);
            if(direction === "EAST"){
                //console.log(`DIRECTION: ${direction}`);
                if(currentship.size + firstX < 11){
                    //console.log("IT FITS");
                    for(let a = 0; a < currentship.size; a++){
                        if(board[refY][refX].status !== 0){
                            //console.log(`SHIP ALREADY PLACED HERE, RESTARTING ${refX} ${refY}`)
                            restart = true;
                            break;
                        }
                        //console.log("refX in loop:" + refX);
                        //console.log("refY in loop:" + refY);
                        refX++;
                    }
                }else{
                    //console.log("didnt fit");
                    restart = true;
                }

            }else if(direction === "NORTH"){
                //console.log(`DIRECTION: ${direction}`);
                if(firstY - currentship.size >= -1 ){
                    //console.log("IT FITS");
                    for(let a = 0; a < currentship.size; a++){
                        if(board[refY][refX].status !== 0){
                            //console.log(`SHIP ALREADY PLACED HERE, RESTARTING ${refX} ${refY}`)
                            restart = true;
                            break;
                        }
                        //console.log("refX in loop" + refX);
                        //console.log("refY in loop" + refY);
                        refY--;
                    }
                }else{
                    //console.log("didnt fit");
                    restart = true;
                }
            }else if(direction === "WEST"){
                //console.log(`DIRECTION: ${direction}`)
                if(firstX - currentship.size >= -1 ){
                    //console.log("IT FITS");
                    for(let a = 0; a < currentship.size; a++){
                        if(board[refY][refX].status !== 0){
                            //console.log(`SHIP ALREADY PLACED HERE, RESTARTING ${refX} ${refY}`)
                            restart = true;
                            break;
                        }
                        //console.log("refX in loop" + refX);
                        //console.log("refY in loop" + refY);
                        refX--;
                    }
                }else{
                    //console.log("didnt fit");
                    restart = true;
                }
            }else if(direction === "SOUTH"){
                //console.log(`DIRECTION: ${direction}`);
                if(currentship.size + firstY < 11){
                    //console.log("IT FITS");
                    for(let a = 0; a < currentship.size; a++){
                        if(board[refY][refX].status !== 0){
                            //console.log(`SHIP ALREADY PLACED HERE, RESTARTING ${refX} ${refY}`);
                            restart = true;
                            break;
                        }
                        //console.log("refX in loop" + refX);
                        //console.log("refY in loop" + refY);
                        refY++;
                    }
                }else{
                    //console.log("didnt fit");
                    restart = true;
                }

            }
            //console.log("restart: " + restart);
        }
        //console.log("placing ship");
        for(j = 0; j < currentship.size; j++){
            //console.log("X " + firstX);
            //console.log("Y " + firstY);
            board[firstY][firstX].status = 1;
            board[firstY][firstX].ship = currentship.name;
            switch(direction){
                case "EAST": firstX++;
                break;
                case "NORTH": firstY--;
                break;
                case "SOUTH": firstY++;
                break;
                case "WEST": firstX--;
                break;
            }
        }
            
    }
    return board;
}

function makeBoard() {
    let emptyShips = [];
    for(let i = 0; i < 10; i++){
        emptyShips.push([]);
    }

    function emptyCell(coord){
        this.coord = coord;
        this.status = 0;
        this.ship = "";
    }

    let charCode = 'A'.charCodeAt();
    for(let i = 0; i < 10; i++){
        let letter = String.fromCharCode(charCode);   
        for(let j = 0; j < 10; j++){
        emptyShips[i].push(new emptyCell(letter + j));
        }
        charCode++;
    }

    return emptyShips;

}



function createNewBoard(){
    return fillBoard(makeBoard());
}


module.exports = createNewBoard;