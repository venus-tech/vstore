import db from '../../db';

export default {
	namespaced: true,
	state: ()=>({
		orderType: null,
		employee: null,
		agency: null,
		agentName: '',
		products: [],
		taxes: [],
		discounts: [],
		discount: 0,
		notes: '',
		currentStep: 1,
		isGeneralConfigurationsLoaded: false,
	}),
	getters: {
		orderType(state){
			return state.orderType ;
		},
		employee(state){
			return state.employee ;
		},
		agency(state){
			return state.agency;
		},
		agentName(state){
			return state.agentName;
		},
		products(state){
			return state.products;
		},
		currentStep(state){
			return state.currentStep
		},
		discounts(state){
			return state.discounts;
		},
		taxes(state){
			return state.taxes;
		},
		notes(state){
			return state.notes;
		},
		isGeneralConfigurationsLoaded(state){
			return state.isGeneralConfigurationsLoaded;
		},
		export(state){
			return JSON.stringify(state);
		}
	},
	mutations: {
		setCurrentStep(state, step){
			state.currentStep = step
		},
		setOrderType(state, type){
			state.orderType = type ;
		},
		setEmployee(state, employee){
			state.employee = employee ;
		},
		setAgency(state, agency){
			state.agency = agency;
		},
		setAgentName(state, name){
			state.agentName = name;
		},
		addProducts(state,product){
			state.products.push(product);
		},
		incrementProductQuantity(state, product){
			++state.products[state.products.indexOf(product)].quantity ;
		},
		decrementProductQuantity(state, product){
			const index = state.products.indexOf(product) ;
			--state.products[index].quantity ;
			if(state.products[index].quantity == 0){
				state.products.splice(index,1);
			}
		},
		setDiscount(state, discount){
			state.discount = discount;
		},
		setNotes(state, notes){
			state.notes = notes;
		},
		setTaxes(state, taxes){
			state.taxes = taxes;
		},
		setDiscounts(state, discounts){
			state.discounts = discounts;
		},
		configurationsLoaded(state, load){
			load = true;
			state.isGeneralConfigurationsLoaded = load;
		},
		async resetCart(state){
			const DB = await db.getConnection();
			const employee = await DB.get("SELECT * FROM employees WHERE id = 0");
			employee.phone_numbers = employee.phone_numbers.split(',');

			const agency = await DB.get("SELECT * FROM agencies WHERE id = 0");
		
			agency.phone_numbers = agency.phone_numbers.split(",");
			agency.discount_table = JSON.parse(agency.discount_table);

			state.orderType = '',
			state.employee = employee,
			state.agency = agency,
			state.agentName = '',
			state.products = [],
			state.taxes = [],
			state.discounts = [],
			state.notes = '',
			state.discount = 0;
			state.currentStep = 2
			state.isGeneralConfigurationsLoaded = false;
		},
		import(state, cart){
			state.orderType = cart.orderType,
			state.employee = cart.employee,
			state.agency = cart.agency,
			state.agentName = cart.agentName,
			state.products = cart.products,
			state.discount = cart.discount,
			state.notes = cart.notes,
			state.currentStep = cart.currentStep
		}
	},
	actions: {}
}