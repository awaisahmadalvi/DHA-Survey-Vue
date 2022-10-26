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
      List of Complaint Types
    </v-card-title>
    <ComplaintTypesEditDialog
      :complaintTypeEdit="editComplaintType"
      :isEdit="isEdit"
      v-model="showEditForm"
    />

    <v-data-table
      :headers="headers"
      :items="complaintTypesList"
      @click:row="editComplaintTypeFunc"
      :search="search"
      class="elevation-12 mx-6 my-8"
      disable-pagination
      :hide-default-footer="true"
      ><template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Complaint Types</v-toolbar-title>
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
            @click.stop="addComplaintTypeFunc"
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
                >Are you sure you want to delete this Complaint Type with
                associated data?</v-card-title
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
      <template v-slot:[`item.phasesArray`]="{ item }">
        <li v-for="phase in item.phase" :key="phase.phaseName">
          {{ phase.phaseName }}
        </li>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="ma-1"
              @click.stop="editComplaintTypeFunc(item)"
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
          <span>Edit ComplaintType</span>
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
          <span>Delete ComplaintType</span>
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
import ComplaintTypesEditDialog from "./ComplaintTypesEditDialog.vue";

export default {
  name: "ComplaintTypesList",
  components: { ComplaintTypesEditDialog },
  data: () => ({
    search: "",
    showSearchField: false,
    showDelDialog: false,
    deleteid: -1,
    selectedGenre: [],
    complaintTypesList: [],
    categoryList: [],
    editDialog: false,
    showEditForm: false,
    showImagesForm: false,
    editComplaintType: null,
    imageComplaintTypeId: null,
    isEdit: false,

    // Filter Values
    isGetActive: false,
    filterGenre: "",

    page: 1,
    totalPages: 0,
    pageSize: 10,
    pageSizes: [10, 20, 50],

    headers: [
      {
        text: "Complaint Type",
        align: "start",
        // sortable: true,
        value: "complaintTypeName",
      },
      {
        text: "Category",
        // align: "start",
        sortable: false,
        value: "category[0].categoryName",
      },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),

  methods: {
    getRequestParams(page, pageSize, isGetActive, search, filterGenre) {
      let params = {};

      if (pageSize) {
        params["size"] = pageSize;
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

      if (filterGenre) {
        params["category"] =
          // console.log(
          filterGenre.map((category) => {
            return category._id;
          });
        // );
      }

      // console.log(params);

      return params;
    },

    retrieveComplaintTypes() {
      let token = localStorage.getItem("token");
      const params = this.getRequestParams(
        this.page,
        this.pageSize,
        this.search,
        this.postId
      );
      let data = {
        params,
        headers: {
          "X-Access-Token": JSON.parse(token),
        },
      };
      let uri = `http://` + window.location.hostname + `:4000/complaintTypes`;
      axios
        .get(uri, data)
        .then((response) => {
          console.log("GET complaintTypes: ", response.data);

          const { docs, metadata } = response.data[0];

          this.complaintTypesList = docs;
          this.totalPages = Math.ceil(metadata[0].total / this.pageSize);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    handlePageChange(value) {
      this.page = value;
      this.retrieveComplaintTypes();
    },

    handlePageSizeChange(size) {
      this.pageSize = size;
      this.page = 1;
      this.retrieveComplaintTypes();
    },

    refreshList() {
      this.retrieveComplaintTypes();
    },

    deleteComplaintTypes(id) {
      let token = localStorage.getItem("token");

      let data = {
        headers: {
          "X-Access-Token": JSON.parse(token),
        },
      };

      let uri =
        `http://` + window.location.hostname + `:4000/complaintType/${id}`;
      axios
        .delete(uri, data, this.complaintTypesList)
        .then(() => {
          this.refreshList();
        })
        .catch((error) => {
          console.error("ERROR deleteComplaintTypes: ", error);
        });
    },

    editComplaintTypeFunc(complaintTypeTemp) {
      this.isEdit = true;
      this.editComplaintType = complaintTypeTemp;
      this.showEditForm = true;
    },

    addComplaintTypeFunc() {
      this.isEdit = false;
      this.editComplaintType = null;
      this.showEditForm = true;
    },

    deleteItem(id) {
      this.deleteid = id;
      this.showDelDialog = true;
    },

    deleteItemConfirm() {
      this.deleteComplaintTypes(this.deleteid);
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