import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest<T = Response>(
  method: string,
  url: string,
  options?: {
    body?: any;
    headers?: Record<string, string>;
  }
): Promise<T> {
  // Determine if we're dealing with FormData
  const isFormData = options?.body instanceof FormData;
  
  // Only set Content-Type for non-FormData requests
  // For FormData, let the browser set the Content-Type automatically with boundary
  const headers = isFormData 
    ? options?.headers || {} 
    : { "Content-Type": "application/json", ...options?.headers };
  
  // Handle the body correctly based on type
  const body = options?.body 
    ? (isFormData ? options.body : JSON.stringify(options.body)) 
    : undefined;
  
  // Sanitize the URL to prevent double slash issues
  const sanitizedUrl = url.replace(/([^:]\/)\/+/g, "$1");
  
  const res = await fetch(sanitizedUrl, {
    method,
    headers,
    body,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  
  // If the response is JSON, parse it
  if (res.headers.get('content-type')?.includes('application/json')) {
    return res.json() as Promise<T>;
  }
  
  return res as unknown as T;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Sanitize the URL to prevent double slash issues
    const url = (queryKey[0] as string).replace(/([^:]\/)\/+/g, "$1");
    
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
