<template>
  <v-card :loading="isLoading" dense class="ma-6 pb-1">
    <v-card-text
      class="font-weight-bold text-h5 text-center justify-center"
      v-if="isLoading == true"
      >Loading data. Please wait...</v-card-text
    >
    <v-card-title
      v-if="isLoading == false"
      class="
        text-h4
        font-weight-bold
        title
        text-center
        justify-center
        white--text
      "
      >Complaint# {{ complaint.complaintNumber }}
    </v-card-title>
    <v-card-text v-if="isLoading == false">
      <v-row
        class="mt-4 mb-2"
        justify="space-around"
        align-items="align-stretch"
      >
        <v-card width="68%">
          <v-container>
            <v-card-title class="title white--text text-center justify-center">
              Before
            </v-card-title>
            <v-row class="ma-1">
              <v-col
                v-for="(image, index) in complaint.startSnaps"
                :key="index"
                :cols="6"
                :sm="4"
              >
                <v-card>
                  <v-img
                    :src="image"
                    :lazy-src="require('../../../assets/logo.png')"
                    aspect-ratio="1"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                        ></v-progress-circular>
                      </v-row>
                    </template>
                    <!-- <v-card-title>
                      <v-spacer />
                      <v-fab-transition>
                        <v-btn fab light small @click="deleteImage(image._id)">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </v-fab-transition>
                    </v-card-title> -->
                  </v-img>
                </v-card>
              </v-col>
            </v-row>
            <v-card-title class="title white--text text-center justify-center">
              After
            </v-card-title>
            <v-row class="ma-1">
              <v-col
                v-for="(image, index) in complaint.resolvedSnaps"
                :key="index"
                :cols="6"
                :sm="4"
              >
                <v-card>
                  <v-img
                    :src="image"
                    :lazy-src="require('../../../assets/logo.png')"
                    aspect-ratio="1"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                        ></v-progress-circular>
                      </v-row>
                    </template>
                    <!-- <v-card-title>
                      <v-spacer />
                      <v-fab-transition>
                        <v-btn fab light small @click="deleteImage(image._id)">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </v-fab-transition>
                    </v-card-title> -->
                  </v-img>
                </v-card>
              </v-col>
            </v-row>

            <v-card-title class="title white--text text-center justify-center">
              Location
            </v-card-title>
            <v-row class="fill-height ma-2" align="center" justify="center">
              <iframe
                :src="latlong"
                width="600"
                height="450"
                style="border: 1"
                allowfullscreen="0"
                loading="lazy"
              ></iframe>
            </v-row>
          </v-container>
        </v-card>
        <v-card width="25%">
          <v-card-title
            class="
              text-h5
              font-weight-bold
              title
              text-center
              justify-center
              white--text
            "
            >Details
          </v-card-title>
          <v-card-title> Officer: </v-card-title>
          <v-card-subtitle>
            {{ complaint.officer[0].officerName }} ({{
              complaint.post[0].postName
            }})
          </v-card-subtitle>
          <v-card-title> Status: </v-card-title>
          <v-row justify="center" align="center">
            <v-chip class="px-8" :color="statusColor(complaint.status)">
              {{ complaint.status }}
            </v-chip>
          </v-row>

          <!-- <v-card-subtitle class="success darken-1" chips>
            {{ complaint.status }}
          </v-card-subtitle> -->
          <v-card-title outlined> Description: </v-card-title>
          <v-card-subtitle>
            {{ complaint.description }}
          </v-card-subtitle>
          <v-card-title> Started at: </v-card-title>
          <v-card-subtitle>
            {{ complaint.startTime }}
          </v-card-subtitle>
          <div v-if="complaint.status == 'Resolved'">
            <v-card-title> Resolved at: </v-card-title>
            <v-card-subtitle>
              {{ complaint.resolvedTime }}
            </v-card-subtitle>
          </div>

          <v-card-title> Type: </v-card-title>
          <v-card-subtitle>
            {{ complaint.complaintType[0].complaintTypeName }}
          </v-card-subtitle>
          <v-card-title> Category: </v-card-title>
          <v-card-subtitle>
            {{ complaint.category[0].categoryName }}
          </v-card-subtitle>

          <v-card-title> Phase: </v-card-title>
          <v-card-subtitle>
            {{ complaint.phase[0].phaseName }}
          </v-card-subtitle>

          <v-card-title> Sector: </v-card-title>
          <v-card-subtitle>
            {{ complaint.sector[0].sectorName }}
          </v-card-subtitle>
        </v-card>
      </v-row>
    </v-card-text>
  </v-card>
</template>
    <!-- <v-col cols="12" lg="8" md="4" sm="5">
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
          >Details of Complaint: {{ complaint.complaintNumber }}
        </v-card-title>

        <v-spacer></v-spacer>

        <v-container>
          <v-row>
            <v-col
              v-for="(image, index) in complaint"
              :key="index"
              :cols="6"
              :sm="4"
            >
              <v-card>
                <v-img
                  :src="image.image_data"
                  :lazy-src="require('../../../assets/logo.png')"
                  aspect-ratio="1"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular indeterminate></v-progress-circular>
                    </v-row>
                  </template>
                  <v-card-title>
                    <v-spacer />
                    <v-fab-transition>
                      <v-btn fab light small @click="deleteImage(image._id)">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-fab-transition>
                  </v-card-title>
                </v-img>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>

    <v-col cols="12" lg="4" md="4" sm="5">
      <v-card class="ma-6 pb-1">
        <v-container>
          <template>
            <v-card class="mx-auto" max-width="344">
              <v-card-text>
                <div>Word of the Day</div>
                <p class="text-h4 text--primary">el·ee·mos·y·nar·y</p>
                <p>adjective</p>
                <div class="text--primary">
                  relating to or dependent on charity; charitable.<br />
                  "an eleemosynary educational institution."
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="teal accent-4" @click="reveal = true">
                  Learn More
                </v-btn>
              </v-card-actions>

              <v-expand-transition>
                <v-card
                  v-if="reveal"
                  class="transition-fast-in-fast-out v-card--reveal"
                  style="height: 100%"
                >
                  <v-card-text class="pb-0">
                    <p class="text-h4 text--primary">Origin</p>
                    <p>
                      late 16th century (as a noun denoting a place where alms
                      were distributed): from medieval Latin eleemosynarius,
                      from late Latin eleemosyna ‘alms’, from Greek eleēmosunē
                      ‘compassion’
                    </p>
                  </v-card-text>
                  <v-card-actions class="pt-0">
                    <v-btn text color="teal accent-4" @click="reveal = false">
                      Close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-expand-transition>
            </v-card>
          </template>
        </v-container>
      </v-card>
    </v-col>
  </div>
</template> -->
<script>
import axios from "axios";
// import ImageAddDialog from "./ImageAddDialog.vue";

export default {
  name: "ComplaintGrid",
  // components: { ImageAddDialog },

  data() {
    return {
      complaint: [],
      complaintId: null,
      showEditForm: false,
      isLoading: true,
      latlong: "",
    };
  },

  methods: {
    getComplaintDetails() {
      this.isLoading = true;
      let token = localStorage.getItem("token");

      let data = {
        headers: {
          "X-Access-Token": JSON.parse(token),
        },
      };

      let uri =
        `http://` +
        window.location.hostname +
        `:4000/complaints/${this.complaintId}`;
      console.log(uri);
      axios
        .get(uri, data)
        .then((response) => {
          this.isLoading = false;
          this.complaint = response.data[0].docs[0];
          this.latlong =
            "http://maps.google.com/maps?q=" +
            this.complaint.lat +
            "," +
            this.complaint.long +
            "&z=15&output=embed";

          console.log("this.complaint: ", this.complaint);
        })
        .catch((error) => {
          console.error("ERROR getComplaint: ", error);
        });
    },

    deleteImage(id) {
      let uri = `http://` + window.location.hostname + `:3000/complaints/${id}`;
      axios
        .delete(uri, this.complaint)
        .then(() => {
          this.getComplaint();
        })
        .catch((error) => {
          console.error("ERROR deleteImage: ", error);
        });
    },

    statusColor(item) {
      // console.log("item: ", item);
      // statusList: ["In-progress", "Resolved", "Re-opened"],
      if (item == "Resolved") {
        return "success darken-1"; //can also return multiple classes e.g ["orange","disabled"]
      } else if (item == "In-progress") {
        return "warning"; //can also return multiple classes e.g ["orange","disabled"]
      } else if (item == "Re-opened") {
        return "info darken-1"; //can also return multiple classes e.g ["orange","disabled"]
      }
      return "text"; //can also return multiple classes e.g ["orange","disabled"]
    },
  },

  mounted() {
    this.complaintId = this.$route.params.id;
  },

  created() {
    console.log("length: ", this.complaint.length);
    this.complaintId = this.$route.params.id;
    this.getComplaintDetails();
  },

  watch: {
    showEditForm(val) {
      val ? val : this.getComplaint();
    },
  },
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
