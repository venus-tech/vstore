<template>
  <v-dialog
    v-model="show"
    scrollable
    persistent
    transition="dialog-transition"
    max-width="960"
  >
    <v-card>
      <v-card-title class="pa-4">
        <v-icon right>mdi-pencil</v-icon>
        <span>تعديل البيانات الأساسية المنتج {{ product.name }}</span>
        <v-spacer></v-spacer>
        # {{ product.id }}
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text class="pa-6">
        
          <v-row>
            <v-col>
              <v-text-field
                counter="127"
                label="الإسم"
                outlined
                v-model="product.name"
                :error-messages="nameErrors"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-autocomplete
                :items="categoriesNames"
                v-model="selectedCategory"
                label="التصنيف"
                :multiple="false"
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                counter="127"
                label="وحدة القياس"
                outlined
                v-model="product.unit"
                :error-messages="unitErrors"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="product.unit_price"
                type="number"
                :min="0"
                step="0.01"
                suffix=" جنيه  "
                label="سعر بيع الوحدة"
                outlined
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="product.serial_number"
                type="text"
                label="الرقم المتسلسل"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                v-model="product.description"
                outlined
                label="وصف عن المنتج"
                auto-grow
                rows="3"
                counter="65000"
              ></v-textarea>
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
        <v-btn large color="success" @click="editProduct">
          <v-icon left>mdi-content-save</v-icon>
          <span>حفظ</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import db from "../../../db";
// import Sortable from "sortablejs/modular/sortable.complete.esm.js";

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      categories: [],
      selectedCategory: "",

      nameErrors: [],
      unitErrors: [],
    };
  },
  methods: {
    cancel() {
      this.$emit("canceled", "GUI cancel event");
    },
    async editProduct() {
     

      const name = this.product.name.trim().toLowerCase();

      this.nameErrors = [];
      this.unitErrors = [];

      if (name.length < 1 || name.length > 127) {
        this.nameErrors.push(
          "يجب ان يحتوي الاسم على حرف واحد على الاقل وان لا يزيد عن 127 حرف"
        );
        return false;
      }

      const unit = this.product.unit.trim().toLowerCase();

      if (unit.length < 1 || unit.length > 127) {
        this.unitErrors.push(
          "يجب ان تحتوي وحدة القياس على حرف واحد على الاقل وان لا تزيد عن 127 حرف"
        );
        return false;
      }

      const DB = await db.getConnection();

      const isUnique = await DB.get(
        "SELECT Count(*) < 1 as isUnique from products where name = :name and id != :id ",
        {
          ":name": name,
          ":id": this.product.id,
        }
      );

      if (isUnique.isUnique !== 1) {
        this.nameErrors.push("هناك تصنيف اسمه يطابق نفس اسم التصنيف الجديد");
        return false;
      }

      let category;

      for (let i = 0; i < this.categories.length; i++) {
        if (this.categories[i].name === this.selectedCategory) {
          this.product.category_id = this.categories[i].id;
          category = this.categories[i];
          break;
        }
      }

      const sql = `
        UPDATE products SET 
          name = :name,
          description = :description,
          category_id = :category,
          unit_price =:price,
          unit = :unit,
          serial_number = :serial_number
        WHERE id = :id
      `;

      const data = {
        ":id": this.product.id,
        ":name": this.product.name,
        ":description": this.product.description.trim().toLowerCase(),
        ":category": this.product.category_id,
        ":price": this.product.unit_price,
        ":unit": unit,
        ":serial_number": this.product.serial_number,
      };
      await DB.run(sql, data);

      const newProduct = {
        product: this.product,
        category: category,
      };

      this.$emit("updated", newProduct);
    },
    async loadCatogories() {
      const DB = await db.getConnection();
      this.categories = await DB.all("SELECT * FROM categories");
    },
  },
  computed: {
    categoriesNames() {
      let names = [];
      for (let i = 0; i < this.categories.length; i++) {
        names.push(this.categories[i].name);
      }
      return names;
    },
  },
  async created() {
    await this.loadCatogories();
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].id == this.product.category_id) {
        this.selectedCategory = this.categories[i].name;
        break;
      }
    }
  },
};
</script>

<style scoped>
</style>