<template>
    <div class="header">
        <div class="header-left">
            <router-link
                class="brand"
                :to="'/'"
            >
                <Icon
                    class="logo"
                    :title="'brand'"
                />
                <span class="title">Balancer</span>
            </router-link>
            <a
                v-if="isDev"
                :href="commitLink"
                target="_blank"
                class="commit-label"
            >
                <div>
                    #{{ commitLabel }}
                </div>
            </a>
            <div class="page-links">
                <div
                    class="link active"
                >
                    {{ $t('header.trade') }}
                </div>
                <ExternalLink
                    class="link"
                    href="https://pools.balancer.exchange"
                >
                    {{ $t('header.invest') }}
                </ExternalLink>
            </div>
        </div>
        <div class="header-right">
            <div
                class="notification-icon-wrapper"
            >
                <Icon
                    v-if="isConnected"
                    class="header-icon notification-icon"
                    title="notification"
                    @click="openTransactionsModal"
                />
                <span
                    v-if="hasNewNotification"
                    class="notification-icon-dot"
                />
            </div>
            <Icon
                class="header-icon"
                :title="modeLogo"
                @click="toggleMode"
            />
            <Account class="account" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';

import { RootState } from '@/store';

import Storage from '@/utils/storage';

import Account from '@/components/Account.vue';
import Icon from '@/components/Icon.vue';
import ExternalLink from '@/components/ExternalLink.vue';

import useModal from '@/composable/useModal';

export default defineComponent({
    components: {
        Account,
        Icon,
        ExternalLink,
    },
    setup() {
        const store = useStore<RootState>();
        const transactionsModal = useModal('transactions', { 
            orderByField: 'timestamp',
            direction: 'desc',
        });
        
        // eslint-disable-next-line no-undef
        const isDev = ref(process.env.APP_ENV === 'dev');
        // eslint-disable-next-line no-undef
        const commit = ref(APP_COMMIT || '');
        const commitLabel = computed(() => commit.value.substr(0, 6));
        const commitLink = computed(() => 
            `https://github.com/balancer-labs/balancer-frontend/commit/${commit.value}`,
        );

        const mode = ref(Storage.isDarkmode());
        const modeLogo = computed(() => getLogo(mode.value));
        const isConnected = computed(() => store.getters['account/isConnected']);
        const hasNewNotification = computed(() => store.state.ui.hasNewNotification);

        function toggleMode(): void {
            mode.value = Storage.toggleMode();
            if (mode.value) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
        }

        function getLogo(isDarkmode: boolean): string {
            return isDarkmode ? 'moon' : 'sun';
        }

        function openTransactionsModal(): void {
            transactionsModal.open();
        }

        return {
            isDev,
            commitLabel,
            commitLink,

            modeLogo,
            toggleMode,

            openTransactionsModal,
            isConnected,
            hasNewNotification,
        };
    },
});
</script>

<style scoped>
.header {
    height: 80px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--background-primary);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid var(--border);
}

.header-left {
    display: flex;
    align-items: flex-end;
}

.header-right {
    display: flex;
    align-items: center;
}

a {
    text-decoration: none;
    color: var(--text-primary);
}

.brand {
    margin-left: 20px;
    display: flex;
    align-items: flex-end;
}

.logo {
    height: 22px;
    width: 27px;
}

.title {
    margin-left: 12px;
    font-size: var(--font-size-large);
}

.commit-label {
    margin-left: 8px;
    font-size: var(--font-size-small);
    color: var(--text-secondary);
}

.page-links {
    display: flex;
    align-items: flex-end;
    margin-left: 48px;
}

.link {
    margin-right: 20px;
    color: var(--text-secondary);
    cursor: pointer;
}

.link.active {
    color: var(--text-primary);
}

.header-icon {
    height: 24px;
    width: 24px;
    cursor: pointer;
}

.notification-icon-wrapper {
    position: relative;
}

.notification-icon {
    margin-right: 16px;
    cursor: pointer;
}

.notification-icon-dot {
    width: 8px;
    height: 8px;
    background: rgb(253, 97, 97);
    border-radius: 50%;
    position: absolute;
    top: 4px;
    left: 14px;
    pointer-events: none;
}

.account {
    margin: 0 16px;
}

@media only screen and (max-width: 768px) {
    .brand {
        margin-left: 16px;
    }

    .title,
    .commit-label,
    .link {
        display: none;
    }
}
</style>
