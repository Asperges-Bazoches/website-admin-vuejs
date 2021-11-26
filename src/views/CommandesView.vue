<template>
  <div class="orders-panel">
    <v-row>
      <v-col cols="5">
        <v-select
          v-model="template"
          :items="Object.keys(lsTemplate)"
          :rules="[v => !!v || 'Item is required']"
          label="Sélection des commandes"
          required
        ></v-select>
      </v-col>
      <v-col cols="5">
        <v-text-field
          :value="itemsPerPage"
          label="Nombre de commandes par page"
          type="number"
          min="-1"
          max="15"
          @input="itemsPerPage = parseInt($event, 10)"
        ></v-text-field>
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
      v-model="selectedOrder"

      :loading="loading"
      loading-text="Chargement..."
      :headers="headers"
      :items="orders"
      class="elevation-1"

      item-key="ID"
      single-select
      show-select

      hide-default-footer
      :page.sync="page"
      :items-per-page="itemsPerPage"
      @page-count="pageCount = $event"
    >
      <template slot="no-data">
          Aucune commande disponible
      </template>
      <template v-slot:item.STATUS="{ item }">
        <v-chip
          :color="getColor(item.STATUS)"
          dark
        >
          {{ item.STATUS }}
        </v-chip>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination
        v-model="page"
        :length="pageCount"
      ></v-pagination>
    </div>
    <br/><br/>

    <Order
      v-if="selectedOrder.length"
      :id="selectedOrder[0].ID"
      :name="selectedOrder[0].NAME"
      :email="selectedOrder[0].EMAIL"
      :phone="selectedOrder[0].PHONE"
      :day="selectedOrder[0].DAY"
      :hour="selectedOrder[0].HOUR"
      :aspb="selectedOrder[0].ASPB"
      :aspv="selectedOrder[0].ASPV"
      :fraise="selectedOrder[0].FRAISE"
      :place="selectedOrder[0].PLACE"
      :status="selectedOrder[0].STATUS"
      :comments="selectedOrder[0].COMMENTS"
      :secret="selectedOrder[0].SECRET"
    />
    <br/><br/><br/>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';
import Order from '@/components/Order.vue';

export default {
  name: 'CommandesView',
  components: {
    Order,
  },
  data: () => ({
    template : "Toutes les commandes",
    selectedOrder : '',
    slug : "all",
    loading: true,
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    headers : [{text: 'Id.',
                sortable: true,
                value: 'ID',
              }, {
                text: 'Prénom-Nom',
                sortable: true,
                value: 'NAME',
              //}, {
              //  text: 'Téléphone',
              //  sortable: false,
              //  value: 'PHONE',
              //}, {
              //  text: 'Adresse e-mail',
              //  sortable: false,
              //  value: 'EMAIL',
              }, {
                text: 'Date',
                sortable: true,
                value: 'DAY',
              }, {
                text: 'Créneau',
                sortable: true,
                value: 'HOUR',
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
      this.selectedOrder = [];
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
    },

    getColor (status) {
      if (status == "EN ATTENTE") return 'orange'
      else if (status == "ACCEPTE") return 'green'
      else return 'red'
    },
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
