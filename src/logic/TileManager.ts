import "../models/CustomElement.js";
import { Tile } from "../models/Tile.js";
import BoardManager from "./BoardManager.js";
import constants from "../shared/Constants.js";
import Templates from "../shared/TemplateProvider.js";

class TileManager {
    private _board: BoardManager;
    private _templates: Templates;
    private _tileOnStyle = "tile on";
    private _tileOffStyle = "tile off";

    public constructor(board: BoardManager, templates: Templates) {
        this._templates = templates;
        this._board = board;
    }

    public async createTile(row: HTMLElement, rowIndex: number, columnIndex: number): Promise<Tile> {
        const initialState: boolean = Math.round(Math.random()) === 1;
        const id = `${rowIndex}-${columnIndex}`;
        const newTile = this._templates.tile.replace("{0}", id)
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
}

export default TileManager;
