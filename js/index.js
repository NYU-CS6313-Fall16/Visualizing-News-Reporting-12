var data = {};
var filter = {
    time: {
        from: null,
        to: null
    },
    websites: {},
    topics: {
    },
    corporations: {}
}

var websites = [];
var topics = [];
var corps = [];
var websiteObjects = {}
var topicObjects = {};
var corpObjects = {};
var minTime = new Date("2016-01-01 00:00:00 UTC");
var maxTime = new Date("2016-08-20 00:00:00 UTC");

var websiteCard;

var chart;
var chartWidth = 0, chartHeight = 0;
var chartMargin = {
    left: 10,
    right: 10,
    top: 5,
    bottom: 5
};
var itemSize = {
    width: 20,
    height: 20
};

var colorScale = d3.scale.category20();

var pageloaded = false;

var load = function () {
    d3.json("/data/all/website", function (error, result) {
        if (error) return console.warn(error);
        for (var i = 0; i < result.length; i++) {
            websiteObjects[result[i]] = null;
            websites.push(result[i]);
        }
        // d3.json("/data/all/corp", function (error, result) {
        //     if (error) return console.warn(error);
        //     for (var i = 0; i < result.length; i++) {
        //         corpObjects[result[i]] = null;
        //     }
        //     for (var corp in corpObjects) {
        //         corps.push(corp);
        //     }
        // d3.json("/data/all/topic", function (error, result) {
        //     if (error) return console.warn(error);
        //     for (var i = 0; i < result.length; i++) {
        //         topicObjects[result[i].group] = null;
        //     }
        //     for (var topic in topicObjects) {
        //         topics.push(topic);
        //     }
            //console.log(websites,corps,topics);
            initial();
        });
    topics = ['Accounting Actions', 'Business Concerns', 'Company Earnings', 'Contracts', 'Corporate Governance',
                'Criminal Actions', 'Disaster', 'Employment Actions', 'Financing Actions','General Business Actions',
                'Government','Legal Actions','Mergers and Acquisitions','Product Development','Rumors','Stock Activities'];
        // });
    //});

}

var initial = function () {

    console.log("page loaded!");
    chart = d3.select("#chart");
    websiteCard = document.getElementById("websiteCard");

    chartWidth = document.getElementById("chart").clientWidth;
    chartHeight = document.getElementById("chart").clientHeight;

    itemSize.height = (chartHeight / 5 - chartMargin.top - chartMargin.bottom - 10) / 12;
    itemSize.width = itemSize.height;
    // analyse data
    // var websiteObjects = {}
    // var topicObjects = {};
    // var corpObjects = {};
    // for (var i in data) {
    //     websiteObjects[i] = null;
    //     for (var j = 0; j < data[i].length; j++) {
    //         var article = data[i][j];
    //         for (var k = 0; k < article.topic.length; k++) {
    //             if (!topicObjects[article.topic[k].group])
    //                 topicObjects[article.topic[k].group] = {};
    //             topicObjects[article.topic[k].group][article.topic[k].type] = null;
    //         }
    //         for (var k = 0; k < article.corp.length; k++) {
    //             corpObjects[article.corp[k]] = null;
    //         }
    //         var tempDate = new Date(article.time["$date"]);
    //         if (minTime === null) minTime = tempDate;
    //         else if (minTime > tempDate) minTime = tempDate;
    //         if (maxTime === null) maxTime = tempDate;
    //         else if (maxTime < tempDate) maxTime = tempDate;
    //     }
    //     // initialize websites type array
    //     websites.push(i);
    // }

    // initialize topic type array
    // for (var name in topicObjects) {
    //     var topicTypes = [];
    //     for (var subname in topicObjects[name]) {
    //         topicTypes.push(subname);
    //     }
    //     topics.push({
    //         groupname: name,
    //         value: topicTypes
    //     });
    // }
    // initialize corporation type array
    // for (var name in corpObjects) {
    //     corps.push(name);
    // }

    // read websites
    // var websiteContext = d3.select("#websiteSelection").append("div");
    // websiteContext.selectAll("div.item")
    //     .data(websites)
    //     .enter()
    //     .append(function (v, i) {
    //         var div = document.createElement("div");
    //         div.setAttribute("id", "item_" + v);
    //         div.setAttribute("class", "item");
    //         var input = document.createElement("input");
    //         input.setAttribute("class", "filled-in");
    //         input.setAttribute("type", "checkbox");
    //         input.setAttribute("id", v);
    //         input.onchange = function (event) {
    //             if (event.target.checked) {
    //                 filter.websites.push(event.target.id);
    //             } else {
    //                 filter.websites.splice(filter.websites.indexOf(event.target.id), 1);
    //             }
    //             updateData();
    //             //if (pageloaded) render();
    //         }
    //         var label = document.createElement("label");
    //         label.innerText = v;
    //         label.setAttribute("for", input.getAttribute("id"));
    //         div.appendChild(input);
    //         div.appendChild(label);
    //         // var test = document.createElement("div");
    //         return div;
    //     });


    // read topics
    var topicsContext = d3.select("#topicsSelection");
    topicsContext.selectAll("div")
        .data(topics)
        .enter()
        .append(function (v, i) {
            var div = document.createElement("div");
            div.setAttribute("id", "item_" + v);
            div.setAttribute("class", "item");
            var input = document.createElement("input");
            input.setAttribute("class", "filled-in");
            input.setAttribute("type", "checkbox");
            input.setAttribute("id", v);
            input.setAttribute("index", i);
            input.onchange = function (event) {
                if (event.target.checked) {
                    filter.topics[topics[event.target.getAttribute("index")]] = null;
                    // var values = topics[event.target.getAttribute("index")].value;
                    // for (var j = 0; j < values.length; j++) {
                    //     filter.topics[topics[event.target.getAttribute("index")].groupname][values[j]] = null;
                    // }
                } else {
                    delete filter.topics[topics[event.target.getAttribute("index")]];
                }
                // var thisGroup = document.getElementById("div_group_" + topics[event.target.getAttribute("index")].groupname);
                // var typeInputs = thisGroup.getElementsByTagName("input");
                // for (var j = 0; j < typeInputs.length; j++) {
                //     if (filter.topics[topics[event.target.getAttribute("index")].groupname] !== undefined &&
                //         filter.topics[topics[event.target.getAttribute("index")].groupname][topics[typeInputs[j].getAttribute("groupIndex")].value[typeInputs[j].getAttribute("typeIndex")]] !== undefined) {
                //         typeInputs[j].checked = true;
                //     } else {
                //         typeInputs[j].checked = false;
                //     }
                // }
                if (pageloaded) render();
            };
            var label = document.createElement("label");
            label.innerText = v;
            label.setAttribute("for", input.getAttribute("id"));
            label.setAttribute("style", "color: " + colorScale(v));
            div.appendChild(input);
            div.appendChild(label);

            // var typesDiv = document.createElement("div");
            // typesDiv.id = "div_group_" + v.groupname;
            // typesDiv.setAttribute("class", "item");
            // for (var j = 0; j < v.value.length; j++) {
            //     var typeDiv = document.createElement("div");
            //     typeDiv.setAttribute("id", "item_" + v.value[j]);
            //     var typeInput = document.createElement("input");
            //     typeInput.setAttribute("class", "filled-in");
            //     typeInput.setAttribute("type", "checkbox");
            //     typeInput.setAttribute("id", v.value[j]);
            //     typeInput.setAttribute("groupIndex", i);
            //     typeInput.setAttribute("typeIndex", j);
            //     typeInput.onchange = function (event) {
            //         if (event.target.checked) {
            //             if (!filter.topics[topics[event.target.getAttribute("groupIndex")].groupname]) {
            //                 filter.topics[topics[event.target.getAttribute("groupIndex")].groupname] = {};
            //             }
            //             filter.topics[topics[event.target.getAttribute("groupIndex")].groupname][topics[event.target.getAttribute("groupIndex")].value[event.target.getAttribute("typeIndex")]]
            //                 = null;
            //         } else {
            //             delete filter.topics[topics[event.target.getAttribute("groupIndex")].groupname][topics[event.target.getAttribute("groupIndex")].value[event.target.getAttribute("typeIndex")]];
            //         }
            //         var groupInput = document.getElementById(topics[event.target.getAttribute("groupIndex")].groupname);
            //         if (Object.keys(filter.topics[topics[event.target.getAttribute("groupIndex")].groupname]).length
            //             == topics[event.target.getAttribute("groupIndex")].value.length) {
            //             groupInput.checked = true;
            //         } else {
            //             groupInput.checked = false;
            //         }
            //         if (pageloaded) render();
            //     }
            //     var typeLabel = document.createElement("label");
            //     typeLabel.innerText = v.value[j];
            //     typeLabel.setAttribute("for", typeInput.getAttribute("id"));
            //     typeDiv.appendChild(typeInput);
            //     typeDiv.appendChild(typeLabel);
            //     typesDiv.appendChild(typeDiv);
            // }
            // typesDiv.style.paddingLeft = "25px";
            // div.appendChild(typesDiv);
            return div;
        });

    // read corps
    // var corpsContext = d3.select("#corpsSelection");
    // corpsContext.selectAll("div")
    //     .data(corps)
    //     .enter()
    //     .append(function (v, i) {
    //         var div = document.createElement("div");
    //         div.setAttribute("id", "item_" + v);
    //         div.setAttribute("class", "item");
    //         var input = document.createElement("input");
    //         input.setAttribute("class", "filled-in");
    //         input.setAttribute("type", "checkbox");
    //         input.setAttribute("id", v);
    //         input.onchange = function (event) {
    //             if (event.target.checked) {
    //                 filter.corporations[event.target.id] = null;
    //             } else {
    //                 delete filter.corporations[event.target.id];
    //             }
    //             if (pageloaded) render();
    //         }
    //         var label = document.createElement("label");
    //         label.innerText = v;
    //         label.setAttribute("for", input.getAttribute("id"));
    //         div.appendChild(input);
    //         div.appendChild(label);
    //         var test = document.createElement("div");
    //         return div;
    //     });
    // for (var i = 0; i < websites.length; i++) {
    //     document.getElementById(websites[i]).click();
    // }
    for (var i = 0; i < topics.length; i++) {
        document.getElementById(topics[i]).click();
    }
    // for (var i = 0; i < corps.length; i++) {
    //     document.getElementById(corps[i]).click();
    // }

    // initial time
    maxTime = new Date(maxTime.getTime() + 24 * 60 * 60 * 1000);
    document.getElementById("date_filter_input_from").value = toDateString(minTime);
    document.getElementById("date_filter_input_to").value = toDateString(maxTime);
    filter.time.from = new Date(toDateString(minTime));
    filter.time.to = new Date(toDateString(maxTime));

    // initial autocomplete
    $("input#autocomplete-text-website").autocomplete({
        data: websiteObjects
    }).change(function (event) {
        // var name = event.target.value;
        // var target = document.getElementById(name);
        // var item = document.getElementById("item_" + name);
        // var list = document.getElementById("websiteSelection");
        // if (target) {
        //     list.scrollTop = target.offsetTop - list.offsetTop;
        //     item.style.backgroundColor = "#009688";
        //     setTimeout(function () {
        //         item.style.backgroundColor = "#ffffff";
        //     }, 500)
        // }
        var name = event.target.value;
        var websiteChips = document.getElementById("websiteSelection");
        if (websiteObjects[name] !== undefined) {
            var flag = false;
            for (var i in filter.websites) {
                if (i == name) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                var newChip = document.createElement("div");
                newChip.innerHTML = name + "<i class='close material-icons'>close</i>";
                newChip.className = "chip";
                websiteChips.appendChild(newChip);
                $(newChip).on('click.chips-delete', { name }, function (event) {
                    delete filter.websites[event.data.name];
                    render();
                });
                filter.websites[name] = null;
            }
            updateData(name);
        }
    });
    $("input#autocomplete-text-topic").autocomplete({
        data: topicObjects
    }).change(function (event) {
        var name = event.target.value;
        var target = document.getElementById(name);
        var item = document.getElementById("item_" + name);
        var list = document.getElementById("topicsSelection");
        if (target) {
            list.scrollTop = target.offsetTop - list.offsetTop;
            item.style.backgroundColor = "#f5f5f5";
            setTimeout(function () {
                item.style.backgroundColor = "#ffffff";
            }, 500)
        }
    });
    // $("input#autocomplete-text-corp").autocomplete({
    //     data: corpObjects
    // }).change(function (event) {
    //     var name = event.target.value;
    //     var target = document.getElementById(name);
    //     var item = document.getElementById("item_" + name);
    //     var list = document.getElementById("corpsSelection");
    //     if (target) {
    //         list.scrollTop = target.offsetTop - list.offsetTop;
    //         item.style.backgroundColor = "#009688";
    //         setTimeout(function () {
    //             item.style.backgroundColor = "#ffffff";
    //         }, 500)
    //     }
    // });

    // console.log(filter);
    pageloaded = true;
    
    render();
}
var toDateString = function (date) {
    var year = date.getUTCFullYear();
    var month = date.getUTCMonth() + 1;
    var day = date.getUTCDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day;
}


var updateData = function (website) {
    d3.json("/data/website/" + website, function (error, result) {
        if (error) return console.warn(error);
        data[result[0].website] = result;
        render();
    })

}

var onTimeChange = function (event) {
    var value = event.target.value;
    var date = new Date(value);
    if (event.target.id == "date_filter_input_from") {
        filter.time.from = date;
    } else if (event.target.id == "date_filter_input_to") {
        filter.time.to = date;
    }
    render();
}

var onMouseEnter = function (item) {
    var floatInfo = document.getElementById("float_info");
    var wrapper = document.createElement("div");
    for (var i = 0; i < item.topic.length; i++) {
        var group = document.createElement("div");
        group.innerHTML = "Topic Group" + (i + 1) + ": " + item.topic[i].group;
        var type = document.createElement("div");
        type.innerHTML = "Topic Type" + (i + 1) + ": " + item.topic[i].type;
        wrapper.appendChild(group);
        wrapper.appendChild(type);
    }
    for (var i = 0; i < item.corp.length; i++) {
        var corp = document.createElement("div");
        corp.innerHTML = "Corporation" + (i + 1) + ": " + item.corp[i];
        wrapper.appendChild(corp);
    }
    var time = document.createElement("div");
    time.innerHTML = "Time: " + (new Date(item.time)).toUTCString();
    wrapper.appendChild(time);
    floatInfo.replaceChild(wrapper, floatInfo.children[0]);
}

var render = function () {
    // var colorScale = d3.scale.category20();
    var xScale = d3.scale.linear().range([0, chartWidth - chartMargin.left - chartMargin.right - 30]);
    xScale.domain([0, 59]);
    var unit = (filter.time.to.getTime() - filter.time.from.getTime()) / 60;
    //console.log(filter);
    var yScale = d3.scale.linear().range([chartHeight / 5 - chartMargin.top - chartMargin.bottom - 20, 0]);
    yScale.domain([0, 11]);

    var websiteDivs = chart.selectAll("div.websiteRect").data(Object.keys(filter.websites));
    websiteDivs.select("div.float-name").text(function (v, i) { return v; });
    websiteDivs.enter()
        .append(function (v, i) {
            var website = document.createElement("div");
            website.className = "websiteRect";
            website.style.left = chartMargin.left + "px";
            website.style.top = i * (chartHeight / 5 + chartMargin.bottom) + chartMargin.top + "px";
            website.style.width = chartWidth - chartMargin.left - chartMargin.right - 10 + "px";
            website.style.height = chartHeight / 5 - chartMargin.top - chartMargin.bottom + "px";
            var name = document.createElement("div");
            name.className = "float-name";
            name.style.right = "10px";
            name.addEventListener("mouseenter", function (event) {
                var right = event.target.style.right;
                var left = event.target.style.left;
                if (right == "10px") {
                    left = "10px";
                    right = "";
                } else if (left == "10px") {
                    left = "";
                    right = "10px";
                }
                event.target.style.right = right;
                event.target.style.left = left;
            });
            name.innerText = v;
            website.appendChild(name);
            return website;
        })
        // .append("div")
        // .attr("class", "websiteRect")
        // .style("left", chartMargin.left + "px")
        // .style("top", function (v, i) {
        //     return i * (chartHeight / 4 + chartMargin.bottom) + chartMargin.top + "px";
        // })
        // .style("width", chartWidth - chartMargin.left - chartMargin.right - 10 + "px")
        // .style("height", chartHeight / 4 - chartMargin.top - chartMargin.bottom + "px")
        // .append(function (v, i) {
        //     var wrapper = document.createElement("div");
        //     wrapper.className = "svg-wrapper";
        //     var svg = document.createElement("svg");
        //     svg.setAttribute("width", chartWidth - chartMargin.left - chartMargin.right - 10);
        //     svg.setAttribute("height", chartHeight / 4 - chartMargin.top - chartMargin.bottom - 10);
        //     wrapper.appendChild(svg);
        //     var name = document.createElement("div");
        //     name.className = "float-name";
        //     name.style.right = "10px";
        //     name.addEventListener("mouseenter", function (event) {
        //         var right = event.target.style.right;
        //         var left = event.target.style.left;
        //         if (right == "10px") {
        //             left = "10px";
        //             right = "";
        //         } else if (left == "10px") {
        //             left = "";
        //             right = "10px";
        //         }
        //         event.target.style.right = right;
        //         event.target.style.left = left;
        //     });
        //     name.innerText = v;
        //     wrapper.appendChild(name);
        //     return wrapper;
        // });
        .append("div")
        .attr("class", "websiteSVG")
        .attr("width", chartWidth - chartMargin.left - chartMargin.right - 10)
        .attr("height", chartHeight / 5 - chartMargin.top - chartMargin.bottom - 10);
    // chart.selectAll("div.websiteRect")
    //     .append("div")
    //     .attr("class", "float-name")
    //     .style({ right: "10px" })
    //     .on("mouseenter", function (v, i) {
    //         var right = d3.event.target.style.right;
    //         var left = d3.event.target.style.left;
    //         if (right == "10px") {
    //             left = "10px";
    //             right = "";
    //         } else if (left == "10px") {
    //             left = "";
    //             right = "10px";
    //         }
    //         d3.event.target.style.right = right;
    //         d3.event.target.style.left = left;
    //     })
    //     .text(function (v) { return v; });
    websiteDivs.exit().remove();
    var websiteItems = document.getElementsByClassName("websiteRect");
    var filteredWebsite = Object.keys(filter.websites);
    for (var i = 0; i < websiteItems.length; i++) {
        var websiteSVG = d3.select(websiteItems[i]).select("div.websiteSVG");
        var articleRects = websiteSVG.selectAll("div.flash").data(data[filteredWebsite[i]].filter(function (item) {
            // filter data
            var flag = true;
            // filter time
            if (new Date(item.time) > filter.time.to || new Date(item.time) < filter.time.from) flag = false;

            // filter topics
            for (var i = 0; i < item.topic.length && flag; i++) {
                // console.log(item.topic[i]);
                if (filter.topics[item.topic[i].group] === undefined) flag = false;
            }
            // filter corporations
            // for (var i = 0; i < item.corp.length && flag; i++) {
            //     if (filter.corporations[item.corp[i]] === undefined) flag = false;
            // }
            return flag;
        }));
        articleRects.attr("class", "flash")
            .style("left", function (v, i) {
                var dateDisp = (new Date(v.time)).getTime() - filter.time.from.getTime();
                var result = xScale(Math.floor(dateDisp / unit));
                return result + "px";
            })
            .style("top", function (v, i) {
                var result = yScale(Math.floor((new Date(v.time)).getUTCHours() / 2));
                return result + "px";
            })
            .style("border-radius", 2)
            // .attr("ry", 2)
            .style("width", itemSize.width + "px")
            .style("height", itemSize.height + "px")
            .style("background-color", function (v, i) {
                return colorScale(v.topic[0].group);
            })
            .on("mouseenter", function (v, i) {
                onMouseEnter(v);
                d3.event.target.style.stroke = "#66ccff";
                d3.select("#float_info").style({
                    visibility: "visible",
                    transform: "translate(" + d3.event.clientX + "px, " + d3.event.clientY + "px)",
                    WebkitTransform: "translate(" + d3.event.clientX + "px, " + d3.event.clientY + "px)",
                    opacity: 1
                });
            })
            .on("mouseleave", function (v, i) {
                d3.event.target.style.stroke = null;
                d3.select("#float_info").style({
                    visibility: "hidden",
                    opacity: 0
                });
            });
        articleRects.enter()
            .append("div")
            .attr("class", "flash")
            .style("left", function (v, i) {
                var dateDisp = (new Date(v.time)).getTime() - filter.time.from.getTime();
                var result = xScale(Math.floor(dateDisp / unit));
                return result + "px";
            })
            .style("top", function (v, i) {
                var result = yScale(Math.floor((new Date(v.time)).getUTCHours() / 2));
                return result + "px";
            })
            .style("border-radius", 2)
            // .attr("ry", 2)
            .style("width", itemSize.width + "px")
            .style("height", itemSize.height + "px")
            .style("background-color", function (v, i) {
                return colorScale(v.topic[0].group);
            })
            .on("mouseenter", function (v, i) {
                onMouseEnter(v);
                d3.event.target.style.stroke = "#66ccff";
                d3.select("#float_info").style({
                    visibility: "visible",
                    transform: "translate(" + d3.event.clientX + "px, " + d3.event.clientY + "px)",
                    WebkitTransform: "translate(" + d3.event.clientX + "px, " + d3.event.clientY + "px)",
                    opacity: 1
                });
            })
            .on("mouseleave", function (v, i) {
                d3.event.target.style.stroke = null;
                d3.select("#float_info").style({
                    visibility: "hidden",
                    opacity: 0
                });
            });
        articleRects.exit().remove();
    }
}
