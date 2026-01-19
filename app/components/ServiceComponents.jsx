import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";

// Product Selection Component
export function ProductSelectionSection({ formData, serviceCategories = [] }) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(formData?.category || "");
  const [selectedProduct, setSelectedProduct] = useState(formData?.productData || null);
  const [selectedVariants, setSelectedVariants] = useState(() => {
    // Initialize from saved product data if available
    if (formData?.productData && formData?.shopifyVariantIds) {
      return formData.productData.variants?.filter(v =>
        formData.shopifyVariantIds.includes(v.id)
      ) || [];
    }
    return [];
  });
  const shopify = useAppBridge();

  const hasProduct = selectedProduct !== null;

  const openProductSelector = async () => {
    const selection = await shopify.resourcePicker({
      type: "product",
      action: "select",
      selectionIds: selectedProduct ? [{ id: selectedProduct.id }] : [],
      multiple: false,
    });

    if (selection && selection.length > 0) {
      const product = selection[0];
      setSelectedProduct(product);
      // Select all variants by default
      setSelectedVariants(product.variants || []);
    }
  };

  const handleVariantToggle = (variant) => {
    setSelectedVariants(prev => {
      const exists = prev.find(v => v.id === variant.id);
      if (exists) {
        return prev.filter(v => v.id !== variant.id);
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
        paddingBlockEnd={isOpen ? "small-300" : ""}
        onClick={() => setIsOpen(!isOpen)}
      >
        <s-heading>Product Selection</s-heading>
        <s-icon type={isOpen ? "chevron-down" : "chevron-up"}></s-icon>
      </s-stack>

      {isOpen && (
        <s-stack gap="small">
          <s-text color="subdued">Start by naming your service and linking the relevant products.</s-text>
          {/* Service Name */}
          <s-stack gap="small-300">
            <s-text-field
              name="name"
              label="Service name"
              defaultValue={formData?.name || ""}
              required
            />
            <s-text color="subdued">
              Enter a clear service name (e.g online Class, Car Rental)
            </s-text>
          </s-stack>

          {/* Category */}
          <s-stack gap="small-300">
            <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <s-text type="strong">Category</s-text>
              <s-select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <s-option value="">Select a category</s-option>
                {serviceCategories.map((category) => (
                  <s-option key={category.id} value={category.name}>
                    {category.name}
                  </s-option>
                ))}
              </s-select>
            </label>
            <s-text color="subdued">
              Choose a category for this service
            </s-text>
          </s-stack>

          {/* Hidden input for category */}
          <input type="hidden" name="category" value={selectedCategory} />

          {/* Product Link */}
          <s-stack gap="small-300">
            <s-text type="strong">Product link</s-text>
            <s-text color="subdued">
              Click Browse, pick the product (or variants) you want to sell, then click select to confirm.
            </s-text>
          </s-stack>

          {/* Product Selection Card */}
          <s-box padding="base" border="base" borderRadius="base">
            <s-grid gridTemplateColumns="1fr 1fr auto" justifyContent="space-between" alignItems="center" paddingBlockEnd="small">
              <s-grid-item gridColumn="span 2">
                <s-text type="strong">Product selection</s-text>
              </s-grid-item>
              <s-grid-item gridColumn="span 1">
                <s-button size="slim" icon="product" onClick={openProductSelector}>
                  {hasProduct ? 'Change Product' : 'Select Product'}
                </s-button>
              </s-grid-item>
            </s-grid>
            {!hasProduct && !formData?.shopifyProductId && (
              <s-text color="subdued">
                No Product selected. Click "Select Product" to choose a shopify product for this service.
              </s-text>
            )}
            {!hasProduct && formData?.shopifyProductId && (
              <s-text color="subdued">
                Product ID: {formData.shopifyProductId} (Click "Change Product" to select a different product)
              </s-text>
            )}

            {/* Display selected product with variants */}
            {hasProduct && selectedProduct && (
              <div>
                <s-stack gap="small-300" direction="inline" justifyContent="space-between" alignItems="center" paddingBlockEnd="small">
                  <s-text type="strong">{selectedProduct.title}</s-text>
                  <s-stack gap="small-300" direction="inline" alignItems="center">
                    <s-text type="strong">Select Variant</s-text>
                    <s-button size="slim" onClick={selectAllVariants}>Select all</s-button>
                    <s-button size="slim" onClick={clearAllVariants}>Clear all</s-button>
                  </s-stack>
                </s-stack>

                {/* Variant List */}
                {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                  <s-stack gap="small-300">
                    {selectedProduct.variants.map((variant) => {
                      const isSelected = selectedVariants.find(v => v.id === variant.id);
                      return (
                        <div
                          key={variant.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            padding: "0.75rem",
                            border: "1px solid #e1e3e5",
                            borderRadius: "8px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleVariantToggle(variant)}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleVariantToggle(variant)}
                            style={{ cursor: "pointer" }}
                          />
                          {variant.image && (
                            <img src={variant.image.src} alt={variant.title} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                          )}
                          <div style={{ flex: 1 }}>
                            <s-text type="strong">{variant.title}</s-text>
                          </div>
                          <s-text type="strong">${variant.price}</s-text>
                          <s-badge tone="success">Available</s-badge>
                        </div>
                      );
                    })}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem" }}>
                      <s-badge tone="success">✓ {selectedVariants.length} Variant Selected</s-badge>
                      <s-text color="subdued">Bookeasy</s-text>
                    </div>
                  </s-stack>
                )}

                {/* Pricing Preview */}
                {selectedVariants.length > 0 && (
                  <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #e1e3e5", borderRadius: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <s-text type="strong">Pricing Preview</s-text>
                      <s-icon type="info"></s-icon>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "0.75rem" }}>
                      <div>
                        <s-text color="subdued">Base Price</s-text>
                        <s-text type="strong">${selectedVariants[0]?.price || "0.00"}</s-text>
                      </div>
                      <div>
                        <s-text color="subdued">Total Price</s-text>
                        <s-text type="strong" tone="success">${selectedVariants[0]?.price || "0.00"}</s-text>
                      </div>
                      <div>
                        <s-text color="subdued">Deposit Required</s-text>
                        <s-text type="strong">${selectedVariants[0]?.price || "0.00"}</s-text>
                      </div>
                    </div>
                    <s-banner tone="info">
                      <s-text>Pricing includes:, 20% deposit required</s-text>
                    </s-banner>
                  </div>
                )}
              </div>
            )}
          </s-box>

          {/* Time Zone */}
          <s-stack gap="small-300">
            <s-select name="timezone" label="Time zone" defaultValue={formData?.timezone || "Eastern time (ET)"}>
              <s-option value="Eastern time (ET)">Eastern time (ET)</s-option>
              <s-option value="Central time (CT)">Central time (CT)</s-option>
              <s-option value="Mountain time (MT)">Mountain time (MT)</s-option>
              <s-option value="Pacific time (PT)">Pacific time (PT)</s-option>
              <s-option value="Alaska time (AKT)">Alaska time (AKT)</s-option>
              <s-option value="Hawaii time (HT)">Hawaii time (HT)</s-option>
            </s-select>
            <s-text color="subdued">
              The timezone for this service availability
            </s-text>
          </s-stack>
        </s-stack>
      )}

      {/* Hidden inputs for product data */}
      <input type="hidden" name="shopifyProductId" value={selectedProduct?.id || ""} />
      <input type="hidden" name="shopifyVariantIds" value={JSON.stringify(selectedVariants.map(v => v.id))} />
      <input type="hidden" name="productData" value={selectedProduct && selectedVariants.length > 0 ? JSON.stringify({
        id: selectedProduct.id,
        title: selectedProduct.title,
        variants: selectedVariants.map(v => ({
          id: v.id,
          title: v.title,
          price: v.price,
          image: v.image
        }))
      }) : ""} />
    </s-section>
  );
}

// Slot Configuration Section Wrapper
export function SlotConfigurationSection({ formData, currentServiceType }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px solid #e1e3e5",
        padding: "1rem",
        marginBottom: "1rem",
      }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          marginBottom: isOpen ? "1rem" : "0",
        }}
      >
        <s-heading>Slot Configuration</s-heading>
        <s-icon type={isOpen ? "chevron-down" : "chevron-up"}></s-icon>
      </div>

      <div style={{ display: isOpen ? "block" : "none" }}>
        <s-stack direction="block" gap="base">
          {/* Service Type */}
          <ServiceTypeSelector formData={formData} />

          {/* Bundle Booking Section */}
          <BundleBookingSection formData={formData} currentServiceType={currentServiceType} />

          {/* Render appropriate slot configuration based on service type */}
          {currentServiceType === "regular" && (
            <RegularSlotConfiguration formData={formData} />
          )}
          {currentServiceType === "full-day" && (
            <FullDaySlotConfiguration formData={formData} />
          )}
          {currentServiceType === "multi-day" && (
            <MultiDaySlotConfiguration formData={formData} />
          )}
        </s-stack>
      </div>
    </div>
  );
}

// Slot Configuration for Regular Booking
export function RegularSlotConfiguration({ formData }) {
  // Initialize with saved slots or default
  const defaultSlots = formData?.slotConfiguration?.slots || [{ start: "09:00", end: "17:00" }];
  const [slots, setSlots] = useState(defaultSlots);

  const addSlot = () => {
    setSlots([...slots, { start: "09:00", end: "17:00" }]);
  };

  const removeSlot = (index) => {
    if (slots.length > 1) {
      setSlots(slots.filter((_, i) => i !== index));
    }
  };

  const updateSlot = (index, field, value) => {
    const newSlots = [...slots];
    newSlots[index][field] = value;
    setSlots(newSlots);
  };

  return (
    <div>
      <div style={{ marginTop: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <s-text variant="heading-sm">Time Slots</s-text>
          <s-button
            size="slim"
            onClick={addSlot}
          >
            Add New Slot
          </s-button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {slots.map((slot, index) => (
            <div key={index} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "12px", color: "#6b7280" }}>
                  Start Time
                </label>
                <input
                  type="time"
                  value={slot.start}
                  onChange={(e) => updateSlot(index, 'start', e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "12px", color: "#6b7280" }}>
                  End Time
                </label>
                <input
                  type="time"
                  value={slot.end}
                  onChange={(e) => updateSlot(index, 'end', e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                />
              </div>
              {slots.length > 1 && (
                <div style={{ paddingTop: "1.25rem" }}>
                  <s-button
                    variant="plain"
                    icon="delete"
                    onClick={() => removeSlot(index)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <input type="hidden" name="slotConfiguration" value={JSON.stringify({ slots })} />
    </div>
  );
}

// Slot Configuration for Full-Day Booking
export function FullDaySlotConfiguration({ formData }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  const defaultSlots = formData?.slotConfiguration || {
    monday: [{ start: "9:00 AM", end: "9:00 AM" }],
    tuesday: [{ start: "9:00 AM", end: "9:00 AM" }],
    wednesday: [{ start: "9:00 AM", end: "9:00 AM" }],
    thursday: [{ start: "9:00 AM", end: "9:00 AM" }],
    friday: [{ start: "9:00 AM", end: "9:00 AM" }],
    saturday: [{ start: "Off", end: "Off" }],
    sunday: [{ start: "Off", end: "Off" }],
  };

  const [slots, setSlots] = useState(defaultSlots);

  const addBreak = (day) => {
    setSlots({
      ...slots,
      [day]: [...slots[day], { start: "9:00 AM", end: "8:00 AM" }],
    });
  };

  const removeBreak = (day, index) => {
    const newSlots = slots[day].filter((_, i) => i !== index);
    setSlots({
      ...slots,
      [day]: newSlots.length > 0 ? newSlots : [{ start: "9:00 AM", end: "9:00 AM" }],
    });
  };

  const updateSlot = (day, index, field, value) => {
    const newSlots = [...slots[day]];
    newSlots[index][field] = value;
    setSlots({
      ...slots,
      [day]: newSlots,
    });
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <s-text variant="body-sm" fontWeight="semibold">Set minimum & maximum no. of days a customer can book this service</s-text>
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <s-text variant="body-sm">Minimum</s-text>
            <s-text-field
              type="number"
              name="minDays"
              defaultValue={formData?.minDays || 1}
              min="1"
              style={{ width: "80px" }}
            />
            <s-text variant="body-sm">days</s-text>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <s-text variant="body-sm">Maximum</s-text>
            <s-text-field
              type="number"
              name="maxDays"
              defaultValue={formData?.maxDays || 1}
              min="1"
              style={{ width: "80px" }}
            />
            <s-text variant="body-sm">days</s-text>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <s-text variant="heading-sm">Day - Start Time - End Time - Add Break</s-text>

        <div style={{ marginTop: "1rem" }}>
          {dayKeys.map((dayKey, index) => (
            <div key={dayKey} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", marginBottom: "0.5rem" }}>
              <div style={{ width: "60px", paddingTop: "0.5rem" }}>
                <s-text variant="body-sm">{days[index]}</s-text>
              </div>

              <div style={{ flex: 1 }}>
                {slots[dayKey].map((slot, slotIndex) => (
                  <div key={slotIndex} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <s-select
                        name={`slot_${dayKey}_${slotIndex}_start`}
                        value={slot.start}
                        onChange={(e) => updateSlot(dayKey, slotIndex, 'start', e.target.value)}
                      >
                        <option value="Off">Off</option>
                        <option value="9:00 AM">9:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="1:00 PM">1:00 PM</option>
                        <option value="2:00 PM">2:00 PM</option>
                        <option value="3:00 PM">3:00 PM</option>
                        <option value="4:00 PM">4:00 PM</option>
                        <option value="5:00 PM">5:00 PM</option>
                        <option value="6:00 PM">6:00 PM</option>
                      </s-select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <s-select
                        name={`slot_${dayKey}_${slotIndex}_end`}
                        value={slot.end}
                        onChange={(e) => updateSlot(dayKey, slotIndex, 'end', e.target.value)}
                      >
                        <option value="Off">Off</option>
                        <option value="9:00 AM">9:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="1:00 PM">1:00 PM</option>
                        <option value="2:00 PM">2:00 PM</option>
                        <option value="3:00 PM">3:00 PM</option>
                        <option value="4:00 PM">4:00 PM</option>
                        <option value="5:00 PM">5:00 PM</option>
                        <option value="6:00 PM">6:00 PM</option>
                      </s-select>
                    </div>
                    {slotIndex > 0 && (
                      <s-button
                        variant="plain"
                        icon="delete"
                        onClick={() => removeBreak(dayKey, slotIndex)}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div style={{ paddingTop: "0.25rem" }}>
                <s-button
                  variant="plain"
                  size="slim"
                  onClick={() => addBreak(dayKey)}
                >
                  Add break
                </s-button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <input type="hidden" name="slotConfiguration" value={JSON.stringify(slots)} />
    </div>
  );
}

// Slot Configuration for Multi-Day Booking
export function MultiDaySlotConfiguration({ formData }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  const [allowedDays, setAllowedDays] = useState(
    formData?.allowedDays || ["monday", "tuesday", "wednesday", "thursday", "friday"]
  );

  const toggleDay = (day) => {
    if (allowedDays.includes(day)) {
      setAllowedDays(allowedDays.filter((d) => d !== day));
    } else {
      setAllowedDays([...allowedDays, day]);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <s-text variant="body-sm" fontWeight="semibold">Set minimum & maximum no. of days a customer can book this service</s-text>
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <s-text variant="body-sm">Minimum</s-text>
            <s-text-field
              type="number"
              name="minDays"
              defaultValue={formData?.minDays || 1}
              min="1"
              style={{ width: "80px" }}
            />
            <s-text variant="body-sm">days</s-text>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <s-text variant="body-sm">Maximum</s-text>
            <s-text-field
              type="number"
              name="maxDays"
              defaultValue={formData?.maxDays || 1}
              min="1"
              style={{ width: "80px" }}
            />
            <s-text variant="body-sm">days</s-text>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <s-text variant="body-sm" fontWeight="semibold">Set minimum & maximum no. of days a customer can book this service</s-text>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
          {dayKeys.map((dayKey, index) => (
            <s-button
              key={dayKey}
              variant={allowedDays.includes(dayKey) ? "primary" : "secondary"}
              size="slim"
              onClick={() => toggleDay(dayKey)}
            >
              {days[index]}
            </s-button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <s-text variant="heading-sm">Multi-Day Booking Options</s-text>
        <div style={{ marginTop: "1rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="radio"
                name="multiDayBooking"
                value="flexible"
                defaultChecked={formData?.multiDayBooking !== "consecutive"}
              />
              <div>
                <s-text variant="body-sm" fontWeight="semibold">Flexible Date Selection</s-text>
                <s-paragraph>Customer can book multiple dates, either consecutive or non-consecutive.</s-paragraph>
              </div>
            </label>
          </div>
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="radio"
                name="multiDayBooking"
                value="consecutive"
                defaultChecked={formData?.multiDayBooking === "consecutive"}
              />
              <div>
                <s-text variant="body-sm" fontWeight="semibold">Consecutive date Selection</s-text>
                <s-paragraph>Customer can book multiple days only if they are consecutive, with no gaps between dates.</s-paragraph>
              </div>
            </label>
          </div>
        </div>
      </div>

      <input type="hidden" name="allowedDays" value={JSON.stringify(allowedDays)} />
    </div>
  );
}

// Service Type Selection
export function ServiceTypeSelector({ formData }) {
  const [serviceType, setServiceType] = useState(formData?.serviceType || "regular");

  return (
    <s-form-field>
      <s-text variant="body-sm" fontWeight="semibold">Service Type</s-text>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", padding: "0.75rem", border: serviceType === "regular" ? "2px solid #005BD3" : "1px solid #e1e3e5", borderRadius: "8px", cursor: "pointer" }}>
          <input
            type="radio"
            name="serviceTypeRadio"
            value="regular"
            checked={serviceType === "regular"}
            onChange={() => setServiceType("regular")}
            style={{ marginTop: "0.25rem" }}
          />
          <div>
            <s-text variant="body-sm" fontWeight="semibold">Regular</s-text>
          </div>
        </label>

        <label style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", padding: "0.75rem", border: serviceType === "full-day" ? "2px solid #005BD3" : "1px solid #e1e3e5", borderRadius: "8px", cursor: "pointer" }}>
          <input
            type="radio"
            name="serviceTypeRadio"
            value="full-day"
            checked={serviceType === "full-day"}
            onChange={() => setServiceType("full-day")}
            style={{ marginTop: "0.25rem" }}
          />
          <div>
            <s-text variant="body-sm" fontWeight="semibold">Full- Day</s-text>
          </div>
        </label>

        <label style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", padding: "0.75rem", border: serviceType === "multi-day" ? "2px solid #005BD3" : "1px solid #e1e3e5", borderRadius: "8px", cursor: "pointer" }}>
          <input
            type="radio"
            name="serviceTypeRadio"
            value="multi-day"
            checked={serviceType === "multi-day"}
            onChange={() => setServiceType("multi-day")}
            style={{ marginTop: "0.25rem" }}
          />
          <div>
            <s-text variant="body-sm" fontWeight="semibold">Multi-Day</s-text>
          </div>
        </label>
      </div>

      <input type="hidden" name="serviceType" value={serviceType} />
    </s-form-field>
  );
}

// Bundle Booking Section
export function BundleBookingSection({ formData, currentServiceType }) {
  const bundleBooking = formData?.bundleBooking || {};
  const [bundleBookingEnabled, setBundleBookingEnabled] = useState(bundleBooking?.enabled || false);
  const [minSlots, setMinSlots] = useState(bundleBooking?.minSlots || "");
  const [maxSlots, setMaxSlots] = useState(bundleBooking?.maxSlots || "");

  // Only show if service type is regular
  if (currentServiceType !== "regular") {
    return null;
  }

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    setBundleBookingEnabled(e.target.checked);
  };

  // Create JSON object for hidden input
  const bundleBookingData = {
    enabled: bundleBookingEnabled,
    minSlots: minSlots ? parseInt(minSlots) : null,
    maxSlots: maxSlots ? parseInt(maxSlots) : null,
  };

  return (
    <s-box padding="base" border="base" borderRadius="base" style={{ marginTop: "1rem" }}>
      <s-checkbox
        checked={bundleBookingEnabled}
        onChange={handleCheckboxChange}
        onClick={(e) => e.stopPropagation()}
        label="Bundle Booking"
      />

      {bundleBookingEnabled && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
          <div>
            <s-text variant="body-sm" fontWeight="semibold" style={{ marginBottom: "0.5rem", display: "block" }}>
              Minimum slots to book
            </s-text>
            <s-text-field
              type="number"
              placeholder="Eg:1"
              suffix="Slots"
              value={minSlots}
              onChange={(e) => setMinSlots(e.target.value)}
              min="1"
            />
          </div>
          <div>
            <s-text variant="body-sm" fontWeight="semibold" style={{ marginBottom: "0.5rem", display: "block" }}>
              Maximum slots per book
            </s-text>
            <s-text-field
              type="number"
              placeholder="Eg:5"
              suffix="Slots"
              value={maxSlots}
              onChange={(e) => setMaxSlots(e.target.value)}
              min="1"
            />
          </div>
        </div>
      )}

      <input type="hidden" name="bundleBooking" value={JSON.stringify(bundleBookingData)} />
    </s-box>
  );
}

// Service List Item
export function ServiceListItem({ service, onEdit, onDelete }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1.5fr 1fr 1fr 40px",
        gap: "0.5rem",
        padding: "0.75rem 0.5rem",
        alignItems: "center",
      }}
    >
      <div>
        <s-text variant="body-sm" fontWeight="semibold">{service.name}</s-text>
        {service.category && (
          <s-text variant="body-sm" color="subdued">{service.category}</s-text>
        )}
      </div>

      <div>
        <s-text variant="body-sm">{service.timezone}</s-text>
      </div>

      <div>
        <s-text variant="body-sm">
          {service.serviceType === "regular" ? "Regular" : service.serviceType === "full-day" ? "Full-Day" : "Multi-Day"}
        </s-text>
      </div>

      <div>
        <s-text variant="body-sm">
          {service.bookingType === "general" ? "General" : "Bundle"}
        </s-text>
      </div>

      <div style={{ textAlign: "right" }}>
        <s-button-group>
          <s-button variant="plain" icon="edit" onClick={() => onEdit(service)} />
          <s-button variant="plain" icon="delete" onClick={() => onDelete(service.id)} />
        </s-button-group>
      </div>
    </div>
  );
}

// Others Tab Component (formerly Availability)
export function OthersTabContent({ formData }) {
  return (
    <s-stack direction="block" gap="large">
      {/* Minimum Advanced Noticed */}
      <MinimumAdvancedNoticed formData={formData} />

      {/* Service Visibility */}
      <ServiceVisibility formData={formData} />

      {/* Notification Email */}
      <NotificationEmail formData={formData} />

      {/* Cancel Bookings */}
      <CancelBookings formData={formData} />

      {/* Reschedule Bookings */}
      <RescheduleBookings formData={formData} />

      {/* Payment Preferences */}
      <PaymentPreferences formData={formData} />

      {/* Customer Information */}
      <CustomerInformation formData={formData} />
    </s-stack>
  );
}

// Minimum Advanced Noticed Component
function MinimumAdvancedNoticed({ formData }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <s-section>
      <s-stack
        direction="inline"
        alignItems="center"
        justifyContent="space-between"
        gap="small-100"
        className="cursor-pointer"
        paddingBlockEnd={isOpen ? "small-300" : ""}
        onClick={() => setIsOpen(!isOpen)}
      >
        <s-stack direction="inline" alignItems="center" gap="small-300">
          <s-heading>Minimum Advanced Noticed - Lead Time (optional)</s-heading>
          <s-icon type="info"></s-icon>
        </s-stack>
        <s-icon type={isOpen ? "chevron-down" : "chevron-up"}></s-icon>
      </s-stack>

      {isOpen && (
        <s-stack gap="small">
          <s-text color="subdued">
            Set how far in advance a customer must book your slot. For example, if set to 2 hours, customers can't book within 2 hours of the service time.
          </s-text>
          <s-stack direction="inline" gap="small-300" alignItems="center">
            <s-text-field
              type="number"
              name="minimumAdvancedNotice"
              defaultValue={formData?.minimumAdvancedNotice || 0}
              min="0"
              style={{ width: "200px" }}
            />
            <s-select name="minimumAdvancedNoticeUnit" defaultValue={formData?.minimumAdvancedNoticeUnit || "Minutes"}>
              <s-option value="Minutes">Minutes</s-option>
              <s-option value="Hours">Hours</s-option>
              <s-option value="Days">Days</s-option>
            </s-select>
          </s-stack>
        </s-stack>
      )}
    </s-section>
  );
}

// Service Visibility Component
function ServiceVisibility({ formData }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <s-section>
      <s-stack
        direction="inline"
        alignItems="center"
        justifyContent="space-between"
        gap="small-100"
        className="cursor-pointer"
        paddingBlockEnd={isOpen ? "small-300" : ""}
        onClick={() => setIsOpen(!isOpen)}
      >
        <s-stack direction="inline" alignItems="center" gap="small-300">
          <s-heading>Service visibility</s-heading>
          <s-icon type="info"></s-icon>
        </s-stack>
        <s-icon type={isOpen ? "chevron-down" : "chevron-up"}></s-icon>
      </s-stack>

      {isOpen && (
        <s-stack gap="small">
          <s-text color="subdued">
            Set the number of calender days visible to your customers to book your service
          </s-text>
          <s-stack direction="inline" gap="small-300" alignItems="center">
            <s-text-field
              type="number"
              name="serviceVisibilityDays"
              defaultValue={formData?.serviceVisibilityDays || 60}
              min="1"
              style={{ width: "200px" }}
            />
            <s-text>Days</s-text>
          </s-stack>
          <s-text color="subdued" variant="body-sm">
            Example: Set to 60 days = customer can only book up to 60 days in advance
          </s-text>
          <s-text color="subdued" style={{ marginTop: "1rem" }}>
            Set the maximum number of product quantities that you'll allow customers to book at a time
          </s-text>
          <s-text-field
            type="number"
            name="maxProductQuantities"
            defaultValue={formData?.maxProductQuantities || 5}
            min="1"
          />
          <s-text color="subdued" variant="body-sm">
            If set to 5, a customer can't book more than 5 quantities at once, even if more availability exists
          </s-text>
        </s-stack>
      )}
    </s-section>
  );
}

// Capacity Setup Component
export function CapacitySetup({ formData }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <s-section>
      <s-stack
        direction="inline"
        alignItems="center"
        justifyContent="space-between"
        gap="small-100"
        className="cursor-pointer"
        paddingBlockEnd={isOpen ? "small-300" : ""}
        onClick={() => setIsOpen(!isOpen)}
      >
        <s-stack direction="inline" alignItems="center" gap="small-300">
          <s-heading>Capacity Setup (Optional)</s-heading>
          <s-icon type="info"></s-icon>
        </s-stack>
        <s-icon type={isOpen ? "chevron-down" : "chevron-up"}></s-icon>
      </s-stack>

      {isOpen && (
        <s-stack gap="small">
          <s-text color="subdued">
            Set the maximum number of bookings allowed per time slot. Helps you manage your availability and avoid over bookings.
          </s-text>
          <s-stack gap="small-300">
            <s-text type="strong">Capacity</s-text>
            <s-text-field
              name="capacity"
              placeholder="Optional Eg: 5"
              defaultValue={formData?.capacity || ""}
            />
          </s-stack>
        </s-stack>
      )}
    </s-section>
  );
}

// Notification Email Component
function NotificationEmail({ formData }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <s-section>
      <s-stack
        direction="inline"
        alignItems="center"
        justifyContent="space-between"
        gap="small-100"
        className="cursor-pointer"
        paddingBlockEnd={isOpen ? "small-300" : ""}
        onClick={() => setIsOpen(!isOpen)}
      >
        <s-stack direction="inline" alignItems="center" gap="small-300">
          <s-heading>Notification Email (Optional)</s-heading>
          <s-icon type="info"></s-icon>
        </s-stack>
        <s-icon type={isOpen ? "chevron-down" : "chevron-up"}></s-icon>
      </s-stack>

      {isOpen && (
        <s-stack gap="small">
          <s-text color="subdued">
            Enter the email addresss to receive your booking notification
          </s-text>
          <s-text-field
            type="email"
            name="notificationEmail"
            placeholder="Optional Eg: storeowner@gmail.com"
            defaultValue={formData?.notificationEmail || ""}
          />
        </s-stack>
      )}
    </s-section>
  );
}

// Cancel Bookings Component
function CancelBookings({ formData }) {
  const [isOpen, setIsOpen] = useState(true);
  const cancelBooking = formData?.cancelBooking || {};
  const [allowCancel, setAllowCancel] = useState(cancelBooking?.allowed || false);
  const [cutoffTime, setCutoffTime] = useState(cancelBooking?.cutoffTime || "");
  const [cutoffUnit, setCutoffUnit] = useState(cancelBooking?.cutoffUnit || "Hours");

  // Create JSON object for hidden input
  const cancelBookingData = {
    allowed: allowCancel,
    cutoffTime: cutoffTime,
    cutoffUnit: cutoffUnit,
  };

  return (
    <s-section>
      <s-stack
        direction="inline"
        alignItems="center"
        justifyContent="space-between"
        gap="small-100"
        className="cursor-pointer"
        paddingBlockEnd={isOpen ? "small-300" : ""}
        onClick={() => setIsOpen(!isOpen)}
      >
        <s-stack direction="inline" alignItems="center" gap="small-300">
          <s-heading>Cancel Bookings (Optional)</s-heading>
          <s-icon type="info"></s-icon>
        </s-stack>
        <s-icon type={isOpen ? "chevron-down" : "chevron-up"}></s-icon>
      </s-stack>

      {isOpen && (
        <s-stack gap="small">
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={allowCancel}
              onChange={(e) => setAllowCancel(e.target.checked)}
            />
            <s-text>Allow your customers to cancel booking</s-text>
          </label>

          {allowCancel && (
            <s-stack gap="small-300">
              <s-text type="strong">Cut-off time</s-text>
              <s-stack direction="inline" gap="small-300" alignItems="center">
                <s-text-field
                  type="text"
                  placeholder="Eg: 2 H"
                  value={cutoffTime}
                  onChange={(e) => setCutoffTime(e.target.value)}
                  style={{ width: "200px" }}
                />
                <s-select value={cutoffUnit} onChange={(e) => setCutoffUnit(e.target.value)}>
                  <s-option value="Hours">Hours</s-option>
                  <s-option value="Days">Days</s-option>
                </s-select>
              </s-stack>
              <s-text color="subdued" variant="body-sm">
                Set a cut-off time limit before the appointment, after which customers can no longer cancel their appointments.
              </s-text>
            </s-stack>
          )}

          <input type="hidden" name="cancelBooking" value={JSON.stringify(cancelBookingData)} />
        </s-stack>
      )}
    </s-section>
  );
}

// Reschedule Bookings Component
function RescheduleBookings({ formData }) {
  const [isOpen, setIsOpen] = useState(true);
  const [allowReschedule, setAllowReschedule] = useState(formData?.allowReschedule || false);

  return (
    <s-section>
      <s-stack
        direction="inline"
        alignItems="center"
        justifyContent="space-between"
        gap="small-100"
        className="cursor-pointer"
        paddingBlockEnd={isOpen ? "small-300" : ""}
        onClick={() => setIsOpen(!isOpen)}
      >
        <s-stack direction="inline" alignItems="center" gap="small-300">
          <s-heading>Reschedule Bookings (Optional)</s-heading>
          <s-icon type="info"></s-icon>
        </s-stack>
        <s-icon type={isOpen ? "chevron-down" : "chevron-up"}></s-icon>
      </s-stack>

      {isOpen && (
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
          <input
            type="checkbox"
            name="allowReschedule"
            checked={allowReschedule}
            onChange={(e) => setAllowReschedule(e.target.checked)}
          />
          <s-text>Allow your customers to reschedule booking</s-text>
        </label>
      )}
    </s-section>
  );
}

// Payment Preferences Component
function PaymentPreferences({ formData }) {
  const [isOpen, setIsOpen] = useState(true);
  const paymentPrefs = formData?.paymentPreferences || {};
  const [paymentType, setPaymentType] = useState(paymentPrefs?.type || "fullPayment");
  const [fullPaymentName, setFullPaymentName] = useState(paymentPrefs?.fullPayment?.name || "Full payment");
  const [fullPaymentLabel, setFullPaymentLabel] = useState(paymentPrefs?.fullPayment?.label || "Full payment");
  const [fullPaymentDescription, setFullPaymentDescription] = useState(paymentPrefs?.fullPayment?.description || "You are required to pay the full amount upfront to confirm the booking.");
  const [bookNowPayLaterName, setBookNowPayLaterName] = useState(paymentPrefs?.bookNowPayLater?.name || "Book now, pay later");
  const [bookNowPayLaterDescription, setBookNowPayLaterDescription] = useState(paymentPrefs?.bookNowPayLater?.description || "You can complete the booking without payment. The payment will be collected later.");

  return (
    <s-section>
      <s-stack
        direction="inline"
        alignItems="center"
        justifyContent="space-between"
        gap="small-100"
        className="cursor-pointer"
        paddingBlockEnd={isOpen ? "small-300" : ""}
        onClick={() => setIsOpen(!isOpen)}
      >
        <s-stack direction="inline" alignItems="center" gap="small-300">
          <s-heading>Payment preferences</s-heading>
          <s-icon type="info"></s-icon>
        </s-stack>
        <s-icon type={isOpen ? "chevron-down" : "chevron-up"}></s-icon>
      </s-stack>

      {isOpen && (
        <s-stack gap="small">
          <s-text color="subdued">
            How would you like to handle your service payments.
          </s-text>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Full Payment Option */}
            <div
              style={{
                padding: "1rem",
                border: paymentType === "fullPayment" ? "2px solid #005BD3" : "1px solid #e1e3e5",
                borderRadius: "8px",
                backgroundColor: paymentType === "fullPayment" ? "#f6f8fa" : "white",
              }}
            >
              <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="paymentType"
                  value="fullPayment"
                  checked={paymentType === "fullPayment"}
                  onChange={() => setPaymentType("fullPayment")}
                  style={{ marginTop: "0.25rem" }}
                />
                <div style={{ flex: 1 }}>
                  <s-text type="strong">Full payment</s-text>
                  <s-text color="subdued" style={{ display: "block", marginTop: "0.25rem" }}>
                    Your customers are required to complete the payment to confirm thier Bookings
                  </s-text>
                </div>
              </label>

              {paymentType === "fullPayment" && (
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #e1e3e5" }}>
                  <s-stack gap="small-300">
                    <div>
                      <s-text variant="body-sm" fontWeight="semibold" style={{ marginBottom: "0.25rem", display: "block" }}>
                        Name
                      </s-text>
                      <s-text-field
                        value={fullPaymentName}
                        onChange={(e) => setFullPaymentName(e.target.value)}
                      />
                      <s-text color="subdued" variant="body-sm" style={{ display: "block", marginTop: "0.25rem" }}>
                        This name appears on the cart, checkout, and order pages.
                      </s-text>
                    </div>

                    <div>
                      <s-text variant="body-sm" fontWeight="semibold" style={{ marginBottom: "0.25rem", display: "block" }}>
                        Label
                      </s-text>
                      <s-text-field
                        value={fullPaymentLabel}
                        onChange={(e) => setFullPaymentLabel(e.target.value)}
                      />
                    </div>

                    <div>
                      <s-text variant="body-sm" fontWeight="semibold" style={{ marginBottom: "0.25rem", display: "block" }}>
                        Description
                      </s-text>
                      <s-text-field
                        value={fullPaymentDescription}
                        onChange={(e) => setFullPaymentDescription(e.target.value)}
                      />
                    </div>
                  </s-stack>
                </div>
              )}
            </div>

            {/* Book Now, Pay Later Option */}
            <div
              style={{
                padding: "1rem",
                border: paymentType === "bookNowPayLater" ? "2px solid #005BD3" : "1px solid #e1e3e5",
                borderRadius: "8px",
                backgroundColor: paymentType === "bookNowPayLater" ? "#f6f8fa" : "white",
              }}
            >
              <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="paymentType"
                  value="bookNowPayLater"
                  checked={paymentType === "bookNowPayLater"}
                  onChange={() => setPaymentType("bookNowPayLater")}
                  style={{ marginTop: "0.25rem" }}
                />
                <div style={{ flex: 1 }}>
                  <s-text type="strong">Book Now, Pay Later</s-text>
                  <s-text color="subdued" style={{ display: "block", marginTop: "0.25rem" }}>
                    Your customers can book without payment. suitable for in-person appointments or free services
                  </s-text>
                </div>
              </label>

              {paymentType === "bookNowPayLater" && (
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #e1e3e5" }}>
                  <s-stack gap="small-300">
                    <div>
                      <s-text variant="body-sm" fontWeight="semibold" style={{ marginBottom: "0.25rem", display: "block" }}>
                        Name
                      </s-text>
                      <s-text-field
                        value={bookNowPayLaterName}
                        onChange={(e) => setBookNowPayLaterName(e.target.value)}
                      />
                      <s-text color="subdued" variant="body-sm" style={{ display: "block", marginTop: "0.25rem" }}>
                        This name appears on the cart, checkout, and order pages.
                      </s-text>
                    </div>

                    <div>
                      <s-text variant="body-sm" fontWeight="semibold" style={{ marginBottom: "0.25rem", display: "block" }}>
                        Description
                      </s-text>
                      <s-text-field
                        value={bookNowPayLaterDescription}
                        onChange={(e) => setBookNowPayLaterDescription(e.target.value)}
                      />
                    </div>
                  </s-stack>
                </div>
              )}
            </div>
          </div>

          {/* Hidden input for payment preferences JSON */}
          <input
            type="hidden"
            name="paymentPreferences"
            value={JSON.stringify({
              type: paymentType,
              fullPayment: {
                name: fullPaymentName,
                label: fullPaymentLabel,
                description: fullPaymentDescription,
              },
              bookNowPayLater: {
                name: bookNowPayLaterName,
                description: bookNowPayLaterDescription,
              },
            })}
          />
        </s-stack>
      )}
    </s-section>
  );
}

// Customer Information Component
function CustomerInformation({ formData }) {
  const [isOpen, setIsOpen] = useState(true);
  const [fields, setFields] = useState(formData?.customerFields || [
    { id: 1, name: "firstName", label: "First name", type: "text", required: true, visible: true },
    { id: 2, name: "lastName", label: "Last name", type: "text", required: true, visible: true },
    { id: 3, name: "phone", label: "Phone No", type: "tel", required: true, visible: true },
    { id: 4, name: "email", label: "Email", type: "email", required: true, visible: true },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [modalFieldName, setModalFieldName] = useState("");
  const [modalFieldType, setModalFieldType] = useState("text");

  const fieldTypes = [
    { value: "text", label: "Text" },
    { value: "email", label: "Email" },
    { value: "tel", label: "Phone" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
    { value: "textarea", label: "Text Area" },
    { value: "select", label: "Dropdown" },
    { value: "checkbox", label: "Checkbox" },
  ];

  const toggleFieldSetting = (fieldId, setting) => {
    setFields(fields.map(field =>
      field.id === fieldId ? { ...field, [setting]: !field[setting] } : field
    ));
  };

  const handleEditField = (field) => {
    setEditingField(field);
    setModalFieldName(field.label);
    setModalFieldType(field.type);
    setShowModal(true);
  };

  const handleAddField = () => {
    setEditingField(null);
    setModalFieldName("");
    setModalFieldType("text");
    setShowModal(true);
  };

  const handleSaveField = () => {
    if (!modalFieldName.trim()) {
      return;
    }

    if (editingField) {
      // Update existing field
      setFields(fields.map(field =>
        field.id === editingField.id
          ? { ...field, label: modalFieldName, type: modalFieldType }
          : field
      ));
    } else {
      // Add new field
      const newField = {
        id: Date.now(),
        name: modalFieldName.toLowerCase().replace(/\s+/g, '_'),
        label: modalFieldName,
        type: modalFieldType,
        required: false,
        visible: true,
      };
      setFields([...fields, newField]);
    }

    setShowModal(false);
    setEditingField(null);
  };

  const handleDeleteField = (fieldId) => {
    if (confirm("Are you sure you want to delete this field?")) {
      setFields(fields.filter(field => field.id !== fieldId));
    }
  };

  const getFieldTypeLabel = (type) => {
    const fieldType = fieldTypes.find(ft => ft.value === type);
    return fieldType ? fieldType.label : type;
  };

  return (
    <s-section>
      <s-stack
        direction="inline"
        alignItems="center"
        justifyContent="space-between"
        gap="small-100"
        className="cursor-pointer"
        paddingBlockEnd={isOpen ? "small-300" : ""}
        onClick={() => setIsOpen(!isOpen)}
      >
        <s-stack direction="inline" alignItems="center" gap="small-300">
          <s-heading>Customer information</s-heading>
          <s-icon type="info"></s-icon>
        </s-stack>
        <s-icon type={isOpen ? "chevron-down" : "chevron-up"}></s-icon>
      </s-stack>

      {isOpen && (
        <s-stack gap="small">
          <s-text color="subdued">
            Collect customer information during the booking process.
          </s-text>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {fields.map((field) => (
              <div
                key={field.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem",
                  border: "1px solid #e1e3e5",
                  borderRadius: "8px",
                }}
              >
                <div>
                  <s-text type="strong">{field.label}</s-text>
                  <s-text color="subdued" variant="body-sm" style={{ display: "block", marginTop: "0.25rem" }}>
                    {getFieldTypeLabel(field.type)}
                  </s-text>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <s-button
                    variant="plain"
                    icon="edit"
                    size="slim"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditField(field);
                    }}
                  />
                  <s-button
                    variant="plain"
                    icon={field.visible ? "view" : "view-off"}
                    size="slim"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFieldSetting(field.id, 'visible');
                    }}
                  />
                  <s-button
                    variant="plain"
                    icon="delete"
                    size="slim"
                    tone="critical"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteField(field.id);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <s-button size="slim" style={{ marginTop: "0.5rem" }} onClick={handleAddField}>
            Add Additional Fields
          </s-button>

          <input type="hidden" name="customerFields" value={JSON.stringify(fields)} />
        </s-stack>
      )}

      {/* Modal for Edit/Add Field */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "500px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e1e3e5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <s-text type="strong" style={{ fontSize: "18px" }}>
                {editingField ? "Edit Field" : "Add Field"}
              </s-text>
              <s-button variant="plain" icon="close" onClick={() => setShowModal(false)} />
            </div>
            <div style={{ padding: "1.5rem" }}>
              <s-stack gap="base">
                <div>
                  <s-text variant="body-sm" fontWeight="semibold" style={{ marginBottom: "0.5rem", display: "block" }}>
                    Field Name
                  </s-text>
                  <s-text-field
                    value={modalFieldName}
                    onChange={(e) => setModalFieldName(e.target.value)}
                    placeholder="Enter field name"
                  />
                </div>

                <div>
                  <s-text variant="body-sm" fontWeight="semibold" style={{ marginBottom: "0.5rem", display: "block" }}>
                    Field Type
                  </s-text>
                  <s-select
                    value={modalFieldType}
                    onChange={(e) => setModalFieldType(e.target.value)}
                  >
                    {fieldTypes.map((type) => (
                      <s-option key={type.value} value={type.value}>
                        {type.label}
                      </s-option>
                    ))}
                  </s-select>
                </div>
              </s-stack>
            </div>
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e1e3e5", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <s-button onClick={() => setShowModal(false)}>Cancel</s-button>
              <s-button variant="primary" onClick={handleSaveField}>Save</s-button>
            </div>
          </div>
        </div>
      )}
    </s-section>
  );
}

// Review & Publish Tab Component
export function ReviewPublishTabContent({ formData, locations = [], staffMembers = [], onTabChange }) {
  const [liveFormData, setLiveFormData] = useState({
    name: "",
    category: "",
    serviceType: "",
    basePrice: "0.00",
    paymentType: "",
    locationType: "",
  });

  // Read form values in real-time for new services (when formData is null)
  useEffect(() => {
    const form = document.getElementById("service-form");
    if (!form) return;

    const updateLiveData = () => {
      const name = form.querySelector('[name="name"]')?.value || "";
      const category = form.querySelector('[name="category"]')?.value || "";
      const serviceType = form.querySelector('[name="serviceType"]')?.value || "";
      const locationType = form.querySelector('[name="locationType"]')?.value || "";

      // Get price from selected product variants
      const variantIdsInput = form.querySelector('[name="shopifyVariantIds"]')?.value;
      let basePrice = "0.00";
      if (variantIdsInput) {
        try {
          const variantIds = JSON.parse(variantIdsInput);
          // Get the first variant's price from the product data
          const productDataInput = form.querySelector('[name="productData"]');
          if (productDataInput) {
            const productData = JSON.parse(productDataInput.value);
            const firstVariant = productData.variants?.[0];
            if (firstVariant) {
              basePrice = firstVariant.price;
            }
          }
        } catch (e) {
          // Ignore parse errors
        }
      }

      // Get payment type from paymentPreferences JSON
      const paymentPrefsInput = form.querySelector('[name="paymentPreferences"]')?.value;
      let paymentType = "";
      if (paymentPrefsInput) {
        try {
          const paymentPrefs = JSON.parse(paymentPrefsInput);
          paymentType = paymentPrefs.type || "";
        } catch (e) {
          // Ignore parse errors
        }
      }

      setLiveFormData({ name, category, serviceType, basePrice, paymentType, locationType });
    };

    // Update on form changes
    form.addEventListener("input", updateLiveData);
    form.addEventListener("change", updateLiveData);

    // Initial update
    updateLiveData();

    return () => {
      form.removeEventListener("input", updateLiveData);
      form.removeEventListener("change", updateLiveData);
    };
  }, []);

  const getServiceTypeLabel = (type) => {
    switch (type) {
      case "regular":
        return "Regular";
      case "full-day":
        return "Full-Day";
      case "multi-day":
        return "Multi-Day";
      default:
        return "Standalone Service";
    }
  };

  const getPaymentTypeLabel = (type) => {
    switch (type) {
      case "fullPayment":
        return "Full Payment";
      case "bookNowPayLater":
        return "Book Now, Pay Later";
      default:
        return "Book Now, Pay Later";
    }
  };

  // Get lead time formatted
  const getLeadTime = () => {
    const notice = formData?.minimumAdvancedNotice || 0;
    const unit = formData?.minimumAdvancedNoticeUnit || "Hours";
    if (notice === 0) return "No lead time";
    return `${notice} ${unit.toLowerCase()}`;
  };

  // Get visibility
  const getVisibility = () => {
    const days = formData?.serviceVisibilityDays || 60;
    return `${days} days ahead`;
  };

  // Get cancellation status
  const getCancellation = () => {
    if (formData?.allowCancel) {
      const cutoff = formData?.cancelCutoffTime || "24";
      const unit = formData?.cancelCutoffUnit === "Days" ? "h" : "h";
      return { allowed: true, label: `Allowed (${cutoff}${unit} cutoff)` };
    }
    return { allowed: false, label: "Not allowed" };
  };

  // Get rescheduling status
  const getRescheduling = () => {
    if (formData?.allowReschedule) {
      return { allowed: true, label: "Allowed (24h cutoff)" };
    }
    return { allowed: false, label: "Not allowed" };
  };

  // Get selected locations count
  const selectedLocations = formData?.selectedLocations || [];
  const hideLocationSelection = formData?.hideLocationSelection || false;

  // Get selected staff count
  const selectedStaff = formData?.selectedStaff || [];
  const hideStaffSelection = formData?.hideStaffSelection || false;

  // Get customer fields count
  const customerFields = formData?.customerFields || [];
  const customerFieldsCount = customerFields.length;

  const cancellationData = getCancellation();
  const reschedulingData = getRescheduling();

  return (
    <s-stack direction="block" gap="large">
      <div>
        <s-text variant="heading-lg" style={{ marginBottom: "0.5rem", display: "block" }}>
          Review & Publish
        </s-text>
        <s-text color="subdued">
          Review every section and make sure everything looks good before publishing your service.
        </s-text>
      </div>

      {/* Service Overview */}
      <s-box
        padding="base"
        border="base"
        borderRadius="base"
        style={{ backgroundColor: "white" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <s-text variant="heading-md">Service overview</s-text>
          <s-button
            size="slim"
            icon="edit"
            onClick={() => onTabChange && onTabChange(0)}
          >
            Edit
          </s-button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* Service Name */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <s-text color="subdued">Service name :</s-text>
            <s-text type="strong">{formData?.name || liveFormData.name || "Service name"}</s-text>
          </div>

          {/* Category */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <s-text color="subdued">Category :</s-text>
            <s-text type="strong">{formData?.category || liveFormData.category || "No category"}</s-text>
          </div>

          {/* Service Type */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <s-text color="subdued">Service type :</s-text>
            <s-text type="strong">{getServiceTypeLabel(formData?.serviceType || liveFormData.serviceType)}</s-text>
          </div>

          {/* Status */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <s-text color="subdued">Status :</s-text>
            <s-badge tone={formData?.id ? "success" : "info"}>
              {formData?.id ? "Active and Bookable" : "Not yet published"}
            </s-badge>
          </div>

          {/* Base Price */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <s-text color="subdued">Base Price :</s-text>
            <s-text type="strong">
              ${(() => {
                // For edit mode, get price from productData
                if (formData?.productData?.variants?.[0]) {
                  return formData.productData.variants[0].price;
                }
                // For new service, use live form data
                return liveFormData.basePrice || "0.00";
              })()}
            </s-text>
          </div>

          {/* Payment Status */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <s-text color="subdued">Payment :</s-text>
            <s-badge tone="warning">
              {getPaymentTypeLabel(
                formData?.paymentPreferences?.type || liveFormData.paymentType
              )}
            </s-badge>
          </div>
        </div>
      </s-box>

      {/* Location & Staff Members */}
      <s-box
        padding="base"
        border="base"
        borderRadius="base"
        style={{ backgroundColor: "white" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <s-text variant="heading-md">Location & Staff Members</s-text>
          <s-button
            size="slim"
            icon="edit"
            onClick={() => onTabChange && onTabChange(1)}
          >
            Edit
          </s-button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* Location Type */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <s-text color="subdued">Location Type :</s-text>
            <s-text type="strong">
              {(() => {
                const locType = formData?.locationType || liveFormData.locationType;
                return locType ? (locType.charAt(0).toUpperCase() + locType.slice(1)) : "Not set";
              })()}
            </s-text>
          </div>

          {/* Locations */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <s-text color="subdued">Locations :</s-text>
            <s-text type="strong">
              {selectedLocations.length > 0
                ? `${selectedLocations.length} assigned ${hideLocationSelection ? '(hidden from customer)' : ''}`
                : "None assigned"}
            </s-text>
          </div>

          {/* Staff Members */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <s-text color="subdued">Staff Member :</s-text>
            <s-text type="strong">
              {selectedStaff.length > 0
                ? `${selectedStaff.length} assigned ${hideStaffSelection ? '(hidden from customer)' : ''}`
                : "None assigned"}
            </s-text>
          </div>

          {/* Customer Fields */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <s-text color="subdued">Customer Fields :</s-text>
            <s-text type="strong">{customerFieldsCount} configured</s-text>
          </div>
        </div>
      </s-box>

      {/* Other Settings */}
      <s-box
        padding="base"
        border="base"
        borderRadius="base"
        style={{ backgroundColor: "white" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <s-text variant="heading-md">Other Settings</s-text>
          <s-button
            size="slim"
            icon="edit"
            onClick={() => onTabChange && onTabChange(2)}
          >
            Edit
          </s-button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* Lead Time */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <s-text color="subdued">Lead Time :</s-text>
            <s-text type="strong">{getLeadTime()}</s-text>
          </div>

          {/* Visibility */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <s-text color="subdued">Visibility :</s-text>
            <s-text type="strong">{getVisibility()}</s-text>
          </div>

          {/* Cancellation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <s-text color="subdued">Cancellation :</s-text>
            <s-badge tone={cancellationData.allowed ? "success" : "critical"}>
              {cancellationData.label}
            </s-badge>
          </div>

          {/* Rescheduling */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <s-text color="subdued">Rescheduling :</s-text>
            <s-badge tone={reschedulingData.allowed ? "success" : "critical"}>
              {reschedulingData.label}
            </s-badge>
          </div>

          {/* Capacity */}
          {formData?.capacity && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <s-text color="subdued">Max Capacity :</s-text>
              <s-text type="strong">{formData.capacity} bookings per slot</s-text>
            </div>
          )}

          {/* Notification Email */}
          {formData?.notificationEmail && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <s-text color="subdued">Notification Email :</s-text>
              <s-text type="strong">{formData.notificationEmail}</s-text>
            </div>
          )}
        </div>
      </s-box>
    </s-stack>
  );
}

// Location & Staff Member Tab Component
export function LocationStaffTabContent({ formData, locations = [], staffMembers = [] }) {
  return (
    <s-stack direction="block" gap="large">
      {/* Block Out Date & Time */}
      <BlockOutDateTime formData={formData} />

      {/* Locations */}
      <LocationsSection formData={formData} locations={locations} />

      {/* Staff Members */}
      <StaffMembersSection formData={formData} staffMembers={staffMembers} />
    </s-stack>
  );
}

// Block Out Date & Time Component
function BlockOutDateTime({ formData }) {
  const [isOpen, setIsOpen] = useState(true);
  const [locationType, setLocationType] = useState(formData?.locationType || "");

  const handleLocationTypeChange = (type) => {
    setLocationType(type);
  };

  return (
    <s-section>
      <s-stack
        direction="inline"
        alignItems="center"
        justifyContent="space-between"
        gap="small-100"
        className="cursor-pointer"
        paddingBlockEnd={isOpen ? "small-300" : ""}
        onClick={() => setIsOpen(!isOpen)}
      >
        <s-heading>Location Type</s-heading>
        <s-icon type={isOpen ? "chevron-down" : "chevron-up"}></s-icon>
      </s-stack>

      {isOpen && (
        <s-stack gap="small">
          <s-text color="subdued">Select where your service will be provided</s-text>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="radio"
                name="locationTypeRadio"
                value="online"
                checked={locationType === "online"}
                onChange={() => handleLocationTypeChange("online")}
              />
              <s-text>Online</s-text>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="radio"
                name="locationTypeRadio"
                value="offline"
                checked={locationType === "offline"}
                onChange={() => handleLocationTypeChange("offline")}
              />
              <s-text>Offline</s-text>
            </label>
          </div>

          {/* Hidden input for form submission */}
          <input type="hidden" name="locationType" value={locationType} />
        </s-stack>
      )}
    </s-section>
  );
}

// Locations Section Component
function LocationsSection({ formData, locations }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedLocations, setSelectedLocations] = useState(formData?.selectedLocations || []);
  const [hideLocationSelection, setHideLocationSelection] = useState(formData?.hideLocationSelection || false);
  const [showLocationPanel, setShowLocationPanel] = useState(false);

  const toggleLocationInPanel = (locationId) => {
    if (selectedLocations.includes(locationId)) {
      setSelectedLocations(selectedLocations.filter(id => id !== locationId));
    } else {
      setSelectedLocations([...selectedLocations, locationId]);
    }
  };

  const removeLocation = (locationId, e) => {
    e.stopPropagation();
    setSelectedLocations(selectedLocations.filter(id => id !== locationId));
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const selectedLocationObjects = locations.filter(loc => selectedLocations.includes(loc.id));

  return (
    <s-section>
      <s-stack
        direction="inline"
        alignItems="center"
        justifyContent="space-between"
        gap="small-100"
        paddingBlockEnd={isOpen ? "small-300" : ""}
      >
        <s-stack direction="inline" alignItems="center" gap="small-300">
          <s-heading>Locations (Optional)</s-heading>
          <s-icon type="info"></s-icon>
        </s-stack>
        <s-stack direction="inline" alignItems="center" gap="small-300">
          <s-button size="slim" onClick={() => navigate('/app/location')}>
            Create Location
            <s-icon type="arrow-right"></s-icon>
          </s-button>
          <s-icon
            type={isOpen ? "chevron-down" : "chevron-up"}
            onClick={() => setIsOpen(!isOpen)}
            style={{ cursor: "pointer" }}
          ></s-icon>
        </s-stack>
      </s-stack>

      {isOpen && (
        <s-stack gap="small">
          <s-text color="subdued">
            Locations added here will be shown to customers during booking. Useful for multi-branch business or on-site services
          </s-text>

          {/* Display selected locations */}
          {selectedLocationObjects.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {selectedLocationObjects.map((location) => (
                <div
                  key={location.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.75rem",
                    border: "2px solid #005BD3",
                    borderRadius: "8px",
                    backgroundColor: "#f6f8fa",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    {getInitials(location.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <s-text type="strong">{location.name}</s-text>
                    {location.address && (
                      <s-text color="subdued" style={{ display: "block" }}>
                        {typeof location.address === 'string' ? location.address :
                          location.address?.street || 'No address provided'}
                      </s-text>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <s-button
                      variant="plain"
                      icon="edit"
                      size="slim"
                      onClick={() => window.location.href = `/app/location/${location.id}`}
                    />
                    <s-button
                      variant="plain"
                      icon="delete"
                      size="slim"
                      tone="critical"
                      onClick={(e) => removeLocation(location.id, e)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <s-button size="slim" onClick={() => setShowLocationPanel(true)}>
            Add Location
          </s-button>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
            <input
              type="checkbox"
              checked={hideLocationSelection}
              onChange={(e) => setHideLocationSelection(e.target.checked)}
            />
            <s-text>Hide location selection in booking widget, When there's only one option.</s-text>
          </label>

          <input type="hidden" name="selectedLocations" value={JSON.stringify(selectedLocations)} />
          <input type="hidden" name="hideLocationSelection" value={hideLocationSelection} />
        </s-stack>
      )}

      {/* Location Selection Panel */}
      {showLocationPanel && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowLocationPanel(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "80vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e1e3e5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <s-text type="strong" style={{ fontSize: "18px" }}>Select Locations</s-text>
              <s-button variant="plain" icon="close" onClick={() => setShowLocationPanel(false)} />
            </div>
            <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
              {locations.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {locations.map((location) => {
                    const isSelected = selectedLocations.includes(location.id);
                    return (
                      <div
                        key={location.id}
                        onClick={() => toggleLocationInPanel(location.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          padding: "0.75rem",
                          border: isSelected ? "2px solid #005BD3" : "1px solid #e1e3e5",
                          borderRadius: "8px",
                          cursor: "pointer",
                          backgroundColor: isSelected ? "#f6f8fa" : "white",
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "16px",
                          }}
                        >
                          {getInitials(location.name)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <s-text type="strong">{location.name}</s-text>
                          {location.address && (
                            <s-text color="subdued" style={{ display: "block" }}>
                              {typeof location.address === 'string' ? location.address :
                                location.address?.street || 'No address provided'}
                            </s-text>
                          )}
                        </div>
                        {isSelected && (
                          <s-icon type="check-circle" style={{ color: "#005BD3" }}></s-icon>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <s-text color="subdued">No locations available. Create one first.</s-text>
                </div>
              )}
            </div>
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e1e3e5", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <s-button onClick={() => setShowLocationPanel(false)}>Cancel</s-button>
              <s-button variant="primary" onClick={() => setShowLocationPanel(false)}>Done</s-button>
            </div>
          </div>
        </div>
      )}
    </s-section>
  );
}

// Staff Members Section Component
function StaffMembersSection({ formData, staffMembers }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState(formData?.selectedStaff || []);
  const [hideStaffSelection, setHideStaffSelection] = useState(formData?.hideStaffSelection || false);
  const [showStaffPanel, setShowStaffPanel] = useState(false);

  const toggleStaffInPanel = (staffId) => {
    if (selectedStaff.includes(staffId)) {
      setSelectedStaff(selectedStaff.filter(id => id !== staffId));
    } else {
      setSelectedStaff([...selectedStaff, staffId]);
    }
  };

  const removeStaff = (staffId, e) => {
    e.stopPropagation();
    setSelectedStaff(selectedStaff.filter(id => id !== staffId));
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const selectedStaffObjects = staffMembers.filter(staff => selectedStaff.includes(staff.id));

  return (
    <s-section>
      <s-stack
        direction="inline"
        alignItems="center"
        justifyContent="space-between"
        gap="small-100"
        paddingBlockEnd={isOpen ? "small-300" : ""}
      >
        <s-stack direction="inline" alignItems="center" gap="small-300">
          <s-heading>Staff Members (Optional)</s-heading>
          <s-icon type="info"></s-icon>
        </s-stack>
        <s-stack direction="inline" alignItems="center" gap="small-300">
          <s-button size="slim" onClick={() => navigate('/app/staff')}>
            Create Staff Member
            <s-icon type="arrow-right"></s-icon>
          </s-button>
          <s-icon
            type={isOpen ? "chevron-down" : "chevron-up"}
            onClick={() => setIsOpen(!isOpen)}
            style={{ cursor: "pointer" }}
          ></s-icon>
        </s-stack>
      </s-stack>

      {isOpen && (
        <s-stack gap="small">
          <s-text color="subdued">
            Staff members added here will appear to customers as part of the booking process. Useful for services with more than one staff.
          </s-text>

          {/* Display selected staff */}
          {selectedStaffObjects.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {selectedStaffObjects.map((staff) => (
                <div
                  key={staff.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.75rem",
                    border: "2px solid #005BD3",
                    borderRadius: "8px",
                    backgroundColor: "#f6f8fa",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    {getInitials(staff.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <s-text type="strong">{staff.name}</s-text>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <s-button
                      variant="plain"
                      icon="edit"
                      size="slim"
                      onClick={() => window.location.href = `/app/staff/${staff.id}`}
                    />
                    <s-button
                      variant="plain"
                      icon="delete"
                      size="slim"
                      tone="critical"
                      onClick={(e) => removeStaff(staff.id, e)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <s-button size="slim" onClick={() => setShowStaffPanel(true)}>
            Add Staff Member
          </s-button>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
            <input
              type="checkbox"
              checked={hideStaffSelection}
              onChange={(e) => setHideStaffSelection(e.target.checked)}
            />
            <s-text>Hide staff selection in booking widget, When there's only one option.</s-text>
          </label>

          <input type="hidden" name="selectedStaff" value={JSON.stringify(selectedStaff)} />
          <input type="hidden" name="hideStaffSelection" value={hideStaffSelection} />
        </s-stack>
      )}

      {/* Staff Selection Panel */}
      {showStaffPanel && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowStaffPanel(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "80vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e1e3e5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <s-text type="strong" style={{ fontSize: "18px" }}>Select Staff Members</s-text>
              <s-button variant="plain" icon="close" onClick={() => setShowStaffPanel(false)} />
            </div>
            <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
              {staffMembers.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {staffMembers.map((staff) => {
                    const isSelected = selectedStaff.includes(staff.id);
                    return (
                      <div
                        key={staff.id}
                        onClick={() => toggleStaffInPanel(staff.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          padding: "0.75rem",
                          border: isSelected ? "2px solid #005BD3" : "1px solid #e1e3e5",
                          borderRadius: "8px",
                          cursor: "pointer",
                          backgroundColor: isSelected ? "#f6f8fa" : "white",
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "16px",
                          }}
                        >
                          {getInitials(staff.name)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <s-text type="strong">{staff.name}</s-text>
                        </div>
                        {isSelected && (
                          <s-icon type="check-circle" style={{ color: "#005BD3" }}></s-icon>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <s-text color="subdued">No staff members available. Create one first.</s-text>
                </div>
              )}
            </div>
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e1e3e5", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <s-button onClick={() => setShowStaffPanel(false)}>Cancel</s-button>
              <s-button variant="primary" onClick={() => setShowStaffPanel(false)}>Done</s-button>
            </div>
          </div>
        </div>
      )}
    </s-section>
  );
}
