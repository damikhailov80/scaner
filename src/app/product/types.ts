export interface OpenFoodFactsProduct {
  code: string;
  product?: {
    product_name?: string;
    product_name_en?: string;
    product_name_ru?: string;
    brands?: string;
    categories?: string;
    ingredients_text?: string;
    ingredients_text_en?: string;
    ingredients_text_ru?: string;
    allergens?: string;
    image_url?: string;
    image_front_url?: string;
    image_front_small_url?: string;
    quantity?: string;
    serving_size?: string;
    
    // Nutritional information
    nutriments?: {
      energy?: number;
      'energy-kcal'?: number;
      'energy-kj'?: number;
      'energy_100g'?: number;
      'energy-kcal_100g'?: number;
      'energy-kj_100g'?: number;
      
      proteins?: number;
      proteins_100g?: number;
      proteins_unit?: string;
      
      fat?: number;
      fat_100g?: number;
      fat_unit?: string;
      'saturated-fat'?: number;
      'saturated-fat_100g'?: number;
      
      carbohydrates?: number;
      carbohydrates_100g?: number;
      carbohydrates_unit?: string;
      sugars?: number;
      sugars_100g?: number;
      
      fiber?: number;
      fiber_100g?: number;
      
      salt?: number;
      salt_100g?: number;
      sodium?: number;
      sodium_100g?: number;
    };
    
    nutriscore_grade?: string;
    ecoscore_grade?: string;
    nova_group?: number;
  };
  status: number;
  status_verbose: string;
}

