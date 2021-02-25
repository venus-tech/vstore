<template>
  <v-card flat>
    <v-card-title>
      <v-row>
        <v-col md="6">
          <strong> هيكل الضرائب </strong>
        </v-col>
        <v-col md="6">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="فلترة الجدول"
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="product.taxs_table"
        class="elevation-1"
        :search="search"
      >
        <template v-slot:item.value="{ item }">
                {{item.value}} 
                <v-icon>{{item.type == 'percent' ? `mdi-percent` : `mdi-currency-gbp`}}</v-icon>
              </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data: ()=>({
    search: '',
    headers: [
      {text: 'البيان', value: 'name', align: 'right'},
      {text: 'القيمة', value: 'value', align: 'left'},
    ]
  }),
};
</script>

<style>
</style>