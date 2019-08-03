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

	this.hexCenterColor = [ 1.0, 0.2, 0.1 ];
	this.hexCornerColor = [ 1.0, 0.2, 1.0 ];

	// create lines to draw hexes
	this.hexLines = [];
	for (i = 0; i < this.horizontalHexCount; i++) {
		for (j = 0; j < this.verticalHexCount; j++) {
			
			// draw the center hex
			var hexCenter = Kiwi.Plugins.hex.geometry.hexCenter(
				new HexCoords( i, j),
				this.hexSize
			)
			var centerCircle = new Kiwi.Plugins.Primitives.Ellipse( {
				state: this,
				x: hexCenter.i,
				y: hexCenter.j,
				radius: 8,
				segments: 8,
				centerOnTransform: true,
				color: this.hexCenterColor,
				
			} );
			this.addChild( centerCircle );
			
			for(n = 0; n < 3; n++){
				var hexCorner = Kiwi.Plugins.hex.geometry.hexCorner(
					hexCenter,
					this.hexSize,
					n
				)
				var cornerCircle = new Kiwi.Plugins.Primitives.Ellipse( {
					state: this,
					x: hexCorner.i,
					y: hexCorner.j,
					radius: 4,
					segments: 8,
					centerOnTransform: true,
					color: this.hexCornerColor,
					
				} );
				this.addChild( cornerCircle );	
			}
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
