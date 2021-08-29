  <template>
    <div class="home">
      <iframe
        class='iframe-resize' id="cmd_d1" title="Orders" width='100%' height='300px'
        src="https://api.champ-ramard.fr/secure/set_settings.php"></iframe>
    </div>
  </template>

  <script>
  // @ is an alias to /src

  export default {
    name: 'SettingsView',
    components: {
    }
  }
  </script>

<style>
  .iframe-resize { border:none }
</style>
