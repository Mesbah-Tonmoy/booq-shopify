import { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import { boundary } from '@shopify/shopify-app-react-router/server';
import { authenticate } from '../shopify.server';
import prisma from '../db.server';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { CollapsibleCard } from '../components/CollapsibleCard';
import { SetupGuide } from '../components/SetupGuide';
import { getMockBookingStats } from '../data/mockBookings';
import type { Service } from '@prisma/client';
import type { Route } from './+types/app._index';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { session } = await authenticate.admin(request);

  let shop = await prisma.shop.findUnique({
    where: { domain: session.shop },
  });

  if (!shop) {
    shop = await prisma.shop.create({
      data: {
        domain: session.shop,
        accessToken: session.accessToken!,
      },
    });
  }

  const services = await prisma.service.findMany({
    where: { shopId: shop.id },
  });

  const staffs = await prisma.staff.findMany({
    where: { shopId: shop.id },
  });

  const locations = await prisma.location.findMany({
    where: { shopId: shop.id },
  });

  const settings = await prisma.settings.findUnique({
    where: { shopId: shop.id },
  });

  const setupSteps = {
    createLocation: locations.length > 0,
    addStaffMember: staffs.length > 0,
    createService: services.length > 0,
    customizeBookingWidget: !!settings?.widgetSettings,
    confirmEmailSettings: !!settings?.emailTemplates,
  };

  const completedSteps = Object.values(setupSteps).filter(Boolean).length;
  const totalSteps = Object.keys(setupSteps).length;

  return {
    shop,
    stats: {
      services: services.length,
      staff: staffs.length,
      activeServices: services.filter((s: Service) => s.status === 'active')
        .length,
    },
    bookingStats: getMockBookingStats(),
    setupProgress: {
      completed: completedSteps,
      total: totalSteps,
      percentage: (completedSteps / totalSteps) * 100,
      steps: setupSteps,
    },
  };
};

export default function Index() {
  const { shop, stats, bookingStats, setupProgress } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [showSetupGuide, setShowSetupGuide] = useState(true);
  const [activeStepId, setActiveStepId] = useState<string | null>('step-1');

  const { steps } = setupProgress;

  const setupStepsData = [
    {
      id: 'step-1',
      title: 'Add a location',
      description:
        'Set where your services are provided, along with hours, capacity, and contact details.',
      completed: steps.createLocation,
      actions: (
        <s-button variant="primary" onClick={() => navigate('/app/location')}>
          Add a location
        </s-button>
      ),
    },
    {
      id: 'step-2',
      title: 'Add a staff member',
      description:
        'Add the people who provide your services so customers can book with them.',
      completed: steps.addStaffMember,
      actions: (
        <s-button variant="primary" onClick={() => navigate('/app/staff')}>
          Add staff
        </s-button>
      ),
    },
    {
      id: 'step-3',
      title: 'Create a service',
      description:
        'Link a Shopify product to a bookable service and configure its available slots.',
      completed: steps.createService,
      actions: (
        <s-button
          variant="primary"
          onClick={() => navigate('/app/service/new')}
        >
          Create a service
        </s-button>
      ),
    },
    {
      id: 'step-4',
      title: 'Customize your booking widget',
      description:
        'Choose what customers see when booking — pricing, staff photos, reviews, and more.',
      completed: steps.customizeBookingWidget,
      actions: (
        <s-button variant="primary" onClick={() => navigate('/app/settings')}>
          Customize widget
        </s-button>
      ),
    },
    {
      id: 'step-5',
      title: 'Set up email templates',
      description:
        'Write the confirmation, reminder, and cancellation emails your customers will receive.',
      completed: steps.confirmEmailSettings,
      actions: (
        <s-button variant="primary" onClick={() => navigate('/app/settings')}>
          Edit templates
        </s-button>
      ),
    },
  ];
  // Mock data for the chart
  const labels = [
    'Jan 2022',
    'Mar 2022',
    'May 2022',
    'Jul 2022',
    'Sep 2022',
    'Nov 2022',
  ];
  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Sample bookings',
        data: [10, 15, 8, 12, 6, 18, 10, 14, 8, 16, 5], // Illustrative sample data
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.2)',
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        fill: true,
        label: 'Previous period (sample)',
        data: [8, 12, 10, 14, 8, 10, 6, 12, 9, 13, 7], // Illustrative sample data
        borderColor: 'rgba(53, 162, 235, 0.4)',
        backgroundColor: 'rgba(53, 162, 235, 0.1)',
        tension: 0.4,
        borderDash: [5, 5],
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#8c9196',
          font: {
            size: 11,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#f1f2f3',
          borderDash: [5, 5],
        },
        ticks: {
          color: '#8c9196',
          font: {
            size: 11,
          },
          stepSize: 10,
        },
        border: {
          display: false,
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <s-page heading="Booqly">
      <br />
      <s-stack gap="base">
        <s-stack
          direction="inline"
          justifyContent="space-between"
          alignItems="center"
        >
          <s-heading>Welcome to Booqly</s-heading>
          <s-text color="subdued">
            {stats.activeServices} active service
            {stats.activeServices === 1 ? '' : 's'} · {stats.staff} staff member
            {stats.staff === 1 ? '' : 's'}
          </s-text>
        </s-stack>

        <s-banner heading="Enable Booqly in your Theme Editor" tone="warning">
          Our Widget will only work when the Booqly app embed is enabled in your
          theme. This is Shopify&apos;s recommended way to use an app in the
          online store.
          <div style={{ marginTop: '0.5rem' }}>
            <s-button
              variant="primary"
              onClick={() =>
                window.open(
                  `https://${shop.domain}/admin/themes/current/editor`,
                  '_top'
                )
              }
            >
              Enable in Theme Editor
            </s-button>
          </div>
        </s-banner>

        {showSetupGuide && (
          <CollapsibleCard
            onDismiss={() => setShowSetupGuide(false)}
            header={
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border border-dashed border-gray-300 flex-shrink-0" />
                <s-text>
                  {setupProgress.completed} of {setupProgress.total} tasks
                  completed
                </s-text>
              </div>
            }
          >
            <s-stack gap="base">
              <s-box paddingBlock="base small-500">
                <s-stack gap="small-400">
                  <s-heading>Booq Setup Guide</s-heading>
                  <s-text>
                    Get your Store fully configured to provide a smooth booking
                    experience.
                  </s-text>
                </s-stack>
              </s-box>

              <SetupGuide
                steps={setupStepsData}
                activeStepId={activeStepId}
                onStepToggle={(id) =>
                  setActiveStepId(activeStepId === id ? null : id)
                }
              />
            </s-stack>
          </CollapsibleCard>
        )}

        <s-text color="subdued">
          Sample booking data — see the{' '}
          <s-link href="/app/bookings">Bookings</s-link> page.
        </s-text>

        <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base">
          <s-grid-item gridColumn="span 3">
            <s-section>
              <s-stack gap="small-400">
                <s-stack
                  direction="inline"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <s-heading>Confirmed Appointments</s-heading>
                  <s-icon type="check" tone="success"></s-icon>
                </s-stack>
                <s-text color="subdued">Appointments approved</s-text>
                <s-heading>{bookingStats.confirmed}</s-heading>
              </s-stack>
            </s-section>
          </s-grid-item>
          <s-grid-item gridColumn="span 3">
            <s-section>
              <s-stack gap="small-400">
                <s-stack
                  direction="inline"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <s-heading>Pending Appointments</s-heading>
                  <s-icon type="clock" tone="warning"></s-icon>
                </s-stack>
                <s-text color="subdued">Awaiting confirmation</s-text>
                <s-heading>{bookingStats.pending}</s-heading>
              </s-stack>
            </s-section>
          </s-grid-item>
          <s-grid-item gridColumn="span 3">
            <s-section>
              <s-stack gap="small-400">
                <s-stack
                  direction="inline"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <s-heading>Total Appointments</s-heading>
                  <s-icon type="calendar-check" tone="info"></s-icon>
                </s-stack>
                <s-text color="subdued">All-time bookings</s-text>
                <s-heading>{bookingStats.total}</s-heading>
              </s-stack>
            </s-section>
          </s-grid-item>
          <s-grid-item gridColumn="span 3">
            <s-section>
              <s-stack gap="small-400">
                <s-stack
                  direction="inline"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <s-heading>Cancelled Appointments</s-heading>
                  <s-icon type="alert-circle" tone="critical"></s-icon>
                </s-stack>
                <s-text color="subdued">Cancelled by customer</s-text>
                <s-heading>{bookingStats.cancelled}</s-heading>
              </s-stack>
            </s-section>
          </s-grid-item>
        </s-grid>

        <s-section>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Sample booking trend
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Illustrative chart — this will chart real booking volume once
              customers start booking through your widget.
            </p>
          </div>

          <div style={{ height: '300px', width: '100%' }}>
            <Line options={options} data={data} />
          </div>
        </s-section>
      </s-stack>
      <br />
    </s-page>
  );
}

export const headers: Route.HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
