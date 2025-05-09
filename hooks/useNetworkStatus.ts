import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Theme } from '@/constants/Theme';

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });

    return () => unsubscribe();
  }, []);

  return isConnected;
};