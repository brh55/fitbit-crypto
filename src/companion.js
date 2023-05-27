import { peerSocket } from 'messaging'
import * as actions from '../common/actions';

export const listen = () => {
    console.info('fitbit-crypto/companion: listening for price requests')
    peerSocket.addEventListener('message', async ({data}) => {
        if (data.type === actions.FETCH_CRYPTO_PRICE) {
            const {fromSymbol, toSymbol} = data;
    
            fetch(`https://min-api.cryptocompare.com/data/price?fsym=${fromSymbol}&tsyms=${toSymbol}`)
                .then(response => response.json())
                .then(payload => { 
                    peerSocket.send({
                        type: actions.LOAD_CRYPTO_PRICE,
                        price: payload[toSymbol],
                        toSymbol: toSymbol,
                        fromSymbol: fromSymbol
                    });
                })
                .catch(err => {
                    console.error(err);
                    peerSocket.send({
                        type: actions.FETCH_CRYPTO_PRICE_ERROR,
                        errorMessage: err,
                    });
                });
        }
    });
};
