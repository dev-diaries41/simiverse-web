import { NextResponse } from "next/server";

export function handleError(error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message || 'Internal Server Error';
    console.error('Error: ', message);
    return NextResponse.json({ message, status, success: false }, { status });
  }

  async function fetchWithError<T>(endpointUrl: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(endpointUrl, options);
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message);
    }
    return await response.json();
  }
  
  export async function generateImage(prompt?: string){
    try{
      const body = JSON.stringify({prompt});
      const endpointUrl = '/api/image';
      return await fetchWithError<{imageUrl: string}>(endpointUrl, { method: 'POST', body});
    }catch(error){
      console.error('Failed to update users onboarding answers');
    }
  }