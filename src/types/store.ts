export type AppState = {
	shoppingCardItems: any[]
};

export type Observer = { render: () => void } & HTMLElement;

export enum Actions {
	'ADDSHOPPINGCART' = 'ADDSHOPPINGCART',
}

