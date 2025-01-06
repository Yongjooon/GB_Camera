<template>
    <div class="container" v-if="isReady">   
        <!-- guide 이미지와 합성 결과 표시 -->
        <div class="guide-container">
            <img :src="'../../public/images/guide/' + guide" alt="Guide Image" v-show="!isCanvasVisible" class="guideImage"/>
            <canvas v-show="isCanvasVisible" ref="canvas" class="canvas"></canvas>
        </div>

        <div class="button-group">
            <button @click="makeImage(0)">
                <img :src="getImageSrc(0)" alt="Image 0" />
            </button>
            <button @click="makeImage(1)">
                <img :src="getImageSrc(1)" alt="Image 1" />
            </button>
            <button @click="makeImage(2)">
                <img :src="getImageSrc(2)" alt="Image 2" />
            </button>
            <button @click="makeImage(3)">
                <img :src="getImageSrc(3)" alt="Image 3" />
            </button>
            <button @click="makeImage(4)">
                <img :src="getImageSrc(4)" alt="Image 4" />
            </button>
            <button @click="makeImage(5)">
                <img :src="getImageSrc(5)" alt="Image 5" />
            </button>
        </div>

        <!-- Next 버튼 -->
        <button @click="goNext" class="next-button">Next</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import SendApi from '@/api/SendApi';
import QRCode from "qrcode";

const router = useRouter();
const userStore = useUserStore();

const guide = ref(''); // guide 이미지 경로
const isReady = ref(false); // 화면 준비 여부
const canvas = ref(null); // Canvas 요소 참조
const addedImages = ref(0); // 추가된 이미지 수
const isCanvasVisible = ref(false);

// 각 버튼 이미지를 배치할 위치
const positions2 = [
    { x: 22, y: 72 }, // 왼쪽 위
    { x: 212, y: 72 }, // 오른쪽 위
    { x: 22, y: 317 }, // 왼쪽 아래
    { x: 212, y: 317 }, // 오른쪽 아래
];

const positions = [
    { x: 62.7, y: 212 }, // 왼쪽 위
    { x: 613, y: 212 }, // 오른쪽 위
    { x: 62.7, y: 924 }, // 왼쪽 아래
    { x: 613, y: 924 }, // 오른쪽 아래
];


// 이미지 경로를 동적으로 반환하는 메서드
const getImageSrc = (num) => {
    return `../../public/images/camera/${userStore.user.userNo}_${num}.png`;
};

const goNext = () => {
    const canvasDataURL = canvas.value.toDataURL('image/png'); // canvas를 PNG 이미지로 변환
    // canvasDataURL을 서버에 업로드하거나, 로컬 파일로 저장할 수 있음
    // 예시로 console.log로 출력
    console.log(canvasDataURL);

    // 여기서 예를 들어, 이미지를 파일로 저장하거나 서버로 전송하는 로직을 추가
    // 예시로 이미지를 Blob으로 변환하고 다운로드 링크 생성
    const link = document.createElement('a');
    link.href = canvasDataURL;
    link.download = `${userStore.user.userNo}_result.png`; // 다운로드할 파일 이름
    link.click(); // 파일 다운로드

    sendPicture(canvasDataURL);

    router.push('/getpicture');
};

// 이미지 합성 함수
const makeImage = async (num) => {
    
    if (addedImages.value >= positions.length) return; // 모든 위치가 채워지면 종료

    const selectedImagePath = `../../public/images/camera/${userStore.user.userNo}_${num}.png`;
    const guideImagePath = `../../public/images/guide/${guide.value}`;

    // Canvas에 이미지 합성
    const ctx = canvas.value.getContext('2d', { willReadFrequently: true });

    // 이미지 로드 함수
    const loadImage = (src) =>
        new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = src;
        });

    const guideImage = await loadImage(guideImagePath);
    const selectedImage = await loadImage(selectedImagePath);

    // Canvas 크기 설정
    if (addedImages.value === 0) {
        // 최초 실행 시 Canvas 크기 설정
        canvas.value.width = guideImage.width;
        canvas.value.height = guideImage.height;
        //ctx.drawImage(guideImage, 0, 0); // 배경(guide) 이미지 그리기
    }

    // 현재 Canvas 내용을 저장
    const existingCanvas = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height);

    // guide.value에 따라 사용할 위치와 크기 설정
    console.log(guide.value);
    const usePositions = guide.value === 1 ? positions2 : positions;
    const imageWidth = guide.value === 1 ? 176 : 507;
    const imageHeight = guide.value === 1 ? 234 : 673;


    // 버튼 이미지 합성 (정해진 위치에 배치)
    const position = positions[addedImages.value]; // 현재 배치 위치
    ctx.putImageData(existingCanvas, 0, 0); // 기존 내용을 복원
    ctx.drawImage(selectedImage, position.x, position.y, imageWidth, imageHeight); // 버튼 이미지 추가

    // guide 이미지 그리기
    ctx.drawImage(guideImage, 0, 0); // 배경(guide) 이미지 그리기

    addedImages.value++; // 추가된 이미지 수 증가
    isCanvasVisible.value = true;

};

//이미지 보내기
const sendPicture = async (DataURL) => {
    try {
        const picture = {
            base64Data: DataURL, // base64 인코딩된 데이터
            filename: `${userStore.user.userNo}.png`,       // 업로드할 파일 이름
        };
        const send = await SendApi.send(picture); // /home/info 호출
        console.log(send.data.filename);  // userInfo 값 확인
        // 서버의 파일 경로 생성
        let fileUrl = `http://gaebong.duckdns.org:8080/page/download/${send.data.filename}`;

        // .png 확장자 제거
        fileUrl = fileUrl.replace(/\.png$/, "");

        // QR 코드 생성
        const qrCodeDataUrl = await QRCode.toDataURL(fileUrl);

        // QR 코드를 이미지로 저장
        saveQRCode(qrCodeDataUrl, `${userStore.user.userNo}_qrcode.png`);

        console.log("QR 코드 생성 및 저장 완료:", fileUrl);


    } catch (error) {
        console.error('사용자 정보 가져오는 함수 API 호출 중 오류 발생:', error);
    }
};

// QR 코드 저장 함수
const saveQRCode = (qrCodeDataUrl, fileName) => {
    const link = document.createElement("a");
    link.href = qrCodeDataUrl;
    link.download = fileName;
    link.click();
};




// Pinia 상태를 가져와 guide에 설정 및 화면 표시 준비
onMounted(() => {
    setTimeout(() => {
        guide.value = userStore.state.selectedImage; // Pinia 상태 반영
        isReady.value = true;
    }, 500);
});
</script>


<style scoped>
.container {
        background-color: #415088;
        width: 100vw; 
        height: 100vh;
        margin: 0;
        display: flex; /* 내용 정렬을 위한 flex 사용 */
        flex-direction: row;
        justify-content: center; /* 세로 중앙 정렬 */
        align-items: center;
        text-align: center;
    }


.guide-container {
    width: 60%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.guideImage{
    width: auto;
    height: 90%;
    margin-right: 400px;
}

.button-group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px; /* 버튼 간격 */
    height: 80%;
    justify-content: center;
}

.canvas {
    width: auto;
    height: 90%;
    margin-right: 400px;
    border: 1px solid #ccc;
}


button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
}

button img {
    width: 100%;
    max-width: 110px;
    display: block;
}

button img:hover {
    opacity: 0.8;
}

.next-button {
    background-color: #182D7A;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    width: 100%;
    max-width: 200px;
    position: absolute;
    bottom: 20px;
    margin-left: 100px;
}

.next-button:hover {
    background-color:#0D173B;
}
img{
    -webkit-user-drag: none; /* 드래그 방지 (WebKit 기반 브라우저) */
    user-drag: none;
}
</style>
