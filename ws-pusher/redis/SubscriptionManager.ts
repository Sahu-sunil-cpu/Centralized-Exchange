import { createClient, type RedisClientType } from "redis";
import { UserManager } from "../user/UserManager";

const redis_url = process.env.REDIS_URL;
if(!redis_url) throw new Error("REDIS_URL not set");
export class SubscriptionManager {
    private static instance: SubscriptionManager;
    private subscriptions: Map<string, string[]> = new Map();
    private time: Map<string, string> = new Map();
    private reverseSubscriptions: Map<string, string[]> = new Map();
    private redisClient: RedisClientType;



    private constructor() {
        this.redisClient = createClient({
            url: redis_url
        });
        this.redisClient.connect();

    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new SubscriptionManager();
        }

        return this.instance;
    }

    public async subscribe(userId: string, subscription: string) {
        if (this.subscriptions.get(userId)?.includes(subscription)) {
            return;
        }
        // userId -> array of subscription
        this.subscriptions.set(userId, (this.subscriptions.get(userId) || []).concat(subscription));

        // subscription -> array of userId
        this.reverseSubscriptions.set(subscription, (this.subscriptions.get(subscription) || []).concat(userId));

        if (this.reverseSubscriptions.get(subscription)?.length == 1) {

            await this.redisClient.subscribe(subscription, this.redisCallbackHandler);
        }
    }

    public unsubscribe(userId: string, subscription: string) {
        const subscriptions = this.subscriptions.get(userId);
        if (subscriptions) {
            this.subscriptions.set(userId, subscriptions.filter(s => s !== subscription));
        }
        const reverseSubscriptions = this.reverseSubscriptions.get(subscription);
        if (reverseSubscriptions) {
            this.reverseSubscriptions.set(subscription, reverseSubscriptions.filter(s => s != userId));
            if (this.reverseSubscriptions.get(subscription)?.length == 0) {
                this.reverseSubscriptions.delete(subscription);
                this.redisClient.unsubscribe(subscription);
            }
        }
    }

    private redisCallbackHandler = (message: string, channel: string) => {
        const parsedMessage = JSON.parse(message);
        this.reverseSubscriptions.get(channel)?.forEach(u => {
            if (this.time.get(u) == parsedMessage.data.b) {
              UserManager.getInstance().getUser(u)?.emit(parsedMessage)
            } 
        });
    }

    public userLeft(userId: string) {
        console.log(`user of ${userId} left`);
        this.subscriptions.get(userId)?.forEach(s => this.unsubscribe(userId, s));
    }

    public InsertTradeTime(time: string, userId: string) {
        const subscriptions = this.subscriptions.get(userId);
        if (subscriptions) {
            this.time.set(userId, time);
            return;
        }

        console.log("user is not subscribed");
    }
    getSubscriptions(userId: string) {
        return this.subscriptions.get(userId) || [];
    }

}