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
function Theme(debug, option) {
    this.debug = debug;
    this.option = option;
}

/**
 * Get attributes for area overlay
 */
Theme.prototype.getZone = function () {
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
            "fill-opacity": 0.1,
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
Theme.prototype.getHighlightedArea = function () {
    var res = `{
          "stroke": "white",
          "stroke-width": 0,
          "stroke-opacity": 1,
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "fill": "green",
          "fill-opacity": 0.4
      }`;
    return $.parseJSON(res);
};

/**
 * Get attributes for overhang area
 */
Theme.prototype.getOverhangArea = function () {
    var res = `{
          "stroke": "white",
          "stroke-width": 0,
          "stroke-opacity": 1,
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "fill": "yellow",
          "fill-opacity": 0.4
      }`;
    return $.parseJSON(res);
};

/**
 * Get attributes for promontory area
 */
Theme.prototype.getPromontory = function () {
    var res = `{
          "stroke": "white",
          "stroke-width": 0,
          "stroke-opacity": 1,
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "fill": "url(assets/images/hatch.jpg)",
          "fill-opacity": 0.6
      }`;

    return $.parseJSON(res);
};

/**
 * Get attributes for promontory area
 */
Theme.prototype.getLevel = function (level) {
    var colors = this.option.getOption('colors');
    var color = colors[level];

    var res = `{
          "stroke": "white",
          "stroke-width": 0,
          "stroke-opacity": 1,
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "fill": "` + color + `",
          "fill-opacity": 0.6
      }`;

    return $.parseJSON(res);
};

/**
 * Get attributes for viewlines
 */
Theme.prototype.getViewLine = function () {
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
 * Get attributes for viewlines debug
 */
Theme.prototype.getViewLineDebug = function () {
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
 * Get attributes for viewlines overhang
 */
Theme.prototype.getViewLineOverhang = function () {
    var res = `{
        "stroke": "yellow",
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
Theme.prototype.getText = function () {
    var res = `{
        "stroke": "red",
        "stroke-width": 1
    }`;
    return $.parseJSON(res);
};

/**
 * Get attributes for centers circle
 */
Theme.prototype.getCenter = function () {
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
function Center(data) {
    this.x = data[0];
    this.y = data[1];
}

/**
 * Return the x coordonate
 *
 * @return {Number} The x coordonate
 */
Center.prototype.getX = function () {
    return this.x;
};

/**
 * Return the y coordonate
 *
 * @return {Number} The y coordonate
 */
Center.prototype.getY = function () {
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
function Tile(id, tile) {
    var self = this;

    self.centers = {};
    self.id = id;
    self.perimeter = [];
    self.promontory = false;
    self.level = 0;

    if (typeof (tile.A) !== "undefined") {
        self.centers['A'] = new Center(tile.A);
    }

    if (typeof (tile.B) !== "undefined") {
        self.centers['B'] = new Center(tile.B);
    }

    if (typeof (tile.promontory) !== "undefined") {
        self.promontory = tile.promontory;
    }

    if (typeof (tile.level) !== "undefined") {
        self.level = tile.level;
    }

    /**
     * Retrocompatibility for old tile definition
     * deprecated
     */
    if ($.isArray(tile)) {
        self.centers['A'] = new Center(tile);
    }
}

/**
 * Get the tile id
 *
 * @return {String} The tile id
 */
Tile.prototype.getId = function () {
    return this.id;
};

/**
 * Get the tile centers
 *
 * @return {Array} Centers of the tile
 */
Tile.prototype.getCenters = function () {
    return this.centers;
};

/**
 * Get a tile center base on the given suffix
 *
 * @return {Center} The center based on given suffix
 */
Tile.prototype.getCenter = function (suffix) {
    return this.centers[suffix];
};

/**
 * Set tile perimeter coordonates
 *
 * @param {Array} perimeter - Perimeter coordonates
 *
 * @return {Tile}
 */
Tile.prototype.setPerimeter = function (perimeter) {
    this.perimeter = perimeter;
    return this;
};

/**
 * Return tile perimeter coordonates
 *
 * @return {Array}
 */
Tile.prototype.getPerimeter = function () {
    return this.perimeter;
};

/**
 * Check if the tile is a promontory
 *
 * @return {Boolean}
 */
Tile.prototype.isPromontory = function () {
    return this.promontory;
};

/**
 * Return tile level coordonates
 *
 * @return {integer}
 */
Tile.prototype.getLevel = function () {
    return this.level;
};

/******************************************
 Line
 *******************************************/

/**
 * Line entity - constructor
 *
 * @param {Array} line - Line definition
 */
function Line(line) {

    if ($.isArray(line)) {
        /**
         * Retrocompatibility for old line definition
         * deprecated
         */
        this.center1 = this.format(line[0]);
        this.center2 = this.format(line[1]);
        this.debug = (line[4] !== "") ? line[4] : false;
    } else {
        this.center1 = this.format(line.line[0]);
        this.center2 = this.format(line.line[1]);

        if (line.overhang !== "undefined") {
            this.overhang = line.overhang;
        }

        if (line.overhang !== "undefined") {
            this.overhangPosition = line.overhangPosition;
        }

        if (line.debug !== "undefined") {
            this.debug = line.debug;
        }
    }
}

/**
 * Format the tile id with a suffix if the suffix is missing
 *
 * @param {String} tileId - Tile id to format
 *
 * @return {String} The fromatted tile id
 */
Line.prototype.format = function (tileId) {
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
Line.prototype.getCenter1 = function () {
    return this.center1;
};

/**
 * Getter for center2  id
 *
 * @return {String} Center2 id
 */
Line.prototype.getCenter2 = function () {
    return this.center2;
};

Line.prototype.hasOverhang = function () {
    return this.overhang;
};

Line.prototype.getOverhangPosition = function () {
    return this.overhangPosition;
};

/**
 * Getter for type
 *
 * @return {String} Type
 */
Line.prototype.getType = function () {
    return this.type;
};

/**
 * Getter for additional text
 *
 * @return {String} Additional text
 */
Line.prototype.getText = function () {
    return this.text;
};

/**
 * Getter debug mode
 *
 * @return {Boolean}
 */
Line.prototype.hasDebug = function () {
    return this.debug;
};

/**
 * Check if the line is reciproque or not
 *
 * @return {Boolean}
 */
Line.prototype.isReciproque = function () {
    return true;
};

/**
 * Check if the line used the given center
 *
 * @return {Boolean}
 */
Line.prototype.isElligibleToCenter = function (centerId) {
    return (this.getCenter1() === centerId || (this.isReciproque && this.getCenter2() === centerId));
};

/**
 * For a given center id, return the other center id of the line
 *
 * @return {String} Center id
 */
Line.prototype.getDestinationCenterId = function (centerId) {

    if (this.getCenter1() === centerId) {
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
function ServiceTiles(centers) {
    var self = this;
    var tileCenters = $.parseJSON(centers);

    self.tiles = [];

    $.each(tileCenters, function (key, tile) {
        self.tiles.push(new Tile(key, tile));
    });
}

/**
 * Get the list of tiles
 *
 * @return {Array}
 */
ServiceTiles.prototype.getTiles = function () {
    return this.tiles;
};

/**
 * Get the list of tiles
 *
 * @return {Array}
 */
ServiceTiles.prototype.getPromontoryTiles = function () {
    var promontoryTiles = [];

    $.each(this.tiles, function (key, tile) {
        if (tile.isPromontory()) {
            promontoryTiles.push(tile);
        }
    });

    return promontoryTiles;
};

/**
 * Get the list of tiles
 *
 * @return {Array}
 */
ServiceTiles.prototype.getLevelTiles = function () {
    var levelTiles = [];

    $.each(this.tiles, function (key, tile) {
        if (tile.getLevel() !== 0) {
            levelTiles.push(tile);
        }
    });

    return levelTiles;
};

/**
 * Get a tile based on the given id
 *
 * @param {String} id - the tile id
 *
 * @return {Tile}
 */
ServiceTiles.prototype.getTile = function (id) {
    var selectedTile = null;
    $.each(this.tiles, function (key, tile) {
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
ServiceTiles.prototype.getTileId = function (centerId) {
    return centerId.split('-')[0];
};

/**
 * Return a suffix id from a given center id
 *
 * @param {String} centerId - A center id
 *
 * @return {String} suffix id
 */
ServiceTiles.prototype.getSuffixId = function (centerId) {
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
ServiceTiles.prototype.addPerimeter = function (tileId, coordonates) {
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
ServiceTiles.prototype.getCoordsFromCenterId = function (centerId) {
    var tileId = this.getTileId(centerId);
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
function ServiceLines(viewLines) {
    var self = this;
    self.viewLines = [];
    $.each(viewLines, function (key, line) {
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
ServiceLines.prototype.getLinesByCenter = function (centerId) {
    var eligibleLines = [];

    $.each(this.viewLines, function (key, line) {
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
function Conan(centers, viewLine, colors) {

    this.tiles = new ServiceTiles(centers);
    this.viewLine = new ServiceLines(viewLine);
    this.debug = (window.location.hash === '#debug');
    this.options = new Options(colors);
    this.render = new Render(this.debug, this.options);

    this.processCoordonates();
    this.mapArea();
}

/**
 * Wrapper for console.log
 *
 * @param {*} data - Data to log
 */
Conan.prototype.log = function (data) {
    var self = this;

    if (self.debug) {
        console.log(data);
    }
};


Conan.prototype.processCoordonates = function () {
    var self = this;
    $('#map').find('area').each(function () {
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
Conan.prototype.mapArea = function () {
    var self = this;

    //Display all permanent elements
    self.calculatePermanent();
    $('input#display-level, input#display-promontory').click(function () {
        self.calculatePermanent();
    });

    //Display hover elements
    $.each(self.tiles.getTiles(), function (key, tile) {

        var zone = self.render.initZone(tile.getPerimeter());

        zone.hover(
            function () {
                self.calculateViewLines(tile.getId());
                self.render.runHover();
            },
            function () {
                self.render.cleanHover();
            }
        );

        var centers = tile.getCenters();
        $.each(centers, function (key, center) {
            self.render.initText(tile.getId() + key, center);
        });
    });
};

/**
 * Transform area coordonates into Raphael coordonates
 *
 * @param {String} coords - Coordonate for the html map area coords
 *
 * @return {Array} - Array of coordonates in Raphael format
 */
Conan.prototype.coordConvert = function (coords) {
    var res = ['M'];
    var coordonates = coords.split(',');

    $.each(coordonates, function (index) {
        if (index !== 0 && index % 2 === 0) {
            res.push('L');
        }
        res.push(coordonates[index]);
    });

    return res;
};

Conan.prototype.calculatePermanent = function () {

    var self = this;

    self.render.cleanPermanent();

    if ($('input#display-level').is(':checked')) {
        self.render.addLevel(self.tiles.getLevelTiles())
    }

    if ($('input#display-promontory').is(':checked')) {
        self.render.addPromontory(self.tiles.getPromontoryTiles());
    }

    self.render.runPermanent();
};

/**
 * Display all view lines for a tile
 *
 * @param {String} tileId - Tile id
 */
Conan.prototype.calculateViewLines = function (tileId) {
    var self = this;

    //the current tile data
    var sourceTile = self.tiles.getTile(tileId);

    if (lines.length > 0) {
        //loop on each center of the current tile
        $.each(sourceTile.getCenters(), function (centerSuffix, source) {

            //one of the center of the tile
            var centerId = sourceTile.getId() + '-' + centerSuffix;

            //all the line for a given center
            var lines = self.viewLine.getLinesByCenter(centerId);

            //loop on each line of sight
            $.each(lines, function (key, line) {

                //destination center id
                var destCenterId = line.getDestinationCenterId(centerId);
                //get destination center
                var destination = self.tiles.getCoordsFromCenterId(destCenterId);
                //get destination tile
                var destinationTileId = self.tiles.getTileId(destCenterId);
                //has overhang ?
                var overhang = (line.hasOverhang() && line.getCenter1() === centerId);

                //highligt zones
                var tile = self.tiles.getTile(destinationTileId);
                self.render.addZone(tile.getPerimeter(), overhang);

                //draw overhang dice
                if (overhang) {
                    self.render.addOverhang(destination.getX(), destination.getY(), line.getOverhangPosition());
                }

                //draw line
                self.render.addLine(source.getX(), source.getY(), destination.getX(), destination.getY(), overhang, line.hasDebug());

                //draw circle
                self.render.addCenter(destination.getX(), destination.getY(), overhang);
            });

        });
    }
};

/******************************************
 Render Service
 *******************************************/

/**
 * Render - constructor
 *
 * @params {Boolean} debug - is page in debug mode
 */
function Render(debug, options) {

    this.init = [];
    this.hoverFile = [];
    this.permanentFile = [];
    this.permanentElements = [];
    this.hoverElements = [];

    this.debug = debug;
    this.options = options;
    this.theme = new Theme(debug, options);

    var mapimage = $('#mapimage');
    var top = mapimage.position().top;
    var left = mapimage.position().left;
    var height = mapimage.height();
    var width = mapimage.width();

    this.paper = Raphael(left, top, width, height);
}

/**
 * Sort the file by priority
 *
 * @returns {Render}
 */
Render.prototype.sortFile = function (file) {
    file.sort(function (a, b) {
        return a.prio > b.prio;
    });
    return this;
};

/**
 * Display all the hover elements configured in render
 *
 * @returns {Render}
 */
Render.prototype.runHover = function () {
    var self = this;

    self.sortFile(self.hoverFile);
    $.each(self.hoverFile, function (key, element) {

        if (element.id === 'Line') {
            self.drawLine(element.data);
        }
        if (element.id === 'Overhang') {
            self.drawOverhang(element.data);
        }
        if (element.id === 'Center') {
            self.drawCenter(element.data);
        }
        if (element.id === 'Zone') {
            self.drawZone(element.data);
        }
    });
    self.pushInitToFront();
    return self;
};

/**
 * Display all the permanent elements configured in render
 *
 * @returns {Render}
 */
Render.prototype.runPermanent = function () {
    var self = this;

    self.sortFile(self.permanentFile);
    $.each(self.permanentFile, function (key, element) {
        ;
        if (element.id === 'Promontory') {
            self.drawPromontory(element.data);
        }
        if (element.id === 'Level') {
            self.drawLevel(element.data);
        }
    });
    self.pushInitToFront();
    return self;
};

/**
 * Push the init zone in front (for hover behaviour)
 *
 * @returns {Render}
 */
Render.prototype.pushInitToFront = function () {
    $.each(this.init, function (key, element) {
        element.toFront();
    });
    return this;
};

/**
 * Remove all drawn elements (execpet init zones)
 *
 * @returns {Render}
 */
Render.prototype.cleanHover = function () {
    var self = this;

    $.each(self.hoverElements, function (index, element) {
        element.remove();
    });

    self.hoverFile = [];
    self.hoverElements = [];
    return this;
};

/**
 * Clean promontories
 *
 * @returns {Render}
 */
Render.prototype.cleanPermanent = function () {
    $.each(this.permanentElements, function (index, element) {
        element.remove();
    });

    this.permanentFile = [];
    this.permanentElements = [];
    return this;
};

/**
 * Add an init zone
 *
 * @param {Array} coords - Zone perimeter coordonate
 *
 * @return {Element} - Raphael element
 */
Render.prototype.initZone = function (coords) {
    var element = this.paper.path(coords).attr(this.theme.getZone()).toFront();
    this.init.push(element);
    return element;
};

/**
 * Display a debug text in tiles centers
 *
 * @param {String} text   - text to display
 * @param {Center} center - Coordonates
 *
 * @returns {Render}
 */
Render.prototype.initText = function (text, center) {
    if (this.debug) {
        this.paper.text(center.getX(), center.getY(), text).attr(this.theme.getText());
    }
    return this;
};

/**
 * Add a line in the render
 *
 * @param {Number} xFrom
 * @param {Number} yFrom
 * @param {Number} xTo
 * @param {Number} yTo
 * @param {Boolean} debug
 *
 * @returns {Render}
 */
Render.prototype.addLine = function (xFrom, yFrom, xTo, yTo, overhang, debug) {

    if (!this.options.getOption('display-line')) {
        return this
    }

    var data = {};
    data['id'] = 'Line';
    data['prio'] = '20';

    data['data'] = {};
    data['data']['xFrom'] = xFrom;
    data['data']['yFrom'] = yFrom;
    data['data']['xTo'] = xTo;
    data['data']['yTo'] = yTo;
    data['data']['overhang'] = overhang;
    data['data']['debug'] = debug;

    this.hoverFile.push(data);
    return this;
};

/**
 * Add an overhang in the render
 *
 * @param {Number} xFrom
 * @param {Number} yFrom
 * @param {Number} xTo
 * @param {Number} yTo
 * @param {Boolean} debug
 *
 * @returns {Render}
 */
Render.prototype.addOverhang = function (x, y, angle) {

    if (!this.options.getOption('display-overhang')) {
        return this
    }

    var rayon = 30;
    if (typeof angle === "undefined") {
        angle = 90;
    }

    var deltaX = rayon * Math.sin(angle * Math.PI/180);
    var deltaY = rayon * Math.cos(angle * Math.PI/180) * -1;

    var data = {};
    data['id'] = 'Overhang';

    data['data'] = {};
    data['data']['x'] = x + deltaX;
    data['data']['y'] = y + deltaY;

    this.hoverFile.push(data);
    return this;
};

/**
 * Add center to the render
 *
 * @param {Number} x
 * @param {Number} y
 *
 * @returns {Render}
 */
Render.prototype.addCenter = function (x, y, overhang) {

    if (!this.options.getOption('display-center')) {
        return this
    }

    var data = {};
    data['id'] = 'Center';
    data['prio'] = '30';

    data['data'] = {};
    data['data']['x'] = x;
    data['data']['y'] = y;
    data['data']['overhang'] = overhang;

    this.hoverFile.push(data);
    return this;
};

/**
 * Add zone to the render
 *
 * @param {Array} coords - Zone perimeter coordonates
 *
 * @returns {Render}
 */
Render.prototype.addZone = function (coords, overhang) {

    if (!this.options.getOption('display-zone')) {
        return this
    }

    var data = {};
    data['id'] = 'Zone';
    data['prio'] = '10';

    data['data'] = {};
    data['data']['coords'] = coords;
    data['data']['overhang'] = overhang;

    this.hoverFile.push(data);
    return this;
};

Render.prototype.addPromontory = function (tiles) {
    var self = this;

    if (!self.options.getOption('display-promontory')) {
        return this
    }

    var data = {};

    $.each(tiles, function (key, tile) {

        data = {};
        data['id'] = 'Promontory';
        data['prio'] = '20';

        data['data'] = {};
        data['data']['coords'] = tile.getPerimeter();

        self.permanentFile.push(data);
    });

    return this;
};

Render.prototype.addLevel = function (tiles) {
    var self = this;

    if (!self.options.getOption('display-level')) {
        return this
    }

    var data = {};

    $.each(tiles, function (key, tile) {

        data = {};
        data['id'] = 'Level';
        data['prio'] = '10';

        data['data'] = {};
        data['data']['coords'] = tile.getPerimeter();
        data['data']['level'] = tile.getLevel();

        self.permanentFile.push(data);
    });

    return this;
};

/**
 * Draw a line
 *
 * @param {Object} data - Line data
 *
 * @returns {Render}
 */
Render.prototype.drawLine = function (data) {
    var self = this;

    var theme = self.theme.getViewLine();

    if (data.overhang) {
        theme = self.theme.getViewLineOverhang();
    }

    if (data.debug) {
        theme = self.theme.getViewLineDebug();
    }

    var element = this.paper
        .path("M" + data.xFrom + " " + data.yFrom + "L" + data.xTo + " " + data.yTo)
        .attr(theme);

    this.hoverElements.push(element);
    return this;
};

/**
 * Draw a Overhang
 *
 * @param {Object} data - Overhang data
 *
 * @returns {Render}
 */
Render.prototype.drawOverhang = function (data) {

    var width = 15;
    var height = 15;

    var x = data.x - (width / 2);
    var y = data.y - (height / 2);

    var element = this.paper.image('assets/images/yellow_dice.png', x, y, width, height);

    this.hoverElements.push(element);

    return this;
};

/**
 * Draw a center
 *
 * @param {Object} data - Center data
 *
 * @returns {Render}
 */
Render.prototype.drawCenter = function (data) {
    var width = 15;
    var height = 15;

    var x = data.x - (width / 2);
    var y = data.y - (height / 2);

    var image = 'assets/images/center15.png';
    if (data['overhang']) {
        image = 'assets/images/center15-yellow.png';
    }

    var element = this.paper.image(image, x, y, width, height);

    this.hoverElements.push(element);

    return this;
};

/**
 * Draw a zone
 *
 * @param {Object} data - Zone data
 *
 * @returns {Render}
 */
Render.prototype.drawZone = function (data) {

    var theme = this.theme.getHighlightedArea();

    if (data.overhang) {
        theme = this.theme.getOverhangArea();
    }

    var element = this.paper.path(data.coords).attr(theme);

    this.hoverElements.push(element);

    return this;
};

/**
 * Draw a promontory
 *
 * @param {Object} data - Zone data
 *
 * @returns {Render}
 */
Render.prototype.drawPromontory = function (data) {
    var element = this.paper.path(data.coords).attr(this.theme.getPromontory());
    this.permanentElements.push(element);
    return this;
};

/**
 * Draw a level
 *
 * @param {Object} data - Zone data
 *
 * @returns {Render}
 */
Render.prototype.drawLevel = function (data) {
    var element = this.paper.path(data.coords).attr(this.theme.getLevel(data.level));
    this.permanentElements.push(element);
    return this;
};

/******************************************
 Options
 *******************************************/

/**
 * Options - constructor
 */
function Options(colors) {
    var self = this;
    if (typeof colors !== "undefined") {
        colors = $.parseJSON(colors);
    }

    this.options = {
        'display-line': true,
        'display-zone': true,
        'display-center': true,
        'display-overhang': true,
        'display-promontory': false,
        'display-level': false,
        'colors': colors
    };

    self.refreshOptions();
    $('#options').find('input').click(function () {
        self.refreshOptions();
    });
}

/**
 * Set options value list from check box
 */
Options.prototype.refreshOptions = function () {
    var self = this;
    $('#options').find('input').each(function () {
        var input = $(this);
        self.options[input.attr('id')] = input.is(':checked');
    });
};

/**
 * Return an option
 *
 * @param {String} id - the option code
 *
 * @returns {*}
 */
Options.prototype.getOption = function (id) {
    return this.options[id];
};