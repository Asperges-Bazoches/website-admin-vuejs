<template>
  <v-card
    class="mx-auto"
    max-width="344"
    outlined
    :loading="this.loading"
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">{{this.header}}</div>
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
      loading:true,
      header: 'CHARGEMENT',
      response: null,
      btnMsg: 'Paramétrer',
      msg : 'Erreur : Impossible de lire l\'état actuel',
    }),

    mounted () {
      this.getAvailibility();
    },

    watch: {
      response: function(val){
        var availability=null;
        for(var k in val) {
          if(val[k]['STR_KEY']===this.prodId){
            availability = val[k]['STR_VALUE'];
          }
        }
        if(availability=="true"){
          this.availability = true;
          this.btnMsg='Rendre indisponible';
          this.msg='Ce produit est actuellement commandable depuis le site.';
          this.header='PRODUIT DISPONIBLE';
        }else if(availability=="false"){
          this.availability = false;
          this.btnMsg='Rendre disponible';
          this.msg='Ce produit est actuellement incommandable depuis le site.';
          this.header='PRODUIT INDISPONIBLE';
        }else{
          this.availability = null;
          this.btnMsg='Paramétrer';
          this.msg='Impossible de lire le statut actuel';
          this.header='ERREUR';
        }
        this.loading = false;
      }
    },

    methods: {
      getAvailability(){
        const user = localStorage.getItem('user');
        axios
        .get('/v2/public/settings.php',
          {headers: {
            'Access-Control-Allow-Origin': "*",
            'Authorization': 'Basic ' + user,
            'Content-Type': 'application/json',
           }})
        .then(response => {
          this.response=response.data;
          this.getAvailibility();
        })
        .catch(()=>(this.response=null))
      },
      setAvailability() {
        var bodyFormData = new FormData();
        if(this.availability){
          bodyFormData.append('this.prodId', 'false');
        } else {
          bodyFormData.append('this.prodId', 'true');
        }
        const requestOptions = {
            data: bodyFormData,
            headers: { 'Content-Type': 'application/json',
                       "Access-Control-Allow-Origin": "*",
                       'Authorization': 'Basic ' + localStorage.getItem('user'),
                     }
        };

        axios
        .post('v2/private/settings.php', requestOptions)
        .then((response) => {
          console.log(response.data.res);
        })
        .catch(() => {
          console.log("Error while changing availability");
        })
      }
    },
  }
</script>
