// app/pages/auth/register.vue
<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

const toast = useToast();
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const redirectInfo = useSupabaseCookieRedirect();

const loading = ref(false);

// mendefinisikan input fields
const fields: AuthFormField[] = [
  {
    name: "name",
    type: "text",
    label: "Name",
    placeholder: "Enter your Name",
    required: true,
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
  },
];

// schema untuk form register
const schema = z.object({
  name: z.string("Name is required").min(3, "Must be at least 3 characters"),
  email: z.email("Invalid email"),
  password: z
    .string("Password is required")
    .min(6, "Must be at least 6 characters"),
});

type Schema = z.output<typeof schema>;

// kembali ke main route (/) jika sudah berhasil registrasi
watch(
  user,
  () => {
    if (user.value) return navigateTo(redirectInfo.pluck() || "/");
  },
  { immediate: true },
);


// fungsi untuk memproses registrasi
async function onSubmit(payload: FormSubmitEvent<Schema>) {
  loading.value = true;

  try {
    const { error } = await supabase.auth.signUp({
      email: payload.data.email,
      password: payload.data.password,
      options: {
        data: { name: payload.data.name }, 
        emailRedirectTo: `/auth/confirm`,
      },
    });

    if (error) {
      toast.add({
        title: error.message ?? "Something went wrong",
        color: "error",
      });
      return;
    }

    toast.add({
      title: "Register Successfully",
      color: "primary",
      icon: "iconoir:thumbs-up",
    });
    return await navigateTo("/");
  } catch (error: any) {
    toast.add({
      title: error.message ?? "Something went wrong",
      color: "error",
    });
  } finally {
    loading.value = false;
  }

  return navigateTo("/");
}
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <UPageCard class="w-full h-fit max-w-md">
      <UAuthForm
        :schema="schema"
        title="Register"
        description="Create a new account to get started."
        icon="i-lucide-user"
        :fields="fields"
        @submit="onSubmit"
      />
    </UPageCard>
  </div>
</template>