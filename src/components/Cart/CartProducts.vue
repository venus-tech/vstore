<template>
  <v-card flat>
    <v-card-title>
    <v-row>
       <v-col md="4">
          <v-btn x-large color="primary" @click="$emit('addproduct' , 'ui event')">
            <v-icon left>mdi-plus</v-icon>
            <span>إضافة منتجات</span>
          </v-btn>
        </v-col>
        <v-col md="8">
        <v-text-field v-model="search" append-icon="mdi-magnify" label="فلترة المنتجات" outlined></v-text-field>
        </v-col>
    </v-row>
    </v-card-title>

    <v-card-text>
    <v-data-table elevation-4 :headers="headers" :items="$store.getters['Cart/products']" :search="search">
        <template v-slot:item.name="{ item }">
        <v-btn router :to="`/products/${item.id}`" text color="primary" class="my-4" >
            {{ item.name }}
        </v-btn>
        
        </template>

        <template v-slot:item.price="{ item }">
            <strong v-if="$store.getters['Cart/orderType'] == 'تصدير'" class="green--text">{{ item.price }}ج</strong>
            <strong v-if="$store.getters['Cart/orderType'] == 'توريد'" class="green--text">{{ item.buy_price }}ج</strong>
            لكل {{ item.unit }}
        </template>

        <template v-slot:item.in_store_quantity="{ item }">
            <strong :class="{'red--text' : Number(item.in_store_quantity) < 11.0}">
            {{ item.in_store_quantity }} {{ item.unit }}
            </strong>
        </template>

        <template v-slot:item.quantity="{item}">
            <v-btn icon color="error" outlined @click="decreamentQuantity(item)" >
                <v-icon v-if="Number(item.quantity) > 1">mdi-minus</v-icon>
                <v-icon v-else>mdi-delete</v-icon>
            </v-btn> 
            <span class="mx-2">
                {{item.quantity}} {{ item.unit }}
            </span>
            <v-btn 
                icon 
                color="success" 
                outlined 
                :disabled="Number(item.in_store_quantity) <= Number(item.quantity) && $store.getters['Cart/orderType'] == 'تصدير'"
                @click="increamentQuantity(item)" 
            >
                <v-icon>mdi-plus</v-icon>
            </v-btn> 
        </template>
        <template v-slot:item.id="{ item }">
            <span v-if="$store.getters['Cart/orderType'] == 'تصدير'" >
                {{Number(item.quantity) * Number(item.price)}} جنيه
            </span>
            <span v-if="$store.getters['Cart/orderType'] == 'توريد'" >
                {{Number(item.quantity) * Number(item.buy_price)}} جنيه
            </span>
            
        </template>
    </v-data-table>
    
    </v-card-text>
    <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="success" x-large @click="$emit('continue', 'GUI event')" :disabled="canContinue">
            متابعة
        </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
    data:()=>({
        search: "",
        headers: [
            {
                text: "الإسم",
                value: "name"
            },
            {
                text: "السعر",
                value: "price"
            },
            {
                text: "المتوفر",
                value: "in_store_quantity"
            },
            {
                text: "الكمية",
                align: "center",
                value: "quantity",
            },
            {
                text: "المبلغ",
                align: "left",
                value: "id"
            }
        ],
    }),
    methods: {
        increamentQuantity(item){
            this.$store.commit('Cart/incrementProductQuantity' , item);
        },
        decreamentQuantity(item){
            this.$store.commit('Cart/decrementProductQuantity' , item);
        }
    },
    computed: {
        canContinue(){
            return this.$store.getters["Cart/products"].length < 1;
        }
    }
}
</script>

<style>

</style>