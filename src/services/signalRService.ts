import * as signalR from '@microsoft/signalr';

class SignalRService {
    private connection: signalR.HubConnection | null = null;
    private handlers: Map<string, Array<() => void>> = new Map();

    async startConnection(token: string) {
        if (this.connection) {
            await this.stopConnection();
        }

        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://cruisebaseapi-production.up.railway.app/';
        
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${baseUrl}notificationHub`, {
                accessTokenFactory: () => token,
                skipNegotiation: false,
                transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
            })
            .withAutomaticReconnect()
            .build();

        this.connection.on('ReceiveNotification', () => {
            const receiveHandlers = this.handlers.get('ReceiveNotification');
            if (receiveHandlers) {
                receiveHandlers.forEach(handler => handler());
            }
        });

        try {
            await this.connection.start();
            console.log('SignalR Connected.');
        } catch (err) {
            console.error('SignalR Connection Error: ', err);
            // Retry logic is handled by withAutomaticReconnect()
        }
    }

    async stopConnection() {
        if (this.connection) {
            await this.connection.stop();
            this.connection = null;
        }
    }

    onReceiveNotification(handler: () => void) {
        if (!this.handlers.has('ReceiveNotification')) {
            this.handlers.set('ReceiveNotification', []);
        }
        this.handlers.get('ReceiveNotification')?.push(handler);

        // Return unsubscribe function
        return () => {
            const handlers = this.handlers.get('ReceiveNotification');
            if (handlers) {
                const index = handlers.indexOf(handler);
                if (index > -1) {
                    handlers.splice(index, 1);
                }
            }
        };
    }
}

export const signalRService = new SignalRService();
