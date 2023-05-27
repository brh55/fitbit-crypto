import * as actions from '../actions';

export const peerSocket = {
    readyState: true,
    OPEN: true,
    send: () => true,
    addEventListener: (eventType, callback) => {
        peerSocket.eventQueue = [...peerSocket.eventQueue, [eventType, callback]];
    },
    eventQueue: [],
    simulateEvent: (eventType, data) => {
        peerSocket.eventQueue = peerSocket.eventQueue.map(registeredEvent => {
            if (registeredEvent[0] === eventType) {
                registeredEvent[1](data);
            }
        });

        // For testing purposes, best to clean up queue
        peerSocket.clearQueue();
    },
    clearQueue: () => {
        peerSocket.eventQueue = [];
    },
    send: (event) => {
        if (event.type === actions.FETCH_CRYPTO_PRICE) {
            console.log('recieve event', event)

            if (event.toSymbol === 'FAIL') {
                console.log('do nothing', event)
                // Do nothing and let it fail naturally
            } else {
                peerSocket.simulateEvent('message', {
                    data: {
                        type: actions.LOAD_CRYPTO_PRICE,
                        price: '30000.00'
                    }
                });
            }
        }
    }
};
