<template>
  <v-card flat>
    <v-card-title> إعدادات النظام </v-card-title>
    <v-card-text>
      <v-card outlined>
        <v-card-title>
          مجلد البيانات
          <pre class="mx-2">{{ dataPath }}</pre>
          <v-spacer></v-spacer>

          <v-btn color="success" @click="selectDirectory">
            <v-icon left>mdi-pencil</v-icon>
            <span>تعديل</span>
          </v-btn>
        </v-card-title>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
const electron = require('electron')

export default {
  data() {
    return {
      dataPath: "c:/fake",
    };
  },
  methods: {
    async selectDirectory() {
      const result = await electron.remote.dialog.showOpenDialog(null, {
        properties: ["openDirectory"],
      });
      console.log("directories selected", result.filePaths);
      this.dataPath = result.filePaths[0]
    },
  },
};
</script>

<style>
</style>