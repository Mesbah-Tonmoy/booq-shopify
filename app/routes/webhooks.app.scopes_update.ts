import { authenticate } from '../shopify.server';
import db from '../db.server';
import type { Route } from './+types/webhooks.app.scopes_update';

export const action = async ({ request }: Route.ActionArgs) => {
  const { payload, session, topic, shop } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);
  const current = payload.current;

  if (session) {
    await db.session.update({
      where: {
        id: session.id,
      },
      data: {
        scope: current.toString(),
      },
    });
  }

  return new Response();
};
