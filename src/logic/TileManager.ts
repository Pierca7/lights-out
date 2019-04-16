import "../models/CustomElement.js";
import http from "./Http.js";
import { Tile } from "../models/Tile.js";
import BoardManager from "./BoardManager.js";

export default class TileManager {
    private _board: BoardManager;
    private _boardSize: number;
    private _tileTemplate: string;
    private _congratulationsTemplate: string;
    private _tileOnStyle = "casilla prendida";
    private _tileOffStyle = "casilla apagada";

    public constructor(board: BoardManager) {
        this._board = board;
        this._boardSize = this._board.getBoard().length;
    }
    
    public async createTile(row: HTMLElement, rowIndex: number, columnIndex: number): Promise<Tile> {
        if (!this._tileTemplate){
            this._tileTemplate = await this._getTileTemplate();
        }

        const initialState: boolean = Math.round(Math.random()) === 1;
        const id = `${rowIndex}-${columnIndex}`;  
        const newTile = this._tileTemplate.replace("{0}", id )
        .replace("{1}", initialState ? this._tileOnStyle : this._tileOffStyle);

        row.appendHTMLString(newTile);

        return <Tile>{
            id: id,
            on: initialState
        }
    }

    public addTileAttributes(): void {
        [].concat(...this._board.getBoard()).forEach((tile: Tile) => {
            const tileElement = document.getElementById(tile.id);

            tileElement.addEventListener("click", async (event: Event) => {
                this._updateTiles(event)
                this._board.addMovement();

                const movements = this._board.getMovements().toString();

                document.getElementById("movements").innerHTML = movements

                if (this.gameFinished()) {
                    if (!this._congratulationsTemplate){
                        this._congratulationsTemplate = await this._getCongratulationsTemplate();
                    }
                    
                    const actualRecord = document.getElementById("record").innerHTML;

                    if (!actualRecord || Number(movements) < Number(actualRecord)) {
                        document.getElementById("record").innerHTML = movements;
                    }

                    const congratulations = this._congratulationsTemplate.replace("{0}", this._board.getMovements().toString());

                    document.getElementById("tablero").className += " hidden";
                    document.getElementById("app").appendHTMLString(congratulations);  
                    document.getElementById("reset").addEventListener("click", () => {
                        this._board.resetBoard();
                    })                  
                }
            })
        });
    }   

    public gameFinished(): boolean {
        const tilesOnAmount = [].concat(...this._board.getBoard()).filter((tile: Tile) => tile.on).length;
        
        return tilesOnAmount === 0;
    }

    private _findTilesToChange(element: HTMLElement): Tile[] { 
        const position = element.id.split("-");
        const posX = Number(position[0]);
        const posY = Number(position[1]);
        const tilesToChange: Tile[] = [];
        const board = this._board.getBoard();
    
        tilesToChange.push(board[posX][posY]);
        if (posX - 1 >= 0) tilesToChange.push(board[posX - 1][posY]);
        if (posX + 1 < this._boardSize) tilesToChange.push(board[posX + 1][posY]);
        if (posY - 1 >= 0) tilesToChange.push(board[posX][posY - 1]); 
        if (posY + 1 < this._boardSize) tilesToChange.push(board[posX][posY + 1]);
    
        return tilesToChange;
    }   
    
    private _updateTiles(event: Event): void {
        const clickedTile = <HTMLElement>event.srcElement;
        const tilesToChange = this._findTilesToChange(clickedTile);
    
        tilesToChange.forEach(tileToChange => this._changeState(tileToChange));
    }
    
    private _changeState(tileToChange: Tile): void {
        const element = document.getElementById(tileToChange.id);
         
        tileToChange.on = !tileToChange.on;
        element.className = tileToChange.on ? this._tileOnStyle : this._tileOffStyle;
    }

    private _getTileTemplate(): Promise<string> {
        return http.get("public/views/tile.html");
    }

    private _getCongratulationsTemplate(): Promise<string> {
        return http.get("public/views/congratulations.html");
    }
}



