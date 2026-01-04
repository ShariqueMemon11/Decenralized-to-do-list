import { MetaMaskSDK } from '@metamask/sdk-react';

let sdk;

export const initMetaMask = () => {
  if (!sdk) {
    sdk = new MetaMaskSDK({
      dappMetadata: {
        name: 'D-Todo',
        url: 'https://yourwebsite.com',
      },
    });
  }

  return sdk;
};

export const getMetaMaskProvider = async () => {
  const sdkInstance = initMetaMask();
  const ethereum = sdkInstance.getProvider();

  await ethereum.request({ method: 'eth_requestAccounts' });

  return ethereum;
};
