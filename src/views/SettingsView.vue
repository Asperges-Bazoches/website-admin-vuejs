  <template>
    <div class="settings-panel">
      <STYLE>
      .v-text-field {
        ! padding-top: 0px;
        ! margin-top: 0px;
      }
      </STYLE>

      <h2>Changer la disponiblité et le prix des produits sur le site</h2>
      <p>
        C'est ici que vous pouvez activer la commande d'un produit ou au contraire la désactiver. C'est ici aussi
        que vous pouvez changer les prix des asperges ou des fraises.
      </p>
      <p>
        Par contre, je n'ai pas encore rendu configurable la taille de chaque portion. En 2022, vous m'aviez
        demandé de passer sur des barquettes de 500g de fraises. Pour cela, il faudra encore passer par moi,
        mais je peux vous changer cela rapidement donc ce n'est pas gênant :).
      </p>
      <br/>

      <v-row>
        <v-col cols=12 xs="12" sm="12" md="4">
          <ProductActivation
            prodId="aspb"
            name="Asperges blanches"
            img='img/logo.svg'
            />
        </v-col>
        <v-col cols=12 xs="12" sm="12" md="4">
          <ProductActivation
            prodId="aspv"
            name="Asperges vertes"
            img='img/logo.svg'
          />
        </v-col>
        <v-col cols=12 xs="12" sm="12" md="4">
          <ProductActivation
            prodId="fraise"
            name="Fraises"
            img='img/strawberry.svg'
          />
        </v-col>
      </v-row>

      <br/><br/><br/>

      <h2>Autre paramétrage du site internet</h2>
      <p>
        Cette partie du paramétrage permet de configurer ce que les clients visualiseront en accédant au site internet
        (exemple: certaines tournures de phrase, créneaux de commandes). Elle permet aussi de changer l'email vers laquelle
        les mails de notification sont envoyés à chaque commande
        (ça, cela m'est surtout utile à moi quand je développe sur le site et que je ne veux pas vous
        harceler de mails). N'hésitez pas si vous avez besoin de davantage d'options dans les créneaux de commande.
      </p>

      <v-text-field
        :loading="this.loading"
        v-model="websiteTitle"
        @change="removeAlert()"
        label="Titre du site"
      ></v-text-field>

      <v-text-field
        :loading="this.loading"
        v-model="websiteSubtitle"
        @change="removeAlert()"
        label="Sous-titre du site"
      ></v-text-field>

      <v-row>
        <v-col cols="12" xs="12" sm="12" md="4">
          <v-checkbox
            :loading="this.loading"
            v-model="allowEmail"
            @change="removeAlert()"
            label="Activer les mails de notification"
          ></v-checkbox>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="8">
          <v-text-field
            :loading="this.loading"
            v-model="emailTarget"
            @change="removeAlert()"
            label="Adresse e-mail pour la réception des mails automatiques"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-select
            v-model="selSlots"
            :items="slots"
            :menu-props="{ maxHeight: '400' }"
            label="Choix des créneaux de commandes possibles"
            multiple
            hint="Vous pouvez choisir autant de créneaux que vous voulez"
            persistent-hint
          ></v-select>
        </v-col>
      </v-row>

      <br/>

      <div style='margin-left:35%;margin-right:35%;'>
        <v-btn
          large
          block
          color='primary'
          @click="setSettings()">
          Mettre à jour
        </v-btn>
        <br/>
        <v-alert
          :type='this.alertStt'
          v-if='this.alertMsg'
          dense
          >{{this.alertMsg}}</v-alert>
      </div>
      <br/>

      <h2>Gestion des anciennes commandes</h2>
      <p>
        La loi oblige à ne garder les données personnelles qu'un temps limité (RGPD). Aussi pour éviter qu'un hacker ne vole les
        adresses mails et les numéros de téléphone, je vous mets à disposition deux boutons permettant d'anonymiser les
        commandes des années précédentes, ou de carrément supprimer les commandes enregistrées. Ce second bouton est désactivé
        pour le moment (par mesure de précaution).
      </p>
      <p>
        L'anonymisation est à faire une fois par an. Elle remplace le nom, le numéro de téléphone et le mail de toutes les anciennes
        commandes. La suppression n'est a priori jamais à faire car c'est utile de conserver des traces des commandes pour comparer
        d'une année sur l'autre (parole de statisticien !).
      </p>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="6">
          <v-btn
            large
            block
            color='error'
            @click="anonymizeDB()">
            Anonymiser les anciennes commandes
          </v-btn>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="6">
          <v-btn
            large
            block
            color='error'
            @click="resetDB()">
            Supprimer les anciennes commandes
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <div style='margin-left:10px;'>
          <v-alert
            :type='this.alertDBStt'
            v-if='this.alertDBMsg'
            dense
            >{{this.alertDBMsg}}</v-alert>
          </div>
      </v-row>
      <br/>

      <br/><br/><br/><br/>

    </div>
  </template>

  <script>
  import axios from 'axios';
  import ProductActivation from '@/components/ProductActivation.vue'

  export default {
    name: 'SettingsView',
    components: {
      ProductActivation
    },
    data:() =>({
      websiteTitle: '',
      websiteSubtitle: '',
      emailTarget: '',
      allowEmail: true,
      sateSettings: {},
      slots: ["8h30-11h", "10h-12h30", "14h-16h", "14h-17h30", "16h-18h"],
      selSlots: [],
      alertStt: 'info',
      alertMsg: '',
      alertDBStt: 'info',
      alertDBMsg: '',
      loading: false,
    }),

    methods: {
      getSettings: function () {
        this.loading = true;
        const user = localStorage.getItem('user');
        axios
        .get('/v2/public/settings.php',
          {headers: {
            'Access-Control-Allow-Origin': "*",
            'Authorization': 'Basic ' + user,
            'Content-Type': 'application/json',
           }})
        .then(response => {
          let val = response.data;
          for(var k in val) {
            this.sateSettings[val[k]['STR_KEY']] = val[k]['STR_VALUE'];
          }})
        .then(()=>{
          if('website_title' in this.sateSettings){
            this.websiteTitle = this.sateSettings['website_title'];
          }
          if('order_slots' in this.sateSettings){
            this.selSlots = this.sateSettings['order_slots'].split('//;//');
          }
          if('website_subtitle' in this.sateSettings){
            this.websiteSubtitle = this.sateSettings['website_subtitle'];
          }
          if('email_target' in this.sateSettings){
            this.emailTarget = this.sateSettings['email_target'];
          }
          if('allow_email' in this.sateSettings){
            this.allowEmail = this.sateSettings['allow_email'];
          }
        })
        .catch(()=> {
          this.alertStt='error'
          this.alertMsg='Impossible de lire le paramétrage actuel';
        })
        .then(()=>(this.loading=false));
      },

      setSettings: function() {
        var bodyFormData = new FormData();
        if(this.websiteTitle != ''){
          bodyFormData.append('website_title', this.websiteTitle);
        }
        if(this.websiteSubtitle != ''){
          bodyFormData.append('website_subtitle', this.websiteSubtitle);
        }
        if(this.emailTarget != ''){
          bodyFormData.append('email_target', this.emailTarget);
        }
        bodyFormData.append('allow_email', this.allowEmail);
        bodyFormData.append('order_slots', this.selSlots.join('//;//'));

        const requestOptions = {
            headers: {
                       'Access-Control-Allow-Origin': '*',
                       'Authorization': 'Basic ' + localStorage.getItem('user'),
                       'Content-Type': 'application/json',
                     }
        };

        axios
        .post('v2/private/settings.php', bodyFormData, requestOptions)
        .then(() => {
          this.alertStt='success';
          this.alertMsg='Paramétrages modifiés !';
          this.getSettings();
        })
        .catch(() => {
          this.alertStt='error'
          this.alertMsg='Impossible de changer les paramétrages du site';
          console.log("Error while changing availability");
        });
      },

      anonymizeDB: function() {
        const requestOptions = {
            headers: {
                       'Access-Control-Allow-Origin': '*',
                       'Authorization': 'Basic ' + localStorage.getItem('user'),
                       'Content-Type': 'application/json',
                     }
        };

        axios
        .get('v2/private/anonymize.php', requestOptions)
        .then(response => {
          let val = response.data;
          if(val.res=="ok"){
            this.alertDBStt='success';
            this.alertDBMsg='Anonymisation terminée !';
          } else {
            this.alertDBStt='error';
            this.alertDBMsg=val.msg;
          }
        })
        .catch(() => {
          this.alertDBStt='error'
          this.alertDBMsg="Impossible d'anonymiser les anciennes commandes !"
          console.log("Error while anonymizing !");
        });
      },

      resetDB: function() {
        const requestOptions = {
            headers: {
                       'Access-Control-Allow-Origin': '*',
                       'Authorization': 'Basic ' + localStorage.getItem('user'),
                       'Content-Type': 'application/json',
                     }
        };

        axios
        .get('v2/private/reset.php?table=orders', requestOptions)
        .then(response => {
          let val = response.data;
          if(val.res=="ok"){
            this.alertDBStt='success';
            this.alertDBMsg='Nettoyage terminé !';
          } else {
            this.alertDBStt='error';
            this.alertDBMsg=val.msg;
          }
        })
        .catch(() => {
          this.alertDBStt='error'
          this.alertDBMsg="Un problème a eu lieu durant le nettoyage des anciennes commandes !"
          console.log("Error while resetting DB !");
        });
      },

      removeAlert(){
        this.alertMsg='';
      },

    },

    mounted () {
      this.getSettings();
    },
  }
  </script>

<style>
  .settings-panel {
      margin-left: 5%;
      margin-right: 5%;
  }
</style>
