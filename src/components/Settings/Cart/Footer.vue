<template>
  <div>
    <v-card-actions>
      <p class="headline text-center">هذا النص سيظهر في نهاية اي فاتورة</p>
      <v-spacer></v-spacer>
      <v-btn
        large
        color="success"
        class="my-4"
        @click="edit = true"
        v-if="!edit"
      >
        <v-icon left>mdi-pencil</v-icon>
        <span>تعديل</span>
      </v-btn>

      <div v-else>
        <v-btn
          large
          color="red"
          text
          class="my-4"
          @click="
            edit = false;
            cancelEdit();
          "
        >
          <v-icon left>mdi-cancel</v-icon>
          <span>الغاء</span>
        </v-btn>
        <v-btn
          large
          color="success"
          class="my-4"
          @click="
            edit = false;
            saveContent();
          "
        >
          <v-icon left>mdi-content-save</v-icon>
          <span>حفظ</span>
        </v-btn>
      </div>
    </v-card-actions>

    <v-card outlined >
      <vue-editor v-model="footer" v-if="edit"></vue-editor>
      <div v-else class="ql-container ql-snow  pt-4" style="border: none">
        <div class="ql-editor" v-html="footer"></div>
      </div>
    </v-card>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";

export default {
  components: { VueEditor },
  data() {
    return {
      footer: "",
      edit: false,
    };
  },
  created() {
    this.loadFooter();
  },
  methods: {
    loadFooter() {
      if (!window.localStorage.getItem("CartFooter")) {
        const cartFooter = "";
        window.localStorage.setItem("CartFooter", cartFooter);
        this.footer = cartFooter;
        return false;
      }
      this.footer = window.localStorage.getItem("CartFooter");
    },
    cancelEdit() {
      this.footer = window.localStorage.getItem("CartFooter");
    },
    saveContent() {
      window.localStorage.setItem("CartFooter", this.footer);
    },
  },
  mounted() {
    this.$refs["vue-editor-quill"].quill.format("direction", "rtl");
    this.$refs["vue-editor-quill"].quill.format("align", "right");
  },
};
</script>

<style></style>
