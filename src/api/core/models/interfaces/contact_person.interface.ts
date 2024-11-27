interface IContact_Person {
    id?: number;
    uuid: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    alternative_phone?: string;
    tenant_id: number;
}

export { IContact_Person };
