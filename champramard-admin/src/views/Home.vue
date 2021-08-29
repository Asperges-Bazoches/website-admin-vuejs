<template>
  <div class="home">
    <v-row>
      <v-col cols=4>
        <ProductActivation
          prodId="aspb"
          name="Asperges blanches"
          img='img/logo.svg'
          />
      </v-col>
      <v-col cols=4>
        <ProductActivation
          prodId="aspv"
          name="Asperges vertes"
          img='img/logo.svg'
        />
      </v-col>
      <v-col cols=4>
        <ProductActivation
          prodId="fraise"
          name="Fraises"
          img='img/strawberry.svg'
        />
      </v-col>
    </v-row>
    <br/>

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
import ProductActivation from '@/components/ProductActivation.vue'
import OrdersChart from '@/components/OrdersChart.vue'

export default {
  name: 'Home',
  components: {
    ProductActivation,
    OrdersChart,
  }
}
</script>
