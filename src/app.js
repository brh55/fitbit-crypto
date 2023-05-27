import document from 'document';
import { peerSocket } from 'messaging';
import { FitFont } from 'fitfont';
import getSymbolFromCurrency from 'currency-symbol-map';

import * as actions from '../actions';

export default class {
    constructor(elementId, { fitfont, fromSymbol = 'BTC', toSymbol = 'USD', onPriceChange, tapTargetId, defaultErrorMessage, quickError = true }) {
        this.fromSymbol = fromSymbol;
        this.toSymbol = toSymbol;

        if (onPriceChange) {
            this.onPriceChange = onPriceChange;
        }

        this.listening = false;
        this.price = null;
        this.pendingPromise = null;
        this.defaultErrorMessage = 'Failed to get price, retry later...';
        this.quickError = quickError;

        if (defaultErrorMessage) {
            this.defaultErrorMessage = defaultErrorMessage;
        }

        if (fitfont) {
            this.element = new FitFont({id: elementId, ...fitfont});
        } else {
            this.element = document.getElementById(elementId);
        }

        if (tapTargetId) {
            try {
                document.getElementById(tapTargetId).onclick = () => {
                    this.getPrice();
                };
            } catch(err) {
                console.error('app/fitbit-crypto: ' + err + '. Is tapTargetId valid?');
            }
        }
    }

    getElement() {
        return this.element;
    }

    setColor(color) {
        this.element.style.fill = color;
    }

    setPrice() {
        const text = (this.price) ? `${getSymbolFromCurrency(this.toSymbol)}${this.price}` : '--';
        this.element.text = text;
    }

    setLoading() {
        this.element.text = '...';
    }

    _setError(customErrorMessage) {
        const errorMessage = customErrorMessage ? customErrorMessage : this.defaultErrorMessage;
        this.element.text = errorMessage;

        if (this.price !== 0 && this.quickError) {
            // Default to old price after failed attempt
            setTimeout(() => {
                this.setPrice();
            }, 2000);
        }
    }

    loadPriceHandler({data}) {
        if (data.type === actions.LOAD_CRYPTO_PRICE) {
            const { price } = data;
            this.lastUpdated = new Date();
            this.price = price;

            if (this._pendingPromise) {
                this._pendingPromise(null, data.price);
            }

            if (this.onPriceChange) {
                this.onPriceChange(data);
            }
        }

        if (data.type === actions.FETCH_CRYPTO_PRICE_ERROR) {
            if (this._pendingPromise) {
                this._pendingPromise(data.errorMessage);
            }
        }
    }
    
    _sendPriceRequest() {
        if (peerSocket.readyState === peerSocket.OPEN) {
            const { fromSymbol, toSymbol } = this;
            // Send the data to peer as a message
            peerSocket.send({
                type: actions.FETCH_CRYPTO_PRICE,
                fromSymbol,
                toSymbol
            });
        };
    }

    setConversion(from, to) {
        this.fromSymbol = from || this.fromSymbol;
        this.toSymbol = to || this.toSymbol;
        return this;
    }

    getPrice() {
        if (this.listening === false) {
            peerSocket.addEventListener('message', event => {
                this.loadPriceHandler(event);
            });
            this.listening = true;
        }

        this.setLoading();

        return new Promise((resolve, reject) => {
            // Assign a pending function to resolve later
            this._pendingPromise = (err, price) => {
                this._pendingPromise = null;

                if (err) {
                    return reject(err);
                }

                this.price = price;
                return resolve(price);
            };
            // Initiate the price request to companion device
            this._sendPriceRequest();

            // Reject if no price has been received by companion device
            return setTimeout(() => {
                if (this._pendingPromise) {
                    this._setError();
                    return reject('fitbit-crypto/app: Price request timeout (6000ms)');
                }
            }, 6000);
         });
    }
}
