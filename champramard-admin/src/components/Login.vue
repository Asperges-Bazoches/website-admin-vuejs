<template>
  <v-dialog
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
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn
          color="primary"
          :disabled="loading"
          text
          @click="handleSubmit()"
        >
          Se connecter
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { userService } from '../_services/user.service.ts';

  export default {
    name: 'Login',
    props: {
      logged: Boolean,
    },
    data: () => ({
      username: '',
      password: '',
      submitted: false,
      loading: false,
      returnUrl: '',
      error: '',
      dialog: false,
    }),
    mounted(){
      this.dialog = !this.logged;

      if(this.dialog){
        userService.logout();
      }
    },
    methods: {
        handleSubmit () {

            this.submitted = true;
            this.loading = true;
            const { username, password } = this;

            // stop here if form is invalid
            if (!(username && password)) {
                this.submitted = false;
                this.loading = false;
                return;
            }

            let res = userService.login(username, password);
            this.loading = !res;
            this.dialog = !res;
        }
    }
}
</script>
