<template>
  <v-card class="pa-3">
    <v-card-title primary-title>
      <v-text-field
        outlined
        label="table name"
        v-model="table"
      ></v-text-field>
      <v-spacer></v-spacer>
      {{time}}
      <v-spacer></v-spacer>
      <v-btn color="info" outlined large @click="loadData">load data</v-btn>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-title primary-title>
      <v-text-field
        outlined
        label="SQL"
        v-model="sql"
      ></v-text-field>
      <v-spacer></v-spacer>
      execution and getting data time is : {{time}} ms
      <v-spacer></v-spacer>
      <v-btn color="primary" large @click="exec">execute</v-btn>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-title primary>
      count off data is {{data.length}}
    </v-card-title>
    <v-divider></v-divider>


    <v-alert type="info" v-for="(datum,index) of data" :key="index">
        {{datum}}
    </v-alert>
  </v-card>
</template>

<script>

import conn from '../db/index'
let db ;


export default {
  data: ()=>({
    table: 'null' ,
    data: [] ,
    beforTime : 0 ,
    afterTime : 0 ,
    time : 0 ,
    sql: ''
  }),
  created(){
    db = conn.getConnection();
    console.log(db)
  },
  methods:{
    loadData(){
      this.beforTime = new Date().getTime();
      db.all(`select * from ${this.table}`, [], (err, rows) => {
        if (err) {
          console.log(err)
        }
        this.data = rows ;
        this.afterTime = new Date().getTime();
      });
    },
    exec(){
      this.beforTime = new Date().getTime();
      db.all(this.sql, [], (err, rows) => {
        if (err) {
          console.log(err)
        }
        this.data = rows ;
        this.afterTime = new Date().getTime();
      });
    },
  },
  watch: {
    afterTime(){
      this.time = this.afterTime - this.beforTime
    }
  },
  destroyed(){
    db.close()
    console.log('db is destroyed')
  }
}
</script>

<style>

</style>