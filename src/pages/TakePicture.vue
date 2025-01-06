    <template>
        <div class="guide">
            <div class="content-wrapper">
                <video class="video" ref="video" autoplay playsinline></video>
                <div class="text-container">
                    <h2 v-show="showStartMessage">잠시후 촬영이<br> 시작됩니다.</h2>
                    <h1 v-show="!showStartMessage">         {{ countdown }}</h1>
                    <h1 v-show="!showStartMessage" class="capture-count">{{ captureCount }}/6</h1>
                </div>
            </div>
            <canvas ref="canvas" style="display: none;"></canvas>
            <a ref="downloadLink" style="display: none;">Download</a>
        </div>
    </template>
    
    <script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router'; // Vue Router 사용
    import { useUserStore } from '../stores/userStore';

    const userStore = useUserStore();
    
    const video = ref(null);
    const canvas = ref(null);
    const downloadLink = ref(null);
    const countdown = ref(10);
    let captureCount = 0; // 이미지 파일 이름을 위한 카운트
    const totalCaptures = 6; // 캡처 반복 횟수
    const showStartMessage = ref(true);
    
    const router = useRouter(); // 라우터 객체
    
    onMounted(() => {
        // 웹캠 화면 가져오기
        navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const videoDevices = devices.filter(device => device.kind === 'videoinput'); // 비디오 장치만 필터링
            
            // 사용자가 선택한 카메라 (여기서는 첫 번째 카메라를 선택)
            const selectedCamera = videoDevices[1]; // 또는 원하는 카메라로 설정 (예: videoDevices[1])
            
            // 선택된 카메라의 deviceId를 사용하여 웹캠 스트림 가져오기
            return navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: selectedCamera.deviceId, // 원하는 카메라 선택
                    aspectRatio: 176 / 234, // 비율 설정
                    //aspectRatio: 352 / 468,
                    //facingMode: 'environment', 
                    
                }
            });
        })
        .then((stream) => {
            if (video.value) {
            video.value.srcObject = stream;
            video.value.style.transform = "scaleX(-1)"; // 좌우 반전
            }
        })
        .catch((err) => {
            console.error('Error accessing webcam: ', err);
        });

    setTimeout(() => {
        showStartMessage.value = false; 
        startCountdown(); // 카운트다운 시작
    }, 4000);
});

    
    // 카운트다운 및 캡처 동작
    const startCountdown = () => {
        countdown.value = 10;
        const interval = setInterval(() => {
            if (countdown.value > 1) {
            countdown.value -= 1;
            } else {
            clearInterval(interval);
            captureImage(); // 캡처 및 저장
            }
        }, 1000);
    };
    
    const captureImage = () => {
        if (!video.value || !canvas.value || !downloadLink.value) return;
        
        const ctx = canvas.value.getContext('2d');
        canvas.value.width = video.value.videoWidth;
        canvas.value.height = video.value.videoHeight;
            
        // 캡처 이미지 그리기
        ctx.translate(canvas.value.width, 0); // 캔버스 좌우 반전
        ctx.scale(-1, 1);
        ctx.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0); // 변환 초기화
        
        // 이미지 데이터를 URL로 변환
        const imageData = canvas.value.toDataURL('image/png');
        
        // 다운로드 링크 설정
        downloadLink.value.href = imageData;
        downloadLink.value.download = `${userStore.user.userNo}_${captureCount}.png`; // 파일 이름 설정
        downloadLink.value.click(); // 다운로드 트리거

        soundClick();
        
        captureCount += 1;
        
        if (captureCount < totalCaptures) {
            startCountdown(); // 다시 카운트다운 시작
        } else {
            console.log('All images captured.');
            
            // 모든 캡처 완료 후 /selectpicture로 이동
            router.push('/selectpicture');
        }
    };

    const soundClick = ()=>{
        const audio = new Audio('/click.wav'); // public 폴더에 있는 클릭 소리 파일
        audio.play();
    }
    
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

    .content-wrapper {
    display: flex; /* 이미지와 텍스트를 가로로 정렬 */
    align-items: center;
    justify-content: center;
}



.video {
    /* width: 32%; */
    width: 64%;
    height: auto;
    border: 2px solid #000;
    margin-right: 200px;
}

.text-container {
    display: flex;
    flex-direction: column; /* 세로로 정렬 */
    justify-content: center;
    align-items: center;
    text-align: center; /* 텍스트 중앙 정렬 */
    margin-top: 20px; /* 상단 여백 추가 */

    position: absolute; /* 텍스트가 video 위에 겹치지 않도록 위치 설정 */
    margin-left: 700px;
}

h1, h2 {
    margin: 0;
    text-align: center;
    width: 100%; /* 텍스트 정렬을 위해 고정 */
}

h1 {
    font-size: 4rem;
    color: white;
}

h2 {
    font-size: 2rem;
    color: white;
    line-height: 1.2;
    white-space: nowrap;
}
.capture-count {
    margin-top: 30px; /* 원하는 여백 값 (20px) */
    font-size: 3rem;
    color: white;
}
    </style>
    