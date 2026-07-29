<script setup lang="ts">
import { computed } from 'vue';
import { dezena } from '@/lib/format';

const props = withDefaults(
    defineProps<{
        n: number;
        lit?: boolean;
        size?: 'hero' | 'md' | 'sm';
        contest?: number | null;
    }>(),
    { lit: false, size: 'md', contest: null },
);

const sizeClass = computed(
    () =>
        ({
            hero: 'h-12 w-12 text-16',
            md: 'h-8 w-8 text-14',
            sm: 'h-6 w-6 text-12',
        })[props.size],
);

const label = computed(() =>
    props.lit
        ? `${props.n}, sorteado${props.contest ? ` no concurso ${props.contest}` : ''}`
        : `${props.n}, não sorteado`,
);
</script>

<template>
    <span
        role="img"
        :aria-label="label"
        class="inline-flex items-center justify-center rounded-full font-mono font-tabular"
        :class="[
            sizeClass,
            lit
                ? 'border border-aceso bg-aceso font-bold text-tinta shadow-[0_0_0_2px_rgba(255,194,75,0.55),0_0_16px_rgba(255,138,61,0.4)]'
                : 'border border-vidro/30 bg-noite font-normal text-vidro',
        ]"
    >
        {{ dezena(n) }}
    </span>
</template>
