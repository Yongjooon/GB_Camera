import { createRouter, createWebHistory } from "vue-router";

import Start from '@/pages/Start.vue'
import SelectGuide from '@/pages/SelectGuide.vue'
import TakePicture from '@/pages/TakePicture.vue'
import GetPicture from '@/pages/GetPicture.vue'  
import SelectPicture from '@/pages/SelectPicture.vue'
import Result from '@/pages/Result.vue'



const router = createRouter({
    history: createWebHistory(),
    routes : [
        {path:'/', component:Start},
        {path:'/selectguide', component:SelectGuide},
        {path:'/takepicture', component:TakePicture},
        {path:'/getpicture', component:GetPicture},
        {path:'/selectpicture', component:SelectPicture},
        {path:'/result', component:Result}
    ]   
})
export default router;