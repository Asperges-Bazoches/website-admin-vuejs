<template>
  <div class="home" style="margin-left:5%;margin-right:5%;">

    <h2>Bienvenue sur la page d'administration de Champ-Ramard.fr</h2>
    <br/>

    <h4>Les commandes à venir en quelques chiffres...</h4>
    <CmdByStatus/>

    <br/><br/>

    <p><b>Sur la page d'adminisation, vous pouvez...</b></p>
    <ul>
      <li>Administrer les commandes futures;</li>
      <li>Paramétrer le site (titre, sous-titre, disponibilité des produits);</li>
      <!--<li>Suivre l'évolution des commandes via des graphiques;</li>-->
      <li>Retrouver la liste des clients.</li>
    </ul>
    <br/>
    <p>Naviguez dans le site d'administration grâce au menu sur la gauche.</p>

    <br/><br/><br/>


    <!--
      <h3>Suivi des commandes</h3>
      <br/><hr/><br/>
      <br/><br/>
      <h4>Volume commandé sur le site par produit et par jour</h4>
      <OrdersChart />
      <div style='margin-left:10%; margin-right:10%;'>
        <v-chip>ASTUCES</v-chip><br/>
        <ul>
          <li class="soon"><p style="font-size: 13px"> Vous pouvez zoomer en utilisant la souris et dézommer en cliquant sur le rond <i class="fa fa-minus-circle" style='color:blue'></i> situé en haut à droite du graphique.</p></li>
          <li class="soon"><p style="font-size: 13px"> En passant la souris sur le graphique (ou en cliquant depuis un mobile), vous pouvez avoir un récapitulatif du nombre de commande par produit.</p></li>
        </ul>
      </div>
    -->

    <br/><br/>
  </div>
</template>

<script>
// @ is an alias to /src
//import OrdersChart from '@/components/OrdersChart.vue'
import CmdByStatus from '@/components/CmdByStatus.vue'

export default {
  name: 'Home',
  components: {
    //  OrdersChart,
    CmdByStatus,
  },
  data: () => ({
    accepted: 0,
    refused: 0,
    pending: 0,
  }),
}
</script>

<style scope>
  .soon{
    list-style-type: none;
    transform: translateX(-20px);
  }
</style>
