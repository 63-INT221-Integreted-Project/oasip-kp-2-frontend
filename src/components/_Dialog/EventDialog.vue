<script setup>
import { ref } from "@vue/reactivity";
import { computed, onMounted } from "@vue/runtime-core";
import dayjs from "dayjs";
import { useUtilStore } from "../../stores/utils";
import InputAutocomplete from "../InputAutocomplete.vue";
import Sweetalert from "sweetalert2";
import { useUserStore } from "../../stores/user";
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
    event: {
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
    isInvalid: {
        type: Boolean,
        default: false,
    },
    isSameBookingDateTime: {
        type: Boolean,
        default: false,
    },
    errorType: {
        type: Array,
        default: [],
    },
});
const emit = defineEmits(["close", "onSave"]);

const util = useUtilStore();

const file = ref(null);

const form = ref({
    eventId: props.event?.eventId || "",
    bookingName: props.event?.bookingName || "",
    bookingEmail: props.event?.bookingEmail || "",
    eventStartTime: props.event?.eventStartTime || "",
    eventDuration: props.event?.eventDuration || "",
    eventCategory: props.event?.eventCategory || "",
    eventFile: props.event?.eventFile || "",
    eventNotes: props.event?.eventNotes || "",
});

const today = ref(dayjs().add(1, "minute").format("YYYY-MM-DDTHH:mm"));
// const today = ref(
//     dayjs("2022-09-29 22:25").add(1, "minute").format("YYYY-MM-DDTHH:mm")
// );

onMounted(() => {
    if (!props.event.bookingEmail) {
        form.value.bookingEmail = userStore.getUserEmail();
    }
    if (dayjs(form.value.eventStartTime).format() === "Invalid Date") {
        form.value.eventStartTime = today.value;
    }
    setInterval(() => {
        today.value = dayjs().add(1, "minute").format("YYYY-MM-DDTHH:mm");
        compareDate();
    }, 1000);
});

const getEventCategoriesName = computed(() => {
    return props.eventCategories?.map((ec) => ec.eventCategoryName) || [];
});

const datePreview = computed(() => {
    if (!form.value.eventStartTime || !form.value.eventDuration) {
        return "";
    }
    return (
        dayjs(form.value.eventStartTime).format("HH:mm") +
        " - " +
        dayjs(form.value.eventStartTime)
            .add(form.value.eventDuration, "minute")
            .format("HH:mm")
    );
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

const showErrorList = computed(() => {
    return props.errorType.join("<br/>");
});

const isEmailInvalid = computed(() => {
    if (!form.value.bookingEmail) return "กรุณากรอกอีเมล";
    if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
            form.value.bookingEmail
        )
    )
        return "รูปแบบอีเมลไม่ถูกต้อง";
    return "";
});
const isEventDurationInvalid = computed(() => {
    if (!form.value.eventDuration) return "กรุณากรอกระยะเวลาการจอง";
    if (isNaN(form.value.eventDuration))
        return "ระยะเวลาต้องเป็นตัวเลขเท่านั้น";
    if (!(form.value.eventDuration >= 1 && form.value.eventDuration <= 480))
        return "ช่วงระยะเวลาในการจองต้องอยู่ในช่วง 1 - 480 นาที";
    return "";
});

function onFileChange(e) {
    file.value = e.target.files[0];
    //*Convert file size to MB
    const fileSize = file.value.size / 1024 / 1024;
    if (fileSize > 10) {
        return Sweetalert.fire({
            icon: "error",
            title: "ขนาดไฟล์ใหญ่เกินไป",
            text: "กรุณาอัพโหลดไฟล์ขนาดไม่เกิน 10 MB",
        });
    }
}

function filePath(file) {
    if (!file) return "";
    return `${import.meta.env.VITE_FILE_BASE_URL}${file.filePath}`;
}
</script>

<template>
    <div
        style="background-color: rgba(0, 0, 0, 0.8)"
        class="fixed z-10 top-0 right-0 left-0 bottom-0 h-full w-full overflow-scroll"
        v-show.transition.opacity="openModal"
    >
        <div
            class="p-4 max-w-xl mx-auto absolute left-0 right-0 top-0 2xl:top-[5%]"
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
                class="shadow w-full rounded-lg bg-white block p-8 overflow-scroll"
            >
                <h2 class="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">
                    {{ title }}
                </h2>

                <div role="alert" class="mb-4" v-if="isInvalid">
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
                        >ชื่อการจอง <span class="text-red-800">*</span></label
                    >
                    <input
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        :class="{
                            'border-red-500 border-3':
                                isInvalid && form.bookingName.length < 1,
                        }"
                        type="text"
                        v-model="form.bookingName"
                        :readonly="!!form.eventId"
                        maxlength="100"
                    />
                    <div class="flex justify-between">
                        <div>
                            <p
                                class="text-left text-error text-xs text-red-600"
                                v-if="isInvalid && !form.bookingName"
                            >
                                กรุณากรอกชื่อการจอง
                            </p>
                        </div>
                        <div>
                            <p class="text-right text-sm text-gray-600">
                                {{ form.bookingName.length }} / 100
                            </p>
                        </div>
                    </div>
                </div>

                <div class="mb-4">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >อีเมล <span class="text-red-800">*</span></label
                    >
                    <input
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        :class="{
                            'border-red-500 border-3':
                                isInvalid && isEmailInvalid,
                        }"
                        type="text"
                        v-model="form.bookingEmail"
                        :readonly="!!form.eventId"
                        maxlength="50"
                        :disabled="userStore.getUserEmail()"
                    />
                    <p
                        class="text-error text-xs text-red-600"
                        v-if="isInvalid && isEmailInvalid"
                    >
                        {{ isEmailInvalid }}
                    </p>
                </div>
                <div class="mb-4">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >หมวดหมู่การจอง <span class="text-red-800">*</span>
                    </label>

                    <input
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        type="text"
                        v-model="form.eventCategory"
                        list="eventCategoriesList"
                        :class="{
                            'border-red-500 border-3':
                                isInvalid && !form.eventCategory,
                        }"
                        @blur="checkIfEventCategoryExists"
                        :readonly="!!form.eventId"
                    />
                    <datalist id="eventCategoriesList">
                        <template v-for="(ec, index) in getEventCategoriesName">
                            <option :data-value="ec">{{ ec }}</option>
                        </template>
                    </datalist>
                    <p
                        class="text-error text-xs text-red-600"
                        v-if="isInvalid && !form.eventCategory"
                    >
                        กรุณาเลือกหมวดหมู่การจอง
                    </p>
                </div>
                <div class="mb-4">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >ช่วงเวลาการจอง
                        <span class="text-red-800">*</span></label
                    >
                    <input
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        type="datetime-local"
                        v-model="form.eventStartTime"
                        :class="{
                            'border-red-500 border-3':
                                isInvalid && !form.eventStartTime,
                        }"
                        :min="today"
                        @blur="compareDate"
                    />
                    <p
                        class="text-error text-xs text-red-600"
                        v-if="isInvalid && !form.eventStartTime"
                    >
                        กรุณาเลือกเวลาที่ต้องการ
                    </p>
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
                        type="text"
                        :class="{
                            'border-red-500 border-3':
                                isInvalid && isEventDurationInvalid,
                            // isInvalid && isEventDurationInvalid,
                        }"
                        :readonly="!!form.eventId"
                        @keypress="util.isNumberOnly"
                    />
                    <p
                        class="text-error text-xs text-red-600"
                        v-if="isInvalid && isEventDurationInvalid"
                    >
                        <!-- v-if="isInvalid && isEventDurationInvalid"
                    > -->
                        {{ isEventDurationInvalid }}
                    </p>
                </div>
                <div class="mb-4">
                    <p class="text-center font-bold">
                        เวลาการจอง
                        <span class="text-green-800" v-if="datePreview">
                            {{ datePreview }}
                        </span>
                        <span class="text-red-500" v-else>
                            กรุณาเลือกช่วงเวลาและระยะเวลาการจอง
                        </span>
                    </p>
                </div>
                <div class="mb-4">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >หมายเหตุ</label
                    >
                    <textarea
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-8 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        v-model="form.eventNotes"
                        maxlength="500"
                    />
                    <div class="flex justify-end">
                        <span class="text-sm text-gray-600">
                            {{ form.eventNotes.length }} / 500
                        </span>
                    </div>
                </div>
                <div class="mb-4" v-if="event.file">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >File</label
                    >
                    <!-- Create outlined button tailwind here -->
                    <a
                        class="border-2 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        :class="{
                            'border-blue-500 hover:border-blue-700 text-blue-700':
                                event.file,
                            'border-red-500 hover:border-red-700 text-red-700':
                                !event.file,
                        }"
                        type="button"
                        :href="filePath(event.file)"
                    >
                        {{ event.file ? "View file" : "No file" }}
                    </a>
                </div>
                <div class="mb-4">
                    <label
                        class="text-gray-800 block mb-1 font-bold text-sm tracking-wide"
                        >Upload file (Maximum:
                        <span class="text-red-600">10 MB</span>)</label
                    >
                    <input
                        class="block w-full p-2 bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        id="file_input"
                        type="file"
                        @input="onFileChange"
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
                        @click="emit('onSave', { event: form, file: file })"
                    >
                        บันทึก
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
