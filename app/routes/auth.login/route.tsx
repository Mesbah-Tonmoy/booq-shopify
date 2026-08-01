import { AppProvider } from '@shopify/shopify-app-react-router/react';
import { useState } from 'react';
import { Form } from 'react-router';
import { login } from '../../shopify.server';
import { loginErrorMessage } from './error.server';
import type { Route } from './+types/route';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const errors = loginErrorMessage(await login(request));

  return { errors };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const errors = loginErrorMessage(await login(request));

  return {
    errors,
  };
};

export default function Auth({ loaderData, actionData }: Route.ComponentProps) {
  const [shop, setShop] = useState('');
  const { errors } = actionData || loaderData;

  return (
    <AppProvider embedded={false}>
      <s-page>
        <Form method="post">
          <s-section heading="Log in">
            <s-text-field
              name="shop"
              label="Shop domain"
              details="example.myshopify.com"
              value={shop}
              onChange={(e) => setShop(e.currentTarget.value)}
              autocomplete="on"
              error={errors.shop}
            ></s-text-field>
            <s-button type="submit">Log in</s-button>
          </s-section>
        </Form>
      </s-page>
    </AppProvider>
  );
}
