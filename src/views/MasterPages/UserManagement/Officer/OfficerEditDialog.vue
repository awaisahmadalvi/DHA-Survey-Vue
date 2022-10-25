<template >
  <v-row justify="end">
    <v-dialog v-model="show" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ addoredit }} Officer</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-alert
              v-model="isAlert"
              :type="alertType"
              closable
              close-label="Close Alert"
              >Officer {{ addoredit }}ed
              {{ alertType == "success" ? "Successfully" : "Failed" }}.</v-alert
            >
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="officer.officerName"
                    :rules="officerNameRules"
                    :counter="20"
                    label="Officer Title*"
                    required
                    autofocus
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="officer.dhaNumber"
                    :rules="officerNameRules"
                    :counter="20"
                    label="DHA Number*"
                    required
                    type="number"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="12">
                  <v-textarea
                    v-model="officer.cnic"
                    :rules="officerCNICRules"
                    :counter="6"
                    rows="1"
                    auto-grow
                    label="CNIC*"
                    required
                    type="number"
                  ></v-textarea>
                </v-col>
              </v-row>
              <!-- postID -->
              <v-row>
                <v-col cols="12">
                  <v-combobox
                    v-model="select"
                    :items="postList"
                    item-value="_id"
                    item-text="postName"
                    label="Post"
                    outlined
                  ></v-combobox>
                </v-col>
              </v-row>

              <v-col :cols="12" :sm="4">
                <v-card v-if="image">
                  <!-- :lazy-src="require('../../assets/logo.png')" -->
                  <!-- id="resampled" -->
                  <v-img :src="image" aspect-ratio="1" class="grey lighten-2">
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="grey lighten-5"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </v-card>
                <v-card
                  v-else
                  height="120"
                  color="primary lighten-1"
                  dark
                  @click="addImageFunc"
                >
                  <v-card-actions>
                    <v-row
                      class="fill-height ma-10"
                      align="center"
                      justify="center"
                    >
                      <v-icon>mdi-camera-plus</v-icon>
                    </v-row>
                  </v-card-actions>
                </v-card>
              </v-col>
              <!-- v-model="files" -->
              <v-file-input
                ref="addimage"
                prepend-icon=""
                small-chips
                accept="image/png, image/jpeg, image/bmp"
                hide-input
                show-size
                clearable
                @change="onFileChange"
              ></v-file-input>
              <v-btn
                class="mr-4"
                @click="isEdit ? editOfficer() : addOfficer()"
                variant="outlined"
                color="primary"
              >
                {{ addoredit }} Officer
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
    postId: String,
    officerEdit: Object,
    isEdit: Boolean,
  },
  data: () => ({
    postList: [],
    select: [],
    image: "",
    isAlert: false,
    alertType: "success",
    addoredit: "Add",
    // officer: {},
    valid: false,
    officerNameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 20) || "Name must be less than 20",
    ],
    officerDescRules: [
      (v) => !!v || "Description is required",
      (v) => (v && v.length <= 200) || "Description must be less than 200",
    ],
    officerCNICRules: [
      (v) => !!v || "CNIC is required",
      (v) => (v && v >= 0) || "Price must be 13 digit",
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
    addOfficer() {
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
          this.officer.picture = this.image;
          let uri = "http://" + window.location.hostname + ":4000/officer";
          axios
            .post(uri, this.officer, data)
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
    editOfficer() {
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
          this.officer.picture = this.image;
          console.log("Officer:", this.officer);
          let uri =
            `http://` +
            window.location.hostname +
            `:4000/officer/${this.officer._id}`;
          axios
            .patch(uri, this.officer, data)
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

    addImageFunc() {
      this.$refs.addimage.$refs.input.click();
      console.log("Add image clicked");
    },

    createImage(file) {
      let reader = new FileReader(); //instantiate a new file reader
      reader.onload = (e) => {
        // this.image = e.target.result;

        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");

        canvas.width = 255; // target width
        canvas.height = 255; // target height

        var image = new Image();
        image.src = e.target.result;

        image.addEventListener(
          "load",
          function () {
            ctx.drawImage(
              image,
              0,
              0,
              image.width,
              image.height,
              0,
              0,
              canvas.width,
              (canvas.height * image.height) / image.width
            );
            // create a new base64 encoding
            var resampledImage = new Image();
            resampledImage.src = canvas.toDataURL();

            this.image = canvas.toDataURL();
          }.bind(this),
          false
        );
      };
      reader.readAsDataURL(file);
    },

    onFileChange(file) {
      if (!file) {
        return;
      }
      this.createImage(file);
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
          console.log("POST List: ", response.data);
          this.postList = response.data[0].docs;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    setOfficerPost(officerEdt) {
      if (officerEdt == null) {
        this.select = null;
        return;
      }
      this.select = officerEdt.post[0];
      this.image = this.officerEdit.picture;
    },
  },

  created() {
    this.getPostList();
  },

  watch: {
    isEdit(newValue) {
      // console.log("oldValue: ", oldValue);
      // console.log("newValue: ", newValue);
      if (newValue == false) {
        this.image = {};
        this.addoredit = "Add";
        this.$refs.form.reset();
      } else {
        this.addoredit = "Edit";
      }
    },
  },

  computed: {
    officer: {
      get() {
        this.setOfficerPost(this.officerEdit);
        return this.officerEdit == null ? {} : this.officerEdit;
      },
      set(officerEdit) {
        this.$emit("input", officerEdit);
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