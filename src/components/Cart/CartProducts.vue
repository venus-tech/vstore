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
            <v-text-field
                class="d-inline-block my-2 mx-2"
                style="width: 150px"
                :ref="item.id+'#textfield'"
                v-model="item.quantity"
                type="number"
                step="1"
                outlined
                :suffix="item.unit"
                :min="0.1"
                :max="Number(item.in_store_quantity)"
            ></v-text-field>
            
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

        <template v-slot:item.taxs_table="{ item }">
            {{getUnitTotalTaxes(item.taxs_table, item.price)}}
            <v-icon>mdi-currency-gbp</v-icon>   
        </template>

         <template v-slot:item.total_taxs="{ item }">
            {{getUnitTotalTaxes(item.taxs_table, item.price)* Number(item.quantity)}}
            <v-icon>mdi-currency-gbp</v-icon>   
        </template>

        <template v-slot:item.total_price="{ item }">
            <span v-if="$store.getters['Cart/orderType'] == 'تصدير'" >
                {{
                    (Number(item.quantity) * Number(item.price)) 
                    + 
                    (getUnitTotalTaxes(item.taxs_table, item.price)* Number(item.quantity)) 
                }} جنيه
            </span>
            <span v-if="$store.getters['Cart/orderType'] == 'توريد'" >
                {{Number(item.quantity) * Number(item.buy_price)}} جنيه
            </span>
        </template>
    </v-data-table>
    
    </v-card-text>
    <!-- <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="success" x-large @click="$emit('continue', 'GUI event')" :disabled="canContinue">
            متابعة
        </v-btn>
    </v-card-actions> -->
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
                text: "المتوفر",
                value: "in_store_quantity"
            },
            {
                text: "السعر",
                value: "price"
            },
            {
                text: "الضريبة",
                align: "center",
                value: "taxs_table"
            },
            
            {
                text: "الكمية",
                align: "center",
                value: "quantity",
            },
            {
                text: "المبلغ",
                align: "centet",
                value: "id"
            },
            {
                text: "الضرائب",
                align: "centet",
                value: "total_taxs"
            },
            {
                text: "المطلوب",
                align: "left",
                value: "total_price"
            }
        ],
    }),
    methods: {
        increamentQuantity(item){
            this.$store.commit('Cart/incrementProductQuantity' , item);
        },
        decreamentQuantity(item){
            this.$store.commit('Cart/decrementProductQuantity' , item);
        },
        setQuantity(item, ref){ 
            console.log(this.$refs[ref].value, item)
        },
        getUnitTotalTaxes(taxs_table, unit_price){
            taxs_table = JSON.parse(taxs_table);
            let sum = 0;
            let amount = 0;
            for (let item of taxs_table){
            amount = Number(item.value);
            if (item.type == "percent"){
                amount = amount / 100;
                amount = amount * Number(unit_price);
            }
            sum += amount;
            }
            return sum;
        },
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