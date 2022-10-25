<template>
  <v-card class="ma-6 pb-1">
    <v-card-title
      class="
        text-h4
        font-weight-bold
        title
        py-2
        text-center
        justify-center
        white--text
      "
      >List of {{ officer.name }} Users
    </v-card-title>
    <UsersEditDialog
      :userEdit="editUser"
      :isEdit="isEdit"
      :officerId="officerId"
      v-model="showEditForm"
    />
    <v-data-table
      :headers="headers"
      :items="usersList"
      sort-by="name"
      @click:row="editUserFunc"
      class="elevation-12 mx-6 my-8"
      :search="search"
      ><template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Users</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-show="showSearchField"
            v-model="search"
            label="Search"
            single-line
            hide-details
            class="shrink"
          ></v-text-field>
          <v-icon @click.stop="showSearchField = !showSearchField"
            >mdi-magnify</v-icon
          >
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-btn
            class="mx-1"
            @click.stop="addUserFunc"
            x-small
            color="primary"
            fab
            dark
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-dialog v-model="showDelDialog" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this User with associated
                data?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="closeDelete">No</v-btn>
                <v-btn color="error" text @click="deleteItemConfirm">Yes</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.is_active`]="{ item }">
        <td v-if="item.is_active">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mx-1"
                fab
                dark
                x-small
                @click.stop="setUserActive(item, false)"
                color="success"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-check</v-icon>
              </v-btn>
            </template>
            <span>Deactivate</span>
          </v-tooltip>
        </td>
        <td v-else>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mx-1"
                fab
                dark
                x-small
                @click.stop="setUserActive(item, true)"
                color="error"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <span>Activate</span>
          </v-tooltip>
        </td>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-1"
              @click.stop="editUserFunc(item)"
              x-small
              color="neutral"
              fab
              dark
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>Edit User</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-1"
              @click.stop="deleteItem(item._id)"
              x-small
              color="danger"
              fab
              dark
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>Delete User</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-card>
</template>

lock officer in add new or edit

<script>
import axios from "axios";
import UsersEditDialog from "./UserEditDialog.vue";

export default {
  name: "UsersList",

  components: { UsersEditDialog },
  data: () => ({
    search: "",
    showSearchField: false,
    showDelDialog: false,
    officerId: null,
    officer: [],
    deleteid: -1,
    selectedGenre: [],
    usersList: [],
    genreList: [],
    editDialog: false,
    showEditForm: false,
    showImagesForm: false,
    editUser: null,
    imageUserId: null,
    isEdit: false,

    headers: [
      {
        text: "User Name",
        align: "start",
        sortable: false,
        value: "username",
      },

      { text: "Officer", value: "officer[0].officerName" },
      { text: "Post", value: "post[0].postName" },
      { text: "Created By", value: "createdByOfficer[0].officerName" },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),

  methods: {
    getRequestParams(page, pageSize, search, officerID) {
      let params = {};

      if (pageSize) {
        params["size"] = pageSize;
      }

      // if (isGetActive) {
      //   params["is_active"] = isGetActive;
      // }

      if (search) {
        params["name"] = search;
      }
      if (officerID) {
        params["officerID"] = officerID;
      }

      if (!isNaN(search)) {
        params["number"] = search;
      }

      if (page) {
        params["page"] = page - 1;
      }

      console.log(params);

      return params;
    },
    getUsersList() {
      let token = localStorage.getItem("token");
      const params = this.getRequestParams(
        this.page,
        this.pageSize,
        this.search,
        this.officerId
        // this.isGetActive,
        // this.filterGenre
      );
      let data = {
        params,
        headers: {
          "X-Access-Token": JSON.parse(token),
        },
      };

      let uri = `http://` + window.location.hostname + `:4000/user`;
      axios
        .get(uri, data)
        .then((response) => {
          this.usersList = response.data[0].docs;
          console.log("usersList:", this.usersList);
        })
        .catch((error) => {
          console.error("ERROR getUsersList: ", error);
        });
    },
    deleteUsers(id) {
      let token = localStorage.getItem("token");
      let data = {
        headers: {
          "X-Access-Token": JSON.parse(token),
        },
      };
      let uri = `http://` + window.location.hostname + `:4000/user/${id}`;
      axios
        .delete(uri, data, this.usersList)
        .then(() => {
          this.getUsersList();
        })
        .catch((error) => {
          console.error("ERROR deleteUsers: ", error);
        });
    },
    setUserActive(userTemp, is_active) {
      userTemp.is_active = is_active;
      let uri =
        `http://` + window.location.hostname + `:4000/user/${userTemp._id}`;
      axios
        .patch(uri, userTemp, this.usersList)
        .then(() => {
          this.getUsersList();
        })
        .catch((error) => {
          console.error("ERROR setUserActive: ", error);
        });
    },

    editUserFunc(userTemp) {
      this.isEdit = true;
      this.editUser = userTemp;
      this.showEditForm = true;
    },

    addUserFunc() {
      this.isEdit = false;
      this.editUser = null;
      this.showEditForm = true;
    },

    deleteItem(id) {
      this.deleteid = id;
      this.showDelDialog = true;
    },

    deleteItemConfirm() {
      this.deleteUsers(this.deleteid);
      this.closeDelete();
    },

    closeDelete() {
      this.showDelDialog = false;
      this.$nextTick(() => {
        this.deleteid = -1;
        this.editedIndex = -1;
      });
    },
  },

  computed: {},
  mounted() {
    this.officerId = this.$route.params.id;
    // console.log("MOUNTED DISHID", this.officerId);
  },
  created() {
    this.officerId = this.$route.params.id;
    this.getUsersList();
    // this.getOfficer();
  },
  watch: {
    showDelDialog(val) {
      val || this.closeDelete();
    },
    showEditForm(val) {
      val ? val : this.getUsersList();
    },
  },
};
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>