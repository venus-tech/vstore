<template>
  <div>
    <v-card-actions>
      <p class="headline text-center">هذا النص سيظهر في مقدمة اي فاتورة</p>
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
        <v-btn large color="red" text class="my-4" @click="edit = false;cancelEdit()">
          <v-icon left>mdi-cancel</v-icon>
          <span>الغاء</span>
        </v-btn>
        <v-btn large color="success" class="my-4" @click="edit = false; saveContent()">
          <v-icon left>mdi-content-save</v-icon>
          <span>حفظ</span>
        </v-btn>
      </div>
    </v-card-actions>

    <v-card outlined>
      <vue-editor v-model="header" v-if="edit"></vue-editor>
      <div v-else class="ql-container ql-snow pt-4" style="border: none">
        <div class="ql-editor" v-html="header"></div>
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
      header: "",
      edit: false,
    };
  },
  created() {
    this.loadHeader();
  },
  methods: {
    loadHeader() {
      if (!window.localStorage.getItem("CartHeader")) {
        const cartHeader = "";
        window.localStorage.setItem("CartHeader", cartHeader);
        this.header = cartHeader;
        return false;
      }
      this.header = window.localStorage.getItem("CartHeader");
    },
    cancelEdit(){
      this.header = window.localStorage.getItem("CartHeader");
    },
    saveContent(){
      window.localStorage.setItem("CartHeader", this.header);
    }
  },
};
</script>

<style></style>
