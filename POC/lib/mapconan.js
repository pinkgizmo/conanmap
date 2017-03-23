"use strict";

/******************************************
THEME
*******************************************/

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
}

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
}


/**
 * Get attributes for debug text
 */
Theme.prototype.getText = function() {
    var res = `{
        "stroke": "red",
        "stroke-width": 1
    }`;
    return $.parseJSON(res);
}

/******************************************
Case
*******************************************/

function Tile(id, tile)
{
    var self = this;
    var defaultZone = 'A';

    self.centers = {};
    self.id = id;

    if (!$.isArray(tile)) {
        $.each(tile, function(key, centers) {
            self.centers[key] = centers;
        });
    } else {
        self.centers[defaultZone] = tile;
    }
}

Tile.prototype.getId = function() {
    return this.id;
}

Tile.prototype.getCenters = function(suffix) {
    return this.centers;
}

Tile.prototype.getCenter = function(suffix) {
    return this.centers[suffix];
}

/******************************************
Line
*******************************************/

function Line(line)
{
    this.case1 = this.format(line[0]);
    this.case2 = this.format(line[1]);
    this.type  = (line[2] != "") ? line[2]: false;
    this.text  = (line[3] != "") ? line[3]: false;
    this.debug = (line[4] != "") ? line[4]: false;
}

Line.prototype.format = function(caseId)
{
    if (caseId.split('-')[1] === undefined) {
        return caseId + '-A';
    }
    return caseId;
}

Line.prototype.getCase1 = function() {
    return this.case1;
}

Line.prototype.getCase2 = function() {
    return this.case2;
}

Line.prototype.getType = function() {
    return this.type;
}

Line.prototype.getText = function() {
    return this.text;
}

Line.prototype.getDebug = function() {
    return this.debug;
}

Line.prototype.isReciproque = function() {
    return true;
}

Line.prototype.isElligibleToCase = function(caseId) {

    if (this.getCase1() == caseId) {
        return true;
    }

    if (this.isReciproque && this.getCase2() == caseId) {
        return true;
    }

    return false;
}

Line.prototype.getDestination = function(caseId) {

    if ( this.getCase1() == caseId) {
        return this.getCase2();
    }

    if (this.getCase2() == caseId) {
        return this.getCase1();
    }
}

/******************************************
Service Line
*******************************************/

function ServiceTiles(centers)
{
    var self = this;
    var centers = $.parseJSON(centers);

    self.tiles = [];

    $.each(centers, function(key, tile){
        self.tiles.push(new Tile(key, tile));
    });
}

ServiceTiles.prototype.getTile = function(id)
{
    var selectedTile;
    $.each(this.tiles, function(key, tile){
        if (tile.getId() == id) {
            selectedTile = tile;
            return;
        }
    });
    return selectedTile;
}

/******************************************
Service Line
*******************************************/

function ServiceLines(viewLines)
{
    var self = this;
    self.viewLines = [];
    $.each(viewLines, function(key, line){
        self.viewLines.push(new Line(line));
    });
    console.log(self.viewLines);
}

/**
 * Getter for viewLine data
 */
ServiceLines.prototype.getViewLines = function() {
    return this.viewLines;
}

/**
 * Getter for viewLine data
 */
ServiceLines.prototype.getLinesByCase = function(caseId) {
    var self = this;
    var eligibleLines = [];

    $.each(this.getViewLines(), function(key, line){
        if (line.isElligibleToCase(caseId)) {
            eligibleLines.push(line);
        }
    });
    return eligibleLines;
}

/******************************************
Conan
*******************************************/

/**
 * Constructor
 */
function Conan(paper, centers, viewLine, debug, theme) {
    this.paper    = paper;
    this.tiles    = new ServiceTiles(centers);
    this.viewLine = new ServiceLines(viewLine);
    this.debug    = debug;
    this.theme    = theme;


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

        var area = $(this);
        var coords = area.attr('coords');
        var id = area.attr('id');

        if (id != undefined) {

            coords = self.coordConvert(coords);

            var zone = self.paper.path(coords).attr(self.theme.getZone());
            zone.id = id;
            zone.hover(
                function() {
                    self.displayViewLines(this.id);
                },
                function() {
                    self.clean();
                }
            );

            //DEBUG : display case id on the case
            if (self.debug) {
                var centers = self.tiles.getTile(id).getCenters();
                $.each(centers, function(key, center) {
                    var txt = self.paper.text(center[0], center[1], id + key);
                    txt.attr(self.theme.getText());
                });
            }
        }
    });
};

/**
 * Transform area coordonates into Raphael coordonates
 */
Conan.prototype.coordConvert = function(coords) {
    var self = this;

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
    return res;
};

/**
 * Display all view lines for a case
 */
Conan.prototype.displayViewLines = function(caseId) {
    var self = this;
    var source;
    var centerId;
    var destination;
    var circle;

    //the current case data
    source = self.tiles.getTile(caseId);
    
    if (lines.length > 0) {
        //loop on each center of the current case
        $.each(source.getCenters(), function(suffix, sourceCoords) { 

            //one of the center of the case
            var centerId = source.id + '-' + suffix;

             //all the line for a given case
            var lines = self.viewLine.getLinesByCase(centerId);

            //loop on each line of sight
            $.each(lines, function(key, line) {    
          
                //one of the center of the case
                centerId = source.id + '-' + suffix;
                
                destination = line.getDestination(centerId);
                var dest = destination.split('-')[0];
                var destSuffix = destination.split('-')[1];
              
                var destCoords = self.tiles.getTile(dest).getCenter(destSuffix);
                
                //draw line
                line = self.drawLine(sourceCoords[0], sourceCoords[1], destCoords[0], destCoords[1]);
                self.toRemove.push(line);

                //draw circle
                circle = self.drawCircle(destCoords[0],  destCoords[1]);
                self.toRemove.push(circle);
                
            });
        });
    }
};

/**
 * Remove needed elements
 */
Conan.prototype.clean = function(id) {
    var self = this;

    $.each(self.toRemove, function(index, element){
        element.remove();
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

/**
 * Draw a circle with Raphael
 */
Conan.prototype.drawCircle = function(xTo, yTo) {
    var self = this;
    return this.paper
        .circle(xTo,yTo,8)
        .attr("fill", "#0F0")
        .toBack();
};