<template>
  <v-app>

    <v-app-bar
    app
    color="#2fb485"
    dark
    >

    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

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
      :expand-on-hover="$vuetify.breakpoint.mdAndUp"
    >

        <v-list dense >
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
          <v-list-item
            key="logout"
            v-if="logged"
            @click="handleLogout()"
          >
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Se déconnecter</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>
        <br />

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

          <!--<v-list-item
            key="go_to_timetable"
            href="https://champ-ramard.fr/timetable.html"
            target="_blank"
            link
          >
            <v-list-item-icon>
              <v-icon>mdi-calendar</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Vers le planning</v-list-item-title>
            </v-list-item-content>
          </v-list-item>-->

          <v-list-item
            key="go_to_website"
            href="https://champ-ramard.fr"
            target="_blank"
            link
          >
            <v-list-item-icon>
              <v-img
              alt="CR Logo"
              contain
              src="/img/logo.svg"
              transition="scale-transition"
              width="15"
              />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Vers le site</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

      </v-navigation-drawer>

    <v-main>
      <v-container v-if="logged" fluid>
        <br />
        <router-view></router-view>
      </v-container>
      <v-dialog
        persistent
        no-click-animation
        v-model="dialog"
        width="500"
      >
        <v-card
          :loading="loading"
        >
          <v-card-title class="text-h5 grey lighten-2">
          Connexion
          </v-card-title>

          <v-card-text>
            <br />
            <v-text-field
              v-model="username"
              :disabled="loading"
              label="Nom d'utilisateur"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              :disabled="loading"
              label="Mot de passe"
             type="password"
             required
            ></v-text-field>
            <br/>
            <v-alert v-if="error" type="error">
              {{ error }}
            </v-alert>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn
              color="primary"
              :disabled="loading"
              text
              @click="handleLogin()"
            >
              Se connecter
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import { userService } from './_services/user.service.ts';


export default {
  name: 'App',

  components: {
  },

  data: () => ({
    username: '',
    password: '',
    submitted: false,
    loading: false,
    error: '',
    dialog: false,
    logged: false,
    drawer: false,
    group: null,
    items: [
      { title: 'Accueil', icon: 'mdi-view-dashboard', href: '/' },
      { title: "Carnet d'adresses", icon: 'mdi-card-account-details', href: '/contacts' },
      { title: 'Voir les commandes', icon: 'mdi-cart', href: '/orders' },
      { title: 'Paramétrer le site', icon: 'mdi-cogs', href: '/settings' },
    ],
    right: null,
  }),
  created(){
    this.logged = !(localStorage.getItem('user')==null);
    if(this.logged){
      console.log('Credentials found in local storage !')
    }
  },
  mounted(){
    this.dialog = !this.logged;
  },
  watch: {
    group () {
      this.drawer = false
    },
  },
  methods: {
      handleLogin () {

          this.submitted = true;
          this.loading = true;
          const { username, password } = this;

          // stop here if form is invalid
          if (!(username && password)) {
              this.submitted = false;
              this.loading = false;
              return;
          }

          // check if credential are ok

          userService.login(username, password)
          .then((res) => {
            console.log(res);
            this.username = '';
            this.password = '';
            this.loading = false;
            this.dialog = !res;
            this.error = res ? '' : "L'authentification a échoué !";
            this.logged = res;
          });
      },

      handleLogout() {
        userService.logout()
        this.error = '';
        this.dialog = true;
        this.logged = false;
        this.drawer = false;
      }
  }
};
</script>
