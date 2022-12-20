<template>
  <v-card>
    <EditEmployee 
      :show="showEditEmployeeDialog"
      :employee="employee"
      @canceled="showEditEmployeeDialog = false"
      @updated="updated"
    />
    <ConfirmDeletion 
      title="هل تريد ارشفة بيانات هذا الموظف"
      text="عند الارشفة سيزال هذا الموظق من قائمة الموظفين"
      :show="showConfirmDeletion"
      @canceled="showConfirmDeletion = false"
      @confirmed="archive"
    />
    <v-tabs v-model="tab" :grow="true" dark>
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab href="#data">
        <v-icon right>mdi-file-outline</v-icon> بيانات الموظف
      </v-tab>

      <v-tab href="#sells">
        <v-icon right>mdi-cart-arrow-up</v-icon> المبيعات
      </v-tab>

      <v-tab href="#transactions">
        <v-icon right>mdi-account-cash-outline</v-icon> حركة مالية
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item value="data">
        <v-card>
          <v-card-title >
            {{employee.name}}
            <v-spacer></v-spacer>
            # {{employee.id}}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-title >
            الوظيفة : {{employee.job}}
            <v-spacer></v-spacer>
            تاريخ بداية العمل : {{employee.job_start_date}}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-title >
            المرتب : {{employee.sellary}} جنيه
          </v-card-title>
          <v-divider></v-divider>
          <v-card-title >
            العنوان : {{employee.address}}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-title >
            ارقام الهاتف : 
            <v-chip class="ma-2" v-for="(num, index) of employee.phone_numbers" :key="index">
              {{num}}
            </v-chip>
          </v-card-title>
          <v-divider></v-divider>
           <v-card-text >
            <h3>بيانات اضافية</h3>
            {{employee.job}}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-4">
            <v-btn color="success" large @click="showEditEmployeeDialog = true">
              <v-icon left>mdi-pencil</v-icon>
              <span>تعديل</span>
            </v-btn>  
            <v-spacer></v-spacer>
            <v-btn color="error" large @click="showConfirmDeletion = true" v-if="$route.params.id != 0">
              <v-icon left>mdi-archive</v-icon>
              <span>ارشفة</span>
            </v-btn>            
          </v-card-actions>
        </v-card>
      </v-tab-item>
      <v-tab-item value="sells">
        <EmployeeSells :id="Number($route.params.id)" />
      </v-tab-item>
      <v-tab-item value="transactions">
        <EmployeeTransactions :employee="employee" />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import db from '../db';

import EditEmployee from '../components/Employees/EditEmployee';
import EmployeeTransactions from '../components/Employees/EmployeeTransactions';
import EmployeeSells from '../components/Employees/EmployeeSells';

import ConfirmDeletion from '../components/ConfirmDeletion';


export default {
  components: {EditEmployee, EmployeeTransactions, EmployeeSells, ConfirmDeletion},
  data() {
    return {
      showConfirmDeletion: false,
      tab: null,
      employee: {},
      showEditEmployeeDialog: false,
    };
  },
  async created(){
    await this.loadEmployeeData();
  },
  methods: {
    async loadEmployeeData(){
      const DB = await db.getConnection();
      this.employee = await DB.get("SELECT * FROM employees WHERE id = :id", {
        ":id": this.$route.params.id
      });
      this.employee.phone_numbers = this.employee.phone_numbers.split(',')
    },
    updated(data){
      this.employee = data;
      this.showEditEmployeeDialog = false
    },
    async archive(){
      const DB = await db.getConnection();

      await DB.run('UPDATE employees SET archived = 1 WHERE id = :id',{
        ":id": this.employee.id
      });

      this.showConfirmDeletion = false;

      window.history.back();
    }
  }
};
</script>

<style>
</style>