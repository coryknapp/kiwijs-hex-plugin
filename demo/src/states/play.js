/**
* The PlayState in the core state that is used in the game. 
*
* It is the state where majority of the functionality occurs 'in-game' occurs.
* 
*/

PlayState = new Kiwi.State('PlayState');

PlayState.create = function (params) {
	console.log("create")

	// set some constants
	this.hexSize = 36;
	this.horizontalHexCount = 6;
	this.verticalHexCount = 6;

	// create lines to draw hexes
	this.hexLines = [];
	for (i = 0; i < this.horizontalHexCount; i++) {
		for (j = 0; j < this.verticalHexCount; j++) {

			
			// draw the center hex
			var hexCenter = Kiwi.Plugins.hex.geometry.hexCenter(
				new HexCoords( i, j),
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
				color: [i/this.horizontalHexCount, j/this.verticalHexCount, 1.0],
				state: this,
				indices: [ 0, 1, 2, 0, 3, 4, 0, 5],
				vertices: polyVerts
			} );
			this.addChild( hexPolygon );
		}
	}
	
}

// Push a GameObject into a group, and transfer its transforms to the group.
PlayState.encase = function( entity ) {
	var group = new Kiwi.Group( this );

	group.addChild( entity );
	group.x = entity.x;
	group.y = entity.y;
	entity.x = 0;
	entity.y = 0;

	return group;
};

// called by kiwi in a regular interval
PlayState.update = function () {
	//this.draw
}

// called by kiwi upon mouse/touch events
PlayState.onTap = function (x,y) {	
	console.log("onTap ", x, ', ', y)
}

PlayState.draw = function () {

}
