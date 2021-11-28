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
    <v-row>
      <v-col cols=4>
        <v-alert
          dense
          prominent
          text
          color="green"
          type="success"
          >{{accepted}} commande(s) future(s) acceptée(s)</v-alert>
      </v-col>
      <v-col cols=4>
        <v-alert
          dense
          prominent
          text
          color="red"
          type="success"
        >{{refused}} commande(s) future(s) refusée(s)</v-alert>
      </v-col>
      <v-col cols=4>
        <v-alert
          dense
          outlined
          prominent
          color="red"
          type="error"
        >{{pending}} commande(s) future(s) à traiter</v-alert>
      </v-col>
  </v-row>


  <br/>
  <OrdersChart />

    <br/><br/>
  </div>
</template>

<script>
// @ is an alias to /src
import OrdersChart from '@/components/OrdersChart.vue'

export default {
  name: 'Home',
  components: {
    OrdersChart,
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
