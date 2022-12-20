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
        <span> تعديل خصومات المتجر {{ agency.name }}</span>
        <v-spacer></v-spacer>
        # {{ agency.id }}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-6">
        <v-data-table
          :headers="headers"
          :items="agency.discount_table"
          hide-default-footer
          rounded
        >
          <template v-slot:item.value="{ item }">
            <v-text-field
              name="name"
              label="قيمة الخصم"
              v-model="item.value"
              outlined
              type="number"
              :min="0.0"
              :step="0.1"
              class="ma-2"
              @click:append="
                item.type == 'percent'
                  ? (item.type = 'value')
                  : (item.type = 'percent')
              "
              :append-icon="
                item.type == 'percent' ? 'mdi-percent' : 'mdi-currency-gbp'
              "
            ></v-text-field>
          </template>
          <template v-slot:item.description="{ item }">
            <v-textarea
              v-model="item.description"
              outlined
              label="سبب الخصم"
              auto-grow
              rows="1"
              counter="65000"
            ></v-textarea>
          </template>
          <template v-slot:item.remove="{ item }">
            <v-btn text icon color="error" @click="removeDiscountTableItem(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn large class="ma-2" color="primary" @click="appendDiscountTableItem">
          <v-icon left>mdi-plus-box</v-icon>
          <span>إضافة</span>
        </v-btn>
      </v-card-actions>
      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn large text color="red" @click="cancel">
          <v-icon left>mdi-cancel</v-icon>
          <span>إلغاء</span>
        </v-btn>
        <v-btn large color="success" @click="editAgency">
          <v-icon left>mdi-content-save</v-icon>
          <span>حفظ</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import db from "../../db";

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    agency: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      headers: [
        {text: 'قيمة الخصم', value: 'value' },
        {text: 'السبب', value: 'description' },
        {
          text: "ازالة",
          align: "left",
          sortable: false,
          value: "remove",
        },
      ],
      nameErrors: [],
      discounts: [],
    };
  },
  mounted(){
    this.discounts = JSON.stringify(this.agency.discount_table);
    this.discounts = JSON.parse(this.discounts);
  },
  methods: {
    sanitizeDiscountTable() {
      for (let i in this.agency.discount_table) {
        if (
          Number(this.agency.discount_table[i].value) == 0.0 &&
          this.agency.discount_table[i].description.trim() == ""
        ) {
          this.agency.discount_table.splice(i, 1);
        }
      }
    },
    appendDiscountTableItem() {
      this.agency.discount_table.push({ value: "", description: "", type: 'value'});
    },
    removeDiscountTableItem(item) {
      this.agency.discount_table.splice(this.agency.discount_table.indexOf(item), 1);
    },
    async editAgency() {
      this.sanitizeDiscountTable();
      const name = this.agency.name.trim().toLowerCase();
      

      const DB = await db.getConnection();

      const sql = `
        UPDATE agencies SET 
          discount_table = :discount_table
        WHERE id = :id
      `;

      const address = this.agency.address.trim();
      const phone_numbers = this.agency.phone_numbers.join(",");
      const notes = this.agency.notes.trim();

      const data = {
        ":id": this.agency.id,
        ":discount_table": JSON.stringify(this.agency.discount_table),

      };

      await DB.run(sql, data);

      const newProduct = {
        id: this.agency.id,
        name: name,
        address: address,
        phone_numbers: phone_numbers,
        notes: notes,
        discount_table: this.agency.discount_table
      };

      this.$emit("updated", newProduct);
    },
    cancel() {
      this.agency.discount_table = this.discounts
      this.$emit("canceled", "GUI cancel event");
    },
  },
};
</script>

<style>
</style>