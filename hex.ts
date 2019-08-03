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

class EuclidianCoords {
	i: number;
	j: number;
	constructor(i: number, j: number) {
		this.i = i;
		this.j = j;
    }
}

class HexMap<T> {
	
	private storage: T[][];

	public get(coords: HexCoords): T {
		//XXX
		return new T();
	}

	public set(coords: HexCoords, value: T): void {

	}
}


//You can also add a new quest object using this function. Please note that if one already exists the previous one will be over-written.
Kiwi.Plugins.hex.geometry = {

	hexDimensions:
		function(size: number) {
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
		function(coords: HexCoords, size: number){

			var dim = Kiwi.Plugins.hex.geometry.hexDimensions(size);

			
			var jOffset = 0;
   			if (coords.i % 2 == 1) {
				jOffset = dim.halfHeight;  
			}  

			return new EuclidianCoords(
				coords.i * (size * 2 - dim.horizontalDiff) + 80,
				coords.j * dim.height + 80 + jOffset
			)
		},

	hexCorner:
		function(center: EuclidianCoords, size: number, i: number): EuclidianCoords{
			var angle_deg = 60 * i;
			var angle_rad = Math.PI / 180 * angle_deg;
			return new EuclidianCoords(
				center.i + size * Math.cos(angle_rad),
				center.j + size * Math.sin(angle_rad)
			)
		},


}
