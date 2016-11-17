/**
 * Constructor
 */
function Theme(debug) {
	this.debug = debug;
}	

/**
 * Get attributes for area overlay
 */
Theme.prototype.getZone = function() {
	if (!this.debug) {
		var res = `{
		    "stroke": "black", 
		    "fill": "white",
		    "fill-opacity": 0.1,
		    "stroke-width": 1,
		    "stroke-opacity": 0.1,
		    "stroke-linecap": "round",
		    "stroke-linejoin": "round"
		}`;
	} else {
		//debug
		var res = `{
		    "stroke": "black", 
		    "fill": "white",
		    "fill-opacity": 0.5,
		    "stroke-width": 1,
		    "stroke-opacity": 0.5,
		    "stroke-linecap": "round",
		    "stroke-linejoin": "round"
		}`;

	}
	return $.parseJSON(res);
};

/**
 * Get attributes for viewlines
 */
Theme.prototype.getViewLine = function() {
	var res = `{
	    "stroke": "white", 
	    "stroke-width": 5,
	    "stroke-opacity": 0.6,
	    "stroke-linecap": "round",
	    "stroke-linejoin": "round"
	}`;
	return $.parseJSON(res);
};

/**
 * Get attributes for debug text
 */
Theme.prototype.getText = function() {
	var res = `{
	    "stroke": "red", 
	    "stroke-width": 1
	}`;
	return $.parseJSON(res);
};


/**
 * Constructor
 */
function Conan(paper, centerCoordonate, viewLine, icons, debug, theme) {
	this.paper            = paper;
	this.centerCoordonate = $.parseJSON(centerCoordonate);
	this.viewLine 		  = $.parseJSON(self.viewLine);
	this.icons 			  = $.parseJSON(icons);
	this.debug 			  = debug;
	this.theme 			  = theme;

	this.toRemove = [];
	
    this.mapArea(); 
}		

/**
 * Wrapper for console.log
 */
Conan.prototype.log = function(mixed) {
	var self = this;

	if (self.debug) {
		console.log(mixed);
	}
};

/**
 * Create Raphael zones based on html map coordonates
 */
Conan.prototype.mapArea = function() {
    var self = this;

	$("#map area").each(function(){
		
		area = $(this);
		coords = area.attr('coords');
		id = area.attr('id');

		if (id != undefined) {
			
			coords = self.coordProcess(coords);

			zone = self.paper.path(coords).attr(self.theme.getZone());
			zone.id = id;
			zone.hover(
				function() {
					self.displayViewLine(this.id);
				},
				function() {
					self.clean();
				}
			);
			
		//DEBUG : display case id one the case
		if (self.debug) {
			source = self.centerCoordonate[id];
			var txt = self.paper.text(source.x, source.y, id);
			txt.attr(self.theme.getText());
			}
		}
	});
};

/**
 * Transform area coordonates into Raphael coordonates
 */
Conan.prototype.coordProcess = function(coords) {
	var self = this;

	//TODO REFACTO ??
	var res = [];
	coords = coords.split(',');
	$.each(coords, function(index){
		if (index == 0) {
			res.push('M');
		} else if (index % 2 == 0) {
			res.push('L');
		}
		res.push(coords[index]);
		
	});
	self.log(res);
	return res;
};

/**
 * Display all view lines for a case
 */
Conan.prototype.displayViewLine = function(id) {
	var self = this;

	if (self.viewLine[id] != undefined) {

		source = self.centerCoordonate[id];
		destinations = self.viewLine[id]['dest'];

		$.each(destinations, function(index) {
			//get a dest
			dest = destinations[index];
			currentDest = self.centerCoordonate[dest.case];
			

			//draw line 
			line = self.drawLine(source.x, source.y, currentDest.x, currentDest.y);
			self.toRemove.push(line);

			//draw icons
			if (dest.icon != undefined && dest.icon != '')  {
				xIcon = parseInt((source.x + currentDest.x) / 2);
				yIcon = parseInt((source.y + currentDest.y) / 2);
				icon = self.paper.image(dest.icon, xIcon, yIcon, 50, 50).toBack();
				self.toRemove.push(icon);
			}
		});
	}
};

/**
 * Remove needed elements 
 */
Conan.prototype.clean = function(id) {
	var self = this;

	$.each(self.toRemove, function(index){
		self.toRemove[index].remove();
	});

	self.toRemove = [];
};

/**
 * Draw a line with Raphael
 */
Conan.prototype.drawLine = function(xFrom, yFrom, xTo, yTo) {
	var self = this;
	return this.paper
		.path("M" + xFrom + " " + yFrom + "L"+ xTo + " " + yTo)
		.attr(self.theme.getViewLine())
		.toBack();
};