export class GameSolver {

    private matrix: number[][];
    private columns: number[];
    private matrixLength = 3;
    private matrixSize = Math.pow(this.matrixLength, 2);

    public solve() {
        for(let goal = 0; goal < 2; goal++){
            const anscols: any = [];
            for (let i = 0; i < this.matrixLength; i++) {
            }
        }
    }

    private solveProblem() {
        const matrixLength = this.matrixLength;
        const size = Math.pow(matrixLength, 2);
        

    }

    private swap(array: any[], i: any, j: any): void {
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    private initMatrix() {
        this.matrix = [];
        for (var col = 0; col < this.matrixLength; col++)
            for (var row = 0; row < this.matrixLength; row++)
        {
            var i = row * this.matrixLength + col;
            var line = new Array();
            this.matrix[i] = line;
            for (var j = 0; j < this.matrixSize; j++) line[j] = 0;
            line[i] = 1;
            if (col > 0) line[i - 1] = 1;
            if (row > 0) line[i - this.matrixLength] = 1;
            if (col < this.matrixLength - 1) line[i + 1] = 1;
            if (row < this.matrixLength - 1) line[i + this.matrixLength] = 1;
        }
        this.columns = new Array();
        for (var j = 0; j < this.matrixSize + 1; j++) this.columns[j] = j;
    }

    private a(i: number, j: number) {
        return this.matrix[i][this.columns[j]];
    }

    private setMatrix(i: number, j: number, val: number) {
        this.matrix[i][this.columns[j]] = this.modulate(val); 
    }

    private modulate(x: number) {
        // returns z such that 0 <= z < imgcount and x == z (mod imgcount)
        if (x >= 0) return x % 2;

        x = (-x) % 2;
        if (x == 0) return 0;

        return 2 - x;
    }

    private gcd(x: number, y :number) { 
        // call when: x >= 0 and y >= 0
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

    private invert(value: number) {
        // call when: 0 <= value < imgcount
        // returns z such that value * z == 1 (mod imgcount), or 0 if no such z
        if (value <= 1) return value;

        const seed = this.gcd(value, 2);

        if (seed != 1) return 0;

        let a = 1, b = 0, x = value;    // invar: a * value + b * imgcount == x
        let c = 0, d = 1, y = 2; // invar: c * value + d * imgcount == y
       
        while (x > 1)
        {
            let tmp = Math.floor(y / x);
            y -= x * tmp;
            c -= a * tmp;
            d -= b * tmp;

            tmp = a;
            a = c;
            c = tmp;

            tmp = b;
            b = d;
            d = tmp;

            tmp = x;
            x = y;
            y = tmp;
        }

        return a;
    }

}