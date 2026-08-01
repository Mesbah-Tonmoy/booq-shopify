import { useState } from 'react';
import type { ClearErrorFn, FormErrors, ServiceFormData } from './types';

interface PaymentPreferencesProps {
  formData?: ServiceFormData;
  errors?: FormErrors;
  clearError?: ClearErrorFn;
}

// Payment Preferences Component
export function PaymentPreferences({
  formData,
  clearError = () => {},
}: PaymentPreferencesProps) {
  const [isOpen, setIsOpen] = useState(true);
  const paymentPrefs = formData?.paymentPreferences;
  const [paymentType, setPaymentType] = useState(
    paymentPrefs?.type || 'fullPayment'
  );
  const [fullPaymentName, setFullPaymentName] = useState(
    paymentPrefs?.fullPayment?.name || 'Full payment'
  );
  const [fullPaymentLabel, setFullPaymentLabel] = useState(
    paymentPrefs?.fullPayment?.label || 'Full payment'
  );
  const [fullPaymentDescription, setFullPaymentDescription] = useState(
    paymentPrefs?.fullPayment?.description ||
      'You are required to pay the full amount upfront to confirm the booking.'
  );
  const [bookNowPayLaterName, setBookNowPayLaterName] = useState(
    paymentPrefs?.bookNowPayLater?.name || 'Book now, pay later'
  );
  const [bookNowPayLaterDescription, setBookNowPayLaterDescription] = useState(
    paymentPrefs?.bookNowPayLater?.description ||
      'You can complete the booking without payment. The payment will be collected later.'
  );

  const handlePaymentTypeChange = (type: string) => {
    setPaymentType(type);
    clearError('paymentPreferences');
  };

  const handleFullPaymentNameChange = (val: string) => {
    setFullPaymentName(val);
    clearError('paymentPreferences');
  };

  const handleFullPaymentLabelChange = (val: string) => {
    setFullPaymentLabel(val);
    clearError('paymentPreferences');
  };

  const handleFullPaymentDescriptionChange = (val: string) => {
    setFullPaymentDescription(val);
    clearError('paymentPreferences');
  };

  const handleBNPLNameChange = (val: string) => {
    setBookNowPayLaterName(val);
    clearError('paymentPreferences');
  };

  const handleBNPLDescriptionChange = (val: string) => {
    setBookNowPayLaterDescription(val);
    clearError('paymentPreferences');
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
        <s-stack direction="inline" alignItems="center" gap="small-300">
          <s-heading>Payment preferences</s-heading>
          <s-icon type="info"></s-icon>
        </s-stack>
        <s-icon type={isOpen ? 'chevron-down' : 'chevron-up'}></s-icon>
      </s-stack>

      {isOpen && (
        <s-stack gap="small">
          <s-text color="subdued">
            How would you like to handle your service payments.
          </s-text>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {/* Full Payment Option */}
            <div
              style={{
                padding: '1rem',
                border:
                  paymentType === 'fullPayment'
                    ? '2px solid #005BD3'
                    : '1px solid #e1e3e5',
                borderRadius: '8px',
                backgroundColor:
                  paymentType === 'fullPayment' ? '#f6f8fa' : 'white',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="paymentType"
                  value="fullPayment"
                  checked={paymentType === 'fullPayment'}
                  onChange={() => handlePaymentTypeChange('fullPayment')}
                  style={{ marginTop: '0.25rem' }}
                />
                <div style={{ flex: 1 }}>
                  <s-text type="strong">Full payment</s-text>
                  <s-text
                    color="subdued"
                    style={{ display: 'block', marginTop: '0.25rem' }}
                  >
                    Your customers are required to complete the payment to
                    confirm thier Bookings
                  </s-text>
                </div>
              </label>

              {paymentType === 'fullPayment' && (
                <div
                  style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #e1e3e5',
                  }}
                >
                  <s-stack gap="small-300">
                    <div>
                      <s-text
                        style={{ marginBottom: '0.25rem', display: 'block' }}
                      >
                        Name
                      </s-text>
                      <s-text-field
                        value={fullPaymentName}
                        onChange={(e) =>
                          handleFullPaymentNameChange(e.currentTarget.value)
                        }
                      />
                      <s-text
                        color="subdued"
                        style={{ display: 'block', marginTop: '0.25rem' }}
                      >
                        This name appears on the cart, checkout, and order
                        pages.
                      </s-text>
                    </div>

                    <div>
                      <s-text
                        style={{ marginBottom: '0.25rem', display: 'block' }}
                      >
                        Label
                      </s-text>
                      <s-text-field
                        value={fullPaymentLabel}
                        onChange={(e) =>
                          handleFullPaymentLabelChange(e.currentTarget.value)
                        }
                      />
                    </div>

                    <div>
                      <s-text
                        style={{ marginBottom: '0.25rem', display: 'block' }}
                      >
                        Description
                      </s-text>
                      <s-text-field
                        value={fullPaymentDescription}
                        onChange={(e) =>
                          handleFullPaymentDescriptionChange(
                            e.currentTarget.value
                          )
                        }
                      />
                    </div>
                  </s-stack>
                </div>
              )}
            </div>

            {/* Book Now, Pay Later Option */}
            <div
              style={{
                padding: '1rem',
                border:
                  paymentType === 'bookNowPayLater'
                    ? '2px solid #005BD3'
                    : '1px solid #e1e3e5',
                borderRadius: '8px',
                backgroundColor:
                  paymentType === 'bookNowPayLater' ? '#f6f8fa' : 'white',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="paymentType"
                  value="bookNowPayLater"
                  checked={paymentType === 'bookNowPayLater'}
                  onChange={() => handlePaymentTypeChange('bookNowPayLater')}
                  style={{ marginTop: '0.25rem' }}
                />
                <div style={{ flex: 1 }}>
                  <s-text type="strong">Book Now, Pay Later</s-text>
                  <s-text
                    color="subdued"
                    style={{ display: 'block', marginTop: '0.25rem' }}
                  >
                    Your customers can book without payment. suitable for
                    in-person appointments or free services
                  </s-text>
                </div>
              </label>

              {paymentType === 'bookNowPayLater' && (
                <div
                  style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #e1e3e5',
                  }}
                >
                  <s-stack gap="small-300">
                    <div>
                      <s-text
                        style={{ marginBottom: '0.25rem', display: 'block' }}
                      >
                        Name
                      </s-text>
                      <s-text-field
                        value={bookNowPayLaterName}
                        onChange={(e) =>
                          handleBNPLNameChange(e.currentTarget.value)
                        }
                      />
                      <s-text
                        color="subdued"
                        style={{ display: 'block', marginTop: '0.25rem' }}
                      >
                        This name appears on the cart, checkout, and order
                        pages.
                      </s-text>
                    </div>

                    <div>
                      <s-text
                        style={{ marginBottom: '0.25rem', display: 'block' }}
                      >
                        Description
                      </s-text>
                      <s-text-field
                        value={bookNowPayLaterDescription}
                        onChange={(e) =>
                          handleBNPLDescriptionChange(e.currentTarget.value)
                        }
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
