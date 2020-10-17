<template>
  <v-card flat>
    <div v-if="showSelectEmployee">
      <v-card-title>
        <v-row>
          <v-col>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="فلترة الموظفين" outlined></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-data-table :loading="loading" :headers="headers" :items="employees" :search="search">
          <template v-slot:item.name="{ item }">
            <v-btn color="primary" text router :to="`/employees/${item.id}`">
              {{item.name}}
            </v-btn>
          </template>
          <template v-slot:item.id="{item}">
            <v-btn color="primary" large class="ma-2" @click="selectEmployee(item)" >
              تحديد 
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </div>
    <div v-else>
      <v-card-title >
        الموظف : {{$store.getters['Cart/employee'].name}}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-title >
        العنوان : {{$store.getters['Cart/employee'].address}}
      </v-card-title>
      <v-card-text class="my-4">
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-btn color="info" large @click="showSelectEmployee = true">
          تغير الموظف المندوب
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="success" x-large @click="toNext" :disabled="showSelectEmployee">
          متابعة
        </v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script>
import db from '../../db';

export default {
  data: ()=>({
    showSelectEmployee: true,
    agentName: '',
    employee: null,
    employees: [],
    search: "",
    loading:false,
    headers: [
      {
        text: 'حدد' ,
        value: 'id'
      },
      {
        text: "الإسم" ,
        value: "name"
      },
      {
        text: "العنوان",
        value:"address",
        align: 'left'
      }
    ] ,
  }),
  async created(){
    this.showSelectEmployee = this.$store.getters['Cart/employee'] == null ;
    await this.loadEmployees();
  },
  methods: {
    async loadEmployees(){
      const DB = await db.getConnection();
      this.employees = await DB.all('SELECT * FROM employees WHERE archived = 0 ORDER BY id DESC');
    },
    selectEmployee(employee){
      this.$store.commit('Cart/setEmployee', employee);
      this.showSelectEmployee = false;
    },
    toNext(){
      this.$emit('continue', 'GUI event')
    }
  }
}
</script>

<style>

</style>