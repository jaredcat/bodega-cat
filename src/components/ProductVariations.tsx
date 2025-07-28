import { useState } from "react";
import type { VariationConfig } from "../types/product";

/* eslint-disable sonarjs/no-nested-functions */

interface ProductVariationsProps {
  variations: VariationConfig[];
  basePrice: number;
}

export default function ProductVariations({
  variations,
  basePrice,
}: Readonly<ProductVariationsProps>) {
  const [selectedVariations, setSelectedVariations] = useState<
    Record<string, string>
  >({});
  const [totalPrice, setTotalPrice] = useState(basePrice);

  const handleVariationChange = (variationId: string, optionId: string) => {
    const newSelectedVariations = {
      ...selectedVariations,
      [variationId]: optionId,
    };
    setSelectedVariations(newSelectedVariations);

    // Calculate total price with variations
    let newTotalPrice = basePrice;
    Object.entries(newSelectedVariations).forEach(([varId, optId]) => {
      const variation = variations.find((v) => v.id === varId);
      const option = variation?.options.find((o) => o.id === optId);
      if (option) {
        newTotalPrice += option.priceModifier * 100; // Convert to cents
      }
    });
    setTotalPrice(newTotalPrice);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Product Options</h3>

      {variations.map((variation) => (
        <div key={variation.id} className="space-y-3">
          <label className="block text-sm font-medium">
            {variation.name}
            {variation.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          <div className="space-y-2">
            {variation.type === "select" && (
              <select
                className="input"
                onChange={(e) => {
                  handleVariationChange(variation.id, e.target.value);
                }}
                required={variation.required}
                aria-label={`Select ${variation.name}`}
              >
                <option value="">Select {variation.name}</option>
                {variation.options
                  .filter((option) => option.enabled)
                  .map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                      {option.priceModifier !== 0 &&
                        (option.priceModifier > 0
                          ? ` (+$${option.priceModifier.toFixed(2)})`
                          : ` (-$${Math.abs(option.priceModifier).toFixed(
                              2
                            )})`)}
                    </option>
                  ))}
              </select>
            )}

            {variation.type === "radio" && (
              <div className="space-y-2">
                {variation.options
                  .filter((option) => option.enabled)
                  .map((option) => (
                    <label key={option.id} className="flex items-center">
                      <input
                        type="radio"
                        name={`variation-${variation.id}`}
                        value={option.id}
                        onChange={() => {
                          handleVariationChange(variation.id, option.id);
                        }}
                        required={variation.required}
                        className="mr-2"
                      />
                      <span className="text-sm">
                        {option.name}
                        {option.priceModifier !== 0 &&
                          (option.priceModifier > 0
                            ? ` (+$${option.priceModifier.toFixed(2)})`
                            : ` (-$${Math.abs(option.priceModifier).toFixed(
                                2
                              )})`)}
                      </span>
                    </label>
                  ))}
              </div>
            )}

            {variation.type === "checkbox" && (
              <div className="space-y-2">
                {variation.options
                  .filter((option) => option.enabled)
                  .map((option) => (
                    <label key={option.id} className="flex items-center">
                      <input
                        type="checkbox"
                        name={`variation-${variation.id}`}
                        value={option.id}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleVariationChange(variation.id, option.id);
                          } else {
                            const filtered = Object.entries(selectedVariations).filter(
                              ([key]) => key !== variation.id
                            );
                            setSelectedVariations(Object.fromEntries(filtered));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">
                        {option.name}
                        {option.priceModifier !== 0 &&
                          (option.priceModifier > 0
                            ? ` (+$${option.priceModifier.toFixed(2)})`
                            : ` (-$${Math.abs(option.priceModifier).toFixed(
                                2
                              )})`)}
                      </span>
                    </label>
                  ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Price Display */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Total Price:</span>
          <span className="text-2xl font-bold text-primary">
            ${(totalPrice / 100).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
