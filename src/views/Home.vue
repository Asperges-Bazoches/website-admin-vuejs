<template>
  <div class="home" style="margin-left:5%;margin-right:5%;">

    <h1>Bienvenue sur la page d'administration de Champ-Ramard.fr</h1>
    <br/>

    <p><b>Ici, vous pouvez...</b></p>
    <ul>
      <li>Valider, invalider des commandes;</li>
      <li>Paramétrer le site (titre, sous-titre, disponibilité des produits);</li>
      <li>Suivre l'évolution des commandes via des graphiques;</li>
      <li class="soon"><v-chip>BIENTÔT</v-chip> Retrouver la liste des clients.</li>
    </ul>
    <br/>
    <p>Naviguez dans le site d'administration grâce au menu sur la gauche.</p>

    <br/><br/>

    <h2>Suivi des commandes</h2>

    <h3>Les commandes en quelques chiffres...</h3>
    <CmdByStatus/>


  <br/>
  <OrdersChart />

    <br/><br/>
  </div>
</template>

<script>
// @ is an alias to /src
import OrdersChart from '@/components/OrdersChart.vue'
import CmdByStatus from '@/components/CmdByStatus.vue'

export default {
  name: 'Home',
  components: {
    OrdersChart,
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
