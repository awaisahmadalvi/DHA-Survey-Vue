<template>
  <v-container fluid>
    <v-row class="py-2 pb-4 mx-1" justify="end">
      <v-btn-toggle dense borderless v-model="dateFilter" mandatory>
        <v-btn value="1"> Today </v-btn>
        <v-btn value="2"> 7 Days </v-btn>
        <v-btn value="3"> 30 Days </v-btn>

        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="date"
          transition="scale-transition"
          offset-y
          bottom
          left
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn value="0" v-bind="attrs" v-on="on">
              <v-icon>mdi-calendar</v-icon>
            </v-btn>
          </template>
          <v-date-picker
            v-model="dates"
            :show-current="date"
            show-adjacent-months
            range
          >
            <v-spacer></v-spacer>
            <v-btn text color="error" @click="menu = false"> Cancel </v-btn>
            <v-btn
              text
              color="primary"
              @click="
                {
                  retrieveOrderslist();
                  menu = false;
                }
              "
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-btn-toggle>
    </v-row>
    <v-row dense>
      <v-col
        v-for="(item, i) in items"
        :key="i"
        cols="12"
        md="4"
        lg="3"
        sm="6"
        xs="12"
      >
        <v-card class="mt-8 mx-1">
          <v-btn class="mt-n7 ml-5" fab x-large size="60" :color="item.color"
            ><v-icon size="50">
              <!-- <v-card>
          <v-btn class="mt-5 ml-5" text icon :color="item.color">
            <v-icon size="60"> -->
              {{ item.icon }}
            </v-icon>
          </v-btn>
          <v-card-text class="ml-1 text-h2 font-weight-bold">
            {{ item.value }}
          </v-card-text>
          <v-card-text class="mt-n6 ml-1 text-h5 font-weight-bold"
            >{{ item.name }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="mt-4 mx-auto" max-width="400">
      <v-sheet
        class="v-sheet--offset mx-auto"
        color="cyan"
        elevation="12"
        max-width="calc(100% - 32px)"
        ><v-sparkline
          :value="value"
          color="rgba(255, 255, 255, .7)"
          height="100"
          padding="24"
          stroke-linecap="round"
          smooth
        >
          <template v-slot:label="item"> ${{ item.value }} </template>
        </v-sparkline>
      </v-sheet>

      <v-card-text class="pt-0">
        <div class="text-h6 font-weight-light mb-2">User Registrations</div>
        <div class="subheading font-weight-light grey--text">
          Last Campaign Performance
        </div>
        <v-divider class="my-2"></v-divider>
        <v-icon class="mr-2" small> mdi-clock </v-icon>
        <span class="text-caption grey--text font-weight-light"
          >last registration 26 minutes ago</span
        >
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
// import loginCheck from "../middleware/loginCheck";

export default {
  name: "DashBoardVue",

  components: {},
  data: () => ({
    ordersList: [],
    summaryItems: [],
    dates: [],
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    dateFilter: 0,
    labels: ["12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm"],
    value: [200, 675, 410, 390, 310, 460, 250, 240],
    items: [
      {
        color: "info",
        name: "# of Customers",
        icon: "mdi-account-multiple",
        value: 0,
      },
      {
        color: "success",
        name: "Revenue",
        icon: "mdi-currency-usd",
        value: 0,
      },
      {
        color: "primary",
        name: "Dishes Ordered",
        icon: "mdi-food",
        value: 0,
      },
      {
        color: "accent",
        name: "Tables Free",
        icon: "mdi-table-chair",
        value: 0,
      },
      {
        color: "error",
        name: "# of Genre",
        icon: "mdi-file-tree",
        value: 0,
      },
      {
        color: "warning",
        name: "# of Dishes",
        icon: "mdi-food",
        value: 0,
      },
    ],
  }),
  methods: {
    getRequestParams(dates) {
      let params = {};

      if (dates.length > 0) {
        var startDate = new Date(dates[0]);
        var endDate;
        if (dates.length == 1) endDate = startDate;
        else endDate = new Date(dates[1]);
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        endDate.setHours(23);
        endDate.setMinutes(59);
        endDate.setSeconds(59);

        params["period_start"] = startDate;
        params["period_end"] = endDate;
      }
      return params;
    },

    getOrderStats(dateFilter) {
      // console.log("getOrderStats");
      // console.log("Dates: ", this.dates);
      switch (dateFilter) {
        case 0:
          break;
        case 1:
          this.dates = [new Date(), new Date()];
          break;
        case 2:
          var strt = new Date();
          strt.setDate(strt.getDate() - 7);
          this.dates = [strt, new Date()];
          break;
        case 3:
          strt = new Date();
          strt.setDate(strt.getDate() - 30);
          this.dates = [strt, new Date()];
          break;
      }
      const params = this.getRequestParams(this.dates);
      let uri = `http://` + window.location.hostname + `:3000/orderslist/stats`;
      console.log("URI: ", uri);
      console.log("params: ", params);

      axios
        .get(uri, { params })
        .then((response) => {
          const stats = response.data[0];
          console.log("getOrderStats: ", stats);
          this.items[0].value = stats.count.toLocaleString("en-US");
          this.items[1].value = stats.inflows.toLocaleString("en-US");
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getOrderDetailStats() {
      // console.log("getOrderStats");
      // console.log("Dates: ", this.dates);
      const params = this.getRequestParams(this.dates);
      let uri =
        `http://` + window.location.hostname + `:3000/orderDetail/stats`;
      axios
        .get(uri, { params })
        .then((response) => {
          const stats = response.data[0];
          console.log("getOrderDetailStats: ", stats);
          this.items[2].value = stats.total_dishes;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getFreeTableStats() {
      let params = {};
      params["is_empty"] = true;
      let uri = "http://" + window.location.hostname + ":3000/tables";
      axios
        .get(uri, { params })
        .then((response) => {
          this.items[3].value = response.data.length - 1;
        })
        .catch((error) => {
          console.error("ERROR getFreeTableStats: ", error);
        });
    },

    getGenreStats() {
      let uri = "http://" + window.location.hostname + ":3000/genre/stats"; //get only active
      axios
        .get(uri)
        .then((response) => {
          console.log(
            "response.data[0].metadata[0].total:",
            response.data[0].metadata[0].total
          );
          this.items[4].value = response.data[0].metadata[0].total;
        })
        .catch((error) => {
          console.error("ERROR getGenreStats: ", error);
        });
    },

    getDishesStats() {
      let uri = `http://` + window.location.hostname + `:3000/dishes/stats`;
      axios
        .get(uri)
        .then((response) => {
          console.log(
            "response.data[0].metadata[0].total:",
            response.data[0].metadata[0].total
          );
          this.items[5].value = response.data[0].metadata[0].total;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getStats(dateFilter) {
      this.getOrderStats(dateFilter);
      this.getOrderDetailStats();
      this.getFreeTableStats();
      this.getGenreStats();
      this.getDishesStats();
    },
    // login() {
    //   var cred = {
    //     username: "alvi@astp",
    //     password: "123",
    //     isMobile: 0,
    //   };
    //   // var header = {};
    //   let uri = `http://` + window.location.hostname + `:4000/user/login`;
    //   axios
    //     .post(uri, cred)
    //     .then((response) => {
    //       console.log(response.data);
    //     })
    //     .catch((e) => {
    //       console.log(e);
    //     });
    // },
  },

  created() {
    // this.getStats(1);
    // loginCheck();
  },

  watch: {
    // dateFilter(val) {
    // this.getStats(val);
    // },
  },
};
</script>

<style>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>