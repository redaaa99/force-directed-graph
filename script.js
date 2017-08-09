var url =  "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";


$.getJSON(url, function(response) {

    $("#info ").css("visibility","visible");

    var height = 600;
    var width = 900;

    var svg = d3.select('svg');


    var nodes_data = response.nodes;
    var links_data = response.links;

    var simulation = d3.forceSimulation()
        .force("vertical", d3.forceY().strength(0.10))
        .force("horizontal", d3.forceX().strength(0.03))
        .nodes(nodes_data);

    var link_force =  d3.forceLink(links_data);

    var charge_force = d3.forceManyBody()
        .strength(-100).distanceMax(250);

    var center_force = d3.forceCenter((width-200) / 2, (height-100) / 2);


    simulation
        .force("charge_force", charge_force)
        .force("center_force", center_force)
        .force("links",link_force);


    simulation.on("tick", tickActions );


    var g = svg.append("g")
        .attr("class", "everything");


    var link = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links_data)
        .enter().append("line")
        .attr("stroke-width", 2)
        .style("stroke", "black");


    var node = d3.select('#flags')
        .selectAll('.node')
        .data(nodes_data)
        .enter()
        .append('img')
        .attr('class', function(d) {return 'flag flag-' + d.code;})
        .on("mouseover", function(d,i) {
            $("#info").css("left", (d3.event.pageX + 5) + "px")
                .css("top", (d3.event.pageY - 30) + "px");
            $("#info ").html(" "+d.country+" ");
            $("#info ").show();
        })
        .on("mouseout", function(d, i) {
            $("#info").hide();
        });


    var drag_handler = d3.drag()
        .on("start", drag_start)
        .on("drag", drag_drag)
        .on("end", drag_end);

    drag_handler(node);

    function drag_start(d) {
        if (!d3.event.active) simulation.alphaTarget(0.8).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function drag_drag(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function drag_end(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    function tickActions() {
        node

            .style("left", function(d) { return (d.x+110) + 'px'; })
            .style("top", function(d) { return (d.y+15) + 'px'; });

        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
    }

});