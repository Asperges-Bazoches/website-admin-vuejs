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
      <br/>

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

    </div>
  </template>

  <script>
  // @ is an alias to /src
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
    })
  }
  </script>

<style>
  .settings-panel {
      margin-left: 5%;
      margin-right: 5%;
  }
</style>
