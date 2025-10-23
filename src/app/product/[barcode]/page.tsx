'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { OpenFoodFactsProduct } from '../types';
import styles from './product.module.css';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const barcode = params.barcode as string;
  
  const [product, setProduct] = useState<OpenFoodFactsProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${barcode}`);
        const data: OpenFoodFactsProduct = await response.json();
        
        if (data.status === 1 && data.product) {
          setProduct(data);
        } else {
          setError('Продукт не найден в базе данных');
        }
      } catch (err) {
        setError('Ошибка при загрузке данных о продукте');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (barcode) {
      fetchProduct();
    }
  }, [barcode]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка данных о продукте...</div>
      </div>
    );
  }

  if (error || !product?.product) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Ошибка</h2>
          <p>{error}</p>
          <button onClick={() => router.push('/')} className={styles.button}>
            Вернуться к сканированию
          </button>
        </div>
      </div>
    );
  }

  const p = product.product;
  const nutrients = p.nutriments || {};
  
  // Get product name in available language
  const productName = p.product_name || p.product_name_en || p.product_name_ru || 'Без названия';
  const ingredients = p.ingredients_text || p.ingredients_text_en || p.ingredients_text_ru || 'Информация о составе отсутствует';

  return (
    <div className={styles.container}>
      <button onClick={() => router.push('/')} className={styles.backButton}>
        ← Назад к сканированию
      </button>

      <div className={styles.productCard}>
        {/* Product Image */}
        {(p.image_front_url || p.image_url) && (
          <div className={styles.imageContainer}>
            <img 
              src={p.image_front_url || p.image_url} 
              alt={productName}
              className={styles.productImage}
            />
          </div>
        )}

        {/* Product Header */}
        <div className={styles.header}>
          <h1 className={styles.productName}>{productName}</h1>
          {p.brands && <p className={styles.brand}>{p.brands}</p>}
          {p.quantity && <p className={styles.quantity}>{p.quantity}</p>}
        </div>

        {/* Barcode */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Штрих-код</h3>
          <p className={styles.barcode}>{barcode}</p>
        </div>

        {/* Scores */}
        {(p.nutriscore_grade || p.ecoscore_grade || p.nova_group) && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Оценки</h3>
            <div className={styles.scores}>
              {p.nutriscore_grade && (
                <div className={styles.score}>
                  <span className={styles.scoreLabel}>Nutri-Score:</span>
                  <span className={`${styles.scoreBadge} ${styles[`nutriscore-${p.nutriscore_grade}`]}`}>
                    {p.nutriscore_grade.toUpperCase()}
                  </span>
                </div>
              )}
              {p.ecoscore_grade && (
                <div className={styles.score}>
                  <span className={styles.scoreLabel}>Eco-Score:</span>
                  <span className={`${styles.scoreBadge} ${styles[`ecoscore-${p.ecoscore_grade}`]}`}>
                    {p.ecoscore_grade.toUpperCase()}
                  </span>
                </div>
              )}
              {p.nova_group && (
                <div className={styles.score}>
                  <span className={styles.scoreLabel}>NOVA группа:</span>
                  <span className={styles.scoreBadge}>{p.nova_group}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Nutritional Information */}
        {Object.keys(nutrients).length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Пищевая ценность (на 100г/мл)</h3>
            <div className={styles.nutritionTable}>
              {nutrients['energy-kcal_100g'] !== undefined && (
                <div className={styles.nutritionRow}>
                  <span className={styles.nutritionLabel}>Энергетическая ценность</span>
                  <span className={styles.nutritionValue}>
                    {nutrients['energy-kcal_100g'].toFixed(0)} ккал
                    {nutrients['energy-kj_100g'] && ` (${nutrients['energy-kj_100g'].toFixed(0)} кДж)`}
                  </span>
                </div>
              )}
              
              {nutrients.proteins_100g !== undefined && (
                <div className={styles.nutritionRow}>
                  <span className={styles.nutritionLabel}>Белки</span>
                  <span className={styles.nutritionValue}>{nutrients.proteins_100g.toFixed(1)} г</span>
                </div>
              )}
              
              {nutrients.fat_100g !== undefined && (
                <div className={styles.nutritionRow}>
                  <span className={styles.nutritionLabel}>Жиры</span>
                  <span className={styles.nutritionValue}>{nutrients.fat_100g.toFixed(1)} г</span>
                </div>
              )}
              
              {nutrients['saturated-fat_100g'] !== undefined && (
                <div className={`${styles.nutritionRow} ${styles.indented}`}>
                  <span className={styles.nutritionLabel}>— насыщенные жиры</span>
                  <span className={styles.nutritionValue}>{nutrients['saturated-fat_100g'].toFixed(1)} г</span>
                </div>
              )}
              
              {nutrients.carbohydrates_100g !== undefined && (
                <div className={styles.nutritionRow}>
                  <span className={styles.nutritionLabel}>Углеводы</span>
                  <span className={styles.nutritionValue}>{nutrients.carbohydrates_100g.toFixed(1)} г</span>
                </div>
              )}
              
              {nutrients.sugars_100g !== undefined && (
                <div className={`${styles.nutritionRow} ${styles.indented}`}>
                  <span className={styles.nutritionLabel}>— сахара</span>
                  <span className={styles.nutritionValue}>{nutrients.sugars_100g.toFixed(1)} г</span>
                </div>
              )}
              
              {nutrients.fiber_100g !== undefined && (
                <div className={styles.nutritionRow}>
                  <span className={styles.nutritionLabel}>Пищевые волокна</span>
                  <span className={styles.nutritionValue}>{nutrients.fiber_100g.toFixed(1)} г</span>
                </div>
              )}
              
              {nutrients.salt_100g !== undefined && (
                <div className={styles.nutritionRow}>
                  <span className={styles.nutritionLabel}>Соль</span>
                  <span className={styles.nutritionValue}>{nutrients.salt_100g.toFixed(2)} г</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ingredients */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Состав</h3>
          <p className={styles.ingredients}>{ingredients}</p>
        </div>

        {/* Allergens */}
        {p.allergens && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Аллергены</h3>
            <p className={styles.allergens}>{p.allergens}</p>
          </div>
        )}

        {/* Categories */}
        {p.categories && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Категории</h3>
            <p className={styles.categories}>{p.categories}</p>
          </div>
        )}
      </div>
    </div>
  );
}

