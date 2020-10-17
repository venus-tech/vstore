<template>
  <v-card flat>
    <AddCatogoryDialog :show="showAddCatogoryDialog" @inserted="insertNew" @canceled="showAddCatogoryDialog = false" />
    <v-card-title>
      <v-row>
        <v-col md="6">
          <v-btn x-large color="primary" @click="showAddCatogoryDialog = true">
            <v-icon left>mdi-tag-plus</v-icon>
            <span>إضافة صنف</span>
          </v-btn>
          <span class="mx-2"></span>
          
        </v-col>
        <v-col md="6">
          <v-text-field v-model="search" append-icon="mdi-magnify" label="فلترة الأصناف" outlined></v-text-field>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table :loading="loading" :headers="headers" :items="categories" :search="search">
        <template v-slot:item.name="{ item }">
          <v-btn router :to="`/categories/${item.id}`" color="primary" text>{{ item.name }}</v-btn>
        </template>
        <template v-slot:item.description ="{ item }">
          <span
            class="d-inline-block text-truncate"
            style="max-width: 500px;"
          >{{item.description}}</span>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import AddCatogoryDialog from "./AddCatogory";
import db from '../../db' 

export default {
  components: {
    AddCatogoryDialog
  },
  data() { 
    return {
      db: null ,
      loading: true,
      showAddCatogoryDialog: false,
      search: "",
      headers: [
        {
          text: "الإسم",
          value: "name"
        },
        {
          text: "وصف",
          value: "description",
          align: 'left'
        },
        /*{
          text: "عدد المنتجات",
          value: "products_count",
          align: "left"
        }*/
      ],
      categories: []
    };
  },
  async created(){
    const connection = await db.getConnection();
    this.db = connection ;
    await this.loadCatogories();
  },
  
  methods:{
    async loadCatogories(){
      this.loading = true ;
      this.categories =  await this.db.all('SELECT * FROM categories ORDER BY id DESC')
      this.loading = false ;
    },
    insertNew(newRow) {
      this.showAddCatogoryDialog = false ;
      this.categories.unshift(newRow)
    }
  }
};
</script>

<style>
</style>