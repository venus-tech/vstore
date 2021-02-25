<template>
  <v-card flat>
    <v-card-title>
      <v-row>
        <v-col md="6">
          <strong>
            المبيعات
          </strong>
        </v-col>
        <v-col md="6">
          <v-text-field v-model="search" append-icon="mdi-magnify" label="فلترة الطلبيات" outlined></v-text-field>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
    <v-data-table
      :headers="headers"
      :items="sells"
      class="elevation-1"
      :loading="loading"
      :search="search"
    >
      <template v-slot:item.order_id="{item}">
        <v-btn text router :to="`/orders/${item.order_id}`" color="primary">{{ item.order_id }}</v-btn>
      </template>
      <template v-slot:item.sell_quantity="{item}">
        {{item.sell_quantity}} {{item.unit}}
      </template>
      <template v-slot:item.price="{item}">
        <strong >
          {{item.price}} ج
        </strong>
      </template>
      <template v-slot:item.buy_price="{item}">
        <strong >
          {{item.buy_price}} ج
        </strong>
      </template>
      <template v-slot:item.unit="{item}">
        <strong class="green--text">
          {{Number(item.price) - Number(item.buy_price)}} ج
        </strong>
      </template>
    </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import db from '../../db'

export default {
  props: {
    id : {
      type: Number,
      required: true
    }
  },
  data(){
    return {
      search: '',
      loading: true,
      headers: [
        {
          text : 'الطلبية',
          value: 'order_id'
        },
        {
          text : 'التاريخ',
          value: 'date'
        },
        {
          text : 'الكمية',
          value: 'sell_quantity'
        },
        {
          text : 'السعر',
          value: 'price'
        },
        {
          text : 'الشراء',
          value: 'buy_price'
        },
        {
          text : 'الربح',
          align: 'left',
          value: 'unit'
        }
      ],
      sells: []
    }
  },
  async created(){
    await this.loadSells();
  },
  methods: {
    async loadSells(){
      this.loading = true;
      const DB = await db.getConnection();
      const sql = `
        SELECT
          order_product.order_id as order_id,
          order_product.quantity as sell_quantity,
          order_product.price as price,
          order_product.buy_price as buy_price,
          products.unit as unit,
          orders.date as date
        FROM order_product
        join orders
        join products
        WHERE
        orders.id = order_product.order_id
        and
        products.id = order_product.product_id
        and
        orders.type = 'تصدير'
        and
        order_product.product_id = :id
      `;

      this.sells = await DB.all(sql , {
        ":id" : this.id
      }) ;

      this.loading = false;
    }
  }
}
</script>

<style>

</style>