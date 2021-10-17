<template>
  <div class="home" style="margin-left:5%;margin-right:5%;">

    <h1>Bienvenue sur la page d'administration de Champ-Ramard.fr</h1>
    <br/>

    <p><b>Ici, vous pouvez...</b></p>
    <ul>
      <li>Valider, invalider des commandes;</li>
      <li>Paramétrer le site (titre, sous-titre, disponibilité des produits);</li>
      <li>Suivre l'évolution des commandes via des graphiques;</li>
      <li>Retrouver une liste de clients (BIENTÔT).</li>
    </ul>
    <br/>
    <p>Naviguez dans le site d'administration grâce au menu sur la gauche.</p>

    <br/><br/>

    <h2>Suivi des commandes</h2>

    <OrdersChart />


    <br/><br/>

    <p><b>TODO List</b></p>
    <ul>
      <li>Actualiser les ProductActivation quand le component réapparait</li>
      <li>Nombre de commandes à valider</li>
      <li>Nombre de commandes acceptées</li>
      <li>Nombre de commandes refusées</li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src
import OrdersChart from '@/components/OrdersChart.vue'

export default {
  name: 'Home',
  components: {
    OrdersChart,
  }
}
</script>
