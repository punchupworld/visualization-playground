<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<script>
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as d3 from "d3";

var srcUrl = "https://media.themoviedb.org/t/p/w94_and_h141_bestv2";

const colorList = [
  {
    original_language: "en",
    fullname: "English",
    color: "#4269d0",
  },
  {
    original_language: "fr",
    fullname: "French",
    color: "#efb118",
  },
  {
    original_language: "es",
    fullname: "Spanish",
    color: "#9467bd",
  },
  {
    original_language: "zh",
    fullname: "Mandarin",
    color: "#6cc5b0",
  },
  {
    original_language: "de",
    fullname: "German",
    color: "#3ca951",
  },
  {
    original_language: "ru",
    fullname: "Russian",
    color: "#ff8ab7",
  },
  {
    original_language: "da",
    fullname: "Danish",
    color: "#a463f2",
  },
  {
    original_language: "it",
    fullname: "Italian",
    color: "#97bbf5",
  },
  {
    original_language: "xx",
    fullname: "No Language",
    color: "#9c6b4e",
  },
  {
    original_language: "uk",
    fullname: "Ukrainian",
    color: "#17becf",
  },
  {
    original_language: "ko",
    fullname: "Korean",
    color: "#ECF8F8",
  },
  {
    original_language: "hu",
    fullname: "Hungarian",
    color: "#EEE4E1",
  },
  {
    original_language: "mo",
    fullname: "Moldavian",
    color: "#F6C6C7",
  },
  {
    original_language: "tr",
    fullname: "Turkish",
    color: "#8BD2EC",
  },
  {
    original_language: "pt",
    fullname: "Portuguese",
    color: "#FCEE9E",
  },
  {
    original_language: "fi",
    fullname: "Finnish",
    color: "#80B7A2",
  },
  {
    original_language: "he",
    fullname: "Hebrew",
    color: "#ADD495",
  },
];

const sortGenre = (genre) => {
  let data = genre.split(",").sort();
  let text = "";

  for (let i = 0; i < data.length; i++) {
    text += data[i];
    if (i < data.length - 1) text += ",";
  }

  return text;
};

export default {
  name: "HelloWorld",
  async mounted() {
    // Create D3 simulation and collision force
    var simulation = d3.forceSimulation();
    var collisionForce = d3.forceCollide();

    // Update bullet positions on tick
    simulation.on("tick", function () {
      updatePositions();
    });

    // updtate positions
    function updatePositions() {
      am5.array.each(nodes, function (node) {
        var circle = node.circle;
        // Instead of setting `x` we use `dx`, as `x` is set by the chart
        // each time chart changes its size or something else changes
        circle.setAll({
          dx: node.x - circle.x(),
        });

        node.fy = circle.y(); // `y` might change when div changes its size
      });
    }

    // nodes array which will be used by simulation
    var nodes = [];

    // Adds nodes to the nodes array
    function addNode(dataItem) {
      var bullets = dataItem.bullets;
      if (bullets) {
        var bullet = bullets[0];
        if (bullet) {
          var circle = bullet.get("sprite");

          if (circle) {
            // We use `fy` for vertical position as we don't want `y` to change.
            // For a horizontal chart, set `fx` instead of `fy`
            var node = {
              x: circle.x(),
              fy: circle.y(),
              circle: circle,
            };
            nodes.push(node);
          }
        }
      }
    }

    // Updates collision forces
    function updateForces() {
      simulation.force("collision", collisionForce);

      collisionForce.radius(function (node) {
        var circle = node.circle;
        return circle.get("radius", 1) + 1; // 1 add 1 for padding
      });
    }

    const myTheme = am5.Theme.new(root);

    myTheme.rule("Label").setAll({
      fill: am5.color(0xffffff),
      fontSize: "14px",
      fontFamily: "Kondolar Thai",
    });

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("chartdiv2");
    root._logo.dispose();

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root), myTheme]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        paddingRight: 0,
        paddingLeft: 0,
        layout: root.verticalLayout,
      }),
    );

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {}),
        visible: false,
      }),
    );

    xAxis.get("renderer").grid.template.set("forceHidden", true);

    var yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
        min: 0,
        max: 10,
        visible: false,
      }),
    );

    yAxis.get("renderer").grid.template.set("forceHidden", true);

    var tooltip = yAxis.labelsContainer.set(
      "tooltip",
      am5.Tooltip.new(root, {
        pointerOrientation: "right",
      }),
    );

    tooltip.label.setAll({
      maxWidth: 50,
      oversizedBehavior: "wrap",
    });

    // Create series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = chart.series.push(
      am5xy.LineSeries.new(root, {
        calculateAggregates: true,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "y",
        valueXField: "x",
        valueField: "value",
      }),
    );

    series.strokes.template.set("visible", false);

    // Add bullet
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
    var circleTemplate = am5.Template.new({});

    series.bullets.push(function (root, series, dataItem) {
      var bulletCircle = am5.Circle.new(
        root,
        {
          radius: 4.5,
          fill: colorList.filter(
            (x) =>
              x.original_language == dataItem.dataContext.original_language,
          )[0].color,
          fillOpacity: 1,
          tooltipHTML: `<div class='flex gap-2 text-[14px] overflow-hidden'>
                <img src="{img}" class="w-20"/>
                <div>
                  <div class="flex flex-col">
                    <p class="font-bold lg:text-[16px]">
                      {name}
                    </p>
                    <p><b>Date: </b>{date}</p>
                  </div>
                  <div>
                    <p class="break-words"><b>Genres:</b> </p>
                     <p class="break-words">{genre}</p>
              <p class="break-words"><b>Vote:</b> {vote_count}</p>
                  <p class="break-words"><b>User score:</b> {vote_average}</p>
                </div></div>`,
          tooltipY: 0,
        },
        circleTemplate,
      );

      return am5.Bullet.new(root, {
        sprite: bulletCircle,
      });
    });

    // Add heat rule
    // https://www.amcharts.com/docs/v5/concepts/settings/heat-rules/
    // this makes radius different, depending on the value.
    // remove if you want all circles to be of the same size
    series.set("heatRules", [
      {
        target: circleTemplate,
        min: 2,
        max: 9,
        dataField: "value",
        key: "fill",
      },
    ]);

    // Set data
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Setting_data

    // Generate random data
    var data = [];
    const dataList = (await d3.csv("/filtered_animation_data.csv")).filter(
      (x) => x.original_language != "ja",
    );

    for (var i = 0; i < dataList.length; i++) {
      data.push({
        y: dataList[i].vote_average,
        x: 0,
        fill: colorList.filter(
          (x) => x.original_language == dataList[i].original_language,
        )[0].color,
        value: dataList[i].vote_count,
        name: dataList[i].original_title,
        img: srcUrl + dataList[i].poster_path,
        date: new Date(dataList[i].release_date).toLocaleDateString("en-GB"),
        genre: sortGenre(dataList[i].genres),
        vote_count: parseInt(dataList[i].vote_count).toLocaleString(),
        vote_average: dataList[i].vote_average,
        original_language: dataList[i].original_language,
        original_language_fullname: colorList.filter(
          (x) => x.original_language == dataList[i].original_language,
        )[0].fullname,
      });
    }

    series.data.setAll(data);

    // Update forces whenever data is parsed
    series.events.on("datavalidated", function () {
      // Needs a timeout as bullets are created a bit later
      setTimeout(function () {
        am5.array.each(series.dataItems, function (dataItem) {
          addNode(dataItem);
        });
        simulation.nodes(nodes);
        updateForces();
      }, 500);
    });

    // Update bullet positions when chart bounds change
    chart.plotContainer.events.on("boundschanged", function () {
      updateForces();
      simulation.restart();
    });

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/

    chart.appear(1000, 100);
  },
};
</script>

<template>
  <div class="hello" id="chartdiv2" ref="chartdiv2"></div>
</template>

<style scoped>
.hello {
  width: 100%;
  height: 500px;
}
</style>
