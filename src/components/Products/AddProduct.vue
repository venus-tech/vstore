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
        <v-icon right>mdi-plus-box</v-icon>
        <span>إضافة منتج جديد</span>
        <v-spacer></v-spacer>
        <v-btn text icon color="error" larg @click="cancel">
          <v-icon>mdi-close</v-icon>
        </v-btn>
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
                        v-model="name"
                        :error-messages="nameErrors"
                      ></v-text-field>
                    </v-col>
                   <v-col>
                      <v-text-field
                        v-model="serialNumber"
                        step="1"
                        label="الرقم المتسلسل"
                        outlined
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                     <v-col>
                      <v-text-field
                        counter="127"
                        label="وحدة القياس"
                        outlined
                        v-model="unit"
                        :error-messages="unitErrors"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="price"
                        type="number"
                        :min="0"
                        step="0.01"
                        suffix=" جنيه  "
                        label="سعر بيع الوحدة"
                        outlined
                      ></v-text-field>
                    </v-col>
                    
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-textarea
                        v-model="description"
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
                          المجموع  {{buy_price}}
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text>
                          <v-data-table
                            :headers="expensesTableHeaders"
                            :items="expensesTableItems"
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
                            :items="specsTableItems"
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
                            :items="taxsTableItems"
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
                                @click:append="item.type == 'percent'? item.type = 'value' : item.type = 'percent' "
                                :append-icon="item.type == 'percent'? 'mdi-percent' :'mdi-currency-gbp' "
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
        <v-btn v-if="step > 1" color="primary" large @click="step--">
          <v-icon left>mdi-arrow-right</v-icon>
          <span>السابق</span>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn large text color="red" @click="cancel">
          <v-icon left>mdi-cancel</v-icon>
          <span>إلغاء</span>
        </v-btn>
        <v-btn v-if="step < 4" color="primary" large @click="step++">
          <span>التالي</span>
          <v-icon right>mdi-arrow-left</v-icon>
        </v-btn>
        <v-btn v-else large color="success" @click="addProduct">
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
    category: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      step: 1,
      name: "",
      unit: "",
      description: "",
      price: 0.0,
      serialNumber: '',
      nameErrors: [],
      unitErrors: [],
      itemKeys: new WeakMap(),
      currentItemKey: 0,
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
      specsTableItems: [{ name: "", value: "" }],
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
      expensesTableItems: [{ value: 0.0, description: "سعر الشراء" }],
      taxsTableItems: [{ value: 0.0, description: "", type: "percent" }],
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
      for (let i in this.expensesTableItems) {
        if (
          Number(this.expensesTableItems[i].value) == 0.0 &&
          this.expensesTableItems[i].description.trim() == ""
        ) {
          this.expensesTableItems.splice(i, 1);
        }
      }
    },
    sanitizeSpecsTable() {
      for (let i in this.specsTableItems) {
        if (
          this.specsTableItems[i].value.trim() == "" &&
          this.specsTableItems[i].name.trim() == ""
        ) {
          this.specsTableItems.splice(i, 1);
        }
      }
    },
    sanitizeTaxsTable() {
      for (let i in this.taxsTableItems) {
        if (
          Number(this.taxsTableItems[i].value) == 0.0 &&
          this.taxsTableItems[i].description.trim() == ""
        ) {
          this.taxsTableItems.splice(i, 1);
        }
      }
    },
    dragReorder({ oldIndex, newIndex }) {
      const movedItem = this.items.splice(oldIndex, 1)[0];
      this.items.splice(newIndex, 0, movedItem);
    },
    itemKey(item) {
      if (!this.itemKeys.has(item))
        this.itemKeys.set(item, ++this.currentItemKey);
      return this.itemKeys.get(item);
    },
    removeSpecsTableItem(item) {
      this.specsTableItems.splice(this.specsTableItems.indexOf(item), 1);
    },
    appendSpecsTableItem() {
      this.specsTableItems.push({ name: "", value: "" });
    },
    removeExpensesTableItem(item) {
      this.expensesTableItems.splice(this.expensesTableItems.indexOf(item), 1);
    },
    appendExpensesTableItem() {
      this.expensesTableItems.push({ value: "", description: "" });
    },
    removeTaxsTableItem(item) {
      this.taxsTableItems.splice(this.taxsTableItems.indexOf(item), 1);
    },
    appendTaxsTableItem() {
      this.taxsTableItems.push({ value: "", description: "", type: "percent" });
    },
    cancel() {
      this.$emit("canceled", "GUI cancel event");
    },
    async addProduct() {
      
      this.sanitizeExpensesTable();
      this.sanitizeSpecsTable();
      this.sanitizeTaxsTable();
      

      
      const name = this.name.trim().toLowerCase();
      this.nameErrors = [];
      this.unitErrors = [];

      if (name.length < 1 || name.length > 127) {
        this.step = 1;
        this.nameErrors.push(
          "يجب ان يحتوي الاسم على حرف واحد على الاقل وان لا يزيد عن 127 حرف"
        );
        return false;
      }

      const unit = this.unit.trim().toLowerCase();
      if (unit.length < 1 || unit.length > 127) {
        this.step = 1;
        this.unitErrors.push(
          "يجب ان تحتوي وحدة القياس على حرف واحد على الاقل وان لا تزيد عن 127 حرف"
        );
        return false;
      }

      const DB = await db.getConnection();

      const isUnique = await DB.get(
        "SELECT Count(*) < 1 as isUnique from products where name = :name ",
        {
          ":name": name,
        }
      );

      if (isUnique.isUnique !== 1) {
        this.nameErrors.push("هناك تصنيف اسمه يطابق نفس اسم التصنيف الجديد");
        return false;
      }

      const sql = `
        INSERT INTO products (
          'name', 'description', 'category_id', 
          'unit_price', 'unit', 'buy_price',
          'serial_number', 'specs_table', 'taxs_table', 'costs_table'
        )
        VALUES (
          :name, :description, :category, 
          :price, :unit, :buy_price,
          :serial_number, :specs_table, :taxs_table, :costs_table
        )
      `;
      const data = {
        ":name": name,
        ":description": this.description.trim().toLowerCase(),
        ":category": this.category,
        ":price": this.price,
        ":unit": unit,
        ":buy_price": this.buy_price,
        ":serial_number": this.serialNumber,
        ":costs_table": JSON.stringify(this.expensesTableItems),
        ":specs_table": JSON.stringify(this.specsTableItems),
        ":taxs_table": JSON.stringify(this.taxsTableItems),
      };
      const response = await DB.run(sql, data);

      const newProduct = {
        id: response.lastID,
        name: name,
        unit_price: this.price,
        buy_price: this.buy_price,
        in_store_quantity: 0,
        unit: this.unit
      };

      this.$emit("inserted", newProduct);
    },
  },
  mounted() {
    // console.log(this.$refs)
    // console.log(
    //   Sortable.create(
    //     this.$refs.sortableTable.$el.getElementsByTagName("tbody")[0],
    //     {
    //       draggable: ".sortableRow",
    //       handle: ".sortHandle",
    //       onEnd: this.dragReorder,
    //     }
    //   )
    // );
  },
  computed: {
    buy_price(){
      let sum = 0 ;
      for(let item of this.expensesTableItems){
        sum += Number(item.value) ;
      }
      return sum ;
    }
  }
};
</script>

<style scoped>
</style>