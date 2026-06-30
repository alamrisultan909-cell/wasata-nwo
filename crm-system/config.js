// Google Sheets API Configuration - Comprehensive Mediation Platform
// هذا الملف هو المحرك الرئيسي للربط السحابي مع جداول بيانات جوجل
const CONFIG = {
    // 1. معرف الجدول (Spreadsheet ID)
    SPREADSHEET_ID: '1N-E6G5-SULTAN-WASATA-SHEET-ID', 
    
    // 2. مفتاح الوصول الخاص (PRIVATE KEY) - تم تنسيقه ليعمل مباشرة في GitHub/Vercel
    PRIVATE_KEY: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC1cXrbv5r+2fRy
WuerYM+kaFvosyo7xoGqe2SfrYZu/KA2tTx6dusVSts9XPkEAx2CQ+UeB4Mpc2+3
bneBFZkBDYEQANFFo1sotksbW61cLGdcdqB2ouXN/MkG7o9iV7UwQirx5oT5LKMh
VlBwHnA8GwJn5HzlO0L3hZF21zGwbqLxciNp7Z/xXVEGhoPAI7m/lDIwHhMV6iH1
9aF/Jfhi9DOdoCt57y0YfSTEWqx7Y6IC2P+iZraLzteomIcm4bG5wN02zNR469+o
YpyaqEskknjkZourGf+mGh9005OL1yUZZ2ZkpIUPhE9qBlMxs71fQhwL093ap3an
FgBnq0IDAgMBAAECggEAJK+sOrBUI4FoNpMA0psBgOmE49kOCgYKA7FtWAfa7afw
sP8WGmDfCXAYQiEBTHlgxwz5T4gPUhtAFGOmkBgQ1rCnTtgLeDweW234Y7C2rbNg
tsZZjYNEWdDpyJgFr8myHe7TBhQpAMSwuzXbj7/ny49efikpw6Om16tPDStXpadx
5SQdBFe8kKThffb8yzEq+PYdS9SfKquCGuZeprRa5pphsbbXoXvclCo0f8Pja/Il
Q2S6bhZp4r9qiC4VgfHN2KSIlE4IvsLCQJChlD/bZPCplHMiSOElOpwEvnBqsKRF
1ooozgKq91LuuDDl5oTcivyI6+wMRKAyvIw7xa0gsQKBgQDdaaVipZDxGLHOTQgT
Rbm+Ba3Jhrh4+NvtmlugS5fzI1tugJDTXGXXPzfqMFxrZC/7XRNznQy39kCPNeq+
9QE/H+bX28OHKkacuQ6k8YPApV1x8c/Rz+HGFbe9PL39g83WeDnXfzXX9kKZlMfm
aIyC5wBX6rtgNKdiEbA/orjVSwKBgQDRyXJV7CogTR452u0kwyvUd4RqmD4w0VSD
BKLhhCyP8UVX8DWg3ZSALUFt7erB6jcpvOWjxJOzpDuNaAWiBPQPj8dpgo1Adr4g
Cbhsy8EmbUcZlqxPj7EzQFb1igiezRz790i72VROR5sKuDbejI2eldVPMze+6lLb
SZbRXcirKQKBgEbnPQIhGRBMIyx4eJyLWJbkhKmjjdGXh/5Hzw2/B3LiILZ7T2WQ
EkDiysohIId3dvIc9Uyxv0/t+PCjiIAMP5Dya182zh+rxx8LGAh0GwgHLKx/jliX
JKrla4ibOhBENBd5OrSq1RhKkTtTbMx5MH3+8Zo13jlJw0xhc7p9JomPAoGASZa9
ebBvEoeau7a1Cvk/jbcjBvVCk4NKfu8IZ80iiJecuH01gqlXZyL42aPkfoM3OHff
ofPZz+EjVrYPi8brCe5oh/VYsS02Ai0GuXs71MvubeZxqTMBeLXwCw+ReIsAyM30
gJh6vz7U/wyhiq2JHAD5I2AXBOxThkKpGeYo9wkCgYAzlb0QEiYMzRp3cGN4FCYS
JssVUiphP2dd7LCM/NZ1AR9h7Q1RNSQ9xhUpuYkFpJhmvhKfK6QqO7SGPr+kjNWy
9RngpJ+gMqnwDZen7jnmcI4nXLfo3XFI6EYR1yTX1C66Twy7eT4OWuIRraegVCo5
u+1Q8yEMC6lOgquUjMTVtw==
-----END PRIVATE KEY-----`,

    // 3. البريد الإلكتروني لخدمة جوجل المعتمد
    CLIENT_EMAIL: 'wasata-service-account@wasata-nwo.iam.gserviceaccount.com',

    // 4. أسماء أوراق العمل في جدولك (يجب أن تطابق الأسماء في قوقل شيت)
    SHEETS: {
        CUSTOMERS: 'بيانات العملاء',
        FINANCIALS: 'عمولات المكتب',
        PAYMENTS: 'سداد العملاء',
        USERS: 'إدارة المستخدمين'
    },
    
    // 5. روابط النشر الرسمية
    DEPLOYMENT_URL: 'https://wasata.sa/app',
    PUBLIC_SITE_URL: 'https://wasata.sa'
};

export default CONFIG;
