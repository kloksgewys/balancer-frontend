import { AssetMetadata } from '@/config';
import { Transaction } from '@/store/modules/account';

import get from 'lodash/get';

const PREFERENCES = 'preferences';
const TRANSACTIONS = 'transactions';
const ASSETS = 'assets';

interface Preferences {
    connector: string | null;
    slippage: number;
    pairs: Record<number, Pair>;
    list: string;
    darkmode: boolean;
}

interface Pair {
    inputAsset: string;
    outputAsset: string;
}

type Transactions = Record<string, Record<number, Record<string, Transaction>>>;
type Assets = Record<number, Record<string, AssetMetadata>>;

export default class Storage {
    static set(itemKey: string, value: any): void {
        localStorage.setItem(itemKey, JSON.stringify(value));
    }

    static get<T>(itemKey: string): T | null {
        try {
            const value = localStorage.getItem(itemKey);
            if (value != null) {
                return JSON.parse(value);
            }
        } catch(e) {
            return null;
        }
        return null;
    }

    static remove(itemKey: string): void {
        localStorage.removeItem(itemKey);
    }

    static getConnector(): string | null {
        const preferences = getPreferences();

        return preferences.connector;
    }

    static getSlippage(): number {
        const preferences = getPreferences();

        return preferences.slippage;
    }

    static getPair(chainId: number): Pair {
        const preferences = getPreferences();

        return preferences.pairs[chainId];
    }

    static getList(): string {
        const preferences = getPreferences();

        return preferences.list;
    }

    static getTransactions(account: string, chainId: number): Record<string, Transaction> {
        const transactions = Storage.get<Transactions>(TRANSACTIONS);

        return get(transactions, [account, chainId], {});
    }

    static getAssets(chainId: number): Record<string, AssetMetadata> {
        const assets = Storage.get<Assets>(ASSETS);

        return get(assets, chainId, {});
    }

    static isDarkmode(): boolean {
        const preferences = getPreferences();

        return preferences.darkmode;
    }

    static saveConnector(connector: string): void {
        const preferences = getPreferences();

        preferences.connector = connector;
        
        Storage.set(PREFERENCES, preferences);
    }

    static saveSlippage(slippage: number): void {
        const preferences = getPreferences();

        preferences.slippage = slippage;
        
        Storage.set(PREFERENCES, preferences);
    }

    static saveInputAsset(chainId: number, asset: string): void {
        const preferences = getPreferences();

        preferences.pairs[chainId].inputAsset = asset;
        
        Storage.set(PREFERENCES, preferences);
    }

    static saveOutputAsset(chainId: number, asset: string): void {
        const preferences = getPreferences();

        preferences.pairs[chainId].outputAsset = asset;
        
        Storage.set(PREFERENCES, preferences);
    }

    static saveList(list: string): void {
        const preferences = getPreferences();

        preferences.list = list;
        
        Storage.set(PREFERENCES, preferences);
    }

    static saveTransaction(account: string, chainId: number, transaction: Transaction): void {
        const transactions = Storage.get<Transactions>(TRANSACTIONS) || {};

        if (!transactions[account]) {
            transactions[account] = {};
        }
        if (!transactions[account][chainId]) {
            transactions[account][chainId] = {};
        }
        transactions[account][chainId][transaction.hash] = transaction;
        
        Storage.set(TRANSACTIONS, transactions);
    }

    static saveAssets(chainId: number, assets: Record<string, AssetMetadata>): void {
        const assetList = Storage.get<Assets>(ASSETS) || {};

        if (!assetList[chainId]) {
            assetList[chainId] = {};
        }
        for (const address in assets) {
            assetList[chainId][address] = assets[address];
        }
        Storage.set(ASSETS, assetList);
    }

    static toggleMode(): boolean {
        const preferences = getPreferences();
        preferences.darkmode = !preferences.darkmode;

        Storage.set(PREFERENCES, preferences);
        
        return preferences.darkmode;
    }

    static clearConnector(): void {
        const preferences = getPreferences();
        
        preferences.connector = null;
        
        Storage.set(PREFERENCES, preferences);
    }

    static clearTransactions(): void {
        Storage.remove(TRANSACTIONS);
    }

    static clearAssets(): void {
        Storage.remove(ASSETS);
    }
}

function getPreferences(): Preferences {
    const defaultPreferences: Preferences = {
        connector: null,
        slippage: 0.005,
        pairs: {
            1: {
                inputAsset: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
                outputAsset: '0xba100000625a3754423978a60c9317c58a424e3D',
            },
            42: {
                inputAsset: '0x1528F3FCc26d13F7079325Fb78D9442607781c8C',
                outputAsset: '0xef13C0c8abcaf5767160018d268f9697aE4f5375',
            },
        },
        list: 'balancer',
        darkmode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    };
    const preferences = Storage.get<Preferences>(PREFERENCES) || {};
    return {
        ...defaultPreferences,
        ...preferences,
    };
}
