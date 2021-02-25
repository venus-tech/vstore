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
        <span>تعديل بيانات المنتج {{ product.name }}</span>
        <v-spacer></v-spacer>
        # {{ product.id }}
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-row
          ><v-col>
            <v-stepper class="elevation-0" v-model="step">
              <v-stepper-header class="elevation-0">
                <v-stepper-step :complete="step > 1" step="1">
                  بيانات المنتج
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="step > 2" step="2">
                  هيكل التكاليف
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step step="3" :complete="step > 3">
                  جدول المواصفات
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step step="4"> هيكل الضرائب </v-stepper-step>
              </v-stepper-header>
              <v-stepper-items elevation="0">
                <v-stepper-content step="1">
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
                </v-stepper-content>
                <v-stepper-content step="2">
                  <v-row>
                    <v-col>
                      <v-card outlined>
                        <v-card-title primary-title>
                          هيكل التكاليف
                          <v-spacer></v-spacer>
                          المجموع {{ buy_price }}
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text>
                          <v-data-table
                            :headers="expensesTableHeaders"
                            :items="product.costs_table"
                            hide-default-footer
                            rounded
                          >
                            <template v-slot:item.value="{ item }">
                              <v-text-field
                                name="name"
                                label="القيمة"
                                v-model="item.value"
                                outlined
                                type="number"
                                :min="0.0"
                                :step="0.1"
                                class="ma-2"
                              ></v-text-field>
                            </template>
                            <template v-slot:item.description="{ item }">
                              <v-text-field
                                name="name"
                                label="البيان"
                                v-model="item.description"
                                outlined
                                class="my-2"
                              ></v-text-field>
                            </template>
                            <template v-slot:item.remove="{ item }">
                              <v-btn
                                text
                                icon
                                color="error"
                                @click="removeExpensesTableItem(item)"
                              >
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </template>
                          </v-data-table>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            large
                            class="ma-2"
                            color="primary"
                            @click="appendExpensesTableItem"
                          >
                            <v-icon left>mdi-plus-box</v-icon>
                            <span>إضافة</span>
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-stepper-content>
                <v-stepper-content step="3">
                  <v-row>
                    <v-col>
                      <v-card outlined>
                        <v-card-title primary-title>
                          جدول المواصفات
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text>
                          <v-data-table
                            :headers="specsTableHeaders"
                            :items="product.specs_table"
                            hide-default-footer
                            rounded
                            ref="sortableTable"
                          >
                            <template v-slot:item.name="{ item }">
                              <v-text-field
                                name="name"
                                label="الصفة"
                                v-model="item.name"
                                outlined
                                class="my-2"
                              ></v-text-field>
                            </template>
                            <template v-slot:item.value="{ item }">
                              <v-text-field
                                name="name"
                                label="القيمة"
                                v-model="item.value"
                                outlined
                                class="ma-2"
                              ></v-text-field>
                            </template>
                            <template v-slot:item.remove="{ item }">
                              <v-btn
                                text
                                icon
                                color="error"
                                @click="removeSpecsTableItem(item)"
                              >
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </template>
                          </v-data-table>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            large
                            class="ma-2"
                            color="primary"
                            @click="appendSpecsTableItem"
                          >
                            <v-icon left>mdi-plus-box</v-icon>
                            <span>إضافة صفة</span>
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-stepper-content>
                <v-stepper-content step="4">
                  <v-row>
                    <v-col>
                      <v-card outlined>
                        <v-card-title primary-title>
                          هيكل الضرائب
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text>
                          <v-data-table
                            :headers="taxsTableHeaders"
                            :items="product.taxs_table"
                            hide-default-footer
                            rounded
                          >
                            <template v-slot:item.value="{ item }">
                              <v-text-field
                                name="name"
                                label="قيمة الضريبة"
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
                                  item.type == 'percent'
                                    ? 'mdi-percent'
                                    : 'mdi-currency-gbp'
                                "
                              ></v-text-field>
                            </template>
                            <template v-slot:item.description="{ item }">
                              <v-textarea
                                v-model="item.name"
                                outlined
                                label="البيان"
                                auto-grow
                                rows="1"
                                counter="65000"
                              ></v-textarea>
                            </template>
                            <template v-slot:item.remove="{ item }">
                              <v-btn
                                text
                                icon
                                color="error"
                                @click="removeTaxsTableItem(item)"
                              >
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </template>
                          </v-data-table>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            large
                            class="ma-2"
                            color="primary"
                            @click="appendTaxsTableItem"
                          >
                            <v-icon left>mdi-plus-box</v-icon>
                            <span>إضافة</span>
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <v-btn :disabled="step == 1" color="primary" outlined large @click="step--">
          <v-icon left>mdi-arrow-right</v-icon>
          <span>السابق</span>
        </v-btn> 
        
        <v-btn :disabled="step > 3" color="primary" outlined large @click="step++">
          <span>التالي</span>
          <v-icon right>mdi-arrow-left</v-icon>
        </v-btn>
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
import db from "../../db";
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
    step: {
      type: Number,
      default: 1
    },
  },
  data() {
    return {
      categories: [],
      selectedCategory: "",
      
      nameErrors: [],
      unitErrors: [],
      specsTableHeaders: [
        // {
        //   sortable: false,
        // },

        {
          text: "الوصف",
          sortable: false,
          value: "name",
        },
        {
          text: "القيمة",
          sortable: false,
          value: "value",
        },
        {
          text: "ازالة",
          align: "left",
          sortable: false,
          value: "remove",
        },
      ],
      expensesTableHeaders: [
        {
          text: "القيمة",
          sortable: false,
          value: "value",
        },
        {
          text: "البيان",
          sortable: false,
          value: "description",
        },
        {
          text: "ازالة",
          align: "left",
          sortable: false,
          value: "remove",
        },
      ],

      taxsTableHeaders: [
        {
          text: "الضريبة",
          sortable: false,
          value: "value",
        },
        {
          text: "البيان",
          sortable: false,
          value: "description",
        },
        {
          text: "ازالة",
          align: "left",
          sortable: false,
          value: "remove",
        },
      ],
    };
  },
  methods: {
    sanitizeExpensesTable() {
      for (let i in this.product.costs_table) {
        if (
          Number(this.product.costs_table[i].value) == 0.0 &&
          this.product.costs_table[i].description.trim() == ""
        ) {
          this.product.costs_table.splice(i, 1);
        }
      }
    },
    sanitizeSpecsTable() {
      for (let i in this.product.specs_table) {
        if (
          this.product.specs_table[i].value.trim() == "" &&
          this.product.specs_table[i].name.trim() == ""
        ) {
          this.product.specs_table.splice(i, 1);
        }
      }
    },
    sanitizeTaxsTable() {
      for (let i in this.product.taxs_table) {
        if (
          Number(this.product.taxs_table[i].value) == 0.0 &&
          this.product.taxs_table[i].description.trim() == ""
        ) {
          this.product.taxs_table.splice(i, 1);
        }
      }
    },
    removeSpecsTableItem(item) {
      this.product.specs_table.splice(
        this.product.specs_table.indexOf(item),
        1
      );
    },
    appendSpecsTableItem() {
      this.product.specs_table.push({ name: "", value: "" });
    },
    removeExpensesTableItem(item) {
      this.product.costs_table.splice(
        this.product.costs_table.indexOf(item),
        1
      );
    },
    appendExpensesTableItem() {
      this.product.costs_table.push({ value: "", description: "" });
    },
    removeTaxsTableItem(item) {
      this.product.taxs_table.splice(this.product.taxs_table.indexOf(item), 1);
    },
    appendTaxsTableItem() {
      this.product.taxs_table.push({
        value: "",
        description: "",
        type: "percent",
      });
    },
    cancel() {
      this.$emit("canceled", "GUI cancel event");
    },
    async editProduct() {
      this.sanitizeExpensesTable();
      this.sanitizeSpecsTable();
      this.sanitizeTaxsTable();

      const name = this.product.name.trim().toLowerCase();

      this.nameErrors = [];
      this.unitErrors = [];

      if (name.length < 1 || name.length > 127) {
        this.step = 1;
        this.nameErrors.push(
          "يجب ان يحتوي الاسم على حرف واحد على الاقل وان لا يزيد عن 127 حرف"
        );
        return false;
      }

      const unit = this.product.unit.trim().toLowerCase();

      if (unit.length < 1 || unit.length > 127) {
        this.step = 1;
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
          buy_price =:buy_price,
          serial_number = :serial_number,
          specs_table = :specs_table,
          taxs_table = :taxs_table,
          costs_table = :costs_table
        WHERE id = :id
      `;

      const data = {
        ":id": this.product.id,
        ":name": this.product.name,
        ":description": this.product.description.trim().toLowerCase(),
        ":category": this.product.category_id,
        ":price": this.product.unit_price,
        ":unit": unit,
        ":buy_price": this.buy_price,
        ":serial_number": this.product.serial_number,
        ":costs_table": JSON.stringify(this.product.costs_table),
        ":specs_table": JSON.stringify(this.product.specs_table),
        ":taxs_table": JSON.stringify(this.product.taxs_table),
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
    buy_price() {
      let sum = 0;
      for (let item of this.product.costs_table) {
        sum += Number(item.value);
      }
      return sum;
    },
  },
  async mounted() {
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