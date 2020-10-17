<template>
  <v-card flat class="pa-4">
    <v-row>
      <v-col
        cols="12"
        sm="6"
      >
        <v-date-picker
         elevation="3"
          v-model="dates"
          range
          locale="ar-ae"
          full-width
        ></v-date-picker>
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <h3>
          سيتم الجرد على المنتجات في الفترة بين التارخين التاليين
        </h3>
        <hr class="ma-4">
        <h3>
          من بداية يوم : {{dates[0]}}
        </h3>
        <div class="pa-4"></div>
        <h3>
          الى نهاية يوم : {{dates[1]}}
        </h3>
        <hr class="ma-4">
        <div style="text-align: center">
          <v-btn color="info" x-large class="ma-4" @click="loadData">
            <v-icon left>mdi-calculator</v-icon>
            <span>حساب الجرد</span>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-divider class="ma-4"></v-divider>
    <v-card flat :loading="loading">
      <v-row>
        <div class="pa-4 headline">المبيعات</div>
      </v-row>
      <v-row>
        <v-col>
          <v-card flat outlined>
            <v-card-title >
              عدد الطلبيات <v-spacer></v-spacer> {{sellOrders.count}} 
            </v-card-title>
          </v-card>
        </v-col>
        <v-col>
          <v-card flat outlined>
            <v-card-title >
              مجمل البيع <v-spacer></v-spacer> {{sellOrders.total_bill}} 
            </v-card-title>
          </v-card>
        </v-col>
        <v-col>
          <v-card flat outlined>
            <v-card-title >
              مجمل التخقيض <v-spacer></v-spacer> {{sellOrders.total_discount}} 
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card flat outlined>
            <v-card-title >
              المبلغ المطلوب<v-spacer></v-spacer> {{Number(sellOrders.total_bill) - Number(sellOrders.total_discount)}} 
            </v-card-title>
          </v-card>
        </v-col>
        <v-col>
          <v-card flat outlined>
            <v-card-title >
              المبلغ المدفوع<v-spacer></v-spacer> {{sellOrders.total_payed}} 
            </v-card-title>
          </v-card>
        </v-col>
        <v-col>
          <v-card flat outlined>
            <v-card-title >
              مجمل الديون<v-spacer></v-spacer> {{Number(sellOrders.total_bill) - Number(sellOrders.total_discount) - Number(sellOrders.total_payed)}} 
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-divider class="ma-4"></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <div class="pa-4 headline">المشتريات</div>
      </v-row>
      <v-row>
        <v-col>
          <v-card flat outlined>
            <v-card-title >
              عدد الطلبيات <v-spacer></v-spacer> {{purchaceOrders.count}} 
            </v-card-title>
          </v-card>
        </v-col>
        <v-col>
          <v-card flat outlined>
            <v-card-title >
              مجمل الشراء<v-spacer></v-spacer> {{purchaceOrders.total_bill}} 
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card flat outlined>
            <v-card-title >
              مجمل التخفيض<v-spacer></v-spacer> {{purchaceOrders.total_discount}} 
            </v-card-title>
          </v-card>
        </v-col>
        <v-col>
          <v-card flat outlined>
            <v-card-title >
              مجمل المدفوع<v-spacer></v-spacer> {{Number(purchaceOrders.total_bill) - Number(purchaceOrders.total_discount)}} 
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-divider class="ma-4"></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <div class="pa-4 headline">الصرف والارباح</div>
      </v-row>
      <v-row>
        <v-col>
          <v-card flat outlined>
            <v-card-title >
              مجمل الارباح
              <v-spacer></v-spacer> 
              {{
                Number(sellOrders.total_bill)
                - Number(sellOrders.total_discount)
                - Number(purchaceOrders.total_bill)
                - Number(purchaceOrders.total_discount)
              }} 
            </v-card-title>
          </v-card>
        </v-col>
        <v-col>
          <v-card flat outlined>
            <v-card-title >
              مجمل الصرف <v-spacer></v-spacer> {{ expenses.amount }} 
            </v-card-title>
          </v-card>
        </v-col>
        <v-col>
          <v-card flat outlined>
            <v-card-title >
              صافي الارباح
              <v-spacer></v-spacer> 
              {{
                Number(sellOrders.total_bill)
                - Number(sellOrders.total_discount)
                - Number(purchaceOrders.total_bill)
                - Number(purchaceOrders.total_discount)
                - Number(expenses.amount)
              }} 
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-divider class="ma-4"></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-tabs v-model="tab" :grow="true" dark>
            <v-tabs-slider color="yellow"></v-tabs-slider>

            <v-tab href="#products" >
              <v-icon right>mdi-barcode-scan</v-icon>المنتجات
            </v-tab>

            <v-tab href="#expences">
              <v-icon right>mdi-cash-register</v-icon>المصروفات
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab"> 
            <v-tab-item value="products">
              <br>
              <v-col class="pa-4">
                <v-text-field v-model="productsSearch" append-icon="mdi-magnify" label="فلترة المنتجات" outlined></v-text-field>
              </v-col>
              <v-data-table
                :headers="productsHeader"
                :items="products"
                :search="productsSearch"
              >
                <template v-slot:item.purchaces_quantity="{item}">
                  <strong>{{ item.purchaces_quantity }} {{item.unit}}</strong>
                </template>
                <template v-slot:item.total_purchaces_price="{item}">
                  <strong>{{ item.total_purchaces_price }} جنيه</strong>
                </template>
                <template v-slot:item.salls_quantity="{item}">
                  <strong>{{ item.salls_quantity }} {{item.unit}}</strong>
                </template>
                <template v-slot:item.total_sells_price="{item}">
                  <strong>{{ item.total_sells_price }} جنيه</strong>
                </template>
                <template v-slot:item.profit="{item}">
                  <strong>{{ item.profit }} جنيه</strong>
                </template>
                <template v-slot:item.in_store_quantity="{item}">
                  <strong>{{ item.in_store_quantity }} {{item.unit}}</strong>
                </template>
              </v-data-table>
            </v-tab-item>

            <v-tab-item value="expences">
              <br>
              <v-col class="pa-4">
                <v-text-field v-model="expensesSearch" append-icon="mdi-magnify" label="فلترة المصروفات" outlined></v-text-field>
              </v-col>
              <v-data-table
                :headers="expencesHeader"
                :items="expensesData"
                :search="expensesSearch"
              >
                <template v-slot:item.amount="{item}">
                  <strong>{{ item.amount }} جنيه</strong>
                </template>
              </v-data-table>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<script>
import db from '../db';

export default {
  data: () => ({
    tab: null,
    dates: ['2020-01-01', '2020-01-01'],
    loading: false,
    sellOrders: {},
    purchaceOrders: {},
    expenses: 0,
    products: [],
    productsHeader: [
      {
        text: 'المنتج',
        value: 'name'
      },
      {
        text: 'جملة المشتريات',
        value: 'purchaces_quantity'
      },
      {
        text: 'مبلغ المشتريات',
        value: 'total_purchaces_price'
      },
      {
        text: 'جملة المبيعات',
        value: 'salls_quantity'
      },
      {
        text: 'مبلغ المبيعات',
        value: 'total_sells_price'
      },
      {
        text: 'الربح',
        value: 'profit'
      },
      {
        text: 'المتبقي',
        value: 'in_store_quantity'
      },
      
    ],
    productsSearch: '',
    expensesData: [],
    expencesHeader: [
      {
        text: '#',
        value: 'id'
      },
      {
        text: 'التاريخ',
        value: 'date'
      },
      {
        text: 'المبلغ',
        value: 'amount'
      },
      {
        text: 'الموظف',
        value: 'employee',
        align: 'left'
      }
    ],
    expensesSearch: ''
  }),
  computed: {
    
  },
  async created(){
    
  },
  methods: {
    async loadData(){
      await this.loadOrdersData();
    },
    async loadOrdersData(){
      this.loading = true;
      const DB = await db.getConnection();

      const sellOrdersSql = `
        SELECT 
          sum(total_bill) as total_bill,
          sum(discount) as total_discount,
          sum(payed) as total_payed,
          count(*) as count 
        FROM orders 
        WHERE 
          orders.type = 'تصدير'
          AND 
          orders.date BETWEEN :begin_date AND :end_date
        ;
      `;
      const dates = {
        ":begin_date": this.dates[0] + ' 00:00:00',
        ":end_date": this.dates[1] + ' 23:59:59'
      };
      this.sellOrders = await DB.get(sellOrdersSql, dates);

      const purchaceOrdersSql = `
        SELECT 
          sum(total_bill) as total_bill,
          sum(discount) as total_discount,
          count(*) as count 
        FROM orders 
        WHERE 
          orders.type = 'توريد'
          AND 
          orders.date BETWEEN :begin_date AND :end_date
        ;
      `;
      this.purchaceOrders = await DB.get(purchaceOrdersSql, dates);

      const expensesSQL = `
        SELECT
          sum(amount) as amount
        from money_transactions
        WHERE
          money_transactions.type = 'صرف'
          AND
          money_transactions.date BETWEEN :begin_date AND :end_date  
        ;
      `;
      this.expenses = await DB.get(expensesSQL, dates);

      const sellsSQL = `
        SELECT 
          product_id, 
          sum(price * order_product.quantity) as total_price,
          name,
          unit,
          sum(order_product.quantity) as quantity
        FROM order_product
        JOIN orders
        JOIN products 
        WHERE 
          order_product.product_id = products.id
          AND
          order_product.order_id = orders.id
          AND
          orders.type = 'تصدير'
          AND
          orders.date BETWEEN :begin_date AND :end_date
        GROUP BY
          order_product.product_id
        ;
      `;
      const sells = await DB.all(sellsSQL, dates);

      const purchacesSQL = `
        SELECT 
          product_id, 
          sum(price * order_product.quantity) as total_price,
          name,
          unit,
          sum(order_product.quantity) as quantity
        FROM order_product
        JOIN orders
        JOIN products 
        WHERE 
          order_product.product_id = products.id
          AND
          order_product.order_id = orders.id
          AND
          orders.type = 'توريد'
          AND
          orders.date BETWEEN :begin_date AND :end_date
        GROUP BY
          order_product.product_id
        ;
      `;
      const purchaces = await DB.all(purchacesSQL, dates);

      const productsIDsSql = `
        SELECT product_id 
        FROM order_product 
        JOIN orders 
        WHERE
          orders.id = order_product.order_id 
          AND
          orders.date BETWEEN :begin_date AND :end_date
        GROUP BY product_id
      `;

      const productsIDs = await DB.all(productsIDsSql, dates);
      

      for(let i = 0 ; i < productsIDs.length; i++){
        let tempProduct = {};
        tempProduct.name = '';
        tempProduct.unit = '';
        tempProduct.total_sells_price = 0;
        tempProduct.total_purchaces_price = 0;
        tempProduct.purchaces_quantity = 0;
        tempProduct.salls_quantity = 0;
        tempProduct.profit = 0;
        tempProduct.in_store_quantity = 0;
        
        for(let j = 0; j < sells.length; j++){
          
          if(sells[j].product_id == productsIDs[i].product_id){
            tempProduct.name = sells[j].name ;
            tempProduct.unit = sells[j].unit ;
            tempProduct.total_sells_price = sells[j].total_price;
            tempProduct.salls_quantity = sells[j].quantity;
            break;
          }
        }

        for(let k = 0; k < purchaces.length; k++){
          if(purchaces[k].product_id == productsIDs[i].product_id){
            tempProduct.name = purchaces[k].name;
            tempProduct.unit = purchaces[k].unit;
            tempProduct.total_purchaces_price = purchaces[k].total_price;
            tempProduct.purchaces_quantity = purchaces[k].quantity;
            break;
          }
        }

        tempProduct.profit = Number(tempProduct.total_sells_price) - Number(tempProduct.total_purchaces_price);
        tempProduct.in_store_quantity = Number(tempProduct.purchaces_quantity) - Number(tempProduct.salls_quantity);

        this.products.push(tempProduct);
      }

      const expencesDataSql = `
        SELECT 
          money_transactions.id as id,
          money_transactions.date as date,
          money_transactions.amount as amount,
          employees.name as employee
        FROM money_transactions
        JOIN employees
        WHERE 
          employees.id = money_transactions.employee_id
          AND
          money_transactions.type = 'صرف'
          AND
          money_transactions.date BETWEEN :begin_date AND :end_date
        ;
      `;

      this.expensesData = await DB.all(expencesDataSql, dates);

      this.loading = false;
    }
  }
}
</script>

<style>

</style>