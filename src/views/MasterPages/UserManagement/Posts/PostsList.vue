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
    >
      List of Posts
    </v-card-title>
    <PostsEditDialog
      :postEdit="editPost"
      :isEdit="isEdit"
      v-model="showEditForm"
    />
    <v-data-table
      :headers="headers"
      :items="postsList"
      @click:row="editPostFunc"
      :search="search"
      class="elevation-12 mx-6 my-8"
      disable-pagination
      :hide-default-footer="true"
      ><template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Posts</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            autofocus
            v-show="showSearchField"
            v-model="search"
            label="Search"
            single-line
            hide-details
            class="shrink"
            clearable
            clear-icon="mdi-close-circle"
            @keydown.enter.prevent="
              page = 1;
              refreshList();
            "
          ></v-text-field>
          <v-icon @click="showSearchField = !showSearchField"
            >mdi-magnify</v-icon
          >
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-btn
            class="mx-1"
            @click.stop="addPostFunc"
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
                >Are you sure you want to delete this Post with associated
                data?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >No</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >Yes</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
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
              :to="`/officers/${item._id}`"
            >
              <v-icon>mdi-badge-account-horizontal </v-icon>
            </v-btn>
          </template>
          <span>View Officer</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="ma-1"
              @click.stop="editPostFunc(item)"
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
          <span>Edit Post</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="ma -1"
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
          <span>Delete Post</span>
        </v-tooltip>

        <!-- <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon> -->
      </template>

      <template v-slot:footer>
        <v-col cols="12" sm="12">
          <v-row>
            <v-col class="px-6" cols="4" sm="2">
              <v-select
                outlined
                v-model="pageSize"
                :items="pageSizes"
                label="Items per Page"
                @change="handlePageSizeChange"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="10">
              <v-pagination
                color="grey"
                v-model="page"
                :length="totalPages"
                total-visible="7"
                next-icon="mdi-menu-right"
                prev-icon="mdi-menu-left"
                @input="handlePageChange"
              ></v-pagination>
            </v-col>
          </v-row>
        </v-col>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import axios from "axios";
import PostsEditDialog from "./PostsEditDialog.vue";

export default {
  name: "PostsList",
  components: { PostsEditDialog },
  data: () => ({
    search: "",
    showSearchField: false,
    showDelDialog: false,
    deleteid: -1,
    selectedGenre: [],
    postsList: [],
    genreList: [],
    editDialog: false,
    showEditForm: false,
    showImagesForm: false,
    editPost: null,
    imagePostId: null,
    isEdit: false,

    // Filter Values
    isGetActive: false,
    filterGenre: "",

    page: 1,
    totalPages: 0,
    pageSize: 5,
    pageSizes: [5, 10, 20],

    headers: [
      {
        text: "Post",
        align: "start",
        // sortable: true,
        value: "postName",
      },
      {
        text: "Supervisor",
        // sortable: true,
        value: "supervisor[0].postName",
      },
      {
        text: "Category",
        // sortable: true,
        value: "category[0].categoryName",
      },
      {
        text: "Permission",
        // sortable: true,
        value: "permissionLevel",
      },
      {
        text: "Created at",
        // sortable: true,
        value: "createdAt",
      },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),

  methods: {
    getRequestParams(page, pageSize, isGetActive, search) {
      let params = {};

      if (pageSize) {
        params["size"] = pageSize;
      }

      if (isGetActive) {
        params["is_active"] = isGetActive;
      }

      if (search) {
        params["name"] = search;
      }

      if (!isNaN(search)) {
        params["number"] = search;
      }

      if (page) {
        params["page"] = page - 1;
      }

      // console.log(params);

      return params;
    },

    retrievePosts() {
      const params = this.getRequestParams(
        this.page,
        this.pageSize,
        this.search
        // this.isGetActive,
        // this.filterGenre
      );
      let token = localStorage.getItem("token");

      let data = {
        params,
        headers: {
          "X-Access-Token": JSON.parse(token),
        },
      };

      let uri = `http://` + window.location.hostname + `:4000/post`;
      axios
        .get(uri, data)
        .then((response) => {
          // console.log("POST:", response.data);

          const { docs, metadata } = response.data[0];

          this.postsList = docs;
          this.totalPages = Math.ceil(metadata[0].total / this.pageSize);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    handlePageChange(value) {
      this.page = value;
      this.retrievePosts();
    },

    handlePageSizeChange(size) {
      this.pageSize = size;
      this.page = 1;
      this.retrievePosts();
    },

    refreshList() {
      this.retrievePosts();
    },

    deletePosts(id) {
      let token = localStorage.getItem("token");

      let data = {
        headers: {
          "X-Access-Token": JSON.parse(token),
        },
      };

      let uri = `http://` + window.location.hostname + `:4000/post/${id}`;
      axios
        .delete(uri, data, this.postsList)
        .then(() => {
          this.refreshList();
        })
        .catch((error) => {
          console.error("ERROR deletePosts: ", error);
        });
    },

    editPostFunc(postTemp) {
      this.isEdit = true;
      this.editPost = postTemp;
      this.showEditForm = true;
    },

    addPostFunc() {
      this.isEdit = false;
      this.editPost = null;
      this.showEditForm = true;
    },

    deleteItem(id) {
      this.deleteid = id;
      this.showDelDialog = true;
    },

    deleteItemConfirm() {
      this.deletePosts(this.deleteid);
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
  created() {
    this.refreshList();
  },
  watch: {
    showDelDialog(val) {
      val || this.closeDelete();
    },
    showEditForm(val) {
      val ? val : this.refreshList();
    },
  },
};
</script>