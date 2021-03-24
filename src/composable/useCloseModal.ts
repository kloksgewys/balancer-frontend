import { useStore } from 'vuex';

import { RootState } from '@/store';
import { ModalType } from '@/store/modules/ui';

function useCloseModal(modalType: ModalType): () => void {
    const store = useStore<RootState>();

    function close(): void {
        store.dispatch('ui/closeModal', modalType);
    }

    return close;
}

export default useCloseModal;