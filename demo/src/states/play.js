/**
* The PlayState in the core state that is used in the game. 
*
* It is the state where majority of the functionality occurs 'in-game' occurs.
* 
*/

PlayState = new Kiwi.State('PlayState');

PlayState.create = function (params) {

	// set some constants
	this.hexSize = 64;
	this.horizontalHexCount = 16;
	this.verticalHexCount = 16;

	this.hexPolygons = new HexMap();
	this.hexPolygons.initRectangularHexMap( this.horizontalHexCount, this.verticalHexCount );
	for (var i = 0; i < this.horizontalHexCount; i++) {
		for (var j = 0; j < this.verticalHexCount; j++) {

			var hexCoords = new HexCoords( i, j);
			// draw the center hex
			var hexCenter = Kiwi.Plugins.hex.geometry.hexCenter(
				hexCoords,
				this.hexSize
			)
			
			var polyVerts = []
			
			for(n = 0; n < 6; n++){
	

				var hexCorner = Kiwi.Plugins.hex.geometry.hexCorner(
					hexCenter,
					this.hexSize,
					n
				)
				polyVerts.push( [hexCorner.i, hexCorner.j] )
			}
			var hexPolygon = new Kiwi.Plugins.Primitives.Polygon( {
				state: this,
				indices: [ 0, 1, 2, 0, 3, 4, 0, 5],
				vertices: polyVerts
			} );
			this.hexPolygons.set( hexCoords, hexPolygon );
			this.addChild( hexPolygon );
		}
	}
	this.recolorHexes()

	this.game.input.mouse.onDown.add( this.recolorHexes, this );
	
	this.addChild( new Kiwi.Plugins.Primitives.Line( {
		state: this,
		x: 0,
		y: 0,
		strokeColor: [ 0.3, 1.0, 0.1 ],
		strokeWidth: 3,
		points: [ [0,0], [  100 * 2.8, 100 ] ]
	} ) );

}

PlayState.update = function () {
	Kiwi.State.prototype.update.call( this );
	console.log(this.game.input.x, this.game.input.y);

	var hexCoords = Kiwi.Plugins.hex.geometry.hexCoordsForCartCoords(
		new CartCoords(this.game.input.x, this.game.input.y),
		this.hexSize
	);
	
	if( hexCoords.i >= 0 && hexCoords.i < this.horizontalHexCount
		&& hexCoords.j >= 0 && hexCoords.j < this.verticalHexCount ){
		this.hexPolygons.get(new HexCoords(hexCoords.i, hexCoords.j)).color = [1.0, 0.8, 0.0];
	}
}

PlayState.recolorHexes = function() {
	for (i = 0; i < this.horizontalHexCount; i++) {
		for (j = 0; j < this.verticalHexCount; j++) {
			this.hexPolygons.get(new HexCoords(i, j)).color = [i/this.horizontalHexCount, j/this.verticalHexCount, 1.0];
		}
	}
}
