export interface ItemDto {
    id: string;
    photoUrl: string;
    model: string;
    price: number;
    manufacturer: string;
    itemType: string;
    country: string;
    createdAt: string;
    updatedAt: string | null;
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
    createdAt: string;
    updatedAt: string | null;
}

export interface ManufacturerDto {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string | null;
}

export interface CountryDto {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string | null;
}
