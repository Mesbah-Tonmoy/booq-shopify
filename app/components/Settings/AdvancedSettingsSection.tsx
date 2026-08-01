import { useState } from 'react';
import type { Settings } from '@prisma/client';

interface AdvancedSettingsSectionProps {
  settings?: Settings | null;
}

export function AdvancedSettingsSection({
  settings,
}: AdvancedSettingsSectionProps) {
  const [showRedirectOptions, setShowRedirectOptions] = useState(true);
  const [bookingRedirection, setBookingRedirection] = useState(
    settings?.bookingRedirection || 'Cart page'
  );
  const [paymentStatus, setPaymentStatus] = useState(
    settings?.paymentStatus || 'Paid'
  );
  const [paymentDueTerm, setPaymentDueTerm] = useState('Due on receipt');
  const [universalBookingLink, setUniversalBookingLink] = useState(
    settings?.universalBookingLink ?? true
  );

  return (
    <s-stack direction="block" gap="base">
      <s-form-field>
        <s-select
          name="cancellationPolicy"
          label="Cancellation policy"
          value={settings?.cancellationPolicy || 'Strict-48 hours notice'}
        >
          <s-option value="No cancellation">No cancellation</s-option>
          <s-option value="Strict-24 hours notice">
            Strict-24 hours notice
          </s-option>
          <s-option value="Strict-48 hours notice">
            Strict-48 hours notice
          </s-option>
          <s-option value="Strict-72 hours notice">
            Strict-72 hours notice
          </s-option>
        </s-select>
        <s-text slot="helper-text" color="subdued">
          Set cancellation rules for after booking
        </s-text>
      </s-form-field>

      <s-form-field>
        <s-select
          name="slotReservationTime"
          label="Slot Reservation Time"
          value={settings?.slotReservationTime || '5 min'}
        >
          <s-option value="No reservation">No reservation</s-option>
          <s-option value="5 min">5 min</s-option>
          <s-option value="10 min">10 min</s-option>
          <s-option value="15 min">15 min</s-option>
          <s-option value="30 min">30 min</s-option>
        </s-select>
        <s-text slot="helper-text" color="subdued">
          When a customer selects a time slot, it&apos;s temporarily reserved
          and unavailable to others until the booking is confirmed or the
          reservation expires
        </s-text>
      </s-form-field>

      <s-checkbox
        checked={showRedirectOptions}
        onChange={(e) => setShowRedirectOptions(e.currentTarget.checked)}
        label="Set the destination page (cart or checkout) where users will be redirected after completing the booking flow."
      />

      {showRedirectOptions && (
        <s-form-field>
          <s-choice-list
            name="bookingRedirectionRadio"
            values={[bookingRedirection]}
            onChange={(e) => setBookingRedirection(e.currentTarget.values[0])}
          >
            <s-choice value="Cart page">Cart</s-choice>
            <s-choice value="Checkout page">Checkout</s-choice>
          </s-choice-list>
        </s-form-field>
      )}
      <input
        type="hidden"
        name="bookingRedirection"
        value={bookingRedirection}
      />

      <s-stack direction="inline" alignItems="center" gap="small-100">
        <s-icon type="note" />
        <s-heading>Payment Status</s-heading>
      </s-stack>
      <s-text color="subdued">
        Set the payment status for &quot;Book Now, Pay Later&quot; and manual
        bookings.
      </s-text>

      <s-form-field>
        <s-choice-list
          name="paymentStatusRadio"
          values={[paymentStatus]}
          onChange={(e) => setPaymentStatus(e.currentTarget.values[0])}
        >
          <s-choice value="Paid">Paid</s-choice>
          <s-choice value="Pending">Pending</s-choice>
        </s-choice-list>
      </s-form-field>
      <input type="hidden" name="paymentStatus" value={paymentStatus} />

      {paymentStatus === 'Pending' && (
        <s-form-field>
          <s-select
            label="Payment due"
            value={paymentDueTerm}
            onChange={(e) => setPaymentDueTerm(e.currentTarget.value)}
          >
            <s-option value="Due on receipt">Due on receipt</s-option>
            <s-option value="Due within 24 hours">Due within 24 hours</s-option>
            <s-option value="Due within 3 days">Due within 3 days</s-option>
            <s-option value="Due within 7 days">Due within 7 days</s-option>
          </s-select>
        </s-form-field>
      )}

      <s-checkbox
        checked={universalBookingLink}
        onChange={(e) => setUniversalBookingLink(e.currentTarget.checked)}
        name="universalBookingLink"
        label="Universal Booking Link"
        details="Enable to link your booking widget with any button in your store on any page. You can also share the link to redirect users to your booking widget."
      />
    </s-stack>
  );
}
