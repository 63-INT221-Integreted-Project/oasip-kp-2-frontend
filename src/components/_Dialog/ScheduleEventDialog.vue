<script setup>
import { computed } from "@vue/runtime-core";
import dayjs from "dayjs";
import { useUtilStore } from "../../stores/utils";
import {useUserStore} from '../../stores/user'

const userStore = useUserStore();


const props = defineProps({
    openModal: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: "",
    },
    events: {
        type: Array,
        default: () => [],
    },
    date: {
        type: String,
    },
});
const emit = defineEmits([
    "close",
    "bookingThisDate",
    "cancleEvent",
    "editEvent",
]);

const util = useUtilStore();

const isFromFutureOrToday = computed(() => {
    return (
        dayjs(props.date).format("YYYY-MM-DD") >= dayjs().format("YYYY-MM-DD")
    );
});

const eventSortByDateASC = computed(() => {
    return props.events.sort((a, b) => {
        return dayjs(a.eventStartTime).diff(dayjs(b.eventStartTime));
    });
});

function isCanModifyEvent(event) {
    return dayjs().diff(dayjs(event.eventStartTime), "second") <= 0;
}

function filePath(file) {
    if (!file) return "";
    return `${import.meta.env.VITE_FILE_BASE_URL}${file.filePath}`;
}
</script>

<template>
    <div
        style="background-color: rgba(0, 0, 0, 0.8)"
        class="fixed z-40 top-0 right-0 left-0 bottom-0 w-full"
        v-show.transition.opacity="openModal"
    >
        <div
            class="p-4 max-w-6xl mx-auto absolute left-0 right-0 overflow-hidden top-[5%] 2xl:top-[2%] 2xl:bottom-[2%]"
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
                class="shadow w-full rounded-lg bg-white overflow-hidden block p-8"
            >
                <h2 class="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">
                    {{ title }}
                </h2>
                <div class="flex justify-end">
                    <button
                        class="bg-indigo-500 text-white active:bg-indigo-600 text-sm font-bold uppercase px-3 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        v-if="isFromFutureOrToday && (userStore.isAdmin() || userStore.isStudent())"
                        @click="emit('bookingThisDate', date)"
                    >
                        + จองวันนี้
                    </button>
                </div>
                <div v-if="!events.length">
                    <div
                        class="flex flex-col items-center justify-center w-full p-12"
                    >
                        <img
                            src="/images/_svg/no-data.svg"
                            alt="calendar"
                            width="300"
                        />
                        <h2 class="text-xl text-center">ไม่มีการจองในวันนี้</h2>
                    </div>
                </div>

                <div class="mt-4 h-[400px] overflow-y-scroll" v-else>
                    <div
                        class="p-6 my-2 border-1 rounded-xl shadow-2xl"
                        v-for="(event, index) in eventSortByDateASC"
                        :key="index"
                    >
                        <div class="flex justify-between items-center">
                            <div class="text-ellipsis overflow-auto w-[80%]">
                                <h2 class="block text-lg">
                                    <span class="text-blue-700 font-bold"
                                        >หมวดหมู่: </span
                                    >{{ event.eventCategory.eventCategoryName }}
                                </h2>
                                <h2 class="block text-lg">
                                    <span class="text-blue-500 font-bold"
                                        >ชื่อการจอง:
                                    </span>
                                    <span
                                        v-if="!event.bookingName"
                                        class="text-red-700 italic font-thin"
                                        >ไม่ระบุชื่อ</span
                                    >
                                    <span v-else>
                                        {{ event.bookingName }}
                                    </span>
                                </h2>
                                <h3 class="block text-lg">
                                    <span class="text-blue-500 font-bold"
                                        >อีเมล:
                                    </span>
                                    <span
                                        v-if="!event.bookingName"
                                        class="text-red-700 italic font-thin"
                                        >ไม่ระบุอีเมล</span
                                    >
                                    <span v-else>
                                        {{ event.bookingEmail }}
                                    </span>
                                </h3>
                                <h3 class="block text-lg">
                                    <span class="text-blue-500 font-bold"
                                        >ระยะเวลา:
                                    </span>
                                    {{ util.getHoursAndMinutes(event) }} ({{
                                        event.eventDuration
                                    }}
                                    นาที)
                                </h3>
                                <h3 class="block text-lg">
                                    <span class="text-blue-500 font-bold"
                                        >หมายเหตุ:
                                    </span>
                                    <span
                                        v-if="!event.eventNotes"
                                        class="text-gray-400 italic font-thin"
                                        >ไม่มีหมายเหตุ</span
                                    >
                                    <span v-else>
                                        {{ event.eventNotes }}
                                    </span>
                                </h3>
                                <h3 class="block text-lg">
                                    <span class="text-blue-500 font-bold"
                                        >File ที่แนบมาในระบบ:
                                    </span>
                                    <a
                                        class="border-2 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
                                        :class="{
                                            'border-green-500 hover:border-green-700 text-green-700':
                                                event.file,
                                            'border-red-500 hover:border-red-700 text-red-700':
                                                !event.file,
                                        }"
                                        type="button"
                                        :href="filePath(event.file)"
                                    >
                                        {{
                                            event.file ? "View file" : "No file"
                                        }}
                                    </a>
                                </h3>
                            </div>
                            <div v-if="isCanModifyEvent(event)">
                                <div class="block mb-2">
                                    <button
                                        class="bg-yellow-500 hover:bg-blue-light text-white font-extrabold py-2 px-4 border-b-4 border-yellow-600 rounded mr-2"
                                        @click="emit('editEvent', event)"
                                    >
                                        แก้ไขการจอง
                                    </button>
                                </div>
                                <div class="block">
                                    <button
                                        class="bg-red-500 hover:bg-blue-light text-white font-extrabold py-2 px-4 border-b-4 border-red-600 rounded"
                                        @click="
                                            emit('cancleEvent', {
                                                isOpen: true,
                                                item: event,
                                            })
                                        "
                                    >
                                        ยกเลิกการจอง
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
