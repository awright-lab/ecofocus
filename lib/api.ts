// lib/api.ts
export async function getCMSData(endpoint: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${process.env.CMS_API_TOKEN}`,
        },
      });
  
      if (!res.ok) {
        throw new Error(`Failed to fetch ${endpoint}`);
      }
  
      return res.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  