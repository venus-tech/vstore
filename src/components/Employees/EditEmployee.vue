<template>
  <v-dialog v-model="show" scrollable persistent max-width="960px" transition="dialog-transition">
    <v-card>
      <v-card-title class="pa-4">
        <v-icon right>mdi-account-plus</v-icon>
        <span>إضافة موظف جديد</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-6">
        <v-row>
          <v-col>
            <v-text-field v-model="employee.name" :error-messages="nameErrors" counter="127" label="الإسم" outlined></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="employee.job" counter="127" label="الوظيفة" outlined></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="employee.sellary"
              type="number"
              :min="0"
              step="0.01"
              suffix=" جنيه سوداني "
              label="المرتب"
              outlined
            ></v-text-field>
          </v-col>
          <v-col>
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field v-model="employee.job_start_date" label="تاريخ بداية العمل" readonly v-on="on" outlined></v-text-field>
              </template>
              <v-date-picker
                locale="ar-ae"
                ref="picker"
                v-model="employee.job_start_date"
                :max="new Date().toISOString().substr(0, 10)"
                min="1950-01-01"
                @change="saveDate"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-combobox v-model="employee.phone_numbers" counter="4" label="أرقام الهاتف" multiple small-chips chips outlined></v-combobox>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="employee.address" counter="511" label="العنوان" outlined></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea v-model="employee.notes" outlined label=" ملاحظات عن الموظف " auto-grow rows="3" counter="65000"></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn large text color="red" @click="cancel">
          <v-icon left>mdi-cancel</v-icon>
          <span>إلغاء</span>
        </v-btn>
        <v-btn large color="success" @click="editEmployee">
          <v-icon left>mdi-content-save</v-icon>
          <span>حفظ</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import db from '../../db';

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    employee: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      menu: false ,
      nameErrors: [],
    };
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    }
  },
  methods: {
    cancel() {
      this.$emit("canceled", "GUI cancel event");
    },
    saveDate(date) {
      this.$refs.menu.save(date);
    },
    async editEmployee(){
      const name = this.employee.name.trim().toLowerCase();
      if(name.length < 1 || name.length > 127){
        this.nameErrors.push('يجب ان يحتوي الاسم على حرف واحد على الاقل وان لا يزيد عن 127 حرف');
        return false ;
      }

      const DB = await db.getConnection();

      const isUnique = await DB.get("SELECT Count(*) < 1 as isUnique from employees where name = :name and id != :id" , {
        ":name": name,
        ":id": this.employee.id
      });
      
      if (isUnique.isUnique !== 1) {
        this.nameErrors.push('هناك موظف يحمل نفس هذا الاسم رجاء قم بتعديله');
        return false;
      }

      this.employee.name = name;

      const sql = `
        UPDATE employees SET 
          name = :name, 
          address = :address, 
          sellary = :sellary, 
          job_start_date = :job_start_date, 
          phone_numbers = :phone_numbers, 
          job = :job, 
          notes = :notes
        WHERE id = :id
      `;

      const data = {
        ":id": this.employee.id,
        ":name": this.employee.name,
        ":address": this.employee.address,
        ":sellary": this.employee.sellary,
        ":job_start_date": this.employee.job_start_date,
        ":phone_numbers": this.employee.phone_numbers.join(','),
        ":job": this.employee.job,
        ":notes": this.employee.notes
      }

      await DB.run(sql , data);

      this.$emit('updated', this.employee);
    }
  }
};
</script>

<style>
</style>