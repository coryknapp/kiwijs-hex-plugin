Kiwi.Plugins.hex = {
    name: 'hex',
    version: '1.0.0'
};
Kiwi.PluginManager.register(Kiwi.Plugins.hex);
var HexCoords = (function () {
    function HexCoords(i, j) {
        this.i = i;
        this.j = j;
    }
    HexCoords.prototype.getAdjacent = function (coords) {
        var adjacentList;
        for (var i = -1; i <= i; i++) {
            for (var j = -1; j <= j; j++) {
                if (i != 0 || j != 0) {
                    adjacentList.push(new HexCoords(coords.i + i, coords.j + j));
                }
            }
        }
        return adjacentList;
    };
    return HexCoords;
}());
var CartCoords = (function () {
    function CartCoords(i, j) {
        this.i = i;
        this.j = j;
    }
    return CartCoords;
}());
var IntegerIndexedArray = (function () {
    function IntegerIndexedArray(positiveSize, negativeSize) {
        this._posBack = new Array();
        this._negBack = new Array();
        console.log("ctor");
        if (positiveSize != null) {
            for (var i = 0, len = positiveSize; i < len; i++) {
                this._posBack.push(null);
                console.log("+");
            }
        }
        if (negativeSize != null) {
            for (var i = 0, len = negativeSize; i < len; i++) {
                this._negBack.push(null);
            }
            console.log("-");
        }
    }
    ;
    IntegerIndexedArray.prototype.get = function (i) {
        if (i >= 0) {
            return this._posBack[i];
        }
        return this._negBack[-i - 1];
    };
    IntegerIndexedArray.prototype.set = function (i, value) {
        if (i >= 0) {
            this._posBack[i] = value;
        }
        return this._negBack[-i - 1] = value;
    };
    IntegerIndexedArray.prototype.negitiveCount = function () {
        return this._negBack.length;
    };
    IntegerIndexedArray.prototype.positiveCount = function () {
        return this._posBack.length;
    };
    IntegerIndexedArray.prototype.length = function () {
        return this.negitiveCount() + this.positiveCount();
    };
    return IntegerIndexedArray;
}());
var IntegerIndexedArrayIterator = (function () {
    function IntegerIndexedArrayIterator(array) {
        this._array = array;
        var nLength = this._array.negitiveCount();
        if (nLength > 0) {
            this._index = -nLength;
        }
        else {
            this._index = this._array.positiveCount();
        }
    }
    IntegerIndexedArrayIterator.prototype.next = function (value) {
        if (this._index < this._array.positiveCount()) {
            return {
                done: false,
                value: this._array.get(this._index)
            };
        }
        else {
            return {
                done: true,
                value: null
            };
        }
    };
    return IntegerIndexedArrayIterator;
}());
var HexMap = (function () {
    function HexMap() {
        this._storage = new IntegerIndexedArray();
    }
    HexMap.prototype.get = function (coords) {
        return this._storage.get(coords.i).get(coords.j);
    };
    HexMap.prototype.set = function (coords, value) {
        this._storage.get(coords.i).set(coords.j, value);
    };
    HexMap.prototype.initRectangularHexMap = function (width, depth) {
        var map = new HexMap();
        this._storage = new IntegerIndexedArray(width);
        for (var i = 0; i < width; i++) {
            this._storage.set(i, new IntegerIndexedArray(depth, 0));
        }
        return map;
    };
    HexMap.prototype._iteratorForColumn = function (col) {
        return new IntegerIndexedArrayIterator(this._storage.get(col));
    };
    return HexMap;
}());
var HexMapIterator = (function () {
    function HexMapIterator(hexMap) {
        this._hexMap = hexMap;
        this._i = 0;
        this._iterator = this._hexMap._iteratorForColumn(this._i++);
    }
    HexMapIterator.prototype.next = function (value) {
        var nextValue = this._iterator.next();
        if (nextValue.done) {
            this._iterator = this._hexMap._iteratorForColumn(this._i++);
            return this.next();
        }
        return nextValue;
    };
    return HexMapIterator;
}());
Kiwi.Plugins.hex.geometry = {
    constants: {},
    hexDimensions: function (size) {
        return {
            width: size * 2,
            height: size * Math.sqrt(3),
            halfHeight: size * Math.sqrt(3) / 2,
            horizontalDiff: size / 2
        };
    },
    hexCenter: function (coords, size) {
        var x = size * (3. / 2 * coords.i);
        var y = size * (Math.sqrt(3) / 2 * coords.i + Math.sqrt(3) * coords.j);
        return new CartCoords(x, y);
        var dim = Kiwi.Plugins.hex.geometry.hexDimensions(size);
        var jOffset = 0;
        if (coords.i % 2 == 1) {
            jOffset = dim.halfHeight;
        }
        return new CartCoords(coords.i * (size * 2 - dim.horizontalDiff), coords.j * dim.height + jOffset);
    },
    hexCorner: function (center, size, i) {
        var angle_deg = 60 * i;
        var angle_rad = Math.PI / 180 * angle_deg;
        return new CartCoords(center.i + size * Math.cos(angle_rad), center.j + size * Math.sin(angle_rad));
    },
    hexCoordsForCartCoords: function (point, size) {
        var q = Math.round((2. / 3 * point.i) / size);
        var r = Math.round((-1. / 3 * point.i + Math.sqrt(3) / 3 * point.j) / size);
        return new HexCoords(q, r);
    }
};
