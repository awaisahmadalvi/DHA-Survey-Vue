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
      >List of {{ post.name }} Officers
    </v-card-title>
    <OfficersEditDialog
      :officerEdit="editOfficer"
      :isEdit="isEdit"
      :postId="postId"
      v-model="showEditForm"
    />
    <v-data-table
      :headers="headers"
      :items="officersList"
      sort-by="name"
      @click:row="editOfficerFunc"
      class="elevation-12 mx-6 my-8"
      :search="search"
      ><template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Officers</v-toolbar-title>
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
            @click.stop="addOfficerFunc"
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
                >Are you sure you want to delete this Officer with associated
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
                @click.stop="setOfficerActive(item, false)"
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
                @click.stop="setOfficerActive(item, true)"
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
              class="ma-1"
              x-small
              color="cyan"
              fab
              dark
              v-bind="attrs"
              v-on="on"
              :to="`/users/${item._id}`"
            >
              <v-icon>mdi-lock </v-icon>
            </v-btn>
          </template>
          <span>View users</span> </v-tooltip
        ><v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-1"
              @click.stop="editOfficerFunc(item)"
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
          <span>Edit Officer</span>
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
          <span>Delete Officer</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-card>
</template>

lock post in add new or edit

<script>
import axios from "axios";
import OfficersEditDialog from "./OfficerEditDialog.vue";

export default {
  name: "OfficersList",

  components: { OfficersEditDialog },
  data: () => ({
    search: "",
    showSearchField: false,
    showDelDialog: false,
    postId: null,
    post: [],
    deleteid: -1,
    selectedGenre: [],
    officersList: [],
    genreList: [],
    editDialog: false,
    showEditForm: false,
    showImagesForm: false,
    editOfficer: null,
    imageOfficerId: null,
    isEdit: false,

    headers: [
      {
        text: "Officer Name",
        align: "start",
        sortable: false,
        value: "officerName",
      },

      { text: "CNIC", value: "cnic" },
      { text: "DHA #", value: "dhaNumber" },
      { text: "Post", value: "post[0].postName" },
      // { text: "Category", value: "category[0].categoryName" },
      // { text: "Phase", value: "is_active" },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),

  methods: {
    getRequestParams(page, pageSize, search, postID) {
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
      if (postID) {
        params["postID"] = postID;
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
    getOfficersList() {
      let token = localStorage.getItem("token");
      const params = this.getRequestParams(
        this.page,
        this.pageSize,
        this.search,
        this.postId
        // this.isGetActive,
        // this.filterGenre
      );
      let data = {
        params,
        headers: {
          "X-Access-Token": JSON.parse(token),
        },
      };

      let uri = `http://` + window.location.hostname + `:4000/officer`;
      axios
        .get(uri, data)
        .then((response) => {
          this.officersList = response.data[0].docs;
          console.log("officersList:", this.officersList);
        })
        .catch((error) => {
          console.error("ERROR getOfficersList: ", error);
        });
    },
    deleteOfficers(id) {
      let token = localStorage.getItem("token");

      let data = {
        headers: {
          "X-Access-Token": JSON.parse(token),
        },
      };

      let uri =
        `http://` + window.location.hostname + `:4000/officerlist/${id}`;
      axios
        .delete(uri, data, this.officersList)
        .then(() => {
          this.getOfficersList();
        })
        .catch((error) => {
          console.error("ERROR deleteOfficers: ", error);
        });
    },
    setOfficerActive(officerTemp, is_active) {
      officerTemp.is_active = is_active;
      let uri =
        `http://` +
        window.location.hostname +
        `:4000/officerlist/${officerTemp._id}`;
      axios
        .patch(uri, officerTemp, this.officersList)
        .then(() => {
          this.getOfficersList();
        })
        .catch((error) => {
          console.error("ERROR setOfficerActive: ", error);
        });
    },
    // getPost() {
    //   let uri =
    //     `http://` + window.location.hostname + `:4000/post/${this.postId}`;
    //   axios
    //     .get(uri, this.post)
    //     .then((response) => {
    //       this.post = response.data;
    //     })
    //     .catch((error) => {
    //       console.error("ERROR getPost: ", error);
    //     });
    // },

    editOfficerFunc(officerTemp) {
      this.isEdit = true;
      this.editOfficer = officerTemp;
      this.showEditForm = true;
    },

    addOfficerFunc() {
      this.isEdit = false;
      this.editOfficer = null;
      this.showEditForm = true;
    },

    deleteItem(id) {
      this.deleteid = id;
      this.showDelDialog = true;
    },

    deleteItemConfirm() {
      this.deleteOfficers(this.deleteid);
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
    this.postId = this.$route.params.id;
    // console.log("MOUNTED DISHID", this.postId);
  },
  created() {
    this.postId = this.$route.params.id;
    this.getOfficersList();
    // this.getPost();
  },
  watch: {
    showDelDialog(val) {
      val || this.closeDelete();
    },
    showEditForm(val) {
      val ? val : this.getOfficersList();
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