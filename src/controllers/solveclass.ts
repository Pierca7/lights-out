import { Casilla } from "../models/casilla.js";

export default class Solver {
    private _matrixOrder: number;
    private _matrixSize: number;
    private _binaryMatrix: number[][];
    private _extendedMatrix: number[][];
    private _extendedMatrixColumns: number[];
    private _enlargedMatrixSize: number;
    private _tileStatesAmount: number = 2;
    private _currentRange: number;
    
    private buildMatrix(board: Casilla[][]): void {
        this._binaryMatrix = [];
        this._matrixOrder = board.length;
        this._matrixSize = Math.pow(this._matrixOrder, 2);
        
        board.forEach((row: Casilla[], rowIndex: number) => {
            this._binaryMatrix.push([]);
            row.forEach((tile: Casilla, colIndex: number) => {
                this._binaryMatrix[rowIndex][colIndex] = tile.encendida ? 1 : 0;
            });
        });
    }

    public solve(board: Casilla[][]) {
        this.buildMatrix(board);

        for (let goal = 0; goal < this._tileStatesAmount; goal++) {
            if (this.solveProblem(goal)) {
                const anscols = [];

                for (let i = 0; i < this._matrixSize; i++) anscols[this._extendedMatrixColumns[i]] = i;

                for (let col = 0; col < this._matrixOrder; col++){
                    for (let row = 0; row < this._matrixOrder; row++) {
                        const result = anscols[row * this._matrixOrder + col];
                        const value = (result < this._currentRange) ? this.a(result, this._currentRange) : 0;

                        console.log(`Cell ${col} ${row} = ${value}`)
                    }
                }

                return;
            }
        }
    }

    private solveProblem(goal: number): boolean {
        this._enlargedMatrixSize = this._matrixSize + 1;
        
        this.initMatrix();

        for (let col = 0; col < this._matrixOrder; col++){
            for (let row = 0; row < this._matrixOrder; row++){
                this._extendedMatrix[row * this._matrixOrder + col][this._matrixSize] = this.modulate(goal - this._binaryMatrix[col][row]);
            }         
        }
            
        return this.sweep();
    }

    private initMatrix() {
        this._extendedMatrix = [];

        for (let col = 0; col < this._matrixOrder; col++) {
            for (let row = 0; row < this._matrixOrder; row++) {
                const i = row * this._matrixOrder + col;
                const line: number[] = [];

                for (var j = 0; j < this._matrixSize; j++) line[j] = 0;

                line[i] = 1;
                if (col > 0) line[i - 1] = 1;
                if (row > 0) line[i - this._matrixOrder] = 1;
                if (col < this._matrixOrder - 1) line[i + 1] = 1;
                if (row < this._matrixOrder - 1) line[i + this._matrixOrder] = 1;
                
                this._extendedMatrix[i] = line;
            }
        }

        this._extendedMatrixColumns = [];
        for (var j = 0; j < this._enlargedMatrixSize; j++) this._extendedMatrixColumns[j] = j;
    }

    private sweep() {
        for (this._currentRange = 0; this._currentRange < this._matrixSize; this._currentRange++)
        {
            if (!this.sweepStep()) return false; // failed in founding a solution
            if (this._currentRange == this._matrixSize) break;
        }
        return true; // successfully found a solution
    }

    private sweepStep() {
        var i;
        var j;
        var finished = true;
        for (j = this._currentRange; j < this._matrixSize; j++)
        {
            for (i = this._currentRange; i < this._matrixSize; i++)
            {
                var aij = this.a(i, j);
                if (aij != 0) finished = false;
                var inv = this.invert(aij);
                if (inv != 0)
                {
                    for (var jj = this._currentRange; jj < this._enlargedMatrixSize; jj++)
                        this.setmat(i, jj, this.a(i, jj) * inv);
                    this.doBasicSweep(i, j);
                    return true;
                }
            }
        }
        if (finished) { // we have: 0x = b (every matrix element is 0)
            for (j = this._matrixSize; j < this._enlargedMatrixSize; j++)
                for (i = this._currentRange; i < this._matrixSize; i++)
                if (this.a(i, j) != 0) return false; // no solution since b != 0
            return true;    // 0x = 0 has solutions including x = 0
        }

        return false;   // failed in finding a solution
    }

    
    private doBasicSweep(pivoti: number, pivotj: number) {
        if (this._currentRange != pivoti) this.swap(this._extendedMatrix, this._currentRange, pivoti);
        if (this._currentRange != pivotj) this.swap(this._extendedMatrixColumns, this._currentRange, pivotj);

        for (var i = 0; i < this._matrixSize; i++)
        {
            if (i != this._currentRange)
            {
                var air = this.a(i, this._currentRange);
                if (air != 0)
                    for (var j = this._currentRange; j < this._matrixSize; j++)
                    this.setmat(i, j, this.a(i, j) - this.a(this._currentRange, j) * air);
            }
        }
    }

    private a(i: number, j: number) {
        return this._extendedMatrix[i][this._extendedMatrixColumns[j]];
    }

    private setmat(i: number, j: number, val: number) {
        this._extendedMatrix[i][this._extendedMatrixColumns[j]] = this.modulate(val);
    }

    private swap(array: number[] | number[][], x: number, y: number) {
        const tmp = array[x];
        array[x] = array[y];
        array[y] = tmp;
    }

    private modulate(x: number) {
        // returns z such that 0 <= z < imgcount and x == z (mod imgcount)
        if (x >= 0) {
            return x % this._tileStatesAmount;
        } 

        x = (-x) % this._tileStatesAmount;
        if (x == 0) {
            return 0;
        } 

        return this._tileStatesAmount - x;
    }

    private gcd(x: number, y: number) { // call when: x >= 0 and y >= 0
        if (y == 0 || x == y) return x;
        if (x > y) x = x % y; // x < y

        while (x > 0)
        {
            y = y % x; // y < x
            if (y == 0) return x;
            x = x % y; // x < y
        }

        return y;
    }

    private invert(value: number) { // call when: 0 <= value < imgcount
        // returns z such that value * z == 1 (mod imgcount), or 0 if no such z
        if (value <= 1) return value;
        const seed = this.gcd(value, this._tileStatesAmount);
        if (seed != 1) return 0;
        let a = 1, b = 0, x = value;    // invar: a * value + b * imgcount == x
        let c = 0, d = 1, y = this._tileStatesAmount; // invar: c * value + d * imgcount == y
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