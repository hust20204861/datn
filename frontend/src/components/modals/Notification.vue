<template>
    <div v-if="modalShow" class="w-[450px] h-[100px] fixed top-3 left-1/2 -translate-x-1/2 flex justify-center items-center rounded-xl p-4" 
        :class="data.error ? ' bg-red-500' : 'bg-green-500'">
        <p v-if="data?.message" class="text-[20px] text-white font-semibold">{{ data.message }}</p>
        <p v-if="data?.error" class="text-[20px] text-white font-semibold">{{ data.error }}</p>
    </div>
</template>

<script>
import emitter from '@/emitter';
import { computed, onMounted, onUnmounted, ref } from 'vue';
    export default {
        setup(props) {
            const data = ref(null)
            onMounted(() => {
                // data.value =  props.data
                // emitter.on('NOTIFICATION', showModal)
                init()
            })

            const init = () => {
                emitter.on('*', async(type, ev) => {
                    switch (type) {
                        case 'NOTIFICATION':
                            data.value = ev
                            console.log(ev)
                            showModal()
                            break
                    }
                })
            }

            // onUnmounted(() => {
            //     emitter.off('NOTIFICATION', showModal)
            // })
            const modalShow = ref(false)
            const showModal = (payload) => {
                // if(payload){
                //     data.value = payload;
                // }
                modalShow.value = true

                setTimeout(() => {
                    modalShow.value = false
                }, 1000)
            }
            return { data, modalShow }
        }
    }
</script>