<template>
    <div class="container">
        <p>프레임을 골라보세요</p>
        <div class="button-group">
            <button @click="selectImage('1.png')">
            <img src="../../public/images/guide/1.png" />
            </button>
            <button @click="selectImage('2.png')">
            <img src="../../public/images/guide/2.png" />
            </button>
        </div>
    </div>
</template>

<script setup>
    import { useRouter } from 'vue-router';
    import { useUserStore } from '../stores/userStore'; // Pinia store import
    
    const router = useRouter();
    const userStore = useUserStore(); // Pinia store 초기화
    
    // 버튼 클릭 시 이미지 선택 및 경로 이동
    const selectImage = (imageName) => {
        userStore.setSelectedImage(imageName); // Pinia 상태에 이미지 이름 저장
        router.push('/takepicture'); // 라우터 이동
    };
</script>

<style scoped>
@font-face {
    font-family: 'GmarketSansBold';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansBold.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
:root {
        font-family: 'GmarketSansBold', sans-serif;
    }
    .container {
        background-color: #415088;
        width: 100vw; 
        height: 100vh;
        margin: 0;
        display: flex; /* 내용 정렬을 위한 flex 사용 */
        flex-direction: column; /* 세로 방향 정렬 */
        justify-content: center; /* 세로 중앙 정렬 */
        align-items: center;
        text-align: center;
    }
    p{
        
        color: white;
        text-align: center;
        font-size: 50px;
        margin: 30px; /* 기본 여백 제거 */
    }
    img{
        border: 5px solid white; /* 흰색 테두리 추가 */
        border-radius: 3px; 
        -webkit-user-drag: none; /* 드래그 방지 (WebKit 기반 브라우저) */
        user-drag: none;
    }
    
    .button-group {
        display: flex;
        width: 100%;
        height: 80%;
        bottom: 0;
        justify-content: center;
        gap: 50px; /* 버튼 간격 */
    }
    
    button {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        width: 50%;
        height: 100%;
        display: flex; /* 이미지 중앙 정렬을 위한 flex */
        justify-content: center; /* 가로 정렬 */
        align-items: center; /* 세로 정렬 */
    }
    
    button img {
        width: auto; /* 이미지 크기 100%로 조정 */
        height: 80%;
        display: block;
        
    }
</style>
