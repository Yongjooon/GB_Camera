<template>
    <div class="guide" @click="goSelectGuide">
        <p class="message">여호와여 왕이 주의 힘을 인하여 기뻐하며 주의 구원을 인하여 크게 즐거워하리이다.</p>
        <img src="../../public/images/logo.png">
        <div class="footer">
            <p class="act">화면을 터치해 주세요.</p>
        </div>
    </div>
</template>
<script setup>
    import { useRouter } from 'vue-router';
    import { useUserStore } from '../stores/userStore';
    const router = useRouter();
    const userStore = useUserStore();

    const goSelectGuide = () =>{
        userStore.updateUser();
        router.push('/selectguide');
    }
</script>
<style>
@font-face {
    font-family: 'GmarketSansBold';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansBold.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
:root {
        font-family: 'GmarketSansBold', sans-serif;
    }
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
    .message{
        position: absolute;
        width: 100%;
        top: 10px; /* 위로 10px 여백 */
        left: 50%; /* 가로 중앙 정렬 */
        transform: translateX(-50%); /* 정렬 보정 */
        color: white;
        text-align: center;
        font-size: 20px;
    }
    .footer{
        background-color: #0D173B;
        width: 100%;
        height: 15vh;
        display: flex; /* 내용 정렬을 위한 flex 사용 */
        justify-content: center; /* 가로 중앙 정렬 */
        align-items: center; /* 세로 중앙 정렬 */
        position: absolute;
        bottom: 0;
    }
    .act{
        color: white;
        text-align: center;
        font-size: 50px;
    }
    img{
        width: 40%; /* 크기를 2배로 설정 */
        height: auto; /* 비율 유지 */
        position: relative;
        -webkit-user-drag: none; /* 드래그 방지 (WebKit 기반 브라우저) */
        user-drag: none;
    }
</style>