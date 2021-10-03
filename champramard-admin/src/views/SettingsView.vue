  <template>
    <div class="settings-panel">

      <h2>Changer la disponiblité des produits sur le site</h2>
      <br/>

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
        <v-col cols="4">
          <v-checkbox
            :loading="this.loading"
            v-model="allowEmail"
            @change="removeAlert()"
            label="Activer les mails de notification"
          ></v-checkbox>
        </v-col>
        <v-col cols="8">
          <v-text-field
            :loading="this.loading"
            v-model="emailTarget"
            @change="removeAlert()"
            label="Adresse e-mail pour la réception des mails automatiques"
          ></v-text-field>
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
      alertStt: 'info',
      alertMsg: '',
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
