<template>
  <div class="orders-panel">
    <CmdByStatus short/>
    <v-row>
          <v-btn-toggle
          v-model="template"
          tile
          color="deep-purple accent-3"
          group
        >
          <v-btn value="Toutes les commandes">
            Toutes les commandes
          </v-btn>

          <v-btn value="Toutes les commandes futures">
            Futures
          </v-btn>

          <v-btn value="Commandes du jour">
            Aujourd'hui
          </v-btn>

          <v-btn value="Commandes de demain">
            Demain
          </v-btn>
        </v-btn-toggle>
        <!--<v-select
          v-model="template"
          :items="Object.keys(lsTemplate)"
          :rules="[v => !!v || 'Item is required']"
          label="Sélection des commandes"
          required
        ></v-select>-->
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
    <div class="text-center pt-2">
      <v-pagination
        v-model="page"
        :length="pageCount"
      ></v-pagination>
    </div>
    <br />

    <h2>
      Outils du tableau de commandes
    </h2>
    <v-row>
        <v-col cols="5">
          <v-text-field
            :value="itemsPerPage"
            label="Nombre de commandes par page"
            type="number"
            min="-1"
            max="15"
            @input="$event ? itemsPerPage = parseInt($event, 10): itemsPerPage = 0"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn
          elevation="2"
          :loading="loading"
          large
          block
          @click='updateTable()'
          >Rafraichir</v-btn>
        </v-col>
        <v-col cols="3">
          <v-btn
          elevation="2"
          large
          block
          color="primary"
          @click='printTable()'
          >
          <v-icon left>
            mdi-printer
          </v-icon>
          Imprimer l'ensemble du tableau
        </v-btn>
      </v-col>
    </v-row>

    <div v-if="selectedOrder==''">
      <h2>
        Guide d'utilisation
      </h2>
      <p>
        Cliquez sur une ligne du tableau pour gérer la commande. <br/><br/>

        Une interface, comme celle ci-dessous, va alors apparaître en bas du tableau.
        Vous y retrouverez l'ensemble des détails sur la commande (exemple: coordonnées, commentaire).
        Utilisez les boutons pour accepter, refuser et envoyer un mail. <br/><br/>

        <Order
          id=""
          name="Aucune sélection"
          email=""
          phone="Utiliser le tableau pour sélectionner une commande"
          day="..."
          hour="..."
          aspb="?"
          aspv="?"
          fraise="?"
          place="..."
        />


      </p><br/>

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
    itemsPerPage: 5,
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
