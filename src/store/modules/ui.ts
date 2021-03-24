import { RootState } from '@/store';
import { sleep } from '@/utils/helpers';
import { ActionContext } from 'vuex';
import uniqueId from 'lodash/uniqueId';

export const NOTIFICATION_DURATION = 20 * 1000;

export type ModalType = 'asset' | 'settings' | 'account' | 'connector' | 'transactions';
export type ModalParams = Record<string, any>
export type ModalPayload = { modalType: ModalType; modalParams?: ModalParams }
export type Modal = { 
    type: ModalType;
    params?: ModalParams;
}

export interface UIState {
  modal: {
    asset: {
      isOpen: boolean;
      key: string;
    };
  };
  modals: Modal[];
  notifications: Notification[];
  hasNewNotification: boolean;
}

interface Notification {
  id?: string;
  text: string;
  type: 'success' | 'error' | 'pending';
  link: string;
}

const mutations = {
    setAssetModalOpen: (_state: UIState, isOpen: boolean): void => {
        _state.modal.asset.isOpen = isOpen;
    },
    setAssetModalKey: (_state: UIState, key: string): void => {
        _state.modal.asset.key = key;
    },
    addModal: (_state: UIState, payload: ModalPayload): void => {
        _state.modals.push({
            type: payload.modalType,
            params: payload.modalParams,
        });
    },
    closeTopModal: (_state: UIState): void => {
        _state.modals.splice(0, 1);
    },
    closeAllModals: (_state: UIState): void => {
        _state.modals = [];
    },
    closeModalByType: (_state: UIState, modalType: ModalType): void => {
        _state.modals = _state.modals.filter(modal => modal.type !== modalType);
    },
    addNotification: (_state: UIState, notification: Notification): void => {
        _state.notifications.push(notification);
    },
    updateNotification: (_state: UIState, payload: { id: string; notification: Notification }): void => {
        const notificationIndex = _state.notifications.findIndex(notification => notification.id === payload.id);

        if (notificationIndex > -1) {
            _state.notifications[notificationIndex] = {
                ..._state.notifications[notificationIndex],
                ...payload.notification,

            };
        } else {
            // this is in case someone closed the notification, but then the user tries to update this instance.
            _state.notifications.push({ id: payload.id, ...payload.notification });
        }
    },
    removeTopNotification: (_state: UIState): void => {
        _state.notifications.splice(0, 1);
    },    
    removeNotification: (_state: UIState, payload: { id: string }): void => {
        _state.notifications = _state.notifications.filter(notification => notification.id !== payload.id);
    },
    setHasNewNotification: (_state: UIState, flag: boolean): void => {
        _state.hasNewNotification = flag;
    },
};

const actions = {
    openAssetModal: ({ commit }: ActionContext<UIState, RootState>, key: string): void => {
        commit('setAssetModalOpen', true);
        commit('setAssetModalKey', key);
    },
    closeAssetModal: ({ commit }: ActionContext<UIState, RootState>): void => {
        commit('setAssetModalOpen', false);
    },
    openTransactionsModal: ({ commit }: ActionContext<UIState, RootState>): void => {
        commit('setTransactionsModal', true);
    },
    closeTransactionsModal: ({ commit }: ActionContext<UIState, RootState>): void => {
        commit('setTransactionsModal', false);
    },
    notify: async (
        { commit }: ActionContext<UIState, RootState>,
        notification: Notification,
    ): Promise<void> => {
        commit('addNotification', notification);
        commit('setHasNewNotification', true);
        await sleep(NOTIFICATION_DURATION);
        commit('removeTopNotification');
    },
    removeTopNotification: (
        { commit }: ActionContext<UIState, RootState>,
    ): void => {
        commit('removeTopNotification');
    },
    addNotification: async (
        { commit }: ActionContext<UIState, RootState>,
        notification: Notification,
    ): Promise<string> => {
        const id = uniqueId('notification');
        
        commit('addNotification', { id, ...notification });
        commit('setHasNewNotification', true);

        return id;
    },
    updateNotification: async (
        { commit }: ActionContext<UIState, RootState>,
        payload: { id: number; notification: Notification; removeTopNotification?: boolean },
    ): Promise<void> => {
        commit('updateNotification', payload);
        if (payload.removeTopNotification) {
            await sleep(NOTIFICATION_DURATION);
            commit('removeTopNotification');
        }
    },
    removeNotification: async (
        { commit }: ActionContext<UIState, RootState>,
        payload: { id: number  },
    ): Promise<void> => {
        commit('removeNotification', payload);
    },
    openModal: (
        { commit }: ActionContext<UIState, RootState>,
        payload: ModalPayload,
    ): void => {
        commit('addModal', payload);
        if (payload.modalType === 'transactions') {
            commit('setHasNewNotification', false);
        }
    },
    closeModal: (
        { commit }: ActionContext<UIState, RootState>,
        modalType: ModalType,
    ): void => {
        commit('closeModalByType', modalType);
    },
};

const getters = {
    openedModalTypes: (state: UIState): ModalType[] => state.modals.map(modal => modal.type),
};


function state(): UIState {
    return {
        modal: {
            asset: {
                isOpen: false,
                key: '',
            },
        },
        modals: [],
        notifications: [],
        hasNewNotification: false,
    };
}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations,
};
