<template>
  <v-card
    class="mx-auto"
    max-width="344"
    outlined
    :loading="this.loading"
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">
          <v-chip
            class="ma-2"
            :color="header_col"
            text-color="white"
          >
            <v-avatar left>
              <v-icon>{{this.header_i}}</v-icon>
            </v-avatar>
            {{this.header}}
          </v-chip>
        </div>
        <v-list-item-title class="headline mb-1">{{this.name}}</v-list-item-title>
        <v-list-item-subtitle>{{this.msg}}</v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar
        tile
        size="60"
        color="white"
        src
      >
      <v-img :src="this.img"/>
    </v-list-item-avatar>
    </v-list-item>

    <v-card-actions>
      <v-text-field
        outlined
        v-model="price"
        type="number"
        step="0.1"
        label="Prix du produit"
        suffix="€"
        @change="setPrice()"
      />
    </v-card-actions>
    <v-card-actions>
      <v-btn text @click="setAvailability()">{{this.btnMsg}}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>

  import axios from 'axios';

  export default {
    name: 'ProductActivation',
    props: {
      prodId: String,
      name: String,
      img: String,
    },
    data: () => ({
      price: null,
      loading:true,
      header: 'CHARGEMENT',
      header_i: '',
      header_col: 'grey',
      response: null,
      btnMsg: 'Paramétrer',
      msg : 'Erreur : Impossible de lire l\'état actuel',
    }),
    methods: {
      getAvailability: function () {
        this.loading = true;
        const user = localStorage.getItem('user');
        axios
        .get('https://api.champ-ramard.fr/v2/public/settings.php',
          {headers: {
            'Access-Control-Allow-Origin': "*",
            'Authorization': 'Basic ' + user,
            'Content-Type': 'application/json',
           }})
        .then(response => {
          let val = response.data;
          var availability=null;
          this.price=null;
          for(var k in val) {
            if(val[k]['STR_KEY']===this.prodId){
              availability = val[k]['STR_VALUE'];
            }
            if(val[k]['STR_KEY']===(this.prodId+'_price')){
              this.price = val[k]['STR_VALUE'];
            }
          }
          console.log(availability);
          if(availability=="true"){
            this.availability = true;
            this.btnMsg='Rendre indisponible';
            this.msg='Ce produit est actuellement commandable depuis le site.';
            this.header='DISPONIBLE';
            this.header_i='mdi-tooltip-check';
            this.header_col='green';
          }else if(availability=="false"){
            this.availability = false;
            this.btnMsg='Rendre disponible';
            this.msg='Ce produit est actuellement incommandable depuis le site.';
            this.header='INDISPONIBLE';
            this.header_i='mdi-tooltip-remove';
            this.header_col='grey';
          }else{
            this.availability = null;
            this.btnMsg='Paramétrer';
            this.msg='Impossible de lire le statut actuel';
            this.header='ERREUR';
            this.header_i='mdi-tooltip-outline';
            this.header_col='grey';
          }
          this.loading = false;
        })
        .catch(()=> {
          this.availability = null;
          this.btnMsg='Paramétrer';
          this.msg='Impossible de lire le statut actuel';
          this.header='ERREUR';
        })
      },

      setAvailability: function() {
        var bodyFormData = new FormData();
        if(this.availability){
          bodyFormData.append(this.prodId, 'false');
        } else {
          bodyFormData.append(this.prodId, 'true');
        }
        const requestOptions = {
            headers: {
                       'Access-Control-Allow-Origin': '*',
                       'Authorization': 'Basic ' + localStorage.getItem('user'),
                       'Content-Type': 'application/json',
                     }
        };

        axios
        .post('https://api.champ-ramard.fr/v2/private/settings.php', bodyFormData, requestOptions)
        .then(() => (this.getAvailability()))
        .catch(() => (console.log("Error while changing availability")));
      },

      setPrice: function() {
        var bodyFormData = new FormData();
        bodyFormData.append((this.prodId+'_price'), this.price);
        const requestOptions = {
            headers: {
                       'Access-Control-Allow-Origin': '*',
                       'Authorization': 'Basic ' + localStorage.getItem('user'),
                       'Content-Type': 'application/json',
                     }
        };

        axios
        .post('https://api.champ-ramard.fr/v2/private/settings.php', bodyFormData, requestOptions)
        .then(() => (this.getAvailability()))
        .catch(() => (console.log("Error while changing price")));
      },

    },

    mounted () {
      this.getAvailability();
    },

  }
</script>
