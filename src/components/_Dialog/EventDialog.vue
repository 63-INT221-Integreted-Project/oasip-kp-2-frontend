<script setup>
import { ref } from "@vue/reactivity";
import { computed, onMounted } from "@vue/runtime-core";
import dayjs from "dayjs";
import InputAutocomplete from "../InputAutocomplete.vue";

const props = defineProps({
    openModal: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: "",
    },
    item: {
        type: Object,
        default: null,
    },
    eventCategories: {
        type: Array,
    },
    date: {
        type: String,
        default: dayjs(),
    },
});
const emit = defineEmits(["close"]);

const form = ref({
    bookingName: props.item?.bookingName || "",
    bookingEmail: props.item?.bookingEmail || "",
    eventStartTime: props.item?.eventStartTime || "",
    eventDuration: props.item?.eventDuration || "",
    eventCategory: props.item?.eventCategory || "",
    eventNotes: props.item?.eventNotes || "",
});

const today = ref(dayjs().format("YYYY-MM-DDTHH:mm"));

onMounted(() => {
    setInterval(() => {
        today.value = dayjs().format("YYYY-MM-DDTHH:mm");
        compareDate();
    }, 1000);
});

const getEventCategoriesName = computed(() => {
    return props.eventCategories?.map((ec) => ec.eventCategoryName) || [];
});

function checkIfEventCategoryExists() {
    let exist = getEventCategoriesName.value.includes(form.value.eventCategory);
    if (!exist) return (form.value.eventCategory = "");
    form.value.eventDuration = props.eventCategories?.find(
        (ec) => ec.eventCategoryName === form.value.eventCategory
    )?.eventDuration;
}

function compareDate() {
    if (dayjs(form.value.eventStartTime).isBefore(today.value)) {
        form.value.eventStartTime = today.value;
    }
}
</script>

<template>
    <div
        style="background-color: rgba(0, 0, 0, 0.8)"
        class="fixed z-40 top-0 right-0 left-0 bottom-0 h-full w-full"
        v-show.transition.opacity="openModal"
        @click.self.prevent="emit('close', !openModal)"
    >
        <div
            class="p-4 max-w-xl mx-auto relative absolute left-0 right-0 overflow-hidden top-[25%]"
        >
            <div
                class="shadow absolute right-0 top-0 w-10 h-10 rounded-full bg-white text-gray-500 hover:text-gray-800 inline-flex items-center justify-center cursor-pointer"
                @click="emit('close', !openModal)"
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
                    {{ title }}
                </h2>

                <div class="mb-4">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >ชื่อกิจกรรม</label
                    >
                    <input
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        type="text"
                        v-model="form.bookingName"
                    />
                </div>

                <div class="mb-4">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >อีเมล</label
                    >
                    <input
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        type="text"
                        v-model="form.bookingEmail"
                    />
                </div>
                <div class="mb-4">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >หมวดหมู่กิจกรรม
                    </label>

                    <input
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        type="text"
                        v-model="form.eventCategory"
                        list="eventCategoriesList"
                        @blur="checkIfEventCategoryExists"
                    />
                    <datalist id="eventCategoriesList">
                        <template v-for="(ec, index) in getEventCategoriesName">
                            <option :data-value="ec">{{ ec }}</option>
                        </template>
                    </datalist>
                </div>
                <div class="mb-4">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >ช่วงเวลาเริ่มต้น</label
                    >
                    <input
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        type="datetime-local"
                        v-model="form.eventStartTime"
                        :min="today"
                        @blur="compareDate"
                    />
                </div>
                <div class="mb-4">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >ช่วงเวลา</label
                    >
                    <input
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        type="text"
                        v-model="form.eventDuration"
                    />
                </div>
                <div class="mb-4">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >หมายเหตุ</label
                    >
                    <textarea
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-8 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        v-model="form.eventNotes"
                    />
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
                        @click="emit('save', form)"
                    >
                        บันทึก
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>