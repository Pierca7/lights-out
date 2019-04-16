import "../models/CustomElement.js";
import http from "./Http.js";
import { Tile } from "../models/Tile.js";
import GameSolver from "../logic/GameSolver.js";
import TileManager from "./TileManager.js";

export default class BoardManager {
    private _rowTemplate: string;
    private _boardTemplate: string;
    private _boardSize: number;
    private _board: Tile[][];
    private _tileManager: TileManager;
    private _solver: GameSolver;

    public getSolver(): GameSolver {
        return this._solver;
    }

    public getBoard(): Tile[][] {
        return this._board;
    }

    public async createBoard(boardSize: number): Promise<void> {
        if (!this._boardTemplate) {
            this._boardTemplate = await this._getBoardTemplate();
        }
        
        document.getElementById("app").appendHTMLString(this._boardTemplate);

        this._boardSize = boardSize;
        this._initializeBoardMatrix();
        this._solver = new GameSolver(this._boardSize);
        this._tileManager = new TileManager(this);
    
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
        document.getElementById("tablero").remove();
        
        return this.createBoard(this._boardSize);
    }

    public giveClue(): void {
        const tileToClick = this._solver.solve(this._board);
        console.log(tileToClick);
        document.getElementById(tileToClick).className += " flicker";
    }

    public addTileEvents(): void {
        if (this._tileManager) this._tileManager.addTileAttributes();
    }
    
    private _initializeBoardMatrix(): void {
        this._board = [];
        
        for(let i = 0; i < this._boardSize; i++) {
            this._board.push([]);
        }
    }

    private async _createRow(rowIndex: number): Promise<HTMLElement> {
        if (!this._rowTemplate) {
            this._rowTemplate = await this._getRowTemplate();
        }

        const newRow = this._rowTemplate.replace("{0}", rowIndex.toString());
        document.getElementById("tablero").appendHTMLString(newRow);
        const newRowElement = document.getElementById(`fila${rowIndex}`);

        return newRowElement;
    }

    private _getRowTemplate(): Promise<string> {
        return http.get("public/views/row.html");
    }   

    private _getBoardTemplate(): Promise<string> {
        return http.get("public/views/board.html");
    }
}