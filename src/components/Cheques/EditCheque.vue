<template>
  <v-dialog
    v-model="show"
    scrollable  
    persistent 
    max-width="960px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title class="pa-4">
        <v-icon right>mdi-pencil</v-icon>
        <span>تعديل  بيانات شيك</span>
        <v-spacer></v-spacer>
        # {{cheque.id}}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-6">
        <v-row>
          <v-col>
            <v-text-field 
              v-model="cheque.payer_name" 
              :error-messages="nameErrors" 
              counter="127" label="اسم العميل"
              outlined
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              :items="['مرور', 'ارجاع', 'فحص' ]"
              v-model="cheque.status"
              label="حالة الشيك"
              outlined
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="cheque.serial_number"
              label="الرقم المتسلسل"
              outlined
              :error-messages="serialNumberErrors"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="cheque.amount"
              type="number"
              :min="0"
              step="0.01"
              suffix=" جنيه سوداني "
              label="المبلغ"
              outlined
              :error-messages="amountErrors"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          
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
                <v-text-field v-model="cheque.date" label="تاريخ  الشيك" readonly v-on="on" outlined></v-text-field>
              </template>
              <v-date-picker
                locale="ar-ae"
                ref="picker"
                v-model="cheque.date"
                :max="new Date().toISOString().substr(0, 10)"
                min="1950-01-01"
                @change="saveDate"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col>
            <v-text-field v-model="cheque.area" counter="511" label="المنطقة" outlined></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="cheque.bank" counter="511" label="البنك" outlined></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="cheque.branch" counter="511" label="الفرع" outlined></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea v-model="cheque.notes" outlined label=" ملاحظات   " auto-grow rows="3" counter="65000"></v-textarea>
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
        <v-btn large color="success" @click="editCheque">
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
    cheque: {
      type: Object,
      required: true
    }
  },
  data: ()=>({
    menu: false,
    nameErrors: [],
    serialNumberErrors: [],
    amountErrors: [],
  }),
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
    async editCheque(){
      this.amountErrors = [];
      this.nameErrors = [];
      this.serialNumberErrors = [];

      const name = this.cheque.payer_name.trim().toLowerCase();
      if(name.length < 1 || name.length > 127){
        this.nameErrors.push('يجب ان يحتوي الاسم على حرف واحد على الاقل وان لا يزيد عن 127 حرف');
        return false ;
      }

      if(this.cheque.amount < 0.01){
        this.amountErrors.push('اقل مبلغ يجب ان يكون 0.01');
        return false
      }

      const serialNumber = this.cheque.serial_number.trim().toLowerCase();
      if(serialNumber.length < 1 || serialNumber.length > 127){
        this.serialNumberErrors.push('يجب ان يحتوي الرقم المتسلسل على رقم واحد على الاقل وان لا يزيد عن 127 رقم');
        return false ;
      }

      const DB = await db.getConnection();

      const isUnique = await DB.get("SELECT Count(*) < 1 as isUnique from cheques where serial_number = :serial_number and id != :id " , {
        ":serial_number": serialNumber,
        ":id": this.cheque.id
      });
      if (isUnique.isUnique !== 1) {
        this.serialNumberErrors.push('هناك شيك يحمل نفس هذا الرقم المتسلسل رجاء قم بتعديله');
        return false;
      }

      this.cheque.payer_name = name ;
      this.cheque.serial_number = serialNumber ;

      const sql = `
        UPDATE cheques SET 
          payer_name = :payer_name, 
          serial_number = :serial_number,
          area = :area, 
          bank = :bank, 
          branch = :branch, 
          date = :date, 
          amount = :amount, 
          notes = :notes,
          status = :status
        WHERE id = :id
      `;

      const data = {
        ":id": this.cheque.id,
        ":payer_name": this.cheque.payer_name,
        ":serial_number": this.cheque.serial_number,
        ":area": this.cheque.area,
        ":bank": this.cheque.bank,
        ":branch": this.cheque.branch,
        ":date": this.cheque.date,
        ":amount": this.cheque.amount,
        ":notes": this.cheque.notes,
        ":status": this.cheque.status
      };

      await DB.run(sql, data);

      this.$emit('updated', this.cheque);
    }
  }

}
</script>

<style>

</style>