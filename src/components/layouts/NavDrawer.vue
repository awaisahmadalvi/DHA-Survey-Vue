<template>
  <v-sheet>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item class="justify-center">
          <v-list-item-avatar class="elevation-6" size="120">
            <v-img
              :src="user.officer[0].picture"
              :lazy-src="require('../../assets/logo.png')"
              contain
              class="pa-5"
            ></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item class="text-center">
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{ user.officer[0].officerName }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ user.post[0].postName }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              DHA#: {{ user.officer[0].dhaNumber }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-item-group active-class="primary--text" v-model="selectedItem">
          <v-list-item
            v-for="(item, i) in mainItems"
            :key="i"
            router
            :to="item.route"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <v-divider></v-divider>

      <v-list-item dense class="text-center mr-16">
        <v-list-item-content>
          <v-list-item-title class="text-subtitle-2">
            Settings
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list nav dense>
        <v-list-item-group active-class="primary--text" v-model="selectedItem">
          <v-list-item
            v-for="(item, i) in settingsItems"
            :key="i"
            router
            :to="item.route"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <!-- <v-treeview activatable open-on-click :mainItems="mainItems" item-key="route">
        <template v-slot:prepend="{ item }">
          <v-icon>
            {{ item.icon }}
          </v-icon>
        </template>

        <template v-slot:label="{ item }">
          <router-link  :to="item.route">
            <v-list-item-content>
              <v-list-item-title v-text="item.text"> </v-list-item-title>
            </v-list-item-content>
          </router-link>
        </template>
      </v-treeview> -->

      <!-- <v-treeview
        v-model="tree"
        :mainItems="mainItems"
        activable
        item-key="route"
        :open="open"
        open-on-click
      >
        <template slot="label" slot-scope="{ item }">
          <v-list-item :mainItems="item" :key="i" router :to="item.route">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-treeview> -->
    </v-navigation-drawer>

    <v-app-bar app dense elevate-on-scroll>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>DHA Survey</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon class="d-print-none" @click="toggle_dark_mode">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
    </v-app-bar>
  </v-sheet>
</template>



<script>
import axios from "axios";
export default {
  //   name: "App",
  data: () => ({
    user: {
      officer: [
        { officerName: null, dhaNumber: null, picture: "../assets/logo" },
      ],
      post: [{ postName: null }],
    },
    alert: false,
    drawer: false,
    selectedItem: 0,
    snackbar: false,

    mainItems: [
      { icon: "mdi-chart-bar", text: "Dashboard", route: "/" },
      { icon: "mdi-clipboard-list", text: "Complaints", route: "/complaints" },
      // {
      //   icon: "mdi-cog",
      //   text: "Settings",
      //   route: "",
      //   children: [],
      // },

      { icon: "mdi-logout", text: "Logout", route: "/logout" },
    ],
    settingsItems: [
      { icon: "mdi-sign-real-estate", text: "Phases", route: "/phases" },
      { icon: "mdi-file-tree", text: "Sectors", route: "/sectors" },
      { icon: "mdi-shape", text: "Categories", route: "/categories" },
      {
        icon: "mdi-shape",
        text: "Complaint Types",
        route: "/complainttypes",
      },
      { icon: "mdi-family-tree", text: "User Management", route: "/posts" },
    ],
  }),
  methods: {
    toggle_dark_mode: function () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("dark_theme", this.$vuetify.theme.dark.toString());
    },
    getUserInfo() {
      let token = localStorage.getItem("token");
      let data = {
        headers: {
          "X-Access-Token": JSON.parse(token),
        },
      };
      let uri =
        `http://` + window.location.hostname + `:4000/user/loginUserData`;
      axios
        .post(uri, {}, data)
        .then((response) => {
          // console.log("response: ", response);
          this.user = response.data[0];
          console.log("this.user: ", this.user);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.getUserInfo();
    const theme = localStorage.getItem("dark_theme");
    if (theme) {
      if (theme === "true") {
        this.$vuetify.theme.dark = true;
      } else {
        this.$vuetify.theme.dark = false;
      }
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      this.$vuetify.theme.dark = true;
      localStorage.setItem("dark_theme", this.$vuetify.theme.dark.toString());
    }
  },
};
</script>


<style>
</style>