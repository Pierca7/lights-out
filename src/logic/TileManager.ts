import "../models/CustomElement.js";
import http from "./Http.js";
import { Tile } from "../models/Tile.js";
import BoardManager from "./BoardManager.js";
import constants from "../shared/constants.js";

export default class TileManager {
    private _board: BoardManager;
    private _tileTemplate: string;
    private _tileOnStyle = "tile on";
    private _tileOffStyle = "tile off";

    public constructor(board: BoardManager) {
        this._board = board;
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
                document.getElementById(constants.movementsId).innerHTML = movements;

                if (this._board.gameFinished()) {
                    this._board.endGame();
                }
            })
        });
    }
    
    private _updateTiles(event: Event): void {
        const clickedTile = <HTMLElement>event.srcElement;
        const tilesToChange = this._board.findTilesToChange(clickedTile);
    
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


}



