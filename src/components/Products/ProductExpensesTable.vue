<template>
  <v-card flat>
    <v-card-title>
      <v-row>
        <v-col md="6">
          <strong> هيكل التكاليف </strong>
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
        :items="product.costs_table"
        class="elevation-1"
        :search="search"
      >
        
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
      {text: 'الوصف', value: 'description', align: 'right'},
      {text: 'القيمة', value: 'value', align: 'left'},
    ]
  }),
};
</script>

<style>
</style>