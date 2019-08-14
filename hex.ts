// Silence errors associated with the absence of this declaration in the d.ts file.
declare module Kiwi {
    let Plugins: any;
}

//
Kiwi.Plugins.hex = {
    name: 'hex',
    version: '1.0.0'
};

Kiwi.PluginManager.register(Kiwi.Plugins.hex);

class HexCoords {
	i: number;
	j: number;
	constructor(i: number, j: number) {
		this.i = i;
		this.j = j;
    }

	// XXX undecided about if this should be a class member or a free function
	public getAdjacent(coords: HexCoords): HexCoords[] {
		// XXX obviously these are the wrong results
		var adjacentList: HexCoords[];
		for(var i = -1; i <= i; i++){ 
			for(var j = -1; j <= j; j++){ 
				if( i != 0 || j != 0 ){
					adjacentList.push(new HexCoords(coords.i + i, coords.j + j));
				}
			}
		}
		return adjacentList;
	}
}

class CartCoords {
	i: number;
	j: number;
	constructor(i: number, j: number) {
		this.i = i;
		this.j = j;
    }
}

class IntegerIndexedArray<T> {
	
	private _posBack: (T | null)[] = new Array<(T | null)>();
	private _negBack: (T | null)[] = new Array<(T | null)>();
	
	constructor(positiveSize?: number, negativeSize?: number) {

		console.log("ctor");

		if( positiveSize != null ){
			for (var i = 0, len = positiveSize; i < len; i++) {
				this._posBack.push( null );
				console.log("+");
			}
		}	
		if( negativeSize != null ){
			for (var i = 0, len = negativeSize; i < len; i++) {
				this._negBack.push( null );
			}
			console.log("-");
		}	
	};

	get(i: number): T {
		if( i >= 0 ){
			return this._posBack[i]
		}
		return this._negBack[ -i - 1 ];
	}

	set(i: number, value: T) {
		if( i >= 0 ){
			this._posBack[i] = value;
		}
		return this._negBack[ -i - 1 ] = value;
	}

	negitiveCount(): number {
		return this._negBack.length;
	}
	
	positiveCount(): number {
		return this._posBack.length;
	}

	
	length(): number {
		return this.negitiveCount() + this.positiveCount();
	}
}

class IntegerIndexedArrayIterator<T> implements Iterator<T> {
	
	private _array: IntegerIndexedArray<T>

	// initialized as negative (if there's negative indexes)
	private _index: number;
	
	constructor(array: IntegerIndexedArray<T>){
		this._array = array;

		var nLength = this._array.negitiveCount();
		if( nLength > 0 ){
			this._index = -nLength;
		} else {
			this._index = this._array.positiveCount();
		}
	}

	next(value?: any): IteratorResult<T>{
		if (this._index < this._array.positiveCount()) {
			return {
				done: false,
				value: this._array.get(this._index)
	  		}
		} else {
			return {
				done: true,
				value: null
			}
		}
	}
}

class HexMap<T> {
	
	private _storage: IntegerIndexedArray<IntegerIndexedArray<T>>;

	constructor() {
		this._storage = new IntegerIndexedArray<IntegerIndexedArray<T>>();
	}

	public get(coords: HexCoords): T {
		return this._storage.get(coords.i).get(coords.j);
	}

	public set(coords: HexCoords, value: T): void {
		this._storage.get(coords.i).set(coords.j, value);
	}

	// Because of the transformed coordinate system storing hexs in a array of arrays produces a slanty tiling.
	// This returns a map of irregular lists that should appear to be as close to a rectangle as we can get.
	public initRectangularHexMap(width: number, depth: number): HexMap<(T|null)> {
		var map = new HexMap<(T|null)>();

		this._storage = new IntegerIndexedArray<IntegerIndexedArray<T>>(width);
		for(var i=0; i<width; i++){
			this._storage.set(i, new IntegerIndexedArray<T>(depth, 0));
		}

		return map;
	}

	public _iteratorForColumn(col: number): IntegerIndexedArrayIterator<T>{
		return new IntegerIndexedArrayIterator(this._storage.get(col));
	}
}


class HexMapIterator<T> implements Iterator<T> {
	private _hexMap: HexMap<T>;

	private _i: number;
	private _iterator: IntegerIndexedArrayIterator<T>;

	constructor(hexMap: HexMap<T>) {
		this._hexMap = hexMap;
		this._i = 0;
		this._iterator = this._hexMap._iteratorForColumn(this._i++);
	}

	next(value?: any): IteratorResult<T>{
		var nextValue = this._iterator.next();
		if(nextValue.done){
			this._iterator = this._hexMap._iteratorForColumn(this._i++);
			return this.next();
		}
		return nextValue;
	}
}

//You can also add a new quest object using this function. Please note that if one already exists the previous one will be over-written.
Kiwi.Plugins.hex.geometry = {

	constants: {
			
	},

	hexDimensions:
		function(size: number): any {
			// `size` is side length.  Calculate other dimensions.

			return {
				// across the middle horizontally
				width: size * 2,
				// height, from the top horizontal to the bottom horizontal
				height: size * Math.sqrt(3),
				halfHeight: size * Math.sqrt(3)/2,
				horizontalDiff: size/2
			}
		},
	
	hexCenter:
		function(coords: HexCoords, size: number): CartCoords {

			var x = size * (3./2 * coords.i)
    		var y = size * (Math.sqrt(3)/2 * coords.i + Math.sqrt(3) * coords.j)
    		return new CartCoords(x, y)

			var dim = Kiwi.Plugins.hex.geometry.hexDimensions(size);

			var jOffset = 0;
   			if (coords.i % 2 == 1) {
				jOffset = dim.halfHeight;  
			}  

			return new CartCoords(
				coords.i * (size * 2 - dim.horizontalDiff),
				coords.j * dim.height + jOffset
			)
		},

	hexCorner:
		function(center: CartCoords, size: number, i: number): CartCoords {
			var angle_deg = 60 * i;
			var angle_rad = Math.PI / 180 * angle_deg;
			return new CartCoords(
				center.i + size * Math.cos(angle_rad),
				center.j + size * Math.sin(angle_rad)
			)
		},

	hexCoordsForCartCoords:
		function(point: CartCoords, size: number): HexCoords {

/////////////// let's figure out how to ^-1 this function
			/* var dim = Kiwi.Plugins.hex.geometry.hexDimensions(size); */

			/* var jOffset = 0; */
   			/* if (coords.i % 2 == 1) { */
			/* 	jOffset = dim.halfHeight; */  
			/* } */  

			/* return new CartCoords( */
			/* 	coords.i * (size * 2 - dim.horizontalDiff), */
			/* 	coords.j * dim.height + jOffset */
			/* ) */
//////////////

			// perform of change of basis 
    		var q = Math.round(( 2./3 * point.i ) / size);
    		var r = Math.round((-1./3 * point.i + Math.sqrt(3)/3 * point.j) / size);

			// make adjustments 

    		return new HexCoords( q, r );
		},
}
