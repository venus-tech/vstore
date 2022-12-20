<template>
  <div class="print-zone pa-4">
    <v-card flat class="print-page-options">
      <v-card-title>
        <v-btn color="info" x-large rounded @click="print">
          <v-icon left>mdi-printer</v-icon>
          <span>طباعة</span>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon color="primary" @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-card-title>
    </v-card>
    <div class="pa-4">
      <div class="ql-container ql-snow my-6 pa-4" style="border: none">
        <div class="ql-editor" v-html="cartHeader"></div>
      </div>

      <table
        width="100%"
        cellpadding="10"
        cellspacing="0"
        style="border: 1px solid #AAA;border-radius: 7px"
      >
        <tr>
          <td class="pa-5">
            <h2>فاتورة </h2>
          </td>
          <td class="text-left pa-5">{{ new Date().toLocaleString() }}</td>
        </tr>
      </table>

      <div class="my-4"></div>

      <v-row class="ma-1">
        <v-col>
          <h2>حررت لصالح</h2>
          <p></p>
          <p>الشركة: {{ $store.getters["Cart/agency"].name }}</p>
          <p v-if="$store.getters['Cart/agentName'].trim() != ''">
            اسم العميل: {{ $store.getters["Cart/agentName"] }}
          </p>
          <p>العنوان: {{ $store.getters["Cart/agency"].address }}</p>
          <p>
            {{
              $store.getters["Cart/agency"].phone_numbers.join(" , ")
            }}
          </p>
        </v-col>

        <v-col class="text-left">
          <h2>المحرر</h2>
          <p></p>
          <p>الشركة: {{ CompanyInformations.name }}</p>
          <p></p>
          <p>العنوان: {{ CompanyInformations.locations.join(" , ") }}</p>
          <p>{{ CompanyInformations.phone_numbers.join(" , ") }}</p>
        </v-col>
      </v-row>

      <div class="my-4"></div>

      <div class="ma-1">
        <h2>المنتجات</h2>
        <p></p>
        <table width="100%" border="1" cellpadding="3" cellspacing="0">
          <thead>
            <th width="50px" class="py-1">#</th>
            <th>اسم المنتج</th>
            <th width="120px">سعر الوحدة</th>
            <th width="120px">الكمية</th>
            <th width="120px">الضرائب</th>
            <th width="150px">السعر الكلي</th>
          </thead>
          <tbody>
            <tr
              v-for="(product, index) of $store.getters['Cart/products']"
              :key="product.id"
            >
              <td class="text-center">{{ index + 1 }}</td>
              <td class="pa-1 px-3">{{ product.name }}</td>
              <td class="text-center pa-1 font-weight-bold">
                {{ product.price }}
              </td>
              <td class="text-center pa-1">{{ product.quantity }}</td>
              <td class="text-center pa-1">
                {{ getUnitTotalTaxes(product.taxs_table, product.price) }}
              </td>
              <td class="text-center pa-1 font-weight-black">
                {{
                  Number(product.quantity) * Number(product.price) +
                    Number(getUnitTotalTaxes(product.taxs_table, product.price))
                }}
              </td>
            </tr>
            <tr>
              <td class="text-center pa-1 font-weight-black" colspan="2">المجموع</td>
              <td class="text-center pa-1 font-weight-bold">
                {{ total }}
              </td>
              <td class="text-center pa-1 font-weight-bold">
                {{ productsCount }}
              </td>
              <td class="text-center pa-1 font-weight-bold">
                {{ totalTaxes }}
              </td>
              <td class="text-center pa-1 font-weight-bold">
                {{ total + totalTaxes }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="my-4"></div>

      <v-row>
        <v-col class="pl-1">
          <h2>الضرائب</h2>
          <p></p>
          <table border="1" cellspacing="0" width="100%">
            <thead>
              <th width="30px" class="py-1">#</th>
              <th width="80px">القيمة</th>
              <th>البيان</th>
              <th width="80px">المبلغ</th>
            </thead>
            <tbody>
              <tr
                v-for="(tax, index) of $store.getters['Cart/taxes']"
                :key="index"
              >
                <td class="text-center pa-1">{{ index + 1 }}</td>
                <td class="text-center pa-1 font-weight-bold">
                  {{ tax.value }}
                  <v-icon
                    v-text="
                      tax.type == 'percent' ? 'mdi-percent' : 'mdi-currency-gbp'
                    "
                  ></v-icon>
                </td>
                <td class="pa-1">{{ tax.description }}</td>
                <td class="text-center pa-1 font-weight-bold">
                  {{ calcTax(tax) }}
                </td>
              </tr>
              <tr>
                <td colspan="3" class="text-center pa-1 font-weight-bold">
                  المجموع
                </td>
                <td class="text-center pa-1 font-weight-bold">
                  {{ totalGenralTaxes }}
                </td>
              </tr>
            </tbody>
          </table>
        </v-col>
        <v-col class="pr-2">
          <h2 class="text-left">الخصومات</h2>
          <p></p>
          <table border="1" cellspacing="0" width="100%">
            <thead>
              <th width="30px" class="py-1">#</th>
              <th width="80px">القيمة</th>
              <th>البيان</th>
              <th width="80px">المبلغ</th>
            </thead>
            <tbody>
              <tr
                v-for="(discount, index) of $store.getters['Cart/discounts']"
                :key="index"
              >
                <td class="text-center pa-1">{{ index + 1 }}</td>
                <td class="text-center pa-1 font-weight-bold">
                  {{ discount.value }}
                  <v-icon
                    v-text="
                      discount.type == 'percent'
                        ? 'mdi-percent'
                        : 'mdi-currency-gbp'
                    "
                  ></v-icon>
                </td>
                <td class="pa-1">{{ discount.name }}</td>
                <td class="text-center pa-1 font-weight-bold">
                  {{ calcDiscount(discount) }}
                </td>
              </tr>
              <tr>
                <td colspan="3" class="text-center pa-1 font-weight-bold">
                  المجموع
                </td>
                <td class="text-center pa-1 font-weight-bold">
                  {{ totalGenralDiscounts }}
                </td>
              </tr>
            </tbody>
          </table>
        </v-col>
      </v-row>

      <div class="my-4"></div>
      <div>
        <h2>الملخص المالي</h2>
        <p></p>
        <table border="1" cellspacing="0" width="100%">
          <thead>
            <th class="py-1">سعر المنتجات</th>
            <th>مجموع الضرائب </th>
            <th>مجموع الخصومات </th>
            <th>المبلغ المطلوب </th>
          </thead>
          <tbody>
            <tr>
              <td class="pa-2 text-center font-weight-black">{{total}}</td>
              <td class="pa-2 text-center font-weight-black">{{totalGenralTaxes + totalTaxes}}</td>
              <td class="pa-2 text-center font-weight-black">{{totalGenralDiscounts}}</td>
              <td class="pa-2 text-center font-weight-black">{{amount}}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr class="my-10" />
      <div class="ql-container ql-snow my-6 pa-4" style="border: none">
        <div class="ql-editor" v-html="cartFooter"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    CompanyInformations: {},
    cartHeader: "",
    cartFooter: "",
  }),
  created() {
    this.CompanyInformations = JSON.parse(
      window.localStorage.getItem("companyInformations")
    );
    this.cartHeader = window.localStorage.getItem("CartHeader");
    this.cartFooter = window.localStorage.getItem("CartFooter");
  },
  methods: {
    goBack() {
      window.history.back();
    },
    print() {
      window.print();
    },
    getUnitTotalTaxes(taxs_table, unit_price) {
      taxs_table = JSON.parse(taxs_table);
      let sum = 0;
      let amount = 0;
      for (let item of taxs_table) {
        amount = Number(item.value);
        if (item.type == "percent") {
          amount = amount / 100;
          amount = amount * Number(unit_price);
        }
        sum += amount;
      }
      return sum;
    },
    calcTax(tax) {
      let amount = Number(tax.value);
      if (tax.type == "percent") {
        amount = amount / 100;
        amount = amount * this.total;
      }
      return amount;
    },
    calcDiscount(discount) {
      let amount = Number(discount.value);
      if (discount.type == "percent") {
        amount = amount / 100;
        amount = amount * this.total;
      }
      return amount;
    },
  },
  computed: {
    productsCount(){
      let sum = 0;
      for(let product of this.$store.getters['Cart/products']){
        sum += Number(product.quantity);
      }
      return sum;
    },
    total() {
      let sum = 0;
      if (this.$store.getters["Cart/orderType"] == "تصدير") {
        for (let i = 0; i < this.$store.getters["Cart/products"].length; i++) {
          sum +=
            Number(this.$store.getters["Cart/products"][i].price) *
            Number(this.$store.getters["Cart/products"][i].quantity);
        }
      }
      if (this.$store.getters["Cart/orderType"] == "توريد") {
        for (let i = 0; i < this.$store.getters["Cart/products"].length; i++) {
          sum +=
            Number(this.$store.getters["Cart/products"][i].buy_price) *
            Number(this.$store.getters["Cart/products"][i].quantity);
        }
      }
      return sum;
    },
    totalGenralTaxes() {
      let sum = 0;
      let amount = 0;
      for (let item of this.$store.getters["Cart/taxes"]) {
        amount = Number(item.value);
        if (item.type == "percent") {
          amount = amount / 100;
          amount = amount * this.total;
        }
        sum += amount;
      }
      return sum;
    },
    totalGenralDiscounts() {
      let sum = 0;
      let amount = 0;
      for (let item of this.$store.getters["Cart/discounts"]) {
        amount = Number(item.value);
        if (item.type == "percent") {
          amount = amount / 100;
          amount = amount * this.total;
        }
        sum += amount;
      }
      return sum;
    },
    amount() {
      return (
        this.total +
        this.totalTaxes +
        this.totalGenralTaxes -
        this.totalGenralDiscounts
      );
    },
    totalTaxes() {
      let total = 0;
      const products = this.$store.getters["Cart/products"];
      let taxs_table = [];
      let sum = 0;
      let amount = 0;
      let unit_price = 0;
      let quantity = 0;
      for (let product of products) {
        taxs_table = JSON.parse(product.taxs_table);
        unit_price = product.price;
        quantity = Number(product.quantity);
        sum = 0;
        amount = 0;
        for (let item of taxs_table) {
          amount = Number(item.value);
          if (item.type == "percent") {
            amount = amount / 100;
            amount = amount * Number(unit_price);
          }
          sum += amount * quantity;
        }
        total += sum;
      }

      return total;
    },
  },
};
</script>

<style>
@media print {
  .print-page-options {
    display: none;
  }
}
.print-zone {
  background-color: white !important;
}
</style>
