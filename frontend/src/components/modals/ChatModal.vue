<template>
    <!-- <div :class="{ 'absolute w-[600px] h-[500px] bg-gray-400 bottom-16 left-1 rounded-xl transition-all duration-300 ease-in-out' : onChat,
                  'absolute w-[600px] h-[500px] bg-gray-400 bottom-16 left-[-650px] rounded-xl transition-all duration-300 ease-in-out' : !onChat}">
    </div> -->
    <div :class="onChat ? 
        'absolute w-[600px] h-[500px] bg-gray-400 bottom-16 left-1 rounded-xl transition-all duration-300 ease-in-out' 
      : 'absolute w-[600px] h-[500px] bg-gray-400 bottom-16 left-[-650px] rounded-xl transition-all duration-300 ease-in-out'">
    </div>
</template>

<script>
    export default {
        props: {
            onChat : {
                type: Boolean,
                require: true,
            }
        }
    }
</script>