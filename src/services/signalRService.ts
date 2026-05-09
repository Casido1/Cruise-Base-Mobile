import * as signalR from '@microsoft/signalr';
import type { TelemetryDTO } from '../types';

class SignalRService {
    private notificationConnection: signalR.HubConnection | null = null;
    private telemetryConnection: signalR.HubConnection | null = null;
    private notificationHandlers: Array<() => void> = [];
    private telemetryHandlers: Map<string, Array<(data: TelemetryDTO) => void>> = new Map();

    private baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://cruisebaseapi-production.up.railway.app/';

    async startConnection(token: string) {
        await Promise.all([
            this.startNotificationConnection(token),
            this.startTelemetryConnection(token)
        ]);
    }

    async stopConnection() {
        await this.stopConnections();
    }

    async startNotificationConnection(token: string) {
        if (this.notificationConnection) return;

        this.notificationConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${this.baseUrl}notificationHub`, {
                accessTokenFactory: () => token,
                skipNegotiation: false,
                transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
            })
            .withAutomaticReconnect()
            .build();

        this.notificationConnection.on('ReceiveNotification', () => {
            this.notificationHandlers.forEach(handler => handler());
        });

        try {
            await this.notificationConnection.start();
            console.log('SignalR NotificationHub Connected.');
        } catch (err) {
            console.error('SignalR NotificationHub Connection Error: ', err);
        }
    }

    async startTelemetryConnection(token: string) {
        if (this.telemetryConnection) return;

        this.telemetryConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${this.baseUrl}telemetryHub`, {
                accessTokenFactory: () => token,
                skipNegotiation: false,
                transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
            })
            .withAutomaticReconnect()
            .build();

        this.telemetryConnection.on('ReceiveLatestTelemetry', (data: TelemetryDTO) => {
            const handlers = this.telemetryHandlers.get(data.vehicleId);
            if (handlers) {
                handlers.forEach(handler => handler(data));
            }
            // Also call global handlers if any (using '*' as key)
            this.telemetryHandlers.get('*')?.forEach(handler => handler(data));
        });

        try {
            await this.telemetryConnection.start();
            console.log('SignalR TelemetryHub Connected.');
        } catch (err) {
            console.error('SignalR TelemetryHub Connection Error: ', err);
        }
    }

    async stopConnections() {
        if (this.notificationConnection) {
            await this.notificationConnection.stop();
            this.notificationConnection = null;
        }
        if (this.telemetryConnection) {
            await this.telemetryConnection.stop();
            this.telemetryConnection = null;
        }
    }

    // Notification Handlers
    onReceiveNotification(handler: () => void) {
        this.notificationHandlers.push(handler);
        return () => {
            this.notificationHandlers = this.notificationHandlers.filter(h => h !== handler);
        };
    }

    // Telemetry Handlers and Room Management
    async joinVehicleRoom(vehicleId: string) {
        // Wait for connection to be active if it's currently connecting
        if (this.telemetryConnection?.state === signalR.HubConnectionState.Connecting) {
            let attempts = 0;
            while (this.telemetryConnection.state === signalR.HubConnectionState.Connecting && attempts < 10) {
                await new Promise(resolve => setTimeout(resolve, 500));
                attempts++;
            }
        }

        if (this.telemetryConnection?.state === signalR.HubConnectionState.Connected) {
            try {
                await this.telemetryConnection.invoke('JoinVehicleRoom', vehicleId);
                console.log(`Joined room: ${vehicleId}`);
            } catch (err) {
                console.error(`Error joining room ${vehicleId}:`, err);
            }
        } else {
            console.warn(`Cannot join room ${vehicleId}: Connection state is ${this.telemetryConnection?.state}`);
        }
    }

    async leaveVehicleRoom(vehicleId: string) {
        if (this.telemetryConnection?.state === signalR.HubConnectionState.Connected) {
            try {
                await this.telemetryConnection.invoke('LeaveVehicleRoom', vehicleId);
                console.log(`Left room: ${vehicleId}`);
            } catch (err) {
                console.error(`Error leaving room ${vehicleId}:`, err);
            }
        }
    }

    onReceiveTelemetry(vehicleId: string, handler: (data: TelemetryDTO) => void) {
        if (!this.telemetryHandlers.has(vehicleId)) {
            this.telemetryHandlers.set(vehicleId, []);
        }
        this.telemetryHandlers.get(vehicleId)?.push(handler);

        return () => {
            const handlers = this.telemetryHandlers.get(vehicleId);
            if (handlers) {
                this.telemetryHandlers.set(vehicleId, handlers.filter(h => h !== handler));
            }
        };
    }
}

export const signalRService = new SignalRService();
