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
      List of Sectors
    </v-card-title>
    <SectorsEditDialog
      :sectorEdit="editSector"
      :isEdit="isEdit"
      v-model="showEditForm"
    />
    <v-data-table
      :headers="headers"
      :items="sectorsList"
      @click:row="editSectorFunc"
      :search="search"
      class="elevation-12 mx-6 my-8"
      disable-pagination
      :hide-default-footer="true"
      ><template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Sectors</v-toolbar-title>
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
            @click.stop="addSectorFunc"
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
                >Are you sure you want to delete this Sector with associated
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
              @click.stop="editSectorFunc(item)"
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
          <span>Edit Sector</span>
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
          <span>Delete Sector</span>
        </v-tooltip>
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
import SectorsEditDialog from "./SectorsEditDialog.vue";

export default {
  name: "SectorsList",
  components: { SectorsEditDialog },
  data: () => ({
    search: "",
    showSearchField: false,
    showDelDialog: false,
    deleteid: -1,
    selectedPhase: [],
    sectorsList: [],
    phaseList: [],
    editDialog: false,
    showEditForm: false,
    showImagesForm: false,
    editSector: null,
    imageSectorId: null,
    isEdit: false,

    // Filter Values
    filterPhase: "",

    page: 1,
    totalPages: 0,
    pageSize: 10,
    pageSizes: [10, 20, 50],

    headers: [
      {
        text: "Sector",
        align: "start",
        // sortable: true,
        value: "sectorName",
      },
      { text: "Phase", value: "phase[0].phaseName", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),

  methods: {
    getPhaseList() {
      let token = localStorage.getItem("token");

      let data = {
        headers: {
          "X-Access-Token": JSON.parse(token),
        },
      };

      let uri = `http://` + window.location.hostname + `:4000/phase`;
      axios
        .get(uri, data)
        .then((response) => {
          this.phaseList = response.data;
        })
        .catch((error) => {
          console.error("ERROR getPhaseList: ", error);
        });
    },

    getRequestParams(page, pageSize, search, filterPhase) {
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

      if (filterPhase) {
        params["phase"] = filterPhase.map((phase) => {
          return phase._id;
        });
      }

      console.log(params);

      return params;
    },

    retrieveSectors() {
      const params = this.getRequestParams(
        this.page,
        this.pageSize,
        this.search,
        this.filterPhase
      );
      let token = localStorage.getItem("token");

      let data = {
        params,
        headers: {
          "X-Access-Token": JSON.parse(token),
        },
      };
      let uri = `http://` + window.location.hostname + `:4000/sector`;
      axios
        .get(uri, data)
        .then((response) => {
          // console.log("RETRIEVESECTORS: ", response.data);

          const { docs, metadata } = response.data[0];

          this.sectorsList = docs;
          this.totalPages = Math.ceil(metadata[0].total / this.pageSize);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    handlePageChange(value) {
      this.page = value;
      this.retrieveSectors();
    },

    handlePageSizeChange(size) {
      this.pageSize = size;
      this.page = 1;
      this.retrieveSectors();
    },

    refreshList() {
      this.retrieveSectors();
    },

    deleteSectors(id) {
      let token = localStorage.getItem("token");

      let data = {
        headers: {
          "X-Access-Token": JSON.parse(token),
        },
      };

      let uri = `http://` + window.location.hostname + `:4000/sector/${id}`;
      axios
        .delete(uri, data, this.sectorsList)
        .then(() => {
          this.refreshList();
        })
        .catch((error) => {
          console.error("ERROR deleteSectors: ", error);
        });
    },
    editSectorFunc(sectorTemp) {
      this.isEdit = true;
      this.editSector = sectorTemp;
      this.showEditForm = true;
    },

    addSectorFunc() {
      this.isEdit = false;
      this.editSector = null;
      this.showEditForm = true;
    },

    deleteItem(id) {
      this.deleteid = id;
      this.showDelDialog = true;
    },

    deleteItemConfirm() {
      this.deleteSectors(this.deleteid);
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
    this.getPhaseList();
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