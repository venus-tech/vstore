<template>
  <v-card flat>
    <AddEmployeeDialog 
      :show="showAddEmployeeDialog" 
      @canceled="showAddEmployeeDialog = false"
      @inserted="insertNew"
    />
    <v-card-title>
      <v-row>
        <v-col md="4">
          <v-btn x-large color="primary" @click="showAddEmployeeDialog = true">
            <v-icon left>mdi-account-plus</v-icon>
            <span>إضافة موظف</span>
          </v-btn>
          
        </v-col>
        <v-col md="8">
          <v-text-field v-model="search" append-icon="mdi-magnify" label="فلترة الموظفين" outlined></v-text-field>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table :loading="loading" :headers="headers" :items="employees" :search="search">
        <template v-slot:item.name="{item}">
          <v-btn color="primary" text router :to="`/employees/${item.id}`">
            {{ item.name }}
          </v-btn>
        </template>
        <template v-slot:item.sellary="{item}">
          {{ item.sellary }} جنيه
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import db from '../db' ;
import AddEmployeeDialog from "../components/Employees/AddEmployee";
export default {
  components: {
    AddEmployeeDialog
  },
  data() {
    return {
      showAddEmployeeDialog: false,
      search: "",
      loading: false ,
      headers: [
        {
          text: "الإسم" ,
          value : "name"
        },
        {
          text: "العنوان",
          value : "address" 
        },
        {
          text: "تاريخ البداية",
          align: "left",
          value: "job_start_date"
        },
        {
          text: "الراتب",
          align: "left" ,
          value : "sellary"
        }
      ],
      employees : [] 
    };
  },
  async created(){
    await this.loadEmployees();
  },
  methods: {
    async loadEmployees(){
      this.loading = true ;

      const DB = await db.getConnection();
      this.employees = await DB.all("SELECT * FROM employees WHERE archived = 0 ORDER BY id DESC");
      this.loading = false ;
    },
    insertNew(newRow){
      this.employees.unshift(newRow);
      this.showAddEmployeeDialog = false;
    }
  }
};
</script>

<style>
</style>