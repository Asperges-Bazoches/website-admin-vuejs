<template>
  <v-card
    class="mx-auto"
    max-width="344"
    outlined
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4" v-if="this.active">PRODUIT DISPONIBLE</div>
        <div class="overline mb-4" v-if="!this.active">PRODUIT INDISPONIBLE</div>
        <v-list-item-title class="headline mb-1">{{this.name}}</v-list-item-title>
        <v-list-item-subtitle v-if="!this.active">Impossible de commander actuellement ce produit sur le site.</v-list-item-subtitle>
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
      <v-btn text v-if="!this.active">Rendre disponible</v-btn>
      <v-btn text v-if="this.active">Rendre indisponible</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: 'ProductActivation',
    props: {
      name: String,
      img: String,
      active: Boolean,
    },
    data: () => ({
    }),
  }
</script>
