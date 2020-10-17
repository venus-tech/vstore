<template>
  <v-card flat>
    <v-card-title>
      <v-row>
        <v-col md="6">
          <span class="mx-2"></span>
          <v-btn x-large text icon color="success">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
        <v-col md="6">
          <v-text-field v-model="search" append-icon="mdi-magnify" label="فلترة الطلبيات" outlined></v-text-field>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table :headers="headers" :items="purchaces" :search="search">
        <template v-slot:item.id="{item}">
          <v-btn text router :to="`/orders/${item.id}`" color="primary">{{ item.id }}</v-btn>
        </template>
        <template v-slot:item.value="{item}">{{ item.value }} جنيه</template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      headers: [
        {
          text: "#",
          value: "id"
        },
        {
          text: "التاريخ",
          value: "date"
        },
        {
          text: "المتجر",
          value: "agent"
        },
        {
          text: "المندوب",
          value: "employee"
        },
        {
          text: "القيمة",
          value: "value",
          align: "left"
        }
      ],
      purchaces: [
        {
          id: 11,
          date: "2020-01-01 00:00:00",
          agent: "filan",
          employee: "filan",
          value: 898
        }
      ]
    };
  }
};
</script>

<style>
</style>