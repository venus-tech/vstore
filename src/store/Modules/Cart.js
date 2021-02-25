export default {
	namespaced: true,
	state: ()=>({
		orderType: null,
		employee: null,
		agency: null,
		agentName: '',
		products: [],
		discount: 0.0,
		notes: '',
		currentStep: 1
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
		discount(state){
			return state.discount;
		},
		notes(state){
			return state.notes;
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
		resetCart(state){
			state.orderType = null,
			state.employee = null,
			state.agency = null,
			state.agentName = '',
			state.products = [],
			state.discount = 0.0,
			state.notes = '',
			state.currentStep = 1
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