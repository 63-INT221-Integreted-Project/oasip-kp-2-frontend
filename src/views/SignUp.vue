<template>
    <div class="flex w-full justify-around space-x-4 md:space-x-8 px-9">
        <div
            class="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg md:w-1/3 lg:w-1/3 sm:w-1/3"
        >
            <h3 class="text-2xl font-bold text-center">Join us</h3>
            <form action="">
                <div class="mt-4">
                    <div>
                        <label class="block" for="Name">Name</label>
                        <input
                            type="text"
                            placeholder="Name"
                            class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                    </div>
                    <div class="mt-4">
                        <label class="block" for="email">Email</label>
                        <input
                            type="text"
                            placeholder="Email"
                            class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                    </div>
                    <div class="mt-4">
                        <label class="block">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                    </div>
                    <div class="mt-4">
                        <label class="block">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                    </div>
                    <span class="text-xs text-red-400"
                        >Password must be same!</span
                    >
                    <div class="flex">
                        <button
                            class="w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                        >
                            Create Account
                        </button>
                    </div>
                    <div class="mt-6 text-grey-dark">
                        Already have an account?
                        <a class="text-blue-600 hover:underline" href="#">
                            Log in
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style></style>
