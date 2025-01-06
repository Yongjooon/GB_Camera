import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { v4 as uuidv4 } from 'uuid';

export const useUserStore = defineStore('user', () => {
    const state = reactive({
        selectedImage: '', // 선택된 이미지 이름
    });

    const setSelectedImage = (imageName) => {
        state.selectedImage = imageName;
    };

    const user = reactive({
        userNo: 0
    });

    const updateUser = () =>{
        user.userNo = uuidv4(); // UUID 생성하여 user.userNo에 저장
        console.log('Updated userNo:', user.userNo); // 확인용 로그
    }

    return {state,setSelectedImage, user, updateUser};
});
