<template >
  <v-row justify="end">
    <v-dialog v-model="show" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ addoredit }} Category</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-alert
              v-model="isAlert"
              :type="alertType"
              closable
              close-label="Close Alert"
              >Category {{ addoredit }}ed
              {{ alertType == "success" ? "Successfully" : "Failed" }}.</v-alert
            >
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    autofocus
                    v-model="category.categoryName"
                    :rules="categoryNameRules"
                    :counter="50"
                    label="Category Title*"
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
                    multiple
                    :rules="phaseRule"
                  ></v-combobox>
                </v-col>
              </v-row>
              <v-btn
                class="mr-4"
                @click="isEdit ? editCategory() : addCategory()"
                variant="outlined"
                color="primary"
              >
                {{ addoredit }} Category
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
    categoryEdit: Object,
    isEdit: Boolean,
  },
  data: () => ({
    phaseList: [],
    select: [],
    isAlert: false,
    alertType: "success",
    addoredit: "Add",
    // category: {},
    valid: false,
    latestNumber: 0,
    categoryNameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 50) || "Name must be less than 50",
    ],
    // categoryNmbrRules: [
    //   (v) => !!v || "Number is required",
    //   (v, ltstnmbr) =>
    //     (v && v > ltstnmbr) || "Number must be less than ${ltstnmbr}",
    // ],
    categoryNmbrRules: (limit) => [
      (val) => val >= limit || `Please use greater or equal to ${limit}`,
    ],

    // categoryNmbrRules: {
    //   max(maxNum) {
    //     return (v) =>
    //       (v || "").length > maxNum || "Number Must be greater than " + maxNum;
    //   },
    // },
    categoryDescRules: [
      (v) => !!v || "Description is required",
      (v) => (v && v.length <= 200) || "Description must be less than 200",
    ],
    phaseRule: [(v) => !!v || "Phase is required"],
  }),
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    addCategory() {
      if (this.isEdit == false) {
        this.validate();
        if (this.valid) {
          let token = localStorage.getItem("token");
          let data = {
            headers: {
              "X-Access-Token": JSON.parse(token),
            },
          };
          this.officer.postID = this.select._id;
          // this.officer.picture = this.image.data;

          this.category.is_active = true;
          this.category.phase_id = this.select._id;
          let uri = "http://" + window.location.hostname + ":4000/category";
          axios
            .post(uri, this.category, data)
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
    editCategory() {
      if (this.isEdit == true) {
        this.validate();
        if (this.valid) {
          let token = localStorage.getItem("token");
          let data = {
            headers: {
              "X-Access-Token": JSON.parse(token),
            },
          };
          this.officer.postID = this.select._id;
          console.log("Officer:", this.officer);

          this.category.phase_id = this.select._id;
          console.log(this.category);
          let uri =
            `http://` +
            window.location.hostname +
            `:4000/category/${this.category._id}`;
          axios
            .patch(uri, this.category, data)
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
      let uri = "http://" + window.location.hostname + ":4000/phase";
      axios.get(uri, data).then((response) => {
        this.phaseList = response.data[0].docs;
        console.log("this.phaseList:", this.phaseList);
      });
    },
    setCategoryPhase(categoryEdt) {
      if (categoryEdt == null) {
        this.select = null;
        return;
      }
      // this.select = categoryEdt.phase;
      this.select = categoryEdt.phase;
      // this.select._id = categoryEdt.phase;
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
        this.getLatestCategoryNumber();
      } else {
        this.addoredit = "Edit";
      }
    },
  },
  computed: {
    category: {
      get() {
        this.setCategoryPhase(this.categoryEdit);
        return this.categoryEdit == null ? {} : this.categoryEdit;
      },
      set(categoryEdit) {
        this.$emit("input", categoryEdit);
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