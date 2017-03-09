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
 * Get attributes for debug text
 */
Theme.prototype.getText = function() {
    var res = `{
        "stroke": "red",
        "stroke-width": 1
    }`;
    return $.parseJSON(res);
};

/******************************************
Line
*******************************************/

function Line(line)
{
    this.case1 = line[0];
    this.case2 = line[1];
    this.type  = (line[2] != "") ? line[2]: false;
    this.text  = (line[3] != "") ? line[3]: false;
    this.debug = (line[4] != "") ? line[4]: false;
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
    if (this.getCase1() == caseId) {
        return this.getCase2();
    }

    if (this.getCase2() == caseId) {
        return this.getCase1();
    }
}


/*Line.prototype.getLinesCoordonates = function() {
    var lines = [];

    lines.push([this.getCase1(), this.getCase2()]);
    if (this.isReciproque()) {
        lines.push([this.getCase2(), this.getCase1()]);
    }

    return lines;
}*/

/******************************************
Line
*******************************************/

function ServiceLines(viewLines)
{
    var self = this;
    self.viewLines = [];
    $.each(viewLines, function(key, line){
        self.viewLines.push(new Line(line));
    });
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
Line
*******************************************/

/**
 * Constructor
 */
function Conan(paper, centerCoordonate, viewLine, debug, theme) {
    this.paper            = paper;
    this.centerCoordonate = $.parseJSON(centerCoordonate);
    this.viewLine         = new ServiceLines(viewLine);
    this.debug            = debug;
    this.theme            = theme;


    this.toRemove = [];

    this.mapArea();
}

/**
 * Getter for centerCoordonate data
 */
Conan.prototype.getCenter = function(id) {
    var self = this;

    if (self.centerCoordonate[id] != undefined) {
        return self.centerCoordonate[id];
    }
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
            var center = self.getCenter(id);
            var txt = self.paper.text(center.x, center.y, id);
            txt.attr(self.theme.getText());
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
    var destination;
    var circle;
    var lines = self.viewLine.getLinesByCase(caseId);

    if (lines.length > 0) {

        $.each(lines, function(key, line) {

            source        = self.getCenter(caseId);
            destination   = self.getCenter(line.getDestination(caseId));

            //draw line
            line = self.drawLine(source.x, source.y, destination.x, destination.y);

            //draw circle
            circle = self.drawCircle(destination.x, destination.y);
            self.toRemove.push(line);
            self.toRemove.push(circle);

            //draw icons
            if (destination.icon != undefined && destination.icon != '')  {
                xIcon = parseInt((source.x + destination.x) / 2);
                yIcon = parseInt((source.y + destination.y) / 2);
                icon = self.paper.image(destination.icon, xIcon, yIcon, 50, 50).toBack();
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