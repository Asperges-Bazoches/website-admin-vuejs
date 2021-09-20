<template>
  <div class="orders-panel">
    <v-row>
      <v-col cols="10">
        <v-select
          v-model="template"
          :items="Object.keys(lsTemplate)"
          :rules="[v => !!v || 'Item is required']"
          label="Sélection des commandes"
          required
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-btn
          elevation="2"
          :loading="loading"
          large
          @click='updateTable()'
        >Rafraichir</v-btn>
      </v-col>
    </v-row>
    <br/>
    <v-data-table
          :loading="loading"
          loading-text="Chargement..."
          :headers="headers"
          :items="orders"
          :items-per-page="20"
          class="elevation-1"
        ></v-data-table>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';

export default {
  name: 'CommandesView',
  components: {
  },
  data: () => ({
    template : "Toutes les commandes",
    slug : null,
    loading: true,
    headers : [{text: 'Prénom-Nom',
                sortable: true,
                value: 'NAME',
              }, {
                text: 'Téléphone',
                sortable: false,
                value: 'PHONE',
              }, {
                text: 'Adresse e-mail',
                sortable: false,
                value: 'EMAIL',
              }, {
                text: 'Asperges blanches',
                sortable: true,
                value: 'ASPB',
              }, {
                text: 'Asperges vertes',
                sortable: true,
                value: 'ASPV',
              }, {
                text: 'Fraises',
                sortable: true,
                value: 'FRAISE',
              }, {
                text: 'Etat',
                sortable: true,
                value: 'STATUS',
              }],
    orders : [],
    lsTemplate : {
      "Toutes les commandes" : "all",
      "Toutes les commandes futures" : "default",
      "Commandes du jour" : "today",
      "Commandes de demain" : "tomorrow",
    },
  }),
  methods: {
    updateTable(){
      this.loading = true;
      const requestOptions = {
          headers: { 'Content-Type': 'application/json',
                     "Access-Control-Allow-Origin": "*",
                     'Authorization': 'Basic ' + localStorage.getItem('user'),
                   },
      };

      axios
        .get('/v2/private/orders.php?template='+this.slug, requestOptions)
        .then((response) => {
          this.orders = response.data.data;
          this.loading = false;
        })
        .catch(() => {
          this.orders = [];
          this.loading = false;
        });
    }
  },
  watch: {
    template: function (val) {
      this.slug = this.lsTemplate[val];
      this.updateTable();
    },
  },
  mounted(){
    this.updateTable();
  }
}

</script>

<style>
.orders-panel {
  margin-left: 5%;
  margin-right: 5%;
}

</style>
