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
var HexMap = (function () {
    function HexMap() {
    }
    HexMap.prototype.get = function (coords) {
        return new T();
    };
    HexMap.prototype.set = function (coords, value) {
    };
    return HexMap;
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
        var q = (2. / 3 * point.i) / size;
        var r = (-1. / 3 * point.i + Math.sqrt(3) / 3 * point.j) / size;
        return new HexCoords(Math.round(q), Math.round(r));
    }
};
