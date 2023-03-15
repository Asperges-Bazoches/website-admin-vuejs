<template>
  <div>
    <div v-if="display">
      <h3>Volume commandé sur le site par produit et par jour</h3>

      <v-slide-group multiple show-arrows>
        <v-btn-toggle
          v-model="subset"
          tile
          color="deep-purple accent-3"
          group
          @change="updateChartData()"
        >
          <v-btn value="all">
            Toutes les commandes
          </v-btn>
          <v-btn value="accepted">
            Commandes acceptées
          </v-btn>
          <v-btn value="not_refused">
            Commandes non refusées
          </v-btn>
        </v-btn-toggle>
      </v-slide-group>

      <div class="content" style="display:block">
        <div
          class="chart"
          ref="daily_orders"
          style='width:100%; height:450px; font-size:10pt;'>
        </div>
      </div>
      <br/>
    </div>
    <template v-else><br/><p>Aucune commande disponible. Impossible d'afficher le graphique.</p></template>
  </div>
</template>

<script>

  import axios from 'axios';
  import * as am4core from "@amcharts/amcharts4/core";
  import * as am4charts from "@amcharts/amcharts4/charts";
  import am4themes_animated from "@amcharts/amcharts4/themes/animated";

  // defining the theme to animated
  am4core.useTheme(am4themes_animated);

  export default {
    name: 'OrdersChart',
    props: {
    },
    data: () => ({
      chart: '',
      subset: 'not_refused',
      display: true,
    }),

    methods: {

      createChart(){

        var chart = am4core.create(this.$refs.daily_orders, am4charts.XYChart);

        // Create axes
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;
        dateAxis.renderer.minGridDistance = 30;
        dateAxis.title.text = "Jour";

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = "Nombre de portions";

        // Create series
        function createSeries(field, name, color, unit) {
          var series = chart.series.push(new am4charts.LineSeries());
          series.dataFields.valueY = field;
          series.dataFields.dateX = "DAY";
          series.name = name;
          series.unit = unit;
          series.tooltipText = "{dateX}: [b]{valueY}[/]";
          series.strokeWidth = 2;
          series.stroke = am4core.color(color);
          series.fill = am4core.color(color);
          series.dateFormatter.monthsShort = ["Jan","Fev", "Mar","Avr", "Mai","Jun","Jul","Aou","Sep","Oct","Nov","Dec"];

          // Set up tooltip
          series.adapter.add("tooltipText", function() {
            var text = "[bold]{dateX}[/]\n"
            chart.series.each(function(item) {
              text += "[" + item.stroke.hex + "]●[/] " + item.name + ": {" + item.dataFields.valueY + "}" + item.unit + "\n";
            });
            return text;
          });

          series.tooltip.getFillFromObject = false;
          series.tooltip.background.fill = am4core.color("#fff");
          series.tooltip.label.fill = am4core.color("#00");

          // Prevent cross-fading of tooltips
          series.tooltip.defaultState.transitionDuration = 0;
          series.tooltip.hiddenState.transitionDuration = 0;

          var bullet = series.bullets.push(new am4charts.CircleBullet());
          bullet.circle.stroke = am4core.color(color);
          bullet.circle.strokeWidth = 2;

          return series;
        }

        createSeries("ASPB", "Asp. Blanches", "#000", " kg");
        createSeries("ASPV", "Asp. Vertes", "#50ff50", " kg");
        createSeries("FRAISE", "Fraises", "#ff0000", " x 250g");

        chart.legend = new am4charts.Legend();
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.maxTooltipDistance = 0;

        chart.data = [];

         //const xmin = new Date()
         //xmin.setDate(xmin.getDate() - 1)
         //const xmax = new Date(xmin)
         //xmax.setDate(xmax.getDate() + 15)
         //chart.events.on("ready", function () {dateAxis.zoomToDates(xmin,xmax);});

         return (chart);
      },

     updateChartData() {
        const user = localStorage.getItem('user');
        console.log('Updating chart data..');
        axios
          .get('/v2/private/stats/by_day.php', {
            headers: {
            'Access-Control-Allow-Origin': "*",
            'Authorization': 'Basic ' + user,
            'Content-Type': 'application/json',
          }})
         .then(response => {
           console.log('Request done..');
           this.display = true;
           this.chart.addData(
             response.data[this.subset],
             this.chart.data.length
           );
           console.log('Data ' + this.subset + ' passed to chart..');
         })
         .catch((e)=>{
           console.log(e);
           this.display = true;
           this.chart.addData(
             [],
             this.chart.data.length
           );
         })
      }
    },

    mounted () {
      this.chart = this.createChart();
      this.updateChartData();
    }
  }
</script>
