<script setup lang="ts">
import { computed } from 'vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const props = defineProps<{
    vendedor: {
        uuid: string;
        nome: string;
        slug: string;
        telefone: string | null;
        comissaoPct: number;
        grupoUrl: string | null;
        link: string;
    } | null;
}>();

const editando = computed(() => props.vendedor !== null);

const form = useForm({
    name: props.vendedor?.nome ?? '',
    slug: props.vendedor?.slug ?? '',
    phone: props.vendedor?.telefone ?? '',
    commission_pct: props.vendedor?.comissaoPct ?? 10,
    group_url: props.vendedor?.grupoUrl ?? '',
    password: '',
    password_confirmation: '',
});

function salvar() {
    if (editando.value) {
        form.put(`/admin/vendedores/${props.vendedor!.uuid}`);
    } else {
        form.post('/admin/vendedores');
    }
}
</script>

<template>
    <Head :title="editando ? 'Editar vendedor' : 'Novo vendedor'" />
    <AdminLayout>
        <div class="flex items-center gap-3">
            <Link href="/admin/vendedores" class="text-14 text-vidro hover:text-papel">← Vendedores</Link>
        </div>
        <h1 class="mt-2 font-display text-28 font-black uppercase tracking-tight">
            {{ editando ? 'Editar vendedor' : 'Novo vendedor' }}
        </h1>

        <p v-if="editando && vendedor" class="mt-2 text-14 text-vidro">
            Link de divulgação:
            <span class="font-mono text-12 font-tabular text-aceso">{{ vendedor.link }}</span>
        </p>

        <form class="mt-6 max-w-lg space-y-4" @submit.prevent="salvar">
            <div>
                <label class="block text-12 uppercase text-vidro" for="name">Nome</label>
                <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                />
                <p v-if="form.errors.name" class="mt-1 text-12 text-erro">{{ form.errors.name }}</p>
            </div>

            <div>
                <label class="block text-12 uppercase text-vidro" for="slug">Slug (vai no link /v/…)</label>
                <input
                    id="slug"
                    v-model="form.slug"
                    type="text"
                    placeholder="joao-silva"
                    class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-14 font-tabular focus:border-aceso focus:outline-none"
                />
                <p v-if="form.errors.slug" class="mt-1 text-12 text-erro">{{ form.errors.slug }}</p>
            </div>

            <div>
                <label class="block text-12 uppercase text-vidro" for="phone">Telefone (opcional)</label>
                <input
                    id="phone"
                    v-model="form.phone"
                    type="text"
                    class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                />
                <p v-if="form.errors.phone" class="mt-1 text-12 text-erro">{{ form.errors.phone }}</p>
            </div>

            <div>
                <label class="block text-12 uppercase text-vidro" for="commission_pct">Comissão (%)</label>
                <input
                    id="commission_pct"
                    v-model.number="form.commission_pct"
                    type="number"
                    min="0"
                    max="100"
                    class="mt-1 w-32 rounded border border-vidro/30 bg-noite px-3 py-2 font-mono text-14 font-tabular focus:border-aceso focus:outline-none"
                />
                <p v-if="form.errors.commission_pct" class="mt-1 text-12 text-erro">{{ form.errors.commission_pct }}</p>
            </div>

            <div>
                <label class="block text-12 uppercase text-vidro" for="group_url">Link do grupo do WhatsApp (opcional)</label>
                <input
                    id="group_url"
                    v-model="form.group_url"
                    type="url"
                    placeholder="https://chat.whatsapp.com/..."
                    class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                />
                <p class="mt-1 text-12 text-vidro">Aparece para quem entra pelo link deste vendedor.</p>
                <p v-if="form.errors.group_url" class="mt-1 text-12 text-erro">{{ form.errors.group_url }}</p>
            </div>

            <div>
                <label class="block text-12 uppercase text-vidro" for="password">
                    {{ editando ? 'Nova senha (deixe em branco para manter)' : 'Senha do portal' }}
                </label>
                <input
                    id="password"
                    v-model="form.password"
                    type="password"
                    autocomplete="new-password"
                    class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                />
                <p v-if="form.errors.password" class="mt-1 text-12 text-erro">{{ form.errors.password }}</p>
            </div>

            <div>
                <label class="block text-12 uppercase text-vidro" for="password_confirmation">Confirmar senha</label>
                <input
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    type="password"
                    autocomplete="new-password"
                    class="mt-1 w-full rounded border border-vidro/30 bg-noite px-3 py-2 text-14 focus:border-aceso focus:outline-none"
                />
            </div>

            <div class="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    :disabled="form.processing"
                    class="rounded bg-aceso px-4 py-2 font-display text-14 font-bold uppercase text-tinta disabled:opacity-50"
                >
                    {{ editando ? 'Salvar' : 'Criar' }}
                </button>
                <Link href="/admin/vendedores" class="text-14 text-vidro hover:text-papel">Cancelar</Link>
            </div>
        </form>
    </AdminLayout>
</template>
