<template>

  <v-app>
    <div v-if="$route.path.search('print/') == -1 ">
      <Drawer app  />
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

import Drawer from "./components/Drawer" ;
import AppBar from './components/AppBar';

// const VStoreProductID = 
//   "b2a88ec9896af943eac89a0505a82872"+
//   "a680f29580917660d59ba29cf5f6f486"+
//   "0b31d6eff8f87ea76fa7491ca037258e"+
//   "e3cbf85915276c81ec037054649ae72a"
// ;

// const crypto = require('crypto');
// const sha512 = crypto.createHash('sha512');
// getMachineId().then(id => console.log(md5sum.update(id).digest('hex')));

if (!window.localStorage.getItem('companyInformations')){
  const companyInformations = {
    name: "Venus Technologies",
    whatsapp_accounts: ["00249-90533-0169", "00249-9114-15-666"],
    mobile_numbers: ["00249-90533-0169", "00249-9114-15-666"],
    phone_numbers: ["00249-90533-0169", "00249-9114-15-666"],
    locations: ["Sudan-khartoum"]
  };
  window.localStorage.setItem("companyInformations",JSON.stringify(companyInformations));
}

export default {
  name: 'App',

  components: {
    Drawer ,
    AppBar
  },

  data: () => ({
    //
  }),
  created(){
    
  },
  methods: {
    // async getMachineId() {
    //   return await machineId();
    // },

  }
};
</script>
