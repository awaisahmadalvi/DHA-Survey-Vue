<template >
  <v-row justify="end">
    <v-dialog v-model="show" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ addoredit }} Complaint Type</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-alert
              v-model="isAlert"
              :type="alertType"
              closable
              close-label="Close Alert"
              >Complaint Type {{ addoredit }}ed
              {{ alertType == "success" ? "Successfully" : "Failed" }}.</v-alert
            >
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    autofocus
                    v-model="complaintType.complaintTypeName"
                    :rules="complaintTypeNameRules"
                    :counter="50"
                    label="Complaint Type Title*"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-combobox
                    v-model="select"
                    :items="categoryList"
                    item-value="_id"
                    item-text="categoryName"
                    label="Category"
                    outlined
                    :rules="categoryNameRule"
                  ></v-combobox>
                </v-col>
              </v-row>
              <v-btn
                class="mr-4"
                @click="isEdit ? editComplaintType() : addComplaintType()"
                variant="outlined"
                color="primary"
              >
                {{ addoredit }} Complaint Type
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
    complaintTypeEdit: Object,
    isEdit: Boolean,
  },
  data: () => ({
    complaintTypeList: [],
    select: [],
    isAlert: false,
    alertType: "success",
    addoredit: "Add",
    categoryList: [],
    // category: {},
    valid: false,
    latestNumber: 0,
    complaintTypeNameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 50) || "Name must be less than 50",
    ],
    // categoryNmbrRules: [
    //   (v) => !!v || "Number is required",
    //   (v, ltstnmbr) =>
    //     (v && v > ltstnmbr) || "Number must be less than ${ltstnmbr}",
    // ],
    complaintTypeNmbrRules: (limit) => [
      (val) => val >= limit || `Please use greater or equal to ${limit}`,
    ],

    // complaintTypeNmbrRules: {
    //   max(maxNum) {
    //     return (v) =>
    //       (v || "").length > maxNum || "Number Must be greater than " + maxNum;
    //   },
    // },
    complaintTypeDescRules: [
      (v) => !!v || "Description is required",
      (v) => (v && v.length <= 200) || "Description must be less than 200",
    ],
    categoryNameRule: [(v) => !!v || "Category is required"],
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
    addComplaintType() {
      if (this.isEdit == false) {
        this.validate();
        if (this.valid) {
          let token = localStorage.getItem("token");
          let data = {
            headers: {
              "X-Access-Token": JSON.parse(token),
            },
          };

          this.complaintType.is_active = true;
          this.complaintType.categoryID = this.select._id;
          let uri =
            "http://" + window.location.hostname + ":4000/complaintTypes";
          axios
            .post(uri, this.complaintType, data)
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
    editComplaintType() {
      if (this.isEdit == true) {
        this.validate();
        if (this.valid) {
          let token = localStorage.getItem("token");
          let data = {
            headers: {
              "X-Access-Token": JSON.parse(token),
            },
          };

          this.complaintType.categoryID = this.select._id;
          console.log("EDIT complaintType: ", this.complaintType);
          let uri =
            `http://` +
            window.location.hostname +
            `:4000/complaintTypes/${this.complaintType._id}`;
          axios
            .patch(uri, this.complaintType, data)
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

    getCategoryList() {
      let token = localStorage.getItem("token");
      let data = {
        headers: {
          "X-Access-Token": JSON.parse(token),
        },
      };
      let uri = "http://" + window.location.hostname + ":4000/category";
      axios.get(uri, data).then((response) => {
        this.categoryList = response.data[0].docs;
        console.log("this.category:", this.categoryList);
      });
    },

    setComplaintTypeCategory(complaintTypeEdt) {
      if (complaintTypeEdt == null) {
        this.select = null;
        return;
      }
      // this.select = complaintTypeEdt.complaintType;
      this.select = complaintTypeEdt.category[0].categoryName;
      // this.select._id = categoryEdt.category;
    },
  },
  created() {
    this.getCategoryList();
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
    complaintType: {
      get() {
        this.setComplaintTypeCategory(this.complaintTypeEdit);
        return this.complaintTypeEdit == null ? {} : this.complaintTypeEdit;
      },
      set(complaintTypeEdit) {
        this.$emit("input", complaintTypeEdit);
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