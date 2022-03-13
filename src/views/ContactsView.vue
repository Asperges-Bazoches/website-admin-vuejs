<template>
  <div class="orders-panel">
    <h3>Liste de clients (d'après les commandes de cette saison)</h3><br />
    <v-data-table
      v-model="contacts"

      :loading="loading"
      loading-text="Chargement..."
      :headers="headers"
      :items="contactsData"
      class="elevation-1"

      item-key="NAME"

      hide-default-footer
      :page.sync="page"
      :items-per-page="itemsPerPage"
      @page-count="pageCount = $event"
    >
      <template slot="no-data">
          Aucun client trouvé
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
      <v-col cols="3"></v-col>
    </v-row>
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
    loading: true,
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    headers : [{
                text: 'Prénom-Nom',
                sortable: true,
                value: 'NAME',
              }, {
                text: 'Téléphone',
                sortable: false,
                value: 'PHONE',
              }, {
                text: 'Adresse e-mail',
                sortable: false,
                value: 'EMAIL'
              }],
    contactsData : [],
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
        .get('/v2/private/stats/contacts.php', requestOptions)
        .then((response) => {
          this.contactsData = response.data;
          this.loading = false;
        })
        .catch(() => {
          this.contactsData = [];
          this.loading = false;
        });
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
