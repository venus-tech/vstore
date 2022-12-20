<template>
  <div>
    <v-dialog
      v-model="show"
      scrollable
      persistent
      max-width="900px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title>
          هيكل الضرائب العامة
          <v-spacer></v-spacer>
          <!-- {{ totalGenralTaxes }} <v-icon>mdi-currency-gbp</v-icon> -->
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-data-table
            :headers="taxesHeaders"
            :items="taxes"
            hide-default-footer
            rounded
          >
            <template v-slot:item.value="{ item }">
              <v-text-field
                description="description"
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
                  item.type == 'percent' ? 'mdi-percent' : 'mdi-currency-gbp'
                "
              ></v-text-field>
            </template>
            <template v-slot:item.description="{ item }">
              <v-textarea
                v-model="item.description"
                outlined
                label="البيان"
                auto-grow
                rows="1"
                counter="65000"
              ></v-textarea>
            </template>
            <template v-slot:item.remove="{ item }">
              <v-btn text icon color="error" @click="removeTaxsTableItem(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            large
            class="ma-2"
            color="primary"
            @click="appendTaxsTableItem"
          >
            <v-icon left>mdi-plus-box</v-icon>
            <span>إضافة</span>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn large text color="red" @click="$emit('close', 'UI Event')">
            <v-icon left>mdi-cancel</v-icon>
            <span>الغاء</span>
          </v-btn>

          <v-btn large outlined color="primary" @click="saveContent">
            <v-icon left>mdi-content-save</v-icon>
            <span>حفظ</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      taxes: [],
      taxesHeaders: [
        { text: "البيان", value: "description" },
        { text: "الضريبة", value: "value", align: "center" },
        { text: "حذف", value: "remove", align: "left" },
      ],
    };
  },
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
    sanitizeTaxsTable() {
      for (let i in this.taxes) {
        if (
          Number(this.taxes[i].value) == 0.0 &&
          this.taxes[i].description.trim() == ""
        ) {
          this.taxes.splice(i, 1);
        }
      }
    },
    removeTaxsTableItem(item) {
      this.taxes.splice(this.taxes.indexOf(item), 1);
    },
    appendTaxsTableItem() {
      this.sanitizeTaxsTable();
      this.taxes.push({ value: 0, description: "", type: "percent" });
    },
    saveContent() {
      this.sanitizeTaxsTable();
      window.localStorage.setItem("generalTaxes", JSON.stringify(this.taxes));
      this.$emit("close", "Content is Saved");
    },
  },
};
</script>

<style></style>
