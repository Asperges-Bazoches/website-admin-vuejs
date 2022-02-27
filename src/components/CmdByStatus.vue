<template>
  <div>
      <v-chip
          class="ma-2"
          color="green"
          text-color="white"
        >
          <v-avatar
            left
            class="green darken-4"
          >
            {{accepted}}
          </v-avatar>
          acceptées(s)
      </v-chip>
      <v-chip
        class="ma-2"
        color="red"
        text-color="white"
      >
        <v-avatar
          left
          class="red darken-4"
        >
          {{refused}}
        </v-avatar>
        refusée(s)
      </v-chip>
      <v-chip
        class="ma-2"
        color="grey"
        text-color="white"
      >
        <v-avatar
          left
          class="grey darken-1"
        >
          {{pending}}
        </v-avatar>
        à traiter
      </v-chip>
    </div>
</template>

<script>

  import axios from 'axios';
  import { isAccepted, isRefused } from '@/_services/parsers.js';

  export default {
    name: 'CmdByStatus',
    props: {
      short: Boolean,
    },
    data: () => ({
      loading:true,
      header: 'CHARGEMENT',
      header_i: '',
      header_col: 'grey',
      response: null,
      btnMsg: 'Paramétrer',
      accepted: 0,
      refused: 0,
      pending: 0,
      msg : 'Erreur : Impossible de lire l\'état actuel',
    }),
    methods: {
      getStat: function () {
        this.loading = true;
        const user = localStorage.getItem('user');
        axios
        .get('/v2/private/stats/futures.php',
          {headers: {
            'Access-Control-Allow-Origin': "*",
            'Authorization': 'Basic ' + user,
            'Content-Type': 'application/json',
           }})
        .then(response => {
          let status = response.data;
          for(var k in status) {
            if(k=='EN ATTENTE'){
              this.pending = status[k];
            } else if (isAccepted(k)){
              this.accepted = status[k];
            } else if (isRefused(k)){
              this.refused = status[k];
            }
          }
          this.loading = false;
        })
        .catch(()=> {
          this.msg='Impossible de lire le statut actuel';
          this.header='ERREUR';
        })
      },
    },

    mounted () {
      this.getStat();
    },

  }
</script>
