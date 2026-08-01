import { useState } from 'react';
import { useLoaderData } from 'react-router';
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

  const settings = await prisma.settings.findUnique({
    where: { shopId: shop.id },
  });

  const setupSteps = {
    createLocation: false,
    addStaffMember: staffs.length > 0,
    createService: services.length > 0,
    customizeBookingWidget: !!settings?.widgetSettings,
    confirmEmailSettings: !!settings?.emailConfig,
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
    setupProgress: {
      completed: completedSteps,
      total: totalSteps,
      percentage: (completedSteps / totalSteps) * 100,
      steps: setupSteps,
    },
  };
};

export default function Index() {
  const { setupProgress } = useLoaderData<typeof loader>();
  const [showSetupGuide, setShowSetupGuide] = useState(true);
  const [activeStepId, setActiveStepId] = useState<string | null>('step-1');

  const setupStepsData = [
    {
      id: 'step-1',
      title: 'Create preorder campaign',
      description: 'Customize Widgets and choose products for your campaigns.',
      actions: <s-button variant="primary">Create preorder campaign</s-button>,
    },
    {
      id: 'step-2',
      title: 'Activate app embed in shopify',
      description:
        "You need to activate the appp in your store's theme settigns. this make the preorder button appear on your site",
      actions: (
        <s-stack direction="inline" gap="base small-300">
          <s-button variant="primary">Activate</s-button>
          <s-button variant="primary">I&apos;ve done it</s-button>
        </s-stack>
      ),
    },
    {
      id: 'step-3',
      title: 'Confirm app is working properly',
      description:
        "Finish the steps above, preview it in store to confirm that it's working properly. Let us know if you run into issues or need design tweaks.",
      actions: (
        <s-stack direction="inline" gap="base small-300">
          <s-button variant="primary">Everything is great</s-button>
          <s-button variant="primary">Contact support</s-button>
        </s-stack>
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
        label: 'Data Value',
        data: [10, 15, 8, 12, 6, 18, 10, 14, 8, 16, 5], // Example data points
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.2)',
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        fill: true,
        label: 'Previous Period',
        data: [8, 12, 10, 14, 8, 10, 6, 12, 9, 13, 7], // Example comparison data
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
          <s-box>
            <s-select>
              <s-option value="English">English</s-option>
              <s-option value="Hindi">Hindi</s-option>
              <s-option value="Arabic">Arabic</s-option>
            </s-select>
          </s-box>
        </s-stack>

        <s-banner heading="Enable Booqly in your Theme Editor" tone="warning">
          Our Widget will only work when the Booqly app embed is enabled in your
          theme. This is Shopify&apos;s recommended way to use an app in the
          online store.
          <s-switch id="basic-switch" label="Enable Booqly" />
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
                <s-heading>214</s-heading>
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
                <s-text color="subdued">Appointments approved</s-text>
                <s-heading>3</s-heading>
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
                <s-text color="subdued">Appointments approved</s-text>
                <s-heading>217</s-heading>
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
                <s-text color="subdued">Appointments approved</s-text>
                <s-heading>0</s-heading>
              </s-stack>
            </s-section>
          </s-grid-item>
        </s-grid>

        <s-section>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900">Data Value</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-gray-900">39.71%</span>
              <span className="text-sm font-medium text-teal-600 flex items-center">
                <svg
                  className="w-3 h-3 mr-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                5%
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Data Visualization</p>
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
