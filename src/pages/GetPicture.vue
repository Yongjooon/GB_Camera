<template>
    <div class="guide">
        <h2 v-if="!isLoaded">이미지 생성중....</h2>
        <img v-if="isLoaded" :src="getImageSrc()" alt="Result Image">
        <div class="button-guide">
            <button @click="goFirst">사진 다운로드</button>
        </div>
    </div>
</template>
<script setup>
    import { useRouter } from 'vue-router';
    import { ref, onMounted } from 'vue';
    import { useUserStore } from '../stores/userStore';

    const userStore = useUserStore();

    const router = useRouter();
    // 이미지를 2초 뒤에 표시할 상태 변수
    const isLoaded = ref(false);

    onMounted(() => {
        // 컴포넌트가 마운트 된 후 2초 후에 이미지를 표시
        setTimeout(() => {
            isLoaded.value = true;
        }, 2000);
    });

    const goFirst = () =>{
        router.push('/result');
    }

    const getImageSrc = () => {
    return `../../public/images/camera/${userStore.user.userNo}_result.png`;
};

</script>
<style scoped>
    .guide{
            background-color: #415088;
            width: 100vw; 
            height: 100vh;
            margin: 0;
            display: flex; /* 내용 정렬을 위한 flex 사용 */
            flex-direction: column; /* 세로 방향 정렬 */
            justify-content: center; /* 세로 중앙 정렬 */
            align-items: center;
        }


    img{
        height: 75%;
        width: auto;
        margin: 1%;
        border: 5px solid white; /* 흰색 테두리 추가 */
        border-radius: 10px; 
    }

    .button-guide {
        display: flex; /* 버튼들을 가로로 정렬 */
        justify-content: center; /* 버튼 간격 균일화 */
        gap: 10px; /* 버튼 간 간격 추가 */
        margin-top: 20px; /* 이미지와 버튼 사이의 간격 */
        width: 40%;
    }
    button{
        background-color: #182D7A;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        width: 100%;
        max-width: 200px;

    }
    h2 {
        text-align: center;
        font-size: 2rem;
        color: white;
    }
</style>