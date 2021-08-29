<template>
  <div class="about">
    <v-select
      v-model="template"
      :items="Object.keys(lsTemplate)"
      :rules="[v => !!v || 'Item is required']"
      label="Sélection des commandes"
      required
    ></v-select>
    <br/>
    <iframe
      class='iframe-resize' id="cmd_d1" title="Tomorrow's orders"  width= '100%'
      :src="'https://api.champ-ramard.fr/secure/build_table.php?template='+this.slug">
    </iframe>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'CommandesView',
  components: {
  },
  data: () => ({
    template : "Toutes les commandes",
    slug : null,
    lsTemplate : {
      "Toutes les commandes" : "all",
      "Toutes les commandes futures" : "default",
      "Commandes du jour" : "today",
      "Commandes de demain" : "tomorrow",
    },
  }),
  watch: {
    template: function (val) {
      this.slug = this.lsTemplate[val];
    },
  }
}

</script>
