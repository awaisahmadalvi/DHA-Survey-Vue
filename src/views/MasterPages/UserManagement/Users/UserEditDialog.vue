<template >
  <v-row justify="end">
    <v-dialog v-model="show" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ addoredit }} User</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-alert
              v-model="isAlert"
              :type="alertType"
              closable
              close-label="Close Alert"
              >User {{ addoredit }}ed
              {{ alertType == "success" ? "Successfully" : "Failed" }}.</v-alert
            >
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="user.username"
                    :rules="userNameRules"
                    :counter="20"
                    label="Username*"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="user.password"
                    :rules="userNameRules"
                    label="Password*"
                    type="password"
                    required
                    autofocus
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-btn
                class="mr-4"
                @click="isEdit ? editUser() : addUser()"
                variant="outlined"
                color="primary"
              >
                {{ addoredit }} User
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
    officerId: String,
    userEdit: Object,
    isEdit: Boolean,
  },
  data: () => ({
    officerList: [],
    select: [],
    isAlert: false,
    alertType: "success",
    addoredit: "Add",
    // user: {},
    valid: false,
    userNameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 20) || "Name must be less than 20",
    ],
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
    addUser() {
      if (this.isEdit == false) {
        this.validate();
        if (this.valid) {
          let token = localStorage.getItem("token");
          let data = {
            headers: {
              "X-Access-Token": JSON.parse(token),
            },
          };
          console.log("this.userEdit: ", this.officerId);
          this.user.officerID = this.officerId;
          console.log("this.user: ", this.user);
          let uri =
            "http://" + window.location.hostname + ":4000/user/register";
          axios
            .post(uri, this.user, data)
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
    editUser() {
      if (this.isEdit == true) {
        this.validate();
        if (this.valid) {
          let token = localStorage.getItem("token");
          let data = {
            headers: {
              "X-Access-Token": JSON.parse(token),
            },
          };
          console.log("User:", this.user);
          let uri =
            `http://` +
            window.location.hostname +
            `:4000/user/${this.user._id}`;
          axios
            .patch(uri, this.user, data)
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
      } else {
        this.addoredit = "Edit";
      }
    },
  },

  computed: {
    user: {
      get() {
        return this.userEdit == null ? {} : this.userEdit;
      },
      set(userEdit) {
        this.$emit("input", userEdit);
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