interface ITenant {
	uuid?: string;
	name: string;
	domain: string | null;
	logo_url?: string | null;
	email: string;
	phone: string | null;
	address: string;
	country_name?: string;
	state_name?: string;
	city_name?: string;
	country_id?: number;
	state_id?: number;
	city_id?: number;
	zip_code: string;
	registration_number: string;
	timezone: string;
	status?: number;
	billing_email?: string | null;
	metadata?: Record<string, string | number | boolean | object> | null;
	contact?: {
		firstname: string;
		lastname: string | null;
		email: string;
		phone: string;
		alternative_phone: string | null;
	};
}

export { ITenant };
