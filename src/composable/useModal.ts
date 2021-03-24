import { useStore } from 'vuex';

import { RootState } from '@/store';
import { ModalParams, ModalType } from '@/store/modules/ui';

import useCloseModal from './useCloseModal';

function useModal(modalType: ModalType, modalParams?: ModalParams): {
    open: () => void;
    close: () => void;
} {
    const store = useStore<RootState>();
    const close = useCloseModal(modalType);
    
    function open(): void {
        store.dispatch('ui/openModal', { 
            modalType,
            modalParams,
        });
    }

    return {
        open,
        close,
    };
}

export default useModal;