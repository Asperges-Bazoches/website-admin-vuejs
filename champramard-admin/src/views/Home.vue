<template>
  <div class="home">

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
