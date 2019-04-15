import http from "./Http.js";
import { Tile } from "../models/Tile.js";
import GameSolver from "../logic/GameSolver.js";
import RowManager from "./RowManager.js";
import TileManager from "./TileManager.js";
import "../models/CustomElement.js"

export default class BoardManager {
    private _clueButtonTemplate: string;
    private _boardTemplate: string;
    private _boardSize: number;
    private _board: Tile[][];
    public _solver: GameSolver;

    constructor(boardSize: number){
        this._boardSize = boardSize;
        this._solver = new GameSolver();
        this.initializeBoardMatrix();
    }

    public async createBoard(): Promise<void> {
        if (!this._boardTemplate) {
            this._boardTemplate = await this.getBoardTemplate();
        }

        document.getElementById("app").appendHTMLString(this._boardTemplate);
        
        const boardElement = document.getElementById("tablero");
        const rowManager = new RowManager(boardElement);
        const tileManager = new TileManager(this);
    
        for(let rowIndex = 0; rowIndex < this._boardSize; rowIndex++) {            
            const newRowElement = await rowManager.createRow(rowIndex);

            for(let columnIndex = 0; columnIndex < this._boardSize; columnIndex++) {
                const newTileElement = await tileManager.createTile(newRowElement, rowIndex, columnIndex);
                
                this._board[rowIndex][columnIndex] = newTileElement;
            }
        }

        await this.createClueButton();
        tileManager.addTileAttributes();
    }

    public async createClueButton(): Promise<void> {
        if (!this._clueButtonTemplate) {
            this._clueButtonTemplate = await this.getClueButton();
        }

        document.getElementById("tablero").appendHTMLString(this._clueButtonTemplate);
    }

    public getBoard(): Tile[][] {
        return this._board;
    }

    public resetBoard(): Promise<void> {
        this.initializeBoardMatrix();
        document.getElementById("tablero").remove();
        
        return this.createBoard();
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

    public gameFinished(): boolean {
        const tilesOnAmount = [].concat(...this._board).filter((tile: Tile) => tile.on).length;
        
        return tilesOnAmount === 0;
    }

    public giveClue(): void {
        const tileToClick = this._solver.solve(this._board);
        document.getElementById(tileToClick).className += " flicker";
    }

    private initializeBoardMatrix(): void {
        this._board = [];
        
        for(let i = 0; i < this._boardSize; i++) {
            this._board.push([]);
        }
    }

    private getBoardTemplate(): Promise<string> {
        return http.get("public/views/tablero.html");
    }

    private getClueButton(): Promise<string> {
        return http.get("public/views/clueButton.html");
    }
}