/**
 * @file ConanMap toolset
 * @author Julien Sudraud
 * @version 0.1.1
 */
"use strict";

/******************************************
THEME
*******************************************/

/**
 * Theme holder - constructor
 *
 * @param {Boolean} debug - Is the theme in debug mode ?
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
            "fill-opacity": 0.0,
            "stroke-width": 1,
            "stroke-opacity": 0.0,
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
 * Get attributes for highlighted area
 */
Theme.prototype.getHighlighted = function() {
    if (!this.debug) {
        var res = `{
            "stroke": "white",
            "stroke-width": 0,
            "stroke-opacity": 1,
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "fill": "green",
            "fill-opacity": 0.4
        }`;
    } else {
        //debug
        var res = `{
            "stroke": "black",
            "fill": "black",
            "fill-opacity": 0.5,
            "stroke-width": 3,
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
        "stroke-width": 2,
        "stroke-opacity": 1,
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
    }`;
    return $.parseJSON(res);
};

/**
 * Get attributes for viewlines
 */
Theme.prototype.getViewLineDebug = function() {
    var res = `{
        "stroke": "red",
        "stroke-width": 2,
        "stroke-opacity": 1,
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
 * Get attributes for centers circle
 */
Theme.prototype.getCenter = function() {
    var res = `{
        "fill": "#0F0"
    }`;
    return $.parseJSON(res);
};

/******************************************
Center
*******************************************/

/**
 * Center entity - constructor
 *
 * @param {Array} data - center coordonates
 */
function Center(data)
{
    this.x = data[0];
    this.y = data[1];
}

/**
 * Return the x coordonate
 *
 * @return {Number} The x coordonate
 */
Center.prototype.getX = function() {
    return this.x;
};

/**
 * Return the y coordonate
 *
 * @return {Number} The y coordonate
 */
Center.prototype.getY = function() {
    return this.y;
};

/******************************************
Tile
*******************************************/

/**
 * Tile entity - constructor
 *
 * @param {Array} id - id of the tile
 * @param {Array} tile - a list of centers
 */
function Tile(id, tile)
{
    var self = this;
    var defaultZone = 'A';

    self.centers   = {};
    self.id        = id;
    self.perimeter = [];

    if ($.isArray(tile)) {
        self.centers[defaultZone] = new Center(tile);
    } else {
        $.each(tile, function(suffix, coords) {
            self.centers[suffix] = new Center(coords);
        });
    }
}

/**
 * Get the tile id
 *
 * @return {String} The tile id
 */
Tile.prototype.getId = function() {
    return this.id;
};

/**
 * Get the tile centers
 *
 * @return {Array} Centers of the tile
 */
Tile.prototype.getCenters = function() {
    return this.centers;
};

/**
 * Get a tile center base on the given suffix
 *
 * @return {Center} The center based on given suffix
 */
Tile.prototype.getCenter = function(suffix) {
    return this.centers[suffix];
};

/**
 * Set tile perimeter coordonates
 *
 * @param {Array} perimeter - Perimeter coordonates
 *
 * @return {Tile}
 */
Tile.prototype.setPerimeter = function(perimeter) {
    this.perimeter = perimeter;
    return this;
};

/**
 * Return tile perimeter coordonates
 *
 * @return {Array}
 */
Tile.prototype.getPerimeter = function() {
    return this.perimeter;
};


/******************************************
Line
*******************************************/

/**
 * Line entity - constructor
 *
 * @param {Array} line - Line definition
 */
function Line(line)
{
    this.center1 = this.format(line[0]);
    this.center2 = this.format(line[1]);
    this.type  = (line[2] !== "") ? line[2] : false;
    this.text  = (line[3] !== "") ? line[3] : false;
    this.debug = (line[4] !== "") ? line[4] : false;
}

/**
 * Format the tile id with a suffix if the suffix is missing
 *
 * @param {String} tileId - Tile id to format
 *
 * @return {String} The fromatted tile id
 */
Line.prototype.format = function(tileId)
{
    if (tileId.split('-')[1] === undefined) {
        return tileId + '-A';
    }
    return tileId;
};

/**
 * Getter for center1 id
 *
 * @return {String} Center1 id
 */
Line.prototype.getCenter1 = function() {
    return this.center1;
};

/**
 * Getter for center2  id
 *
 * @return {String} Center2 id
 */
Line.prototype.getCenter2 = function() {
    return this.center2;
};

/**
 * Getter for type
 *
 * @return {String} Type
 */
Line.prototype.getType = function() {
    return this.type;
};

/**
 * Getter for additional text
 *
 * @return {String} Additional text
 */
Line.prototype.getText = function() {
    return this.text;
};

/**
 * Getter debug mode
 *
 * @return {Boolean}
 */
Line.prototype.hasDebug = function() {
    return this.debug;
};

/**
 * Check if the line is reciproque or not
 *
 * @return {Boolean}
 */
Line.prototype.isReciproque = function() {
    return true;
};

/**
 * Check if the line used the given center
 *
 * @return {Boolean}
 */
Line.prototype.isElligibleToCenter = function(centerId) {
    return (this.getCenter1() === centerId || (this.isReciproque && this.getCenter2() === centerId));
};

/**
 * For a given center id, return the other center id of the line
 *
 * @return {String} Center id
 */
Line.prototype.getDestinationCenterId = function(centerId) {

    if ( this.getCenter1() === centerId) {
        return this.getCenter2();
    }

    if (this.getCenter2() === centerId) {
        return this.getCenter1();
    }
};

/******************************************
Service Tiles
*******************************************/

/**
 * Line managment service - constructor
 *
 * @param {Object} centers - The centers object definition from user input
 */
function ServiceTiles(centers)
{
    var self = this;
    var tileCenters = $.parseJSON(centers);

    self.tiles = [];

    $.each(tileCenters, function(key, tile){
        self.tiles.push(new Tile(key, tile));
    });
}

/**
 * Get the list of tiles
 *
 * @return {Array}
 */
ServiceTiles.prototype.getTiles = function()
{
    return this.tiles;
};

/**
 * Get a tile based on the given id
 *
 * @param {String} id - the tile id
 *
 * @return {Tile}
 */
ServiceTiles.prototype.getTile = function(id)
{
    var selectedTile = null;
    $.each(this.tiles, function(key, tile){
        if (tile.getId() === id) {
            selectedTile = tile;
        }
    });
    return selectedTile;
};

/**
 * Return a tile id from a given center id
 *
 * @param {String} centerId - A center id
 *
 * @return {String} tile id
 */
ServiceTiles.prototype.getTileId = function(centerId)
{
    return centerId.split('-')[0];
};

/**
 * Return a suffix id from a given center id
 *
 * @param {String} centerId - A center id
 *
 * @return {String} suffix id
 */
ServiceTiles.prototype.getSuffixId = function(centerId)
{
    return centerId.split('-')[1];
};

/**
 * Add tile perimeter coordonates
 *
 * @param {String} tileId     - A tile id
 * @param {Array} coordonates - Tile perimeters coordonates
 *
 * @return {ServiceTiles}
 */
ServiceTiles.prototype.addPerimeter = function(tileId, coordonates)
{
    this.getTile(tileId).setPerimeter(coordonates);
    return this;
};

/**
 * Get tile coordonates from a givent center id
 *
 * @param {String} centerId - A tile center id
 *
 * @return {Center}
 */
ServiceTiles.prototype.getCoordsFromCenterId = function(centerId)
{
    var tileId     = this.getTileId(centerId);
    var tileSuffix = this.getSuffixId(centerId);

    return this.getTile(tileId).getCenter(tileSuffix);
};

/******************************************
Service Lines
*******************************************/

/**
 * Lines managment service - constructor
 *
 * @param {Array} viewLines - The viewLines array definition from user input
 */
function ServiceLines(viewLines)
{
    var self = this;
    self.viewLines = [];
    $.each(viewLines, function(key, line){
        self.viewLines.push(new Line(line));
    });
}

/**
 * Return a array of line thaht used the given center
 *
 * @param {String} centerId - A tile center id
 *
 * @return {Array} An array of lines
 */
ServiceLines.prototype.getLinesByCenter = function(centerId) {
    var eligibleLines = [];

    $.each(this.viewLines, function(key, line){
        if (line.isElligibleToCenter(centerId)) {
            eligibleLines.push(line);
        }
    });

    return eligibleLines;
};

/******************************************
Conan
*******************************************/

/**
 * ConanMap - constructor
 *
 * @param {Raphael} paper    - Raphael render tool
 * @param {Object}  centers  - Center data definition
 * @param {Array}   viewLine - Viewlines data definition
 * @param {Boolean} debug    - Debug mode flag
 * @param {Theme}   theme    - Theme holder
 */
function Conan(centers, viewLine) {

    var mapimage  = $('#mapimage');
    var top       = mapimage.offset().top;
    var left      = mapimage.offset().left;
    var height    = mapimage.height();
    var width     = mapimage.width();

    this.paper    = Raphael(top, left, width, height);
    this.tiles    = new ServiceTiles(centers);
    this.viewLine = new ServiceLines(viewLine);
    this.debug    = (window.location.hash === '#debug');
    this.theme    = new Theme(this.debug);
    this.toRemove = [];

    this.processCoordonates();
    this.mapArea();
}

/**
 * Wrapper for console.log
 *
 * @param {*} data - Data to log
 */
Conan.prototype.log = function(data) {
    var self = this;

    if (self.debug) {
        console.log(data);
    }
};


Conan.prototype.processCoordonates = function() {
    var self = this;
    $('#map').find('area').each(function(){
        var area = $(this);
        var coords = area.attr('coords');
        var id = area.attr('id');

        if (id !== undefined) {
            coords = self.coordConvert(coords);
            self.tiles.addPerimeter(id, coords);
        }
    });
};

/**
 * Instanciante Raphael zones based on html map coordonates
 */
Conan.prototype.mapArea = function() {
    var self = this;

    $.each(self.tiles.getTiles(), function(key, tile) {

        var coords = tile.getPerimeter();

        var zone = self.paper.path(coords).attr(self.theme.getZone());
        zone.hover(
            function() {
                self.displayViewLines(tile.getId());
            },
            function() {
                self.clean();
            }
        );

        //DEBUG : display tile ids on the tile centers
        if (self.debug) {
            var centers = tile.getCenters();
            $.each(centers, function(key, center) {
                var txt = self.paper.text(center.getX(), center.getY(), tile.getId() + key);
                txt.attr(self.theme.getText());
            });
        }
    });
};

/**
 * Transform area coordonates into Raphael coordonates
 *
 * @param {String} coords - Coordonate for the html map area coords
 *
 * @return {Array} - Array of coordonates in Raphael format
 */
Conan.prototype.coordConvert = function(coords) {
    var res = ['M'];
    var coordonates = coords.split(',');

    $.each(coordonates, function(index) {
        if (index !== 0 && index % 2 === 0) {
            res.push('L');
        }
        res.push(coordonates[index]);
    });

    return res;
};

/**
 * Display all view lines for a tile
 *
 * @param {String} tileId - Tile id
 */
Conan.prototype.displayViewLines = function(tileId) {
    var self = this;

    //the current tile data
    var sourceTile = self.tiles.getTile(tileId);

    if (lines.length > 0) {
        //loop on each center of the current tile
        $.each(sourceTile.getCenters(), function(centerSuffix, source) {

            //one of the center of the tile
            var centerId = sourceTile.getId() + '-' + centerSuffix;

             //all the line for a given center
            var lines = self.viewLine.getLinesByCenter(centerId);

            //loop on each line of sight
            $.each(lines, function(key, line) {

                //destination center id
                var destCenterId= line.getDestinationCenterId(centerId);
                //get destination center
                var destination = self.tiles.getCoordsFromCenterId(destCenterId);
                //get destination tile
                var destinationTileId = self.tiles.getTileId(destCenterId);

                //highligt zones
                self.highlight(destinationTileId);

                //draw line
                var drawnLine = self.drawLine(source.getX(), source.getY(), destination.getX(), destination.getY(), line.hasDebug());
                self.toRemove.push(drawnLine);

                //draw circle
                var circle = self.drawCircle(destination.getX(),  destination.getY());
                self.toRemove.push(circle);
            });
        });
    }
};

/**
 * Clean method to remove drawn elements
*/
Conan.prototype.clean = function() {
    var self = this;

    $.each(self.toRemove, function(index, element){
        element.remove();
    });

    self.toRemove = [];
};

/**
 * Highlight a case
 *
 * @param {String} tileId - Id of the tile to highlight
 */
Conan.prototype.highlight = function(tileId) {
    var tile = this.tiles.getTile(tileId);
    var zone = this.paper.path(tile.getPerimeter()).attr(this.theme.getHighlighted());
    this.toRemove.push(zone);
    return zone;
};

/**
 * Draw a line with Raphael
 *
 * @param {number} xFrom  - x coordonate of the source point
 * @param {number} yFrom  - y coordonate of the source point
 * @param {number} xTo    - x coordonate of the dest point
 * @param {number} yTo    - y coordonate of the dest point
 * @param {boolean} debug - is the line in debug mode ?
 */
Conan.prototype.drawLine = function(xFrom, yFrom, xTo, yTo, debug) {
    var self = this;

    var theme = self.theme.getViewLine();
    if (debug) {
        theme = self.theme.getViewLineDebug()
    }

    return this.paper
        .path("M" + xFrom + " " + yFrom + "L"+ xTo + " " + yTo)
        .attr(theme)
        .toBack();
};

/**
 * Draw a cirle with Raphael
 *
 * @param {number} x - x coordonate of the center
 * @param {number} y - y coordonate of the center
 */
Conan.prototype.drawCircle = function(x, y) {
    var self = this;
    return this.paper
        .circle(x, y, 8)
        .attr(self.theme.getCenter())
        .toBack();
};