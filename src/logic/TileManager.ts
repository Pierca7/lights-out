import { Tile } from "../models/Tile.js";
import http from "./Http.js";
import "../models/CustomElement.js"
import BoardManager from "./BoardManager.js";

export default class TileManager {
    private _board: BoardManager;
    private _tileTemplate: string;
    private _tileOnStyle = "casilla prendida";
    private _tileOffStyle = "casilla apagada";

    public constructor(board: BoardManager) {
        this._board = board;
    }
    
    public async createTile(row: HTMLElement, rowIndex: number, columnIndex: number): Promise<Tile> {
        if (!this._tileTemplate){
            this._tileTemplate = await this.getTileTemplate();
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

    public addTileAttributes(board: Tile[][]): void {
        [].concat(...board).forEach((tile: Tile) => {
            const tileElement = document.getElementById(tile.id);
            tileElement.addEventListener("click", (event: Event) => this.updateTiles(event));
        });
    }
    
    private updateTiles(event: Event): void {
        const clickedTile = <HTMLElement>event.srcElement;
        const tilesToChange = this._board.findTilesToChange(clickedTile);
    
        tilesToChange.forEach(tileToChange => this.changeState(tileToChange));
    }
    
    private changeState(tileToChange: Tile): void {
        const element = document.getElementById(tileToChange.id);
         
        tileToChange.on = !tileToChange.on;
        element.className = tileToChange.on ? this._tileOnStyle : this._tileOffStyle;
    }

    private getTileTemplate(): Promise<string> {
        return http.get("public/views/casilla.html");
    }
}



