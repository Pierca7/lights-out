import { Tile } from "../models/Tile.js";

export default class GameSolver {
    private _tileStates = 2;
    private _matrixOrder: number;
    private _binaryMatrix: number[][]
    private _columns: number[];
    private _extendedMatrix: number[][];
    private _extendedMatrixSize: number;
    private _extendedMatrixSizePlusOne: number;
    private _currentRange: number;
    private _maxRange: number;

    constructor(matrixOrder: number) {
        this._matrixOrder = matrixOrder;
    }

    public solve(board: Tile[][]): string {
        this._buildBinaryMatrix(board);

        var col;
        var row;
        for (var goal = 0; goal < this._tileStates; goal++)
        {
            if (this.solveProblem(goal))
            {
                var anscols = new Array();
                var j;
                for (j = 0; j < this._extendedMatrixSize; j++) anscols[this._columns[j]] = j;
                for (col = 0; col < this._matrixOrder; col++)
                    for (row = 0; row < this._matrixOrder; row++)
                {
                    var value;
                    j = anscols[row * this._matrixOrder + col];
                    if (j < this._currentRange) value = this._a(j, this._extendedMatrixSize); else value = 0;
                    if (value === 1) return `${col}-${row}`;
                }
                return;
            }
        }
    }

    private _buildBinaryMatrix(board: Tile[][]): void {
        this._binaryMatrix = [];

        board.forEach((row, i) => {
            this._binaryMatrix.push([]);

            row.forEach((tile, j) => {
                this._binaryMatrix[i][j] = (tile.on) ? 1 : 0;
            });
        });
    }

    private solveProblem(goal: number): boolean {
        var size = this._matrixOrder * this._matrixOrder;
        this._extendedMatrixSize = size;
        this._extendedMatrixSizePlusOne = this._extendedMatrixSize + 1;
        this._initializeBinaryMatrix();
        for (var col = 0; col < this._matrixOrder; col++)
            for (var row = 0; row < this._matrixOrder; row++)
            this._extendedMatrix[row * this._matrixOrder + col][this._extendedMatrixSize] = this._modulate(goal - this._binaryMatrix[col][row]);
        return this._sweep();
    }

    private _initializeBinaryMatrix(): void {
        this._maxRange = Math.min(this._extendedMatrixSize, this._extendedMatrixSize);
        this._extendedMatrix = new Array();
        for (var col = 0; col < this._matrixOrder; col++)
            for (var row = 0; row < this._matrixOrder; row++)
        {
            var i = row * this._matrixOrder + col;
            var line = new Array();
            this._extendedMatrix[i] = line;
            for (var j = 0; j < this._extendedMatrixSize; j++) line[j] = 0;
            line[i] = 1;
            if (col > 0) line[i - 1] = 1;
            if (row > 0) line[i - this._matrixOrder] = 1;
            if (col < this._matrixOrder - 1) line[i + 1] = 1;
            if (row < this._matrixOrder - 1) line[i + this._matrixOrder] = 1;
        }
        this._columns = new Array();
        for (var j = 0; j < this._extendedMatrixSizePlusOne; j++) this._columns[j] = j;
    }

    private _sweep(): boolean {
        for (this._currentRange = 0; this._currentRange < this._maxRange; this._currentRange++)
        {
            if (!this._sweepStep()) return false; 
            if (this._currentRange == this._maxRange) break;
        }
        
        return true;
    }

    private _sweepStep(): boolean {
        var i;
        var j;
        var finished = true;
        for (j = this._currentRange; j < this._extendedMatrixSize; j++)
        {
            for (i = this._currentRange; i < this._extendedMatrixSize; i++)
            {
                var aij = this._a(i, j);
                if (aij != 0) finished = false;
                var inv = this._invert(aij);
                if (inv != 0)
                {
                    for (var jj = this._currentRange; jj <this. _extendedMatrixSizePlusOne; jj++)
                    this._setBinaryMatrix(i, jj, this._a(i, jj) * inv);
                    this._doBasicSweep(i, j);
                    return true;
                }
            }
        }
        if (finished) {
            this._maxRange = this._currentRange;
            for (j = this._extendedMatrixSize; j < this._extendedMatrixSizePlusOne; j++)
                for (i = this._currentRange; i < this._extendedMatrixSize; i++)
                if (this._a(i, j) != 0) return false;
            return true;
        }

        return false; 
    }

    private _swap(array: number[] | number[][], x: number, y: number): void {
        var tmp = array[x];
        array[x] = array[y];
        array[y] = tmp;
    }

    private _doBasicSweep(pivoti: number, pivotj: number): void {
        if (this._currentRange != pivoti) this._swap(this._extendedMatrix, this._currentRange, pivoti);
        if (this._currentRange != pivotj) this._swap(this._columns, this._currentRange, pivotj);
        
        for (var i = 0; i < this._extendedMatrixSize; i++)
        {
            if (i != this._currentRange)
            {
                var air = this._a(i, this._currentRange);
                if (air != 0)
                    for (var j = this._currentRange; j < this._extendedMatrixSizePlusOne; j++)
                    this._setBinaryMatrix(i, j, this._a(i, j) - this._a(this._currentRange, j) * air);
            }
        }
    }

    private _a(i: number, j: number): number {
        return this._extendedMatrix[i][this._columns[j]];
    }

    private _setBinaryMatrix(i: number, j: number, val: number): void {
        this._extendedMatrix[i][this._columns[j]] = this._modulate(val);
    }

    private _modulate(x: number): number {
        if (x >= 0) return x % this._tileStates;

        x = (-x) % this._tileStates;
        if (x == 0) return 0;
        
        return this._tileStates - x;
    }

    private _gcd(x: number, y: number): number {
        if (y == 0) return x;
        if (x == y) return x;
        if (x > y) x = x % y;

        while (x > 0)
        {
            y = y % x;
            if (y == 0) return x;
            x = x % y;
        }

        return y;
    }

    private _invert(value: number): number {
        if (value <= 1) return value;

        var seed = this._gcd(value, this._tileStates);
        if (seed != 1) return 0;

        var a = 1, b = 0, x = value;
        var c = 0, d = 1, y = this._tileStates;

        while (x > 1)
        {
            var tmp = Math.floor(y / x);
            y -= x * tmp;
            c -= a * tmp;
            d -= b * tmp;
            tmp = a; a = c; c = tmp;
            tmp = b; b = d; d = tmp;
            tmp = x; x = y; y = tmp;
        }

        return a;
    }
}
