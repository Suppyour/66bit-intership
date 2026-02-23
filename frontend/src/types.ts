export interface ItemDto {
    id: string;
    photoUrl: string;
    model: string;
    price: number;
    manufacturer: string;
    itemType: string;
    country: string;
}

export interface CreateItemDto {
    photoUrl: string;
    model: string;
    price: number;
    itemTypeId: string;
    manufacturerId: string;
    countryId?: string | null;
    newCountryName?: string | null;
}

export interface ItemTypeDto {
    id: string;
    name: string;
    description: string;
}

export interface ManufacturerDto {
    id: string;
    name: string;
    description: string;
}

export interface CountryDto {
    id: string;
    name: string;
}
