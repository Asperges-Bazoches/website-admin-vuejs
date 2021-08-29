<template>
  <v-app>

    <v-app-bar
    app
    color="#2fb485"
    dark
    >

    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <h3>Menu</h3>

    <v-spacer></v-spacer>

    <div class="d-flex align-center">
      <v-img
      alt="Vuetify Logo"
      class="shrink mr-2"
      contain
      src="/img/logo.svg"
      transition="scale-transition"
      width="40"
      />
      <h2>Champ-Ramard.fr</h2>
    </div>
   </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      bottom
      temporary
    >

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
            Champ-Ramard.fr
            </v-list-item-title>
            <v-list-item-subtitle>
            Page d'administration
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list
          dense
          nav
        >
          <v-list-item
            v-for="item in items"
            :key="item.title"
            :to="item.href"
            link
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>


          <v-list-item
            key="go_to_website"
            href="https://champ-ramard.fr"
            target="_blank"
            link
          >
            <v-list-item-icon>
              <v-img
              alt="CR Logo"
              class="shrink mr-2"
              contain
              src="/img/logo.svg"
              transition="scale-transition"
              width="20"
              />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Vers le site</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>


    <v-main>
      <v-container fluid>
        <br />
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  components: {
    //
  },

  data: () => ({
    drawer: false,
    group: null,
    items: [
      { title: 'Accueil', icon: 'mdi-view-dashboard', href: '/' },
      { title: 'Voir les commandes', icon: 'mdi-cart', href: '/orders' },
      { title: 'Réglages', icon: 'mdi-cogs', href: '/settings' },
      { title: 'Planning', icon: 'mdi-calendar', href: '/delivry' },
    ],
    right: null,
  }),
  watch: {
    group () {
      this.drawer = false
    },
  },
};
</script>
