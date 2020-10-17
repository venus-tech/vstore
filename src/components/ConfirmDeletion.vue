<template>
  <v-dialog
      v-model="show"
      scrollable 
      persistent
      max-width="500px"
      transition="dialog-transition"
  >
      <v-card class="pa-4">
          <v-card-title error-title>
            {{ title }}
          </v-card-title>
          <v-card-text>
              {{ text }}
          </v-card-text>
          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="cancel" large>
                  الغاء
              </v-btn>
              <v-btn color="error" @click="confirm" large>
                  <v-icon left>mdi-delete</v-icon>
                  <span>حذف</span>
              </v-btn>
          </v-card-actions>
      </v-card>
  </v-dialog>   
</template>

<script>
export default {
    props : {
        show : {
            type : Boolean ,
            default :false 
        },
        title : {
            type : String ,
            default : "Delete"
        },
         text : {
            type : String ,
            default : "Delete this item"
        }
    },
    methods : {
        cancel(){
            this.$emit("canceled" , 'Using GUI');
        },
        confirm(){
            this.$emit("confirmed" , 'Using GUI');
        },
    }
}
</script>

<style>

</style>