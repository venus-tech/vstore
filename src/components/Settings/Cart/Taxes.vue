<template>
  <div>
    <update-taxes
      :show="showUpdateTaxes"
      @close="
        showUpdateTaxes = false;
        loadTaxes();
      "
    />
    <v-row>
      <v-col cols="12" md="4">
        <v-btn large color="success" @click="showUpdateTaxes = true">
          <v-icon left>mdi-pencil</v-icon>
          <span>تعديل</span>
        </v-btn>
      </v-col>
      <v-col>
        <v-text-field
          type="search"
          placeholder="فلترة الضرائب"
          append-icon="mdi-magnify"
          v-model="search"
          outlined
        ></v-text-field>
      </v-col>
    </v-row>
    <v-data-table :headers="taxesHeaders" :items="taxes" :search="search">
      <template v-slot:item.value="{ item }">
        <span class="font-weight-black">{{ item.value }}</span>
        <v-icon
          class="mx-2"
          color="black"
          v-text="item.type == 'percent' ? 'mdi-percent' : 'mdi-currency-gbp'"
        ></v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import UpdateTaxes from "./UpdateTaxes.vue";

export default {
  components: { UpdateTaxes },
  data: () => ({
    tab: 1,
    search: "",
    taxesHeaders: [
      { text: "البيان", value: "description" },
      { text: "الضريبة", value: "value", align: "left" },
    ],
    taxes: [],
    showUpdateTaxes: false,
  }),
  created() {
    this.loadTaxes();
  },
  methods: {
    loadTaxes() {
      if (!window.localStorage.getItem("generalTaxes")) {
        const generalTaxes = [];
        window.localStorage.setItem(
          "generalTaxes",
          JSON.stringify(generalTaxes)
        );
        this.taxes = generalTaxes;
        return false;
      }

      const generalTaxes = JSON.parse(
        window.localStorage.getItem("generalTaxes")
      );
      this.taxes = generalTaxes;
    },
  },
};
</script>

<style></style>
