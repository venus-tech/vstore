<template>
  <v-app>
    <div v-if="$route.path.search('print/') == -1">
      <Drawer app />
      <AppBar />
    </div>

    <v-main style="background-color: rgba(95, 111, 111, 0.13)" class="mt-4">
      <v-container class="pa-6" fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// import {machineId} from 'node-machine-id';

import db from "./db";

import Drawer from "./components/Drawer";
import AppBar from "./components/AppBar";

// const VStoreProductID =
//   "b2a88ec9896af943eac89a0505a82872"+
//   "a680f29580917660d59ba29cf5f6f486"+
//   "0b31d6eff8f87ea76fa7491ca037258e"+
//   "e3cbf85915276c81ec037054649ae72a"
// ;

// const crypto = require('crypto');
// const sha512 = crypto.createHash('sha512');
// getMachineId().then(id => console.log(md5sum.update(id).digest('hex')));

if (!window.localStorage.getItem("companyInformations")) {
  const companyInformations = {
    name: "Venus Technologies",
    whatsapp_accounts: ["00249-90533-0169", "00249-9114-15-666"],
    mobile_numbers: ["00249-90533-0169", "00249-9114-15-666"],
    phone_numbers: ["00249-90533-0169", "00249-9114-15-666"],
    locations: ["Sudan-khartoum"],
  };
  window.localStorage.setItem(
    "companyInformations",
    JSON.stringify(companyInformations)
  );
}

export default {
  name: "App",

  components: {
    Drawer,
    AppBar,
  },

  data: () => ({
    //
  }),
  async created() {
    const DB = await db.getConnection();
    var response = await DB.get("SELECT * FROM agencies WHERE id = :id", {
      ":id": 0,
    });

    if (!response) {
      const sql = `
        INSERT INTO agencies (id, name, address, phone_numbers, notes)
        VALUES (:id, :name, :address, :phone_numbers, :notes)
      `;
      const data = {
        ":id": 0,
        ":name": "المتجر العام",
        ":address": "",
        ":phone_numbers": "",
        ":notes": "",
      };

      await DB.run(sql, data);
    }

    response = await DB.get("SELECT * FROM employees WHERE id = :id", {
      ":id": 0,
    });

    if (!response) {
      const sql = `
        INSERT INTO employees (id, name, address, sellary, job_start_date, phone_numbers, job, notes)
        VALUES (:id, :name, :address, :sellary, :job_start_date, :phone_numbers, :job, :notes)
      `;

      const data = {
        ":id": 0,
        ":name": " الافتراضي",
        ":address": "",
        ":sellary": 0,
        ":job_start_date": "",
        ":phone_numbers": "",
        ":job": "",
        ":notes": "",
      };

      await DB.run(sql, data);
    }

    await this.$store.commit("Cart/resetCart");

    if (!window.localStorage.getItem("generalTaxes")) {
      const generalTaxes = [];
      window.localStorage.setItem("generalTaxes", JSON.stringify(generalTaxes));
    }
    if (!window.localStorage.getItem("CartHeader")) {
      const cartHeader = "";
      window.localStorage.setItem("CartHeader", cartHeader);
    }
    if (!window.localStorage.getItem("CartFooter")) {
      const cartFooter = "";
      window.localStorage.setItem("CartFooter", cartFooter);
    }
  },
  methods: {
    // async getMachineId() {
    //   return await machineId();
    // },
  },
};
</script>
