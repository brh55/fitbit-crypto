import Crypto from './src/app';

describe('fitbit-crypto/app', () => {
    test('should get price', async () => {
        const crypto = new Crypto('cryptoElement', { fromSymbol: "USD", toSymbol: "BTC" });

        const btcPrice = await crypto.getPrice();
        expect(btcPrice).toEqual("30000.00")
    });

    jest.setTimeout(10000)
    test('should support fitfont', async () => {
        const crypto = new Crypto(
            'cryptoElement',
            {
                fromSymbol: "USD", toSymbol: "BTC",
                fitfont: true
            });

        await crypto.getPrice();
        expect(crypto.getElement().text).toBeCalledWith('...');

        crypto.setPrice();
        expect(crypto.getElement().text).toBeCalledWith('$30000.00');
    });

    test('should support callbacks on price change', async () => {
        const changeHandler = jest.fn();
    
        const crypto = new Crypto(
            'cryptoElement',
            {
                fromSymbol: "USD", toSymbol: "BTC",
                onPriceChange: changeHandler
            });
        
        await crypto.getPrice();
        expect(changeHandler).toBeCalledWith({"price": "30000.00", "type": "crypto/priceLoaded"});
    });

    test('should allow updating conversion targets', () => {
        const crypto = new Crypto('cryptoElement', { fromSymbol: "USD", toSymbol: "BTC" });
        crypto.setConversion(null, 'DOGE');
        expect(crypto.fromSymbol).toEqual("USD");
        expect(crypto.toSymbol).toEqual("DOGE")

        crypto.setConversion('ETH', 'BTC');
        expect(crypto.fromSymbol).toEqual("ETH");
        expect(crypto.toSymbol).toEqual("BTC")
    });

    jest.setTimeout(10000)
    test('should allow a custom error message', async () => {
        const elmID = 'cryptoElement';
        const crypto = new Crypto(elmID, { fromSymbol: 'USD', toSymbol: 'FAIL', defaultErrorMessage: 'Test' });
        await expect(crypto.getPrice()).rejects.toMatch('fitbit-crypto/app: Price request timeout (6000ms)');
    });
});
