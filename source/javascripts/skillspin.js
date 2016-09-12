var skillspin = (function($, d3, undefined) {
    var skills = {};
    var allStations = [];
    var tracks = {};
    var bounds = {
        x: 200,
        y: 200
    };
    var layout;
    var canvas;
    var gears;
    var colors = d3.scale.category10();

    function Skill(opts) {
        opts = _.defaults(opts, {
            name: 'sam',
            stations: []
        });

        this.stations = opts.stations;
        this.name = opts.name;
        this.max = 0;
    }

    Skill.prototype.addStation = function(station) {
        this.stations.push(station);

        station.skills[this.name] = this;

        if (station._skills[this.name] > this.max) {
            this.max = station._skills[this.name];
        }
    };

    Skill.prototype.draw = function() {
        // var p = new paper.Point(50, 50);
                
        // var outerCircle = new paper.Path.Circle(p, 10);
        // outerCircle.fillColor = 'blue';
    };

    Skill.prototype.highlight = function() {
        var skill = this;

        _.each(this.stations, function(station) {
            station.inflate(skill.color);
        });

        // unhighlight other stations
        _.each(_.difference(allStations, this.stations), function(station) {
            station.unhighlight();
        });
    };

    function addStation(station) {
        _.each(station._skills, function(value, skill) {
            if (!(skill in skills)) {
                skills[skill] = new Skill({name: skill});
            }

            skills[skill].addStation(station);
        });
    }

    function redraw(seconds) {
        _.each(hierarchy.children, function(child) {
            child.size = Math.floor(Math.random()*30);
        });

        // trigger recalculation
        layout.nodes(hierarchy);

        gears.transition()
            .duration(500)
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", function(d) { return d.r; });
    }

    function draw() {
        // set up colors
        _.each(_.values(skills), function(skill, i) {
            skill.color = colors(i);
        });

        layout = d3.layout.pack()
            .sort(null)
            .size([bounds.x, bounds.y])
            .padding(0);

        canvas = d3.select("#skillspinner").append("svg")
            .attr("width", bounds.x)
            .attr("height", bounds.y)
            .attr("class", "bubble");

        var hierarchy = {"children": []};

        _.each(skills, function(skill) {
            hierarchy.children.push({
                "size": skill.max,
                "name": skill.name,
                "color": skill.color
            });
        });

        layout.value(function(d) {
            return d.size;
        });

        var node = canvas.selectAll(".node")
            .data(layout.nodes(hierarchy))
            .enter().append("g");
        
        gears = node.append("circle")
            .attr("stroke", "black")
            .style("fill", function(d) { return d.color; })
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", function(d) { return d.r; });

        gears.on("click", function(skillRep) {
            var gear = this;
            var skill = skills[skillRep.name];

            skill.highlight();
        });

        _.invoke(skills, 'draw');
    }

    function setup(stations) {
        allStations = stations;

        _.each(stations, addStation);

        draw();
    }

    return {
        setup: setup
    };
}($, d3));