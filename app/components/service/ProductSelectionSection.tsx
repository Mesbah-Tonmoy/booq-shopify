import { useState } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import type {
  ClearErrorFn,
  FormErrors,
  ProductData,
  ProductVariant,
  ServiceCategoryOption,
  ServiceFormData,
} from './types';

interface ProductSelectionSectionProps {
  formData?: ServiceFormData;
  serviceCategories?: ServiceCategoryOption[];
  errors?: FormErrors;
  clearError?: ClearErrorFn;
}

export function ProductSelectionSection({
  formData,
  serviceCategories = [],
  errors = {},
  clearError = () => {},
}: ProductSelectionSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(
    formData?.category || ''
  );
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(
    formData?.productData || null
  );
  const [selectedVariants, setSelectedVariants] = useState<ProductVariant[]>(
    () => {
      // Initialize from saved product data if available
      if (formData?.productData && formData?.shopifyVariantIds) {
        return (
          formData.productData.variants?.filter((v) =>
            formData.shopifyVariantIds!.includes(v.id)
          ) || []
        );
      }
      return [];
    }
  );
  const shopify = useAppBridge();

  const hasProduct = selectedProduct !== null;

  const openProductSelector = async () => {
    const selection = await shopify.resourcePicker({
      type: 'product',
      action: 'select',
      selectionIds: selectedProduct ? [{ id: selectedProduct.id }] : [],
      multiple: false,
    });

    if (selection && selection.length > 0) {
      const product = selection[0] as unknown as ProductData;
      setSelectedProduct(product);
      // Select all variants by default
      setSelectedVariants(product.variants || []);
      clearError('shopifyProductId');
    }
  };

  const handleVariantToggle = (variant: ProductVariant) => {
    setSelectedVariants((prev) => {
      const exists = prev.find((v) => v.id === variant.id);
      if (exists) {
        return prev.filter((v) => v.id !== variant.id);
      } else {
        return [...prev, variant];
      }
    });
  };

  const selectAllVariants = () => {
    if (selectedProduct) {
      setSelectedVariants(selectedProduct.variants || []);
    }
  };

  const clearAllVariants = () => {
    setSelectedVariants([]);
  };

  return (
    <s-section>
      <s-stack
        direction="inline"
        alignItems="center"
        justifyContent="space-between"
        gap="small-100"
        className="cursor-pointer"
        paddingBlockEnd={isOpen ? 'small-300' : ''}
        onClick={() => setIsOpen(!isOpen)}
      >
        <s-heading>Product Selection</s-heading>
        <s-icon type={isOpen ? 'chevron-down' : 'chevron-up'} />
      </s-stack>

      {isOpen && (
        <s-stack gap="small">
          <s-text color="subdued">
            Start by naming your service and linking the relevant products.
          </s-text>

          {/* Service Name */}
          <s-text-field
            name="name"
            error={errors?.name}
            defaultValue={formData?.name || ''}
            required
            onChange={() => clearError('name')}
          />

          {/* Category */}
          <s-select
            label="Category"
            details="Choose a category for this service"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.currentTarget.value);
              clearError('category');
            }}
          >
            <s-option value="">Select a category</s-option>
            {serviceCategories.map((category) => (
              <s-option key={category.id} value={category.name}>
                {category.name}
              </s-option>
            ))}
          </s-select>

          {/* Hidden input for category */}
          <input type="hidden" name="category" value={selectedCategory} />

          {/* Product Link */}
          <s-stack gap="small-500">
            <s-text type="strong">Product link</s-text>
            <s-text color="subdued">
              Click Browse, pick the product (or variants) you want to sell,
              then click select to confirm.
            </s-text>
          </s-stack>

          {/* Product Selection Card */}
          <s-box padding="base" border="base" borderRadius="base">
            <s-stack gap="small-100">
              <s-stack
                direction="inline"
                justifyContent="space-between"
                alignItems="center"
              >
                <s-text type="strong">Product selection</s-text>
                <s-button icon="product" onClick={openProductSelector}>
                  {hasProduct ? 'Change Product' : 'Select Product'}
                </s-button>
              </s-stack>

              {errors?.shopifyProductId && (
                <s-banner tone="critical">
                  <s-text color="critical">{errors.shopifyProductId}</s-text>
                </s-banner>
              )}

              {!hasProduct && !formData?.shopifyProductId && (
                <s-text color="subdued">
                  No Product selected. Click &quot;Select Product&quot; to
                  choose a shopify product for this service.
                </s-text>
              )}

              {!hasProduct && formData?.shopifyProductId && (
                <s-text color="subdued">
                  Product ID: {formData.shopifyProductId} (Click &quot;Change
                  Product&quot; to select a different product)
                </s-text>
              )}

              {/* Display selected product with variants */}
              {hasProduct && selectedProduct && (
                <div>
                  <s-stack
                    gap="small-300"
                    direction="inline"
                    justifyContent="space-between"
                    alignItems="center"
                    paddingBlockEnd="small"
                  >
                    <s-text type="strong">{selectedProduct.title}</s-text>
                    <s-stack
                      gap="small-300"
                      direction="inline"
                      alignItems="center"
                    >
                      <s-text type="strong">Select Variant</s-text>
                      <s-button onClick={selectAllVariants}>
                        Select all
                      </s-button>
                      <s-button onClick={clearAllVariants}>Clear all</s-button>
                    </s-stack>
                  </s-stack>

                  {/* Variant List */}
                  {selectedProduct.variants &&
                    selectedProduct.variants.length > 0 && (
                      <s-stack gap="small-300">
                        {selectedProduct.variants.map((variant) => {
                          const isSelected = selectedVariants.find(
                            (v) => v.id === variant.id
                          );
                          return (
                            <s-box
                              key={variant.id}
                              padding="small"
                              border="base"
                              borderRadius="base"
                              background="subdued"
                            >
                              <s-stack
                                direction="inline"
                                gap="small-300"
                                alignItems="center"
                              >
                                <s-checkbox
                                  label=""
                                  checked={!!isSelected}
                                  onChange={() => handleVariantToggle(variant)}
                                />

                                {variant.image && (
                                  <img
                                    src={variant.image.src}
                                    alt={variant.title}
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      objectFit: 'cover',
                                      borderRadius: '4px',
                                    }}
                                  />
                                )}
                                <div style={{ flex: 1 }}>
                                  <s-text type="strong">{variant.title}</s-text>
                                </div>
                                <s-text type="strong">${variant.price}</s-text>
                                <s-badge tone="success">Available</s-badge>
                              </s-stack>
                            </s-box>
                          );
                        })}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.5rem',
                          }}
                        >
                          <s-badge tone="success">
                            ✓ {selectedVariants.length} Variant Selected
                          </s-badge>
                          <s-text color="subdued">Bookeasy</s-text>
                        </div>
                      </s-stack>
                    )}

                  {/* Pricing Preview */}
                  {selectedVariants.length > 0 && (
                    <div
                      style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        border: '1px solid #e1e3e5',
                        borderRadius: '8px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <s-text type="strong">Pricing Preview</s-text>
                        <s-icon type="info"></s-icon>
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          gap: '1rem',
                          marginBottom: '0.75rem',
                        }}
                      >
                        <div>
                          <s-text color="subdued">Base Price</s-text>
                          <s-text type="strong">
                            ${selectedVariants[0]?.price || '0.00'}
                          </s-text>
                        </div>
                        <div>
                          <s-text color="subdued">Total Price</s-text>
                          <s-text type="strong" tone="success">
                            ${selectedVariants[0]?.price || '0.00'}
                          </s-text>
                        </div>
                        <div>
                          <s-text color="subdued">Deposit Required</s-text>
                          <s-text type="strong">
                            ${selectedVariants[0]?.price || '0.00'}
                          </s-text>
                        </div>
                      </div>
                      <s-banner tone="info">
                        <s-text>Pricing includes:, 20% deposit required</s-text>
                      </s-banner>
                    </div>
                  )}
                </div>
              )}
            </s-stack>
          </s-box>

          {/* Time Zone */}
          <s-select
            name="timezone"
            label="Time zone"
            details="The timezone for this service availability"
            defaultValue={formData?.timezone || 'Eastern time (ET)'}
          >
            <s-option value="Eastern time (ET)">Eastern time (ET)</s-option>
            <s-option value="Central time (CT)">Central time (CT)</s-option>
            <s-option value="Mountain time (MT)">Mountain time (MT)</s-option>
            <s-option value="Pacific time (PT)">Pacific time (PT)</s-option>
            <s-option value="Alaska time (AKT)">Alaska time (AKT)</s-option>
            <s-option value="Hawaii time (HT)">Hawaii time (HT)</s-option>
          </s-select>
        </s-stack>
      )}

      {/* Hidden inputs for product data */}
      <input
        type="hidden"
        name="shopifyProductId"
        value={selectedProduct?.id || ''}
      />
      <input
        type="hidden"
        name="shopifyVariantIds"
        value={JSON.stringify(selectedVariants.map((v) => v.id))}
      />
      <input
        type="hidden"
        name="productData"
        value={
          selectedProduct && selectedVariants.length > 0
            ? JSON.stringify({
                id: selectedProduct.id,
                title: selectedProduct.title,
                variants: selectedVariants.map((v) => ({
                  id: v.id,
                  title: v.title,
                  price: v.price,
                  image: v.image,
                })),
              })
            : ''
        }
      />
    </s-section>
  );
}
