import "../models/CustomElement.js";
import { Tile } from "../models/Tile.js";
import GameSolver from "../logic/GameSolver.js";
import TileManager from "./TileManager.js";
import AppController from "../controllers/AppController.js";
import constants from "../shared/Constants.js";
import Templates from "../shared/TemplateProvider.js";

class BoardManager {
    private _movements: number = 0;
    private _boardSize: number;
    private _board: Tile[][];
    private _tileManager: TileManager;
    private _solver: GameSolver;
    private _app: AppController;
    private _templates: Templates;
    
    public constructor(app: AppController, templates: Templates) {
        this._app = app;
        this._templates = templates;
    }

    public getMovements(): number {
        return this._movements;
    }

    public addMovement(): void {
        this._movements++;
    }

    public getSolver(): GameSolver {
        return this._solver;
    }

    public getBoard(): Tile[][] {
        return this._board;
    }

    public async createBoard(boardSize: number): Promise<void> {
        document.getElementById(constants.appId).appendHTMLString(this._templates.board);

        this._boardSize = Math.floor(boardSize);

        this._initializeBoardMatrix();
        
        this._solver = new GameSolver(this._boardSize);
        this._tileManager = new TileManager(this, this._templates);
    
        for(let rowIndex = 0; rowIndex < this._boardSize; rowIndex++) {            
            const newRowElement = await this._createRow(rowIndex);

            for(let columnIndex = 0; columnIndex < this._boardSize; columnIndex++) {
                const newTileElement = await this._tileManager.createTile(newRowElement, rowIndex, columnIndex);
                
                this._board[rowIndex][columnIndex] = newTileElement;
            }
        }
    }

    public resetBoard(): Promise<void> {
        this._initializeBoardMatrix();
        this._movements = 0;

        document.getElementById(constants.scorePanelId).className += " hidden";
        document.getElementById(constants.boardId).remove();
        document.getElementById(constants.congratulationsId).remove();
        document.getElementById(constants.movementsId).innerHTML = "-";

        this._app.createControls();
        
        return;
    }

    public giveClue(): void {
        const tileToClick = this._solver.solve(this._board);
        document.getElementById(tileToClick).className += " flicker";
    }

    public addBoardEvents(): void {
        if (this._tileManager) this._tileManager.addTileAttributes();
    }

    public gameFinished(): boolean {
        const tilesOnAmount = [].concat(...this._board).filter((tile: Tile) => tile.on).length;
        
        return tilesOnAmount === 0;
    }

    public findTilesToChange(element: HTMLElement): Tile[] { 
        const position = element.id.split("-");
        const posX = Number(position[0]);
        const posY = Number(position[1]);
        const tilesToChange: Tile[] = [];
    
        tilesToChange.push(this._board[posX][posY]);
        if (posX - 1 >= 0) tilesToChange.push(this._board[posX - 1][posY]);
        if (posX + 1 < this._boardSize) tilesToChange.push(this._board[posX + 1][posY]);
        if (posY - 1 >= 0) tilesToChange.push(this._board[posX][posY - 1]); 
        if (posY + 1 < this._boardSize) tilesToChange.push(this._board[posX][posY + 1]);
    
        return tilesToChange;
    }   
    
    public endGame(): void {
        this._app.createCongratulations();
    }

    private _initializeBoardMatrix(): void {
        this._board = [];
        
        for(let i = 0; i < this._boardSize; i++) {
            this._board.push([]);
        }
    }

    private async _createRow(rowIndex: number): Promise<HTMLElement> {
        const newRow = this._templates.row.replace("{0}", rowIndex.toString());
        document.getElementById(constants.boardId).appendHTMLString(newRow);
        const newRowElement = document.getElementById(`${constants.rowId}${rowIndex}`);

        return newRowElement;
    }
}

export default BoardManager;
