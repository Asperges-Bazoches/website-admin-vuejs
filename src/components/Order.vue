<template>
  <v-card
    class="mx-auto"
    max-width="600"
    outlined
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">
          {{status}}
        </div>
        <v-list-item-title class="headline mb-1">{{name}}</v-list-item-title>
        <v-list-item-subtitle>{{phone}} - {{email}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-timeline
      align-top
      dense
    >
      <v-timeline-item
        color="white"
        small
      >
        <div>
          <div class="font-weight-normal">
            <strong>Asperges blanches</strong> - {{ aspb }} botte(s)
          </div>
        </div>
      </v-timeline-item>
      <v-timeline-item
        color="green"
        small
      >
        <div>
          <div class="font-weight-normal">
            <strong>Asperges vertes</strong> - {{ aspv }} botte(s)
          </div>
        </div>
      </v-timeline-item>
      <v-timeline-item
        color="red"
        small
      >
        <div>
          <div class="font-weight-normal">
            <strong>Fraises</strong> - {{ fraise }} barquette(s)
          </div>
        </div>
      </v-timeline-item>
    </v-timeline>
    <br/>

    <v-card-text>
      <v-chip class="mr-2">
        <v-icon left>
          mdi-calendar-clock
        </v-icon>
        {{day}}
      </v-chip>
      <v-chip class="mr-2">
        <v-icon left>
          mdi-clock
        </v-icon>
        {{hour}}
      </v-chip>
      <v-chip class="mr-2">
        <v-icon left>
          mdi-map-marker
        </v-icon>
        {{place}}
      </v-chip>
    </v-card-text>

    <v-card-actions>
        <v-btn
          color="green"
          v-if='status=="EN ATTENTE"'
          v-on:click="accept"
          outlined>
          Accepter
        </v-btn>
        <v-btn
          color="red"
          v-if='status=="EN ATTENTE"'
          v-on:click="refuse"
          outlined>
          Refuser
        </v-btn>
        <v-btn
          :href="'mailto:'+email"
          outlined>
          Envoyer un mail
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="comments && comments.length>0"
          @click="show = !show"
        >
          Commentaire
          <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-card-actions>
      <v-expand-transition>
      <div v-show="show"
        v-if="comments && comments.length>0"
        >
        <v-divider></v-divider>
        <v-card-text>{{comments}}</v-card-text>
      </div>
    </v-expand-transition>
    <v-dialog
      persistent
      v-model="dialog"
      width="700"
    >

    <v-card
      :loading='dialog_loading'
    >
      <v-card-title class="text-h5 grey lighten-2">
        Êtes-vous sûr de vouloir {{action}} la commande ?
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text v-if='response.length == 0'>
        <br/>
        Cette action entraînera l'envoi d'un mail pour avertir le client ou la cliente et modifiera le statut de la commande.
      </v-card-text>

      <v-card-text v-if='response.length > 0'>
        <br/>
        {{response}}
      </v-card-text>

      <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              v-if="response.length == 0"
              @click="confirm()"
              >
              Oui
            </v-btn>
            <v-btn
              color="primary"
              text
              v-if="response.length == 0"
              @click="dialog = false"
              >
            Annuler
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="closeDialog()"
            v-if="response.length > 0"
            >
          Fermer
        </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>

</template>

<script>
  import axios from 'axios';

  export default {
    name: 'Order',
    props: {
      id: String,
      name: String,
      phone: String,
      email: String,
      aspb: Number,
      aspv: Number,
      fraise: Number,
      day: String,
      hour: String,
      place: String,
      status: String,
      comments: String,
      secret: String,
    },
    data: () => ({
      show: true,
      response: '',
      action: '',
      dialog: false,
      dialog_loading: false,
      doUpdate: false,
    }),
    methods: {

      closeDialog: function(){
        this.dialog = false;
        if(this.doUpdate){
          this.$parent.updateTable();
        }
      },

      accept: function(){
        if(!this.dialog){
          this.response = '';
          this.action = "accepter";
          this.dialog = true;
        }
      },

      refuse: function(){
        if(!this.dialog){
          this.response = '';
          this.action = "refuser";
          this.dialog = true;
        }
      },

      confirm: function(){
        this.dialog_loading = true;
        var bodyFormData = new FormData();
        if(this.action=="accepter"){
          bodyFormData.append("action", "accept");
        } else {
          bodyFormData.append("action", "reject");
        }
        bodyFormData.append('id-cmd', this.id);
        bodyFormData.append('secret', this.secret);

        const requestOptions = {
            headers: {
                       'Access-Control-Allow-Origin': '*',
                       'Authorization': 'Basic ' + localStorage.getItem('user'),
                       'Content-Type': 'application/json',
                     }
        };

        axios
        .post('v2/private/action.php', bodyFormData, requestOptions)
        .then((response) => {
          if (response.data['res'] == "ok"){
            this.response = "C'est noté ! Statut changé, mail envoyé au client.";
            this.dialog_loading = false;
            this.doUpdate = true;
          } else if (response.data['msg']){
            this.response = response.data['msg'];
            this.dialog_loading = false;
          } else {
            this.response = 'Un problème imprévu a eu lieu';
            this.dialog_loading = false;
            this.doUpdate = true;
          }
        })
        .catch(() => {
          this.response = 'Un problème a eu lieu durant la requête.';
          this.dialog_loading = false;
          this.dialog = false;
        });

      },




    },

    mounted () {},

  }
</script>
