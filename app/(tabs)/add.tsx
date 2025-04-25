
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function AddScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/journal/new');
  }, []);

  return null;
}
