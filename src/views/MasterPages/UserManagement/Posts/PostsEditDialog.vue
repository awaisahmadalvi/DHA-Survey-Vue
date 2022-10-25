<template >
  <v-row justify="end">
    <v-dialog v-model="show" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ addoredit }} Post</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="postForm" lazy-validation v-model="valid">
            <v-alert
              v-model="isAlert"
              :type="alertType"
              closable
              close-label="Close Alert"
              >Post {{ addoredit }}ed
              {{ alertType == "success" ? "Successfully" : "Failed" }}.</v-alert
            >
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    autofocus
                    v-model="post.postName"
                    :rules="postNameRules"
                    :counter="50"
                    label="Post Name*"
                    required
                  ></v-text-field>
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
                    v-model="selectSupervisor"
                    :items="supervisorList"
                    item-value="_id"
                    item-text="postName"
                    label="Supervisor*"
                    outlined
                    :rules="categoryRule"
                  ></v-combobox>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-combobox
                    v-model="post.permissionLevel"
                    :items="permissionList"
                    label="Permission*"
                    outlined
                    :rules="permissionRule"
                  ></v-combobox>
                </v-col>
              </v-row>
              <v-btn
                class="mr-4"
                @click="isEdit ? editPost() : addPost()"
                variant="outlined"
                color="primary"
              >
                {{ addoredit }} Post
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
    postEdit: Object,
    isEdit: Boolean,
  },
  data: () => ({
    categoryList: [],
    selectCategory: [],
    supervisorList: [],
    supervisorListEdt: [],
    selectSupervisor: [],
    permissionList: [0, 1, 2, 3, 4],
    isAlert: false,
    alertType: "success",
    addoredit: "Add",
    // post: {},
    valid: false,
    latestNumber: 0,
    postNameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 50) || "Name must be less than 50",
    ],
    categoryRule: [(v) => !!v || "Category is required"],
    permissionRule: [(v) => !!v || "Permission is required"],
  }),
  methods: {
    validate() {
      this.$refs.postForm.validate();
    },
    reset() {
      this.$refs.postForm.reset();
    },
    resetValidation() {
      this.$refs.postForm.resetValidation();
    },
    addPost() {
      if (this.isEdit == false) {
        this.validate();
        if (this.valid) {
          let token = localStorage.getItem("token");
          let data = {
            headers: {
              "X-Access-Token": JSON.parse(token),
            },
          };
          this.post.categoryID = this.selectCategory._id;
          this.post.supervisorID = this.selectSupervisor._id;
          // this.post.permissionLevel = this.selectPermission;

          let uri = "http://" + window.location.hostname + ":4000/post";
          axios
            .post(uri, this.post, data)
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
    editPost() {
      if (this.isEdit == true) {
        this.validate();
        if (this.valid) {
          let token = localStorage.getItem("token");
          let data = {
            headers: {
              "X-Access-Token": JSON.parse(token),
            },
          };
          this.post.categoryID = this.selectCategory._id;
          this.post.supervisorID = this.selectSupervisor._id;
          // this.post.permissionLevel = this.selectPermission;

          console.log("EDIT Post: ", this.post);
          let uri =
            `http://` +
            window.location.hostname +
            `:4000/post/${this.post._id}`;
          axios
            .patch(uri, this.post, data)
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

    getPostList() {
      let token = localStorage.getItem("token");

      let data = {
        headers: {
          "X-Access-Token": JSON.parse(token),
        },
      };

      let uri = `http://` + window.location.hostname + `:4000/post`;
      axios
        .get(uri, data)
        .then((response) => {
          // console.log("Supervisor List: ", response.data);
          this.supervisorList = response.data[0].docs;
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
          // console.log("category: ", response.data);
          this.categoryList = response.data[0].docs;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    setPostCategory(postEdt) {
      if (postEdt == null) {
        this.selectCategory = null;
        return;
      }
      this.selectCategory = postEdt.category[0];
    },

    setPostSupervisor(postEdt) {
      if (postEdt == null) {
        this.selectSupervisor = null;
        return;
      }
      // let list = this.supervisorList.filter(function (value) {
      //   return value._id != postEdt._id;
      // });
      // this.supervisorListEdt = list;
      this.selectSupervisor = postEdt.supervisor[0];
      // this.permissionList = [...Array(5).keys()].slice(this.user.permissionLevel);
    },
  },
  created() {
    this.getCategoryList();
    this.getPostList();
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
    post: {
      get() {
        this.setPostCategory(this.postEdit);
        this.setPostSupervisor(this.postEdit);

        return this.postEdit == null ? {} : this.postEdit;
      },
      set(postEdit) {
        this.$emit("input", postEdit);
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