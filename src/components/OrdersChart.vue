<template>
  <div>
    <div v-if="display">
      <h3>Volume commandé sur le site par produit et par jour</h3>

      <p>Voici l'évolution journalière des commandes acceptées ou en attente. Par défaut, le graphique est zoomé sur les 15 prochains jours.</p>
      <div class="content" style="display:block">
        <div class="chart" ref="daily_orders" style='width:100%; height:450px; font-size:10pt;'></div>
      </div>
      <br/>
      <ul>
        <li><em>Astuce 1 : Vous pouvez zoomer en utilisant la souris et dézommer en cliquant sur le rond <i class="fa fa-minus-circle" style='color:blue'></i> situé en haut à droite du graphique.</em></li>
        <li><em>Astuce 2 : En passant la souris sur le graphique (ou en cliquant depuis un mobile), vous pouvez avoir un récapitulatif du nombre de commande par produit.</em></li>
      </ul>
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

        return (chart);

        //const xmin = new Date()
        //xmin.setDate(xmin.getDate() - 1)
        //const xmax = new Date(xmin)
        //xmax.setDate(xmax.getDate() + 15)
        //chart.events.on("ready", function () {dateAxis.zoomToDates(xmin,xmax);});
      },
    },

    mounted () {
      this.chart = this.createChart();
      const user = localStorage.getItem('user');
      axios
        .get('/v1/secure/cmd_overview.php', {
          headers: {
          'Access-Control-Allow-Origin': "*",
          'Authorization': 'Basic ' + user,
          'Content-Type': 'application/json',
        }})
       .then(response => {
         this.display = true;
         this.chart.data = response.data;
       })
       .catch((e)=>{
         console.log(e);
         this.display = true;
         this.chart.data = [];
       })
      },
  }
</script>
