import { Product } from "../src/interfaces/Product";
import { Brand } from "../src/interfaces/Brand";
import { Category } from "../src/interfaces/Category";
import { ResponseType } from "../types/ResponseType";
import { AddToCartResponse } from "@/interfaces/cart/AddToCartResponse";
import { SignInResponse } from "../types/SigninResponse";

class ApiService {
  #Base_Url = process.env.NEXT_PUBLIC_Base_Url;

  #headers = {
    "Content-Type": "application/json",
  };

  async getProducts(): Promise<Product[]> {
    const res = await fetch(this.#Base_Url + "/api/v1/products");
    const data: ResponseType<Product> = await res.json();
    return data.data;
  }

  async getBrands(): Promise<Brand[]> {
    const res = await fetch(this.#Base_Url + "/api/v1/brands");
    const data: ResponseType<Brand> = await res.json();
    return data.data;
  }

  async getCategories(): Promise<Category[]> {
    const res = await fetch(this.#Base_Url + "/api/v1/categories");
    const data: ResponseType<Category> = await res.json();
    return data.data;
  }

  async getPeoductDetails(productId: string): Promise<Product> {
    const res = await fetch(
      this.#Base_Url + "/api/v1/products/" + productId
    );
    const { data: product } = await res.json();
    return product;
  }

  async addProductToCart(productId: string, token?: string): Promise<AddToCartResponse> {
    const headers = token
      ? { ...this.#headers, token }
      : this.#headers;
    const res = await fetch(this.#Base_Url + "/api/v2/cart", {
      method: "POST",
      body: JSON.stringify({ productId }),
      headers: headers,
    });

    return await res.json();
  }

  async getCart(token?: string): Promise<AddToCartResponse> {
    const headers = token
      ? { ...this.#headers, token }
      : this.#headers;
    const res = await fetch(this.#Base_Url + "/api/v2/cart", {
      headers: headers,
    });

    return await res.json();
  }

  async removeProductFromCart(
    productId: string,
    token?: string
  ): Promise<AddToCartResponse> {
    const headers = token
      ? { ...this.#headers, token }
      : this.#headers;
    const res = await fetch(
      this.#Base_Url + "/api/v2/cart/" + productId,
      {
        method: "DELETE",
        headers: headers,
      }
    );

    return await res.json();
  }

  async clearCart(token?: string): Promise<any> {
    const headers = token
      ? { ...this.#headers, token }
      : this.#headers;
    const res = await fetch(this.#Base_Url + "/api/v2/cart", {
      method: "DELETE",
      headers: headers,
    });

    return await res.json();
  }

  async updateProductCount(
    productId: string,
    count: number,
    token?: string
  ): Promise<AddToCartResponse> {
    const headers = token
      ? { ...this.#headers, token }
      : this.#headers;
    const res = await fetch(
      this.#Base_Url + "/api/v2/cart/" + productId,
      {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({ count }),
      }
    );

    return await res.json();
  }

  async checkout(cartId: string, token?: string) {
    const headers = token
      ? { ...this.#headers, token }
      : this.#headers;
    const res = await fetch(
      this.#Base_Url +
      "/api/v1/orders/checkout-session/" +
      cartId +
      "?url=http://localhost:3000",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          shippingAddress: {
            details: "details",
            phone: "01010700999",
            city: "Cairo",
          },
        }),
      }
    );

    return await res.json();
  }

  async signin(email: string, password: string): Promise<SignInResponse> {
    const res = await fetch(this.#Base_Url + "/api/v1/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: this.#headers,
    });
    const data = await res.json();
    return data;
  }

  async signup(
    name: string,
    email: string,
    password: string,
    rePassword: string,
    phone?: string
  ): Promise<any> {
    const body: any = { name, email, password, rePassword };
    if (phone) body.phone = phone;
    const res = await fetch(this.#Base_Url + "/api/v1/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
      headers: this.#headers,
    });
    return await res.json();
  }

  async changePassword(
    currentPassword: string,
    password: string,
    rePassword: string,
    token: string
  ): Promise<any> {
    const res = await fetch(
      this.#Base_Url + "/api/v1/users/changeMyPassword",
      {
        method: "PUT",
        body: JSON.stringify({ currentPassword, password, rePassword }),
        headers: { ...this.#headers, token },
      }
    );
    return await res.json();
  }

  async getCategoryProducts(categoryId: string): Promise<Product[]> {
    const res = await fetch(
      this.#Base_Url + "/api/v1/products?category=" + categoryId
    );
    const data: ResponseType<Product> = await res.json();
    return data.data;
  }

  async getBrandProducts(brandId: string): Promise<Product[]> {
    const res = await fetch(
      this.#Base_Url + "/api/v1/products?brand=" + brandId
    );
    const data: ResponseType<Product> = await res.json();
    return data.data;
  }
}

const apiService = new ApiService();
export default apiService;