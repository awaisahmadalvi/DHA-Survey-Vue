<template >
  <v-row justify="end">
    <v-dialog v-model="show" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ addoredit }} Complaint</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="complaintForm" lazy-validation v-model="valid">
            <v-alert
              v-model="isAlert"
              :type="alertType"
              closable
              close-label="Close Alert"
              >Complaint {{ addoredit }}ed
              {{ alertType == "success" ? "Successfully" : "Failed" }}.</v-alert
            >
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    autofocus
                    v-model="complaint.complaintNumber"
                    :rules="complaintNameRules"
                    :counter="5"
                    label="Complaint#*"
                    type="number"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-combobox
                    v-model="selectPhase"
                    :items="phaseList"
                    item-value="_id"
                    item-text="phaseName"
                    label="Phase"
                    outlined
                    :rules="phaseRule"
                  ></v-combobox>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-combobox
                    v-model="selectSector"
                    :items="sectorList"
                    item-value="_id"
                    item-text="sectorName"
                    label="Sector"
                    outlined
                    :rules="sectorRule"
                  ></v-combobox>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-combobox
                    v-model="selectCategory"
                    :items="categoryList"
                    item-value="_id"
                    item-text="categoryName"
                    label="Category"
                    outlined
                    :rules="categoryRule"
                  ></v-combobox>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-combobox
                    v-model="selectComplaintType"
                    :items="complaintTypeList"
                    item-value="_id"
                    item-text="complaintTypeName"
                    label="Complaint Type"
                    outlined
                    :rules="complaintTypeRule"
                  ></v-combobox>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-combobox
                    v-model="complaint.status"
                    :items="statusList"
                    label="Status"
                    outlined
                    :rules="statusRule"
                  ></v-combobox>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    autofocus
                    v-model="complaintStartTime"
                    :rules="complaintNameRules"
                    label="Start Time*"
                    type="datetime-local"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="12">
                  <v-file-input
                    ref="addimage"
                    append-icon="mdi-camera-plus"
                    prepend-icon=""
                    small-chips
                    label="Start Snaps*"
                    accept="image/png, image/jpeg, image/bmp"
                    multiple
                    show-size
                    clearable
                    @change="onStartSnapFileChange"
                  ></v-file-input>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    autofocus
                    v-model="complaint.resolvedTime"
                    :rules="complaintNameRules"
                    label="Resolved Time*"
                    type="datetime-local"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-file-input
                    ref="addResolvedimage"
                    append-icon="mdi-camera-plus"
                    prepend-icon=""
                    small-chips
                    label="Resolved Snaps*"
                    accept="image/png, image/jpeg, image/bmp"
                    multiple
                    show-size
                    clearable
                    @change="onResolvedSnapFileChange"
                  ></v-file-input>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    autofocus
                    v-model="complaint.lat"
                    :rules="complaintNameRules"
                    :counter="5"
                    label="Latitude*"
                    type="number"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    autofocus
                    v-model="complaint.long"
                    :rules="complaintNameRules"
                    :counter="5"
                    label="Longitude*"
                    type="number"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    autofocus
                    v-model="complaint.description"
                    :rules="complaintNameRules"
                    :counter="100"
                    label="Description*"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-btn
                class="mr-4"
                @click="isEdit ? editComplaint() : addComplaint()"
                variant="outlined"
                color="primary"
              >
                {{ addoredit }} Complaint
              </v-btn>
            </v-container>
          </v-form>
          <small>*indicates required field</small>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";

export default {
  props: {
    value: Boolean,
    complaintEdit: Object,
    isEdit: Boolean,
  },
  data: () => ({
    phaseList: [],
    selectPhase: [],
    sectorList: [],
    selectSector: [],
    categoryList: [],
    selectCategory: [],
    complaintTypeList: [],
    selectComplaintType: [],
    selectStatus: [],
    statusList: ["In-progress", "Resolved", "Re-opened"],
    complaintStartTime: "",
    startSnapList: [],
    complaintResolvedTime: "",
    resolvedSnapList: [],
    isAlert: false,
    alertType: "success",
    addoredit: "Add",
    // complaint: {},
    valid: false,
    latestNumber: 0,
    complaintNameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 50) || "Name must be less than 50",
    ],
    phaseRule: [(v) => !!v || "Phase is required"],
    sectorRule: [(v) => !!v || "Sector is required"],
    complaintTypeRule: [(v) => !!v || "Complaint Type is required"],
    categoryRule: [(v) => !!v || "Category is required"],
    statusRule: [(v) => !!v || "Status is required"],
  }),
  methods: {
    validate() {
      this.$refs.complaintForm.validate();
    },
    reset() {
      this.$refs.complaintForm.reset();
    },
    resetValidation() {
      this.$refs.complaintForm.resetValidation();
    },
    addComplaint() {
      if (this.isEdit == false) {
        this.validate();
        if (this.valid) {
          let token = localStorage.getItem("token");
          let data = {
            headers: {
              "X-Access-Token": JSON.parse(token),
            },
          };
          // this.complaint.phaseID = this.select._id;
          this.complaint.phaseID = this.selectPhase._id;
          this.complaint.sectorID = this.selectSector._id;
          this.complaint.categoryID = this.selectCategory._id;
          this.complaint.complaintTypeID = this.selectComplaintType._id;
          // this.complaint.phaseID = this.select._id;

          let uri = "http://" + window.location.hostname + ":4000/complaints";
          axios
            .post(uri, this.complaint, data)
            .then(() => {
              this.alertType = "success";
              this.isAlert = true;
              new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
                this.show = false;
                this.isAlert = false;
                this.reset();
              });
            })
            .catch((error) => {
              console.error(error);
              this.alertType = "error";
              this.isAlert = true;
            });
        }
      }
    },
    editComplaint() {
      if (this.isEdit == true) {
        this.validate();
        if (this.valid) {
          let token = localStorage.getItem("token");
          let data = {
            headers: {
              "X-Access-Token": JSON.parse(token),
            },
          };
          this.complaint.phaseID = this.select._id;
          console.log("SECTOR: ", this.complaint);
          let uri =
            `http://` +
            window.location.hostname +
            `:4000/complaints/${this.complaint._id}`;
          axios
            .patch(uri, this.complaint, data)
            .then(() => {
              this.alertType = "success";
              this.isAlert = true;
              new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
                this.show = false;
                this.isAlert = false;
                this.reset();
              });
            })
            .catch((error) => {
              console.error(error);
              this.alertType = "error";
              this.isAlert = true;
            });
        }
      }
    },

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
          console.log("GET Phase: ", response.data);
          this.phaseList = response.data[0].docs;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getSectorList() {
      let token = localStorage.getItem("token");

      let data = {
        headers: {
          "X-Access-Token": JSON.parse(token),
        },
      };

      let uri = `http://` + window.location.hostname + `:4000/sector`;
      axios
        .get(uri, data)
        .then((response) => {
          console.log("GET Sector: ", response.data);
          this.sectorList = response.data[0].docs;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getCategoryList() {
      let token = localStorage.getItem("token");

      let data = {
        headers: {
          "X-Access-Token": JSON.parse(token),
        },
      };

      let uri = `http://` + window.location.hostname + `:4000/category`;
      axios
        .get(uri, data)
        .then((response) => {
          console.log("GET Category: ", response.data);
          this.categoryList = response.data[0].docs;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getComplaintTypeList() {
      let token = localStorage.getItem("token");

      let data = {
        headers: {
          "X-Access-Token": JSON.parse(token),
        },
      };

      let uri = `http://` + window.location.hostname + `:4000/complaintTypes`;
      axios
        .get(uri, data)
        .then((response) => {
          console.log("GET Complaint Type: ", response.data);
          this.complaintTypeList = response.data[0].docs;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    onStartSnapFileChange(files) {
      this.complaint.startSnaps = [];
      // const files = e.target.files;
      // console.log("selected files: " + selectedFiles.length);
      files.forEach((fileObj) => {
        if (fileObj !== undefined) {
          const fr = new FileReader();
          fr.readAsDataURL(fileObj);
          fr.addEventListener(
            "load",
            function () {
              this.complaint.startSnaps.push(fr.result);
              console.log("fr.result:", fr.result);
              console.log(
                "this.complaint.startSnaps:",
                this.complaint.startSnaps.length
              );
            }.bind(this),
            false
          );
        }
      });
    },

    onResolvedSnapFileChange(files) {
      this.complaint.resolvedSnaps = [];
      // const files = e.target.files;
      // console.log("selected files: " + selectedFiles.length);
      files.forEach((fileObj) => {
        if (fileObj !== undefined) {
          const fr = new FileReader();
          fr.readAsDataURL(fileObj);
          fr.addEventListener(
            "load",
            function () {
              this.complaint.resolvedSnaps.push(fr.result);
              console.log("fr.result:", fr.result);
              console.log(
                "this.complaint.resolvedSnaps:",
                this.complaint.resolvedSnaps.length
              );
            }.bind(this),
            false
          );
        }
      });
    },

    setComplaintLinks(complaintEdt) {
      if (complaintEdt == null) {
        this.select = null;
        return;
      }
      this.selectPhase = complaintEdt.phase[0].phaseName;
      this.selectSector = complaintEdt.sector[0].sectorName;
      this.selectCategory = complaintEdt.category[0].categoryName;
      this.selectComplaintType =
        complaintEdt.complaintType[0].complaintTypeName;
      this.selectCategory = complaintEdt.category[0].categoryName;
      this.complaintStartTime = new Date(complaintEdt.startTime).toISOString();
      console.log("edt time: ", complaintEdt.startTime);
      console.log("date time: ", this.complaintStartTime);
    },
  },
  created() {
    this.getPhaseList();
    this.getSectorList();
    this.getCategoryList();
    this.getComplaintTypeList();
    // this.getPhaseList();
  },
  watch: {
    isEdit(newValue) {
      // console.log("oldValue: ", oldValue);
      // console.log("newValue: ", newValue);
      if (newValue == false) {
        this.addoredit = "Add";
        this.$refs.form.reset();
      } else {
        this.addoredit = "Edit";
      }
    },
  },
  computed: {
    complaint: {
      get() {
        this.setComplaintLinks(this.complaintEdit);
        return this.complaintEdit == null ? {} : this.complaintEdit;
      },
      set(complaintEdit) {
        this.$emit("input", complaintEdit);
      },
    },
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
        if (value == false) {
          this.reset();
          this.resetValidation();
        }
      },
    },
  },
};
</script>