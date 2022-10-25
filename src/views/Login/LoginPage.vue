<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs7 sm5 md3>
            <v-card class="elevation-12">
              <v-toolbar dark :color="alertType">
                <v-toolbar-title
                  >Login
                  {{
                    alertType == "success"
                      ? "Successful"
                      : alertType == "error"
                      ? "Failed"
                      : ""
                  }}</v-toolbar-title
                >
              </v-toolbar>

              <v-form
                ref="loginForm"
                @submit.prevent="checkLogin"
                lazy-validation
                v-model="valid"
              >
                <v-container>
                  <v-row>
                    <v-col class="pr-7 pl-4" cols="12" md="12">
                      <v-text-field
                        autofocus
                        v-model="loginData.username"
                        prepend-icon="mdi-account"
                        label="Username*"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="pr-7 pl-4" cols="12" md="12">
                      <v-text-field
                        v-model="loginData.password"
                        prepend-icon="mdi-lock"
                        label="Password*"
                        type="password"
                        required
                        @keydown.enter.native.stop.prevent="checkLogin"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="mr-4 mb-2" color="primary" @click="checkLogin"
                  >Login</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginPage",
  data: () => ({
    loginData: {
      username: "",
      password: "",
      isMobile: 0,
    },
    isAlert: false,
    alertType: "primary",
    valid: false,
  }),
  methods: {
    validate() {
      this.$refs.loginForm.validate();
    },
    reset() {
      this.$refs.loginForm.reset();
    },
    resetValidation() {
      this.$refs.loginForm.resetValidation();
    },
    checkLogin() {
      this.validate();
      if (this.valid) {
        let uri = "http://" + window.location.hostname + ":4000/user/login";
        axios
          .post(uri, this.loginData)
          .then((response) => {
            this.alertType = "success";
            this.isAlert = true;
            new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
              console.log(response.data.token);
              localStorage.setItem(
                "token",
                JSON.stringify(response.data.token)
              );
              this.show = false;
              this.isAlert = false;
              this.reset();
              this.$router.push({ name: "Home" });
            });
          })
          .catch((error) => {
            console.error(error);
            this.alertType = "error";
            this.isAlert = true;
          });
      }
    },
  },
  created() {},
  watch: {},
  computed: {},
};
</script>