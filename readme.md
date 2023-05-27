# fitbit-crypto
[![Travis branch](https://app.travis-ci.com/brh55/fitbit-crypto.svg?branch=main&status=started)](https://app.travis-ci.com/github/brh55/fitbit-crypto) [![Coveralls branch](https://img.shields.io/coveralls/brh55/fitbit-crypto/master.svg)](https://coveralls.io/github/brh55/fitbit-crypto) [![npm badge](https://img.shields.io/npm/dt/fitbit-crypto.svg)](https://www.npmjs.com/package/fitbit-crypto)

Still in progress for documentation and testing, but working.

### Getting Started
1. Import library in your `app` directory
```js
import Crypto from 'fitbit-crypto/app';
```
2. Import `listen()` method within your `companion` file
```js
import { listen } from 'fitbit-crypto/companion';
```
3. Create a `Text` element within your views with an Id
4. Initiate Crypto library to create a instance to fetch, display, prices
```js
import Crypto from 'fitbit-crypto/app';

const crypto = new Crypto('elementId', { fromSymbol: 'USD', toSymbol: 'BTC' });

const load = async () => {
  const btcPrice = await crypto.getPrice();
  console.log('BTC Price', btcPrice);
  
  // Display to the target element
  crypto.setPrice();
  
  // Get price to update the target element every second
  setInterval(async () => {
    await crypto.getPrice();
    crypto.setPrice
  }, 1000);
};

load();
```

### Advance Usage
Use the library to create multiple listener for different crytocurrencies and attach a refresh button to it
```js
import Crypto from 'fitbit-crypto/app';

const btc = new Crypto('btcId', { fromSymbol: 'USD', toSymbol: 'BTC', tapTargetId: 'btcRefreshBtn' });
const doge = new Crypto('dogeId', { fromSymbol: 'USD', toSymbol: 'DOGE', tapTargetId: 'dogeRefreshBtn' });
const eth = new Crypto('ethId', { fromSymbol: 'USD', toSymbol: 'ETH', tapTargetId: 'ethRefreshBtn' });

// Set Initial Prices
btc.getPrice().then(() => btc.setPrice());
eth.getPrice().then(() => eth.setPrice());
doge.getPrice().then(() => doge.setPrice());
```

## fitbit-crypto/app
`fitfont, fromSymbol = 'BTC', toSymbol = 'USD', onPriceChange, tapTargetId, defaultErrorMessage, quickError = true`

## fitbit-crypto/companion

## Used in The Wild
This module is being used for the following watchfaces:

- [Dogee](https://gallery.fitbit.com/details/6359d45c-696f-4867-aa15-08397fa0f3fe) (4.8 ⭐s) - A free dogecoin watchface by Pixels on Ridge

Pixels on Ridge
## License
MIT © [Brandon Him](https://github.com/brh55/fitbit-crypto)
