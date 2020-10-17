<template>
  <v-card>
    <AddCheque 
      :show="showAddChequeDialog"
      @canceled="showAddChequeDialog = false"
      @inserted='insertNew'
    />
    <v-card-title>
      <v-row>
        <v-col md="4">
          <v-btn x-large color="primary" @click="showAddChequeDialog = true">
            <v-icon left>mdi-account-plus</v-icon>
            <span>إضافة شيك</span>
          </v-btn>
          
        </v-col>
        <v-col md="8">
          <v-text-field v-model="search" append-icon="mdi-magnify" label="فلترة الشيكات" outlined></v-text-field>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table :loading="loading" :headers="headers" :items="cheques" :search="search">
        <template v-slot:item.serial_number="{item}">
          <v-btn color="primary" text router :to="`/cheques/${item.id}`">
            {{ item.serial_number }}
          </v-btn>
        </template>
        <template v-slot:item.sellary="{item}">
          {{ item.sellary }} جنيه
        </template>
        <template v-slot:item.status="{item}">
          <strong :class='{
            "red--text": item.status == "ارجاع",
            "orange--text": item.status == "فحص",
            "green--text": item.status == "مرور"
          }'>
            {{ item.status }}
          </strong>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import db from '../db';
import AddCheque from '../components/Cheques/AddCheque';

export default {
  components: {AddCheque},
  data: ()=>({
    showAddChequeDialog: false,
    loading: false,
    headers: [
      {text: "الرقم", value: "serial_number"},
      {text: "العميل", value: "payer_name"},
      {text: "تاريخ الشيك", value: "date", align: "left"},
      {text: "القيمة", value: "amount", align: 'left'},
      {text: "الحالة", value: "status", align: 'left'},
    ],
    cheques: [],
    search: '',
  }),
  async created(){
    await this.loadCheques();
  },
  methods: {
    async loadCheques(){
      const DB = await db.getConnection();
      this.cheques = await DB.all('SELECT * FROM cheques ORDER BY id DESC');
    },
    insertNew(cheque){
      this.cheques.unshift(cheque);
      this.showAddChequeDialog = false;
    }
  },
}
</script>

<style>

</style>