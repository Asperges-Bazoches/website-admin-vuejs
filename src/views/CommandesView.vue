<template>
  <div class="orders-panel">
    <h3>Vue d'ensemble des commandes à venir</h3>
    <CmdByStatus short/>
    <br /><br />

    <h3>Interface d'administration des commandes</h3><br />
    <v-row>
      <v-btn-toggle
        v-model="template"
        tile
        color="deep-purple accent-3"
        group
      >
        <v-btn value="Toutes les commandes">
          Toutes</v-btn>
        <v-btn value="Toutes les commandes futures">
          Futures</v-btn>
        <v-btn value="Commandes du jour">
          Aujourd'hui</v-btn>
        <v-btn value="Commandes de demain">
          Demain</v-btn>
      </v-btn-toggle>
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
      @click:row="rowClick"

      hide-default-footer
      :page.sync="page"
      :items-per-page="itemsPerPage"
      @page-count="pageCount = $event"
    >
      <template slot="no-data">
          Aucune commande disponible
      </template>
      <template v-slot:item.ID="{ item }">
        <b v-if="selectedOrder.length && (selectedOrder[0].ID == item.ID)">
          {{ item.ID }}
        </b>
        <span v-else>{{ item.ID }}</span>
      </template>
      <template v-slot:item.STATUS="{ item }">
        <v-chip
          :color="getColor(item.STATUS)"
          dark
        >
          {{ item.STATUS.toUpperCase() }}
        </v-chip>
      </template>
    </v-data-table>

  <v-row>
    <v-col cols="3">
      <div class="text-right pt-3">
        <v-btn
          tile
          :loading="loading"
          @click='updateTable()'
          >
          <v-icon left>
            mdi-sync
          </v-icon>
          Réactualiser
        </v-btn>
      </div>
    </v-col>
    <v-col cols="6">
      <div class="text-center pt-2">
        <v-pagination
        v-model="page"
        :length="pageCount"
        ></v-pagination>
      </div>
    </v-col>
    <v-col cols="3">
      <div class="text-center pt-3">
        <v-btn
          tile
          color="primary"
          @click='printTable()'
          >
          <v-icon left>
            mdi-printer
          </v-icon>
          Imprimer
        </v-btn>
      </div>
    </v-col>
  </v-row>

  <br /><br /><br />

    <div v-if="selectedOrder==''">
      <Order
        id=""
        status="AIDE D'UTILISATION"
        name="Aucune sélection"
        email=""
        phone="
        Utiliser le tableau pour sélectionner une commande en cliquant sur une des lignes.
        Vous retrouverez les informations de la commande dans cet encart."
        aspb="Aucune"
        aspv="Aucune"
        fraise="Aucune"
        day="Jour de commande"
        hour="Créneau"
        place="Point de retrait"
      />
      <br/>
    </div>

    <br/><br/>

    <div v-if="selectedOrder.length">
      <h2>
        Commande sélectionnée
      </h2>

      <Order
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
        :status="selectedOrder[0].STATUS.toUpperCase()"
        :comments="selectedOrder[0].COMMENTS"
        :secret="selectedOrder[0].SECRET"
      />
    </div>

    <br/><br/><br/>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';
import Order from '@/components/Order.vue';
import CmdByStatus from '@/components/CmdByStatus.vue';
import { isAccepted } from '@/_services/parsers.js';

export default {
  name: 'CommandesView',
  components: {
    Order,
    CmdByStatus,
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

    printTable(){
      const requestOptions = {
          headers: { 'Content-Type': 'application/json',
                     "Access-Control-Allow-Origin": "*",
                     'Authorization': 'Basic ' + localStorage.getItem('user'),
                   },
      };

      axios
        .get('/v2/private/print.php?template='+this.slug, requestOptions)
        .then((response) => {
          var wnd = window.open("about:blank", "", "_blank");
          wnd.document.write(response.data);
        })
        .catch((err) => {
          alert(err);
        });
    },

    getColor (status) {
      if (status == "EN ATTENTE") return 'orange'
      else if (isAccepted(status)) return 'green'
      else return 'red'
    },

    rowClick(item, row) {
      if (this.selectedOrder.length && this.selectedOrder[0].ID === item.ID) {
        this.selectedOrder = '';
        row.select(false);
      } else {
        this.selectedOrder = item;
        row.select(true);
        window.scroll({
          top: document.body.scrollHeight,
          behavior: "smooth"
        });
      }
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
