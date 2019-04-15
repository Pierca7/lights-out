import { Tile } from "../models/Tile.js";

export default class GameSolver {
    private colcount = 3;   // integer, number of columns
    private rowcount = 3;   // integer, number of rows
    private imgcount = 2;   // integer, number of states of a tile
    private cells: number[][] = [[],[],[]];      // integer[row][col], current states of tile

    private mat: number[][];    // integer[i][j]
    private cols: number[];   // integer[]
    private m: number;      // count of rows of the matrix
    private n: number;      // count of columns of the matrix
    private np: number;     // count of columns of the enlarged matrix
    private r: number;      // minimum rank of the matrix
    private maxr: number;   // maximum rank of the matrix

    public solve(board: Tile[][]): string {
        this.buildBinaryMatrix(board);

        var col;
        var row;
        for (var goal = 0; goal < this.imgcount; goal++)
        {
            if (this.solveProblem(goal))
            { // found an integer solution
                var anscols = new Array();
                var j;
                for (j = 0; j < this.n; j++) anscols[this.cols[j]] = j;
                for (col = 0; col < this.colcount; col++)
                    for (row = 0; row < this.rowcount; row++)
                {
                    var value;
                    j = anscols[row * this.colcount + col];
                    if (j < this.r) value = this.a(j, this.n); else value = 0;
                    if (value === 1) return `${col}-${row}`;
                }
                return;
            }
        }
    }

    private buildBinaryMatrix(board: Tile[][]): void {
        board.forEach((row, i) => {
            row.forEach((tile, j) => {
                this.cells[i][j] = (tile.on) ? 1 : 0;
            });
        });
    }

    private solveProblem(goal: number): boolean {
        var size = this.colcount * this.rowcount;
        this.m = size;
        this.n = size;
        this.np = this.n + 1;
        this.initMatrix();
        for (var col = 0; col < this.colcount; col++)
            for (var row = 0; row < this.rowcount; row++)
            this.mat[row * this.colcount + col][this.n] = this.modulate(goal - this.cells[col][row]);
        return this.sweep();
    }

    private initMatrix(): void {
        this.maxr = Math.min(this.m, this.n);
        this.mat = new Array();
        for (var col = 0; col < this.colcount; col++)
            for (var row = 0; row < this.rowcount; row++)
        {
            var i = row * this.colcount + col;
            var line = new Array();
            this.mat[i] = line;
            for (var j = 0; j < this.n; j++) line[j] = 0;
            line[i] = 1;
            if (col > 0) line[i - 1] = 1;
            if (row > 0) line[i - this.colcount] = 1;
            if (col < this.colcount - 1) line[i + 1] = 1;
            if (row < this.rowcount - 1) line[i + this.colcount] = 1;
        }
        this.cols = new Array();
        for (var j = 0; j < this.np; j++) this.cols[j] = j;
    }

    private sweep(): boolean {
        for (this.r = 0; this.r < this.maxr; this.r++)
        {
            if (!this.sweepStep()) return false; // failed in founding a solution
            if (this.r == this.maxr) break;
        }
        return true; // successfully found a solution
    }

    private sweepStep(): boolean {
        var i;
        var j;
        var finished = true;
        for (j = this.r; j < this.n; j++)
        {
            for (i = this.r; i < this.m; i++)
            {
                var aij = this.a(i, j);
                if (aij != 0) finished = false;
                var inv = this.invert(aij);
                if (inv != 0)
                {
                    for (var jj = this.r; jj <this. np; jj++)
                    this.setmat(i, jj, this.a(i, jj) * inv);
                    this.doBasicSweep(i, j);
                    return true;
                }
            }
        }
        if (finished) { // we have: 0x = b (every matrix element is 0)
            this.maxr = this.r;   // rank(A) == maxr
            for (j = this.n; j < this.np; j++)
                for (i = this.r; i < this.m; i++)
                if (this.a(i, j) != 0) return false; // no solution since b != 0
            return true;    // 0x = 0 has solutions including x = 0
        }

        return false;   // failed in finding a solution
    }

    private swap(array: number[] | number[][], x: number, y: number): void {
        var tmp = array[x];
        array[x] = array[y];
        array[y] = tmp;
    }

    private doBasicSweep(pivoti:number, pivotj:number): void {
        if (this.r != pivoti) this.swap(this.mat, this.r, pivoti);
        if (this.r != pivotj) this.swap(this.cols, this.r, pivotj);
        for (var i = 0; i < this.m; i++)
        {
            if (i != this.r)
            {
                var air = this.a(i, this.r);
                if (air != 0)
                    for (var j = this.r; j < this.np; j++)
                    this.setmat(i, j, this.a(i, j) - this.a(this.r, j) * air);
            }
        }
    }


    private a(i: number, j:number): number {
        return this.mat[i][this.cols[j]];
    }

    private setmat(i: number, j: number, val: number): void {
        this.mat[i][this.cols[j]] = this.modulate(val);
    }

    // --- finite field algebra solver
    private modulate(x: number): number {
        // returns z such that 0 <= z < imgcount and x == z (mod imgcount)
        if (x >= 0) return x % this.imgcount;
        x = (-x) % this.imgcount;
        if (x == 0) return 0;
        return this.imgcount - x;
    }

    private gcd(x: number, y: number): number { // call when: x >= 0 and y >= 0
        if (y == 0) return x;
        if (x == y) return x;
        if (x > y) x = x % y; // x < y
        while (x > 0)
        {
            y = y % x; // y < x
            if (y == 0) return x;
            x = x % y; // x < y
        }
        return y;
    }

    private invert(value: number): number { // call when: 0 <= value < imgcount
        // returns z such that value * z == 1 (mod imgcount), or 0 if no such z
        if (value <= 1) return value;
        var seed = this.gcd(value, this.imgcount);
        if (seed != 1) return 0;
        var a = 1, b = 0, x = value;    // invar: a * value + b * imgcount == x
        var c = 0, d = 1, y = this.imgcount; // invar: c * value + d * imgcount == y
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

