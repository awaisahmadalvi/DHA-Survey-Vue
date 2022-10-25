<template >
  <v-row justify="end">
    <v-dialog v-model="show" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ addoredit }} Sector</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="sectorForm" lazy-validation v-model="valid">
            <v-alert
              v-model="isAlert"
              :type="alertType"
              closable
              close-label="Close Alert"
              >Sector {{ addoredit }}ed
              {{ alertType == "success" ? "Successfully" : "Failed" }}.</v-alert
            >
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    autofocus
                    v-model="sector.sectorName"
                    :rules="sectorNameRules"
                    :counter="50"
                    label="Sector Name*"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-combobox
                    v-model="select"
                    :items="phaseList"
                    item-value="_id"
                    item-text="phaseName"
                    label="Phase"
                    outlined
                    :rules="phaseRule"
                  ></v-combobox>
                </v-col>
              </v-row>
              <v-btn
                class="mr-4"
                @click="isEdit ? editSector() : addSector()"
                variant="outlined"
                color="primary"
              >
                {{ addoredit }} Sector
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
    sectorEdit: Object,
    isEdit: Boolean,
  },
  data: () => ({
    phaseList: [],
    select: [],
    isAlert: false,
    alertType: "success",
    addoredit: "Add",
    // sector: {},
    valid: false,
    latestNumber: 0,
    sectorNameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 50) || "Name must be less than 50",
    ],
    phaseRule: [(v) => !!v || "Phase is required"],
  }),
  methods: {
    validate() {
      this.$refs.sectorForm.validate();
    },
    reset() {
      this.$refs.sectorForm.reset();
    },
    resetValidation() {
      this.$refs.sectorForm.resetValidation();
    },
    addSector() {
      if (this.isEdit == false) {
        this.validate();
        if (this.valid) {
          let token = localStorage.getItem("token");
          let data = {
            headers: {
              "X-Access-Token": JSON.parse(token),
            },
          };
          this.sector.phaseID = this.select._id;

          let uri = "http://" + window.location.hostname + ":4000/sector";
          axios
            .post(uri, this.sector, data)
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
    editSector() {
      if (this.isEdit == true) {
        this.validate();
        if (this.valid) {
          let token = localStorage.getItem("token");
          let data = {
            headers: {
              "X-Access-Token": JSON.parse(token),
            },
          };
          this.sector.phaseID = this.select._id;
          console.log("SECTOR: ", this.sector);
          let uri =
            `http://` +
            window.location.hostname +
            `:4000/sector/${this.sector._id}`;
          axios
            .patch(uri, this.sector, data)
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
          console.log("PHASE: ", response.data);
          this.phaseList = response.data[0].docs;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    setSectorPhase(sectorEdt) {
      if (sectorEdt == null) {
        this.select = null;
        return;
      }
      this.select = sectorEdt.phase[0].phaseName;
    },
  },
  created() {
    this.getPhaseList();
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
    sector: {
      get() {
        this.setSectorPhase(this.sectorEdit);
        return this.sectorEdit == null ? {} : this.sectorEdit;
      },
      set(sectorEdit) {
        this.$emit("input", sectorEdit);
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