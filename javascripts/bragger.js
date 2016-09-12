var manager = {
	doc: {},
	offset: 180,
	n: 0,
	init: function() {
		manager.doc.width = 800,
		
		resume.start();
		skills.begin();
		projects.init();
		
		manager.examplers();
		
		manager.navigation();

		manager.travel();
		
		manager.countUp();
	},
	countUp: function(n) {
		element = $('#header strong.count');
		element.text(manager.n);
		element.css('font-size', 100 + 20*manager.n + '%');
		
		manager.n = manager.n + 1;
		if( manager.n < 9 )
		{
			window.setTimeout(manager.countUp, 100);
		}
	},
	travel: function() {
        $('#travel_map_canvas').vectorMap({
			map: 'world_mill_en',
			scaleColors: ['#C8EEFF', '#0071A4'],
			normalizeFunction: 'polynomial',
			hoverOpacity: 0.7,
			hoverColor: false,
			// series: {
			// 	regions: [{
			// 		scale: {
			// 			'1': '#4169E1',
			// 			'2': '#FF69B4'
			// 		},
			// 		attribute: 'fill',
			// 		values: data['year2007'].results
			// 	}]
			// },
			regionStyle: {
				initial: {
					fill: '#4A9FC5',
					"fill-opacity": 1,
					stroke: 'none',
					"stroke-width": 0,
					"stroke-opacity": 1
				  },
				hover: {
					"fill-opacity": 0.8
				}
			},
			markerStyle: {
				initial: {
					fill: '#FFBE00',
					stroke: '#383f47'
				}
			},
			backgroundColor: '#111111',
			markers: [
				{latLng: [35.652184, -105.276615], name: 'From 2010-2012, I studied at UWC-USA in New Mexico.'},
				{latLng: [44.332222, -73.092500], name: 'I grew up in Hinesburg, Vermont.'},
				{latLng: [40.714353, -74.005973], name: 'In January 2013, I took a four week class at NYU-New York on Understanding the Financial Crisis.'},
				{latLng: [24.466667, 54.366667], name: 'I currently study at NYU Abu Dhabi.'},
				{latLng: [37.774929, -122.419416], name: 'In March 2012, I visited San Francisco.'},
				{latLng: [38.895112, -77.036366], name: 'I attended Princeton Model Congress in DC.'},
				{latLng: [41.878114, -87.629798], name: 'Every year, I visit family in Chicago for Thanksgiving.'},
				{latLng: [61.218056, -149.900278], name: 'In summer 2011, I spent 1 month hiking in the Alaskan wilderness.'},
				{latLng: [48.856614, 2.352222], name: 'In summer 2009, I spent 6 weeks studying with Choate in Paris.'},
				{latLng: [51.507335, -0.127683], name: 'In summer 2012, I visited friends in London.'},
				{latLng: [45.465454, 9.186516], name: 'In summer 2012, I visited friends and family in Italy.'},
				{latLng: [48.208174, 16.373819], name: 'In summer 2012, I visited friends in Vienna'},
				{latLng: [52.519171, 13.406091], name: 'In summer 2012, I visited friends in Germany'},
				{latLng: [12.862807, 30.217636], name: 'In fall 2012, I visited Sudan and met with the Minister of Defense.'},
				{latLng: [28.394857, 84.124008], name: 'In November 2012, I conducted political research in Nepal with my class.'},
				{latLng: [25.034280, -77.396280], name: 'In 2012, I briefly worked on my friend\'s mango farm in the Bahamas'}
			]
        });
	},
	navigation: function() {
		$('a').smoothScroll({
			offset: -1 * manager.offset
		});
				
		$('.bragger.navigation li a').click(function() {
			$('.bragger.navigation li').removeClass('active');
			$(this).parent().addClass('active');
		});
		
		$('.section.bragger section').waypoint(function(direction) {
		 	active = $(this);
			if (direction === "up") active = active.prev();
			
			$('.bragger.navigation li').removeClass('active').filter('#nav-' + active.attr('id') ).addClass('active');
		},{
			offset: manager.offset
		});
	},
	examplers: function() {
		speed = 100
		$('ul.exampler li').hover(function() {
			h = $(this).parent().height();
			$('a', this).data('height', $('a', this).height()).animate({
				height: h
			}, speed);
			$('a span ', this).fadeIn( speed ).css('display', 'block');
		}, function() {
			$('a', this).animate({
				height: $('a', this).data('height')
			}, speed);
			$('a span ', this).fadeOut( speed );
		});
	}
}


var projects = {
	computer: 'M490.122,0H148.364C139.421,0,132,6.987,132,15.93V216.30700000000002V229.437V246.494C132,255.437,139.421,263,148.364,263H283V281.93C283,281.93,283.012,283.502,281.986,286.325C280.815,289.548,276.90999999999997,294.161,268.402,300.627C268.402,300.627,266.777,302.00100000000003,266.756,303.00100000000003H267V303.82800000000003V307.98600000000005V308.71100000000007C267,308.71100000000007,266.891,308.7340000000001,266.916,308.76900000000006C266.631,309.0830000000001,266.404,309.6140000000001,266.404,309.9700000000001C266.404,311.53800000000007,269.374,313.0010000000001,273.113,313.0010000000001H365.373C369.11199999999997,313.0010000000001,372.144,311.53800000000007,372.144,309.9700000000001C372.144,309.6140000000001,372.113,309.1790000000001,371.826,308.86500000000007C371.851,308.83000000000004,372,308.71200000000005,372,308.71200000000005V307.987V303.829V303H371.729C371.70799999999997,302,370.16999999999996,300.626,370.16999999999996,300.626C361.662,294.15999999999997,357.92699999999996,289.522,356.75699999999995,286.299C355.73199999999997,283.477,355.99899999999997,281.92999999999995,355.99899999999997,281.92999999999995V263H490.121C499.06399999999996,263,505.99899999999997,255.438,505.99899999999997,246.494V229.437V216.30700000000002V15.93C506,6.987,499.065,0,490.122,0ZM145,15.93C145,14.283999999999999,146.718,13,148.364,13H490.12199999999996C491.768,13,492.99999999999994,14.284,492.99999999999994,15.93V216H145V15.93Z',
	init: function() {
		projects.canvas = d3.select('#projects .canvas');
		
		projects.count = 3;
		
		projects.draw();
	},
	draw: function() {
		skills.r = manager.doc.width / 120;

		var svg = projects.canvas.insert("svg:svg", "form")
		    .attr("width", 1000)
		    .attr("height", 250);
		
		x = -100;
		i = 0;
		while (i < 3 ) {
			var path = svg.append("svg:path")
				.attr('class', 'screen')
				.attr('d', projects.computer)
				.attr('transform', 'matrix(0.75,0,0,0.75,' + x + ',10)');
			
			x = x + 330;
			i++;
		}
	}
}

var resume = {
	tracks: [
		{
			name: 'education',
			color: 'blue'
		},
		{
			name: 'tech',
			color: 'pink'
		},
		{
			name: 'law',
			color: 'red'
		}
	],
	paths: [],
	start: function() {
		
    // $('#resume .map').subwayMap({ debug: false });
		
		// // // Get a reference to the canvas object
		// this.canvas = document.getElementById('resumeCanvas');
		// 
		// // Create an empty project and a view for the canvas:
		// paper.setup(this.canvas);
		// 
		// var path = new paper.Path();
		// // Give the stroke a color
		// path.strokeColor = 'black';
		// var start = new paper.Point(100, 100);
		// // Move to start and draw a line from there
		// path.moveTo(start);
		// // Note that the plus operator on Point objects does not work
		// // in JavaScript. Instead, we need to call the add() function:
		// path.lineTo(start.add([ 200, -50 ]));
		// 
		// // set up our paths
		// 
		// $.each( resume.tracks, function( i, track) {
		// 	path = new paper.Path();
		// 				
		// 	path.strokeColor = track.color;
		// 	
		// 	path.add(new paper.Point(0, 0));
		// 	path.add(new paper.Point(100, 50));
		// 	
		// 	resume.paths[track.name] = path;
		// } );
		// 
		//         // Draw the view now:
		//         paper.view.draw();
	}
}

var skills = {
	list: {
		'js': {
			name: 'JavaScript',
			size: 20,
			x: -10,
			y: 30,
			rotate: 0
		},
		'html': {
			name: 'HTML5',
			size: -15,
			x: -45,
			y: -5,
			rotate: 20
		},
		'python': {
			name: 'Python',
			size: 10,
			x: -59,
			y: -49,
			rotate: -3
		},
		'css': {
			name: 'CSS',
			size: 10,
			x: -60,
			y: 37,
			rotate: 25,
			link: 'http://lab.morgante.net/shield'
		},
		'wp': {
			name: 'WordPress',
			size: 10,
			x: -28,
			y: -55,
			rotate: 17,
			link: 'http://google.com'
		},
		'php': {
			name: 'PHP',
			text: 'MVC & OOP',
			size: -15,
			x: 2,
			y: -48,
			rotate: 5,
			link: 'http://lab.morgante.net/habaribox'
		},
		'java': {
			name: 'Java',
			size: -10,
			x: -39,
			y: 66,
			rotate: 15,
		},
		'node': {
			name: 'node.js',
			size: -15,
			x: 30,
			y: 35,
			rotate: 5
		},
		'sql': {
			name: '*SQL',
			size: 10,
			x: 24,
			y: -14,
			rotate: 1
		},
		'debate': {
			name: "Debate",
			size: -15,
			x: 55,
			y: -55,
			rotate: 0
		},
		'writing': {
			name: 'Writing',
			size: 10,
			x: 60,
			y: -5,
			rotate: 3
		},
		'finance': {
			name: 'Finance',
			size: 10,
			x: 60,
			y: 60,
			rotate: 10
		},
	},
	begin: function() {
		skills.graph = d3.select('#skills .graph');
		
		skills.draw();
	},
	draw: function() {
		skills.r = manager.doc.width / 120;
		
		var w = skills.r * 120,
			h = skills.r * 80,
		    x = Math.sin(2 * Math.PI / 3),
		    y = Math.cos(2 * Math.PI / 3),
		    speed = 4,
		    start = Date.now();

		var svg = skills.graph.insert("svg:svg", "form")
		    .attr("width", w)
		    .attr("height", h)
		  .append("svg:g")
		    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")scale(.9)")
		  .append("svg:g")
		    .data([{radius: Infinity}]);
		
		$.each( skills.list, function( i, skill ) {
			var gear = svg.append("svg:g")
			    .attr("class", "skill " + i)
			    .data([{teeth: Math.abs(skill.size / 10) * 16, radius: skill.size * skills.r}])
				.attr("transform", "translate(" + skill.x * skills.r * x + "," + skill.y * skills.r * y + ")rotate(" + skill.rotate + ")")
			gear.append("svg:g")
			    .attr("class", "gear")
				.append("svg:path")
			    .attr("d", skills.gear);
			gear.append("svg:text")
				.attr("class", "title")
			    .attr("x", 0)
			    .attr("dy", ".31em")
				.attr("style", "font-size: " + (Math.abs(skill.size) * skills.r) / 3 + "px")
			    .attr("text-anchor", "middle")
				.attr("transform", "rotate(" + -1 * skill.rotate + ")")
			    .text( skill.name )
			gear.append("svg:text")
				.attr("class", "desc")
			    .attr("x", 0)
			    .attr("dy", (Math.abs(skill.size) * skills.r) / 3 + "px")
			    .attr("text-anchor", "middle")
				.attr("transform", "rotate(" + -1 * skill.rotate + ")")
			    .text( skill.text )
		});
		
		// .attr("transform", "translate(0,-" + r * 3 + ")")

		// d3.selectAll("input[name=reference]")
		//     .data([r * 5, Infinity, -r])
		//     .on("change", function(d) { svg.data([{radius: d}]); });
		// 
		// d3.selectAll("input[name=speed]")
		//     .on("change", function() { speed = +this.value; });

		svg.selectAll(".skill")
		    .on("mouseover", function(d) {
				speed = speed * 2;
				d3.select(this).classed('hover', 1);
			}) 
		    .on("mouseout", function(d) {
				speed = speed / 2;
				d3.select(this).classed('hover', 0);
			});
		    // .on("click", function(d) { console.log("path click"); });

		d3.timer(function() {
			var angle = (Date.now() - start) * speed,
				transform = function(d) { return "rotate(" + angle / d.radius + ")"; };
			svg.selectAll(".gear").attr("transform", transform);
			svg.attr("transform", transform); // fixed ring
		});

	},
	gear: function gear(d) {
	  var n = d.teeth,
	      r2 = Math.abs(d.radius),
	      r0 = r2 - 8,
	      r1 = r2 + 8,
	      r3 = d.ring ? (r3 = r0, r0 = r1, r1 = r3, r2 + 20) : 20,
	      da = Math.PI / n,
	      a0 = -Math.PI / 2 + (d.ring ? Math.PI / n : 0),
	      i = -1,
	      path = ["M", r0 * Math.cos(a0), ",", r0 * Math.sin(a0)];
	  while (++i < n) path.push(
	      "A", r0, ",", r0, " 0 0,1 ", r0 * Math.cos(a0 += da), ",", r0 * Math.sin(a0),
	      "L", r2 * Math.cos(a0), ",", r2 * Math.sin(a0),
	      "L", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0),
	      "A", r1, ",", r1, " 0 0,1 ", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0),
	      "L", r2 * Math.cos(a0 += da / 3), ",", r2 * Math.sin(a0),
	      "L", r0 * Math.cos(a0), ",", r0 * Math.sin(a0));
	  return path.join("");
	}
}

$(document).ready( manager.init );