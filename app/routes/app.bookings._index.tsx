import { useState } from 'react';
import { useLoaderData } from 'react-router';
import { boundary } from '@shopify/shopify-app-react-router/server';
import { authenticate } from '../shopify.server';
import { MOCK_BOOKINGS, type MockBooking } from '../data/mockBookings';
import type { Route } from './+types/app.bookings._index';

const STATUS_TONE = {
  confirmed: 'success',
  pending: 'warning',
  cancelled: 'critical',
} as const;

// Loader - no Booking model exists yet; this route is scaffolded with mock
// data so the admin UI is complete and ready to swap in a real query later.
export const loader = async ({ request }: Route.LoaderArgs) => {
  await authenticate.admin(request);

  return { bookings: MOCK_BOOKINGS };
};

export default function BookingsListPage() {
  const { bookings } = useLoaderData<typeof loader>();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = bookings.filter((booking: MockBooking) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      booking.customerName.toLowerCase().includes(query) ||
      booking.service.toLowerCase().includes(query) ||
      booking.staff.toLowerCase().includes(query) ||
      booking.location.toLowerCase().includes(query)
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const currentPagedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <s-page heading="Bookings">
      <s-banner tone="info">
        Showing sample booking data. Real bookings will appear here once the
        storefront widget is live.
      </s-banner>

      <s-section
        padding="none"
        accessibilityLabel="Bookings table with pagination"
      >
        <s-table
          paginate
          hasPreviousPage={currentPage > 1}
          hasNextPage={currentPage < totalPages}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        >
          <s-grid slot="filters" gap="small-200" gridTemplateColumns="40% 50%">
            <s-text-field
              label="Search bookings"
              labelAccessibilityVisibility="exclusive"
              icon="search"
              placeholder="Search by customer, service, staff, or location"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.currentTarget.value);
                setCurrentPage(1);
              }}
            />
          </s-grid>

          <s-table-header-row>
            <s-table-header listSlot="primary">Customer</s-table-header>
            <s-table-header>Service</s-table-header>
            <s-table-header>Staff</s-table-header>
            <s-table-header>Location</s-table-header>
            <s-table-header>Date &amp; Time</s-table-header>
            <s-table-header>Status</s-table-header>
          </s-table-header-row>

          <s-table-body>
            {currentPagedBookings.length === 0 ? (
              <s-table-row>
                <s-table-cell>
                  <div style={{ padding: '3rem', textAlign: 'center' }}>
                    <s-text color="subdued">
                      No bookings match your search. Try adjusting your filters.
                    </s-text>
                  </div>
                </s-table-cell>
              </s-table-row>
            ) : (
              currentPagedBookings.map((booking: MockBooking) => (
                <s-table-row key={booking.id}>
                  <s-table-cell>
                    <div>
                      <s-text>{booking.customerName}</s-text>
                    </div>
                    <div>
                      <s-text color="subdued">{booking.customerEmail}</s-text>
                    </div>
                  </s-table-cell>
                  <s-table-cell>
                    <s-text>{booking.service}</s-text>
                  </s-table-cell>
                  <s-table-cell>
                    <s-text>{booking.staff}</s-text>
                  </s-table-cell>
                  <s-table-cell>
                    <s-text>{booking.location}</s-text>
                  </s-table-cell>
                  <s-table-cell>
                    <s-text>
                      {booking.date} · {booking.time}
                    </s-text>
                  </s-table-cell>
                  <s-table-cell>
                    <s-badge tone={STATUS_TONE[booking.status]}>
                      {booking.status}
                    </s-badge>
                  </s-table-cell>
                </s-table-row>
              ))
            )}
          </s-table-body>
        </s-table>
      </s-section>
    </s-page>
  );
}

export const headers: Route.HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
