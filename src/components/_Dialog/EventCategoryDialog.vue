<script setup>
import { ref } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
import MySelect from "../MySelect.vue";

const props = defineProps({
    openModal: {
        type: Boolean,
        default: false,
    },
    item: {
        type: Object,
        default: null,
    },
    isInvalid: {
        type: Boolean,
        default: false,
    },
    errorList: {
        type: Array,
        default: () => [],
    },
    users: {
        type: Array,
        default: () => [],
    },
});
const emit = defineEmits(["close", "save"]);

const form = ref({
    eventCategoryId: props.item?.eventCategoryId || "",
    eventCategoryName: props.item?.eventCategoryName || "",
    eventCategoryDescription: props.item?.eventCategoryDescription || "",
    eventDuration: props.item?.eventDuration || "",
    owner: props.item?.owner.map((user) => user.userId) || [],
});

const options = computed(() => {
    return props.users.map((user) => {
        return {
            value: user.userId,
            label: `${user.name} - ${user.email}`,
        };
    });
});

const modalTitle = computed(() => {
    return !form.value.eventCategoryId
        ? "เพิ่มหมวดหมู่การจอง"
        : `แก้ไขหมวดหมู่การจอง (${props.item?.eventCategoryName})`;
});

const isEventDurationInvalid = computed(() => {
    if (!form.value.eventDuration) return "- กรุณากรอกระยะเวลาการจอง";
    if (isNaN(form.value.eventDuration))
        return "- ระยะเวลาต้องเป็นตัวเลขเท่านั้น";
    if (!(form.value.eventDuration >= 1 && form.value.eventDuration <= 480))
        return "- ช่วงระยะเวลาในการจองต้องอยู่ในช่วง 1 - 480 นาที";
    return null;
});

const showErrorList = computed(() => {
    let errorType = [];
    if (!props.isInvalid) return [];
    if (props.errorList.length) errorType.push(...props.errorList);
    return errorType.join("<br/>");
});

function onSubmit() {
    emit("save", form.value);
}
</script>

<template>
    <div
        style="background-color: rgba(0, 0, 0, 0.8)"
        class="fixed z-40 top-0 right-0 left-0 bottom-0 h-full w-full"
        v-show.transition.opacity="openModal"
    >
        <div
            class="p-4 max-w-xl mx-auto absolute left-0 right-0 overflow-hidden top-0 2xl:top-[15%]"
        >
            <div
                class="shadow absolute right-0 top-0 w-10 h-10 rounded-full bg-white text-gray-500 hover:text-gray-800 inline-flex items-center justify-center cursor-pointer"
                @click="emit('close', { isOpen: false, item: null })"
            >
                <svg
                    class="fill-current w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z"
                    />
                </svg>
            </div>

            <div
                class="shadow w-full rounded-lg bg-white overflow-hidden w-full block p-8"
            >
                <h2 class="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">
                    {{ modalTitle }}
                </h2>

                <div role="alert" class="mb-4" v-if="showErrorList.length">
                    <div
                        class="bg-red-500 text-white font-bold rounded-t px-4 py-2"
                    >
                        เกิดข้อผิดพลาด
                    </div>
                    <div
                        class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700"
                    >
                        <p v-html="showErrorList"></p>
                    </div>
                </div>

                <div class="mb-4">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >ชื่อหมวดหมู่ <span class="text-red-800">*</span></label
                    >
                    <input
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        type="text"
                        v-model="form.eventCategoryName"
                        :class="{
                            'border-red-500 border-3':
                                !form.eventCategoryName && props.isInvalid,
                        }"
                        maxlength="100"
                    />
                    <div class="flex justify-between">
                        <div>
                            <p
                                class="text-error text-sm text-red-600"
                                v-if="
                                    !form.eventCategoryName && props.isInvalid
                                "
                            >
                                กรุณากรอกชื่อหมวดหมู่การจอง
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">
                                {{ form.eventCategoryName.length }} / 100
                            </p>
                        </div>
                    </div>
                </div>

                <div class="mb-4">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >รายละเอียดหมวดหมู่</label
                    >
                    <textarea
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full pt-4 pb-16 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        type="text"
                        v-model="form.eventCategoryDescription"
                        maxlength="500"
                    />
                    <div class="flex justify-end">
                        <p class="text-sm text-gray-600">
                            {{ form.eventCategoryDescription.length }} / 500
                        </p>
                    </div>
                </div>
                <div class="mb-4">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >ระยะเวลา (หน่วย นาที)
                        <span class="text-red-800">*</span></label
                    >
                    <input
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        v-model="form.eventDuration"
                        :class="{
                            'border-red-500 border-3':
                                isEventDurationInvalid && props.isInvalid,
                        }"
                    />
                    <p
                        class="text-error text-xs text-red-600"
                        v-if="isEventDurationInvalid && props.isInvalid"
                    >
                        {{ isEventDurationInvalid }}
                    </p>
                </div>
                <div class="mb-4 w-full">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >เจ้าของหมวดหมู่
                    </label>
                    <a-select
                        v-model:value="form.owner"
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        mode="multiple"
                        :options="options"
                    ></a-select>
                </div>

                <div class="mt-8 text-right">
                    <button
                        type="button"
                        class="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm mr-2"
                        @click="emit('close', !openModal)"
                    >
                        ยกเลิก
                    </button>
                    <button
                        type="button"
                        class="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 border border-green-700 rounded-lg shadow-sm"
                        @click="onSubmit"
                    >
                        บันทึก
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
