import { authenticate } from '../shopify.server';
import type { Route } from './+types/webhooks.app.compliance';

export const action = async ({ request }: Route.ActionArgs) => {
  const { topic, shop } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  return new Response();
};
