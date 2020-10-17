<template>

  <v-app>
    <div v-if="$route.path.search('print/') == -1 ">
      <Drawer app  />
      <AppBar />
    </div>
  
    <v-main style="background-color: rgba(95, 111, 111, 0.13)" class="mt-4">
      <v-container class="pa-6">
        <router-view></router-view>
      </v-container>  
      
    </v-main>
  </v-app>
</template>

<script>
import Drawer from "./components/Drawer" ;
import AppBar from './components/AppBar';


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
    
  }
};
</script>
