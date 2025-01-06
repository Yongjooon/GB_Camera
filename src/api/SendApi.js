import api from '@/api/index';

const headers = {
    'Content-Type': 'multipart/form-data',
};

export default {
    //일반 회원가입
    async send(picture) {
        const payload = {
            fileData: picture.base64Data, // base64 인코딩된 데이터
            filename: picture.filename,  // 파일 이름
        };
        const { data } = await api.post(
        `/upload/base64`,
        payload,
        {
            headers: {
            'Content-Type': 'application/json',
            },
        }
        );
        return data;
    },
};