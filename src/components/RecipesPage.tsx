import React, { useState } from 'react';
import { Recipe } from '../types';

interface RecipesPageProps {
  recipes: Recipe[];
  onBack: () => void;
}

const categories = [
  { id: 'all', name: 'Все', emoji: '🍽️' },
  { id: 'soups', name: 'Супы', emoji: '🍲' },
  { id: 'salads', name: 'Салаты', emoji: '🥗' },
  { id: 'main', name: 'Основные', emoji: '🍖' },
  { id: 'porridge', name: 'Каши', emoji: '🥣' },
  { id: 'drinks', name: 'Напитки', emoji: '🥤' },
  { id: 'desserts', name: 'Десерты', emoji: '🍰' },
  { id: 'healthy', name: 'Для здоровья', emoji: '💚' },
];

export default function RecipesPage({ recipes, onBack }: RecipesPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const filteredRecipes = selectedCategory === 'all'
    ? recipes
    : recipes.filter(r => r.category === selectedCategory);

  if (selectedRecipe) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-orange-500 text-white p-4 flex items-center gap-3 shadow-md">
          <button onClick={() => setSelectedRecipe(null)} className="text-2xl p-1">←</button>
          <h1 className="text-xl font-bold truncate">{selectedRecipe.name}</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Recipe Image Placeholder */}
          <div className="bg-orange-100 rounded-xl h-48 flex items-center justify-center text-6xl">
            {selectedRecipe.image}
          </div>

          {/* Info */}
          <div className="flex gap-4 justify-center">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm text-center">
              <p className="text-2xl">⏱️</p>
              <p className="text-sm font-semibold">{selectedRecipe.time}</p>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm text-center">
              <p className="text-2xl">👥</p>
              <p className="text-sm font-semibold">{selectedRecipe.servings} порц.</p>
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-3">📝 Ингредиенты</h3>
            <ul className="space-y-2">
              {selectedRecipe.ingredients.map((ing, idx) => (
                <li key={idx} className="flex items-center gap-2 text-base">
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-3">👨‍🍳 Приготовление</h3>
            <ol className="space-y-3">
              {selectedRecipe.steps.map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-base text-gray-700 pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-orange-500 text-white p-4 flex items-center gap-3 shadow-md">
        <button onClick={onBack} className="text-2xl p-1">←</button>
        <h1 className="text-xl font-bold">Рецепты</h1>
      </div>

      {/* Categories */}
      <div className="bg-white border-b overflow-x-auto">
        <div className="flex gap-1 p-2 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-3">
          {filteredRecipes.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md active:scale-[0.98] transition-all text-left"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                {recipe.image}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base text-gray-800">{recipe.name}</h3>
                <p className="text-sm text-gray-500">
                  ⏱️ {recipe.time} • 👥 {recipe.servings} порций
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  {categories.find(c => c.id === recipe.category)?.emoji}{' '}
                  {categories.find(c => c.id === recipe.category)?.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
