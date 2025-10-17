import { mapTechnology } from '@/app/mappers/technology-mapper';
import { Technology } from '@/types/technology';

const URL = `${process.env.NEXT_PUBLIC_API_URL}/technologies`;

console.log('getTechnology action loaded', URL);
const getTechnology = async (id: string): Promise<Technology> => {
  try {
    const response = await fetch(`${URL}/${id}`);
    if (!response.ok) {
      console.error(`Failed to fetch technology: ${response.status}`);
      throw new Error(`Error fetching technology with ID ${id}`);
    }
    return mapTechnology(await response.json());
  } catch (error) {
    console.error('Error fetching technology:', error);
    throw new Error('Failed to fetch technology');
  }
};

export default getTechnology;
