import type { Route } from "./+types/products";

import { ProductCatalogView } from "~/components/products/product-catalog-view";
import { loadProducts } from "~/lib/server/usecase/load-products.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: "MyCRM | 商品提案" }];
}

export async function loader() {
  return loadProducts();
}

export default function ProductsRoute({ loaderData }: Route.ComponentProps) {
  return <ProductCatalogView products={loaderData} />;
}