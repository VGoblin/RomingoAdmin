export interface HotelData {
  name?: string;
  location?: {
    lat: string;
    lon: string;
    address: string;
  };
  city?: {
    name: string;
    id: string;
    center: {
      latitude: number;
      longitude: number;
    };
    state: {
      id: string;
      code: string;
      name: string;
    };
  };
  mainImg?: string;
  gallery?: string[];
  sabreId?: string;
  addressLine1?: string;
  romingoScore?: number;
  neighborhood?: string;
  zipCode?: string;
  desc?: string;
  featuredImageURL?: string;
  imageURLs?: string[];
  dogAmenities?: string[];
  nearbyActivities?: string[];
  amenities?: string[];
  imageDirectoryName?: string;
  googlePlaceId?: string;
  cityId?: string;
  corporateDiscount?: boolean;
  featuredImageFilename?: string;
  imageFilenames?: string[];
  blocked?: boolean;
  listingsPagePromoText?: string;
  detailsPagePromoText?: string;
  checkoutPagePromoText?: string;
  alias?:string;
  page_rank?:number;
  allows_big_dogs?:number;
  hotelEmail?: string;
  hotelAlternativeEmail?: string;
  petFeesData: any;
}

export interface RoomData {
  name: string;
  areaInSquareFeet: number;
  featuredImageFilename: string;
  imageFilenames: Array<string>;
  sabreText?: string;
  sabreName?: string;
  hotelImageDirectoryName?: string;
  blocked: boolean;
}

export interface StateData {
  id: string;
  code: string;
  name: string;
  country?: {
    id: string;
    name: string;
  };
}

export interface CityData {
  id: string;
  code: string;
  name: string;
}
