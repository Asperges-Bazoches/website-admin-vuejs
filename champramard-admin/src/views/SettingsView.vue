  <template>
    <div class="settings-panel">
      <v-row>
        <v-col cols=4>
          <ProductActivation
            prodId="aspb"
            name="Asperges blanches"
            img='img/logo.svg'
            />
        </v-col>
        <v-col cols=4>
          <ProductActivation
            prodId="aspv"
            name="Asperges vertes"
            img='img/logo.svg'
          />
        </v-col>
        <v-col cols=4>
          <ProductActivation
            prodId="fraise"
            name="Fraises"
            img='img/strawberry.svg'
          />
        </v-col>
      </v-row>

      <br/><br/><br/>

      <h2>Plus de paramétrages</h2>

      <v-text-field
        v-model="websiteTitle"
        label="Titre du site"
      ></v-text-field>

      <v-text-field
        v-model="websiteSubtitle"
        label="Sous-titre du site"
      ></v-text-field>

      <v-row>
        <v-col cols="4">
          <v-checkbox
            v-model="allowEmail"
            label="Activer les mails de notification"
          ></v-checkbox>
        </v-col>
        <v-col cols="8">
          <v-text-field
          v-model="emailTarget"
          label="Adresse e-mail pour la réception des mails automatiques"
          ></v-text-field>
        </v-col>
      </v-row>

      <br/>

      <v-btn
        large
        block
        color='primary'
        @click="setSettings()">
        Mettre à jour
      </v-btn>

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
      errMsg: '',
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
          this.errMsg='Impossible de lire le paramétrage actuel';
        })
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

        const requestOptions = {
            headers: {
                       'Access-Control-Allow-Origin': '*',
                       'Authorization': 'Basic ' + localStorage.getItem('user'),
                       'Content-Type': 'application/json',
                     }
        };

        axios
        .post('v2/private/settings.php', bodyFormData, requestOptions)
        .then(() => (this.getAvailability()))
        .catch(() => (console.log("Error while changing availability")));
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
