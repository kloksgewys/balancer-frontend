<template>
    <ModalBase 
        :title="$t('modals.transactions.title')"
        :open="open"
        @close="close"
    >
        <template #default>
            <div class="section">
                <template v-if="hasTransactions">
                    <div class="transactions-header transactions">
                        <div>{{ $t('modals.transactions.time') }}</div>
                        <div>{{ $t('modals.transactions.type') }}</div>
                        <div>{{ $t('modals.transactions.tx') }}</div>
                    </div>
                    <div
                        v-for="transaction in transactions"
                        :key="transaction.hash"
                        class="transactions"
                    >
                        <div>{{ formatDate(transaction.timestamp) }}</div>
                        <div>
                            <TransactionIcon
                                class="tx-status-icon"
                                :status="transaction.status"
                            /> {{ transaction.text }}
                        </div>
                        <div>
                            <a
                                :href="getEtherscanLink(transaction.hash)"
                                target="_blank"
                            >
                                <Icon
                                    :title="'externalLink'"
                                    class="tx-link icon"
                                />
                            </a>
                        </div>
                    </div>
                </template>
                <div
                    v-else
                    class="no-transactions"
                >
                    {{ $t('modals.transactions.no-transactions') }}
                </div>
            </div>
        </template>
    </ModalBase>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { useStore } from 'vuex';
import orderBy from 'lodash/orderBy';

import { RootState } from '@/store';
import { formatDate, getEtherscanLink } from '@/utils/helpers';

import Icon from '@/components/Icon.vue';
import ModalBase from '@/components/ModalBase.vue';
import TransactionIcon from '@/components/TransactionIcon.vue';

export default defineComponent({
    components: {
        ModalBase,
        Icon,
        TransactionIcon,
    },
    props: {
        open: {
            type: Boolean,
            required: true,
        },
        close: {
            type: Function,
            required: true,
        },
        params: {
            type: Object as PropType<{ orderByField: string; direction: 'desc' | 'asc' }>,
            default: {
                orderByField: 'timestamp',
                direction: 'desc',
            },
        },
    },
    setup(props) {
        const store = useStore<RootState>();

        const transactions = computed(() => orderBy(store.getters['account/transactionList'], props.params.orderByField, props.params.direction));
        const hasTransactions = computed(() => store.getters['account/hasTransactions']);        

        return {
            hasTransactions,
            transactions,

            formatDate,
            getEtherscanLink,
        };
    },
});
</script>

<style scoped>
.section {
    margin: 16px;
}

.transactions {
    display: grid;
    grid-column-gap: 10px;
    grid-template-columns: 140px 1fr auto;
    font-size: var(--font-size-tiny);
    margin-bottom: 20px;
}

.transactions .tx-status-icon {
    width: 14px;
    height: 14px;
    margin-right: 10px;
}

.transactions-header {
    margin-bottom: 20px;
    font-size: var(--font-size-small);
}

.transactions > div {
    display: flex;
}

.tx-link {
    height: 14px;
    width: 14px;
    color: var(--text-primary);
    cursor: pointer;
}

</style>
