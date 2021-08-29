  <template>
    <div class="home">
      <v-row>
        <v-col cols=4>
          <ProductActivation
            name="Asperges blanches"
            img='img/logo.svg'
            activate=false
            />
        </v-col>
        <v-col cols=4>
          <ProductActivation
            name="Asperges vertes"
            img='img/logo.svg'
            activate=true
            />
          </v-col>
          <v-col cols=4>
            <ProductActivation
            name="Fraises"
            img='img/strawberry.svg'
            activate=true
            />
          </v-col>
        </v-row>
        <br /><br />
        <iframe
          class='iframe-resize' id="cmd_d1" title="Orders" width='100%' height='300px'
          src="https://api.champ-ramard.fr/secure/set_settings.php"></iframe>
    </div>
  </template>

  <script>
  // @ is an alias to /src
  import ProductActivation from '@/components/ProductActivation.vue'

  export default {
    name: 'SettingsView',
    components: {
      ProductActivation
    }
  }
  </script>

<style>
  .iframe-resize { border:none }
</style>
