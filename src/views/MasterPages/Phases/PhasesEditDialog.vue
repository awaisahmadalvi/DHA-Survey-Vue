<template >
  <v-row justify="end">
    <v-dialog v-model="show" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ addoredit }} Phase</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="phaseForm" lazy-validation v-model="valid">
            <v-alert
              v-model="isAlert"
              :type="alertType"
              closable
              close-label="Close Alert"
              >Phase {{ addoredit }}ed
              {{ alertType == "success" ? "Successfully" : "Failed" }}.</v-alert
            >
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    autofocus
                    v-model="phase.phaseName"
                    label="Phase #*"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-btn
                class="mr-4"
                @click="isEdit ? editPhase() : addPhase()"
                variant="outlined"
                color="primary"
              >
                {{ addoredit }} Phase
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
    phaseEdit: Object,
    isEdit: Boolean,
  },
  data: () => ({
    select: [],
    isAlert: false,
    alertType: "success",
    addoredit: "Add",
    valid: false,
    latestNumber: 0,
  }),
  methods: {
    validate() {
      this.$refs.phaseForm.validate();
    },
    reset() {
      this.$refs.phaseForm.reset();
    },
    resetValidation() {
      this.$refs.phaseForm.resetValidation();
    },
    addPhase() {
      if (this.isEdit == false) {
        this.validate();
        if (this.valid) {
          let token = localStorage.getItem("token");
          let data = {
            headers: {
              "X-Access-Token": JSON.parse(token),
            },
          };
          let uri = "http://" + window.location.hostname + ":4000/phase";
          axios
            .post(uri, this.phase, data)
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
    editPhase() {
      if (this.isEdit == true) {
        this.validate();
        if (this.valid) {
          let token = localStorage.getItem("token");
          let data = {
            headers: {
              "X-Access-Token": JSON.parse(token),
            },
          };
          console.log(this.phase);
          let uri =
            `http://` +
            window.location.hostname +
            `:4000/phase/${this.phase._id}`;
          axios
            .patch(uri, this.phase, data)
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
  },
  created() {},
  watch: {
    isEdit(newValue) {
      // console.log("oldValue: ", oldValue);
      // console.log("newValue: ", newValue);
      if (newValue == false) {
        this.addoredit = "Add";
        this.$refs.form.reset();
        this.getLatestPhaseNumber();
      } else {
        this.addoredit = "Edit";
      }
    },
  },
  computed: {
    phase: {
      get() {
        return this.phaseEdit == null ? {} : this.phaseEdit;
      },
      set(phaseEdit) {
        this.$emit("input", phaseEdit);
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