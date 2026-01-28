// ----------> category package <---------
export const seedDataCatePackage = [
    {
        id: 1,
        cateName: 'ແພັກເກັດລາຍວັນ',
    },
    {
        id: 2,
        cateName: 'ແພັກເກັດລາຍອາທິດ',
    },
    {
        id: 3,
        cateName: 'ແພັກເກັດລາຍເດືອນ',
    },
]

export const seedDataCatePackage_EN = [
    {
        catePackage_Id: 1,
        languageId: 2,
        cateName: 'Daily packages',
    },
    {
        catePackage_Id: 2,
        languageId: 2,
        cateName: 'Weekly packages',
    },
    {
        catePackage_Id: 3,
        languageId: 2,
        cateName: 'Monthly packages',
    },
]

// ---------------> seed data package <-----------------
import { makeSlugify } from '../utils/regex';
import { DOMAIN } from '../../constants/index';
let imageUrl = `${DOMAIN}/images/defaultPackage.jpg`;

export const seedDataPackage = [
    // {   // test
    //     id: 25,
    //     typePackage_Id: 1,
    //     priority: 14,
    //     code: 112,
    //     // en_name: '50,000₭/40 GB/30Days',
    //     name: '1,000K /2 GB / 1ຊົ່ວໂມງ',
    //     image: imageUrl,
    //     slug: makeSlugify('1,000K /2 GB / 1ຊົ່ວໂມງ')
    // },
    // Prepaid
    // Daily
    {
        id: 1,
        typePackage_Id: 1,
        catePackage_Id: 1,
        priority: 22,
        code: 116,
        name: 'Daily special 2',
        detail: '5,000ກີບ/5ກີກ/3ມື້',
        image: imageUrl,
        slug: makeSlugify('116-5,000ກີບ/5ກີກ/3ມື້-Daily special 2'),
    },
    {
        id: 2,
        typePackage_Id: 1,
        catePackage_Id: 1,
        priority: 21,
        code: 103,
        name: 'Daily Hot',
        detail: '10,000ກີບ/5ກີກ/3ມື້',
        image: `${DOMAIN}/images/package103.png`,
        slug: makeSlugify('103-10,000ກີບ/5ກີກ/3ມື້-Daily Hot')
    },
    {
        id: 3,
        typePackage_Id: 1,
        catePackage_Id: 1,
        priority: 20,
        code: 107,
        name: 'Daily non-stop',
        detail: '5,000ກີບ/2ກີກ(ຫຼີ້ນຕໍ່ເນື່ອງ)/1ມື້',
        image: imageUrl,
        slug: makeSlugify('107-5,000ກີບ/2ກີກ(ຫຼີ້ນຕໍ່ເນື່ອງ)/1ມື້-Daily non-stop')
    },
    {
        id: 4,
        typePackage_Id: 1,
        catePackage_Id: 1,
        priority: 19,
        code: 108,
        name: 'Daily non-stop 2',
        detail: '20,000ກີບ/5ກີກ(ຫຼີ້ນຕໍ່ເນື່ອງ)/4ມື້',
        image: imageUrl,
        slug: makeSlugify('108-20,000ກີບ/5ກີກ(ຫຼີ້ນຕໍ່ເນື່ອງ)/4ມື້-Daily non-stop 2')
    },
    {
        id: 5,
        typePackage_Id: 1,
        catePackage_Id: 1,
        priority: 18,
        code: 112,
        name: 'Daily happy hour',
        detail: '1,000ກີບ/2ກີກ(ຫຼີ້ນຕໍ່ເນື່ອງ)/1ຊົ່ວໂມງ',
        image: `${DOMAIN}/images/package112.png`,
        slug: makeSlugify('112-1,000ກີບ/2ກີກ(ຫຼີ້ນຕໍ່ເນື່ອງ)/1ຊົ່ວໂມງ-Daily happy hour')
    },
    {
        id: 6,
        typePackage_Id: 1,
        catePackage_Id: 1,
        priority: 17,
        code: 113,
        name: 'Daily Tiktok',
        detail: '2,500ກີບ/4ກີກ/1ມື້',
        image: imageUrl,
        slug: makeSlugify('113-2,500ກີບ/4ກີກ/1ມື້-Daily Tiktok')
    },
    {
        id: 7,
        typePackage_Id: 1,
        catePackage_Id: 1,
        priority: 16,
        code: 123,
        name: 'Daily Youtube+Tiktok',
        detail: '3,000ກີບ/4ກີກ/1ມື້',
        image: imageUrl,
        slug: makeSlugify('123-3,000ກີບ/4ກີກ/1ມື້-Daily Youtube+Tiktok')
    },
    {
        id: 8,
        typePackage_Id: 1,
        catePackage_Id: 1,
        priority: 15,
        code: 120,
        name: 'Daily Youtube+Facebook+Tiktok',
        detail: '20,000ກີບ/7ກີກ/5ມື້',
        image: imageUrl,
        slug: makeSlugify('120-20,000ກີບ/7ກີກ/5ມື້-Daily Youtube+Facebook+Tiktok')
    },
    // Weekly
    {
        id: 9,
        typePackage_Id: 1,
        catePackage_Id: 2,
        priority: 14,
        code: 117,
        name: 'Weekly special 2',
        detail: '10,000ກີບ/10ກີກ/6ມື້',
        image: imageUrl,
        slug: makeSlugify('117-10,000ກີບ/10ກີກ/6ມື້-Weekly special 2')
    },
    {
        id: 10,
        typePackage_Id: 1,
        catePackage_Id: 2,
        priority: 13,
        code: 104,
        name: 'Weekly special 3',
        detail: '10,000ກີບ/2ກີກ/7ມື້',
        image: imageUrl,
        slug: makeSlugify('104-10,000ກີບ/2ກີກ/7ມື້-Weekly special 3')
    },
    {
        id: 11,
        typePackage_Id: 1,
        catePackage_Id: 2,
        priority: 12,
        code: 25,
        name: 'Weekly special day',
        detail: '25,000ກີບ/25ກີກ/7ມື້',
        image: `${DOMAIN}/images/prepaid_package25.png`,
        slug: makeSlugify('25-25,000ກີບ/25ກີກ/7ມື້-Weekly special day'),
    },
    {
        id: 12,
        typePackage_Id: 1,
        catePackage_Id: 2,
        priority: 11,
        code: 114,
        name: 'Weekly Tiktok',
        detail: '15,000ກີບ/15ກີກ/7ມື້',
        image: `${DOMAIN}/images/package114.png`,
        slug: makeSlugify('114-15,000ກີບ/15ກີກ/7ມື້-Weekly Tiktok')
    },
    {
        id: 13,
        typePackage_Id: 1,
        catePackage_Id: 2,
        priority: 10,
        code: 118,
        name: 'Weekly Youtube+Tiktok',
        detail: '20,000ກີບ/7ກີກ/7ມື້',
        image: imageUrl,
        slug: makeSlugify('118-20,000ກີບ/7ກີກ/7ມື້-Weekly Youtube+Tiktok')
    },
    {
        id: 14,
        typePackage_Id: 1,
        catePackage_Id: 2,
        priority: 9,
        code: 121,
        name: 'Weekly Youtube+Facebook+Tiktok',
        detail: '55,000ກີບ/20ກີກ/15ມື້',
        image: imageUrl,
        slug: makeSlugify('121-55,000ກີບ/20ກີກ/15ມື້-Weekly Youtube+Facebook+Tiktok')
    },
    // Monthly
    {
        id: 15,
        typePackage_Id: 1,
        catePackage_Id: 3,
        priority: 8,
        code: 105,
        name: 'Monthly Package1',
        detail: '10,000ກີບ/500ແມັກ/30ມື້',
        image: imageUrl,
        slug: makeSlugify('105-10,000ກີບ/500ແມັກ/30ມື້-Monthly Package1')
    },
    {
        id: 16,
        typePackage_Id: 1,
        catePackage_Id: 3,
        priority: 7,
        code: 106,
        name: 'Monthly Package2',
        detail: '50,000ກີບ/5ກີກ/30ມື້',
        image: imageUrl,
        slug: makeSlugify('106-50,000ກີບ/5ກີກ/30ມື້-Monthly Package2')
    },
    {
        id: 17,
        typePackage_Id: 1,
        catePackage_Id: 3,
        priority: 6,
        code: 109,
        name: 'Monthly non-stop',
        detail: '50,000ກີບ/10ກີກ(ຫຼີ້ນຕໍ່ເນື່ອງ)/10ມື້',
        image: imageUrl,
        slug: makeSlugify('50,000ກີບ/10ກີກ(ຫຼີ້ນຕໍ່ເນື່ອງ)/10ມື້-Monthly non-stop')
    },
    {
        id: 18,
        typePackage_Id: 1,
        catePackage_Id: 3,
        priority: 5,
        code: 150,
        name: 'Monthly super hot',
        detail: '50,000ກີບ/40ກີກ(ຫຼີ້ນຕໍ່ເນື່ອງ)/30ມື້',
        image: `${DOMAIN}/images/package150.png`,
        slug: makeSlugify('150-50,000ກີບ/40ກີກ(ຫຼີ້ນຕໍ່ເນື່ອງ)/30ມື້-Monthly super hot')
    },
    {
        id: 19,
        typePackage_Id: 1,
        catePackage_Id: 3,
        priority: 4,
        code: 111,
        name: 'Monthly Premium',
        detail: '250,000ກີບ/60ກີກ(ຫຼີ້ນຕໍ່ເນື່ອງ)/250ນາທີ/30ມື້',
        image: imageUrl,
        slug: makeSlugify('111-250,000ກີບ/60ກີກ(ຫຼີ້ນຕໍ່ເນື່ອງ)/250ນາທີ/30ມື້-Monthly Premium')
    },
    {
        id: 20,
        typePackage_Id: 1,
        catePackage_Id: 3,
        priority: 3,
        code: 115,
        name: 'Monthly Tiktok',
        detail: '50,000ກີບ/30ກີກ/30ມື້',
        image: imageUrl,
        slug: makeSlugify('115-50,000ກີບ/30ກີກ/30ມື້-Monthly Tiktok')
    },
    {
        id: 21,
        typePackage_Id: 1,
        catePackage_Id: 3,
        priority: 2,
        code: 119,
        name: 'Monthly Youtube+Tiktok',
        detail: '65,000ກີບ/25ກີກ/30ມື້',
        image: imageUrl,
        slug: makeSlugify('119-65,000ກີບ/25ກີກ/30ມື້-Monthly Youtube+Tiktok')
    },
    {
        id: 22,
        typePackage_Id: 1,
        catePackage_Id: 3,
        priority: 1,
        code: 122,
        name: 'Monthly Youtube+Facebook+Tiktok',
        detail: '100,000ກີບ/45ກີກ/30ມື້',
        image: imageUrl,
        slug: makeSlugify('122-100,000ກີບ/45ກີກ/30ມື້-Monthly Youtube+Facebook+Tiktok')
    },
    // Postpaid
    // Daily
    {
        id: 23,
        typePackage_Id: 2,
        catePackage_Id: 1,
        priority: 15,
        code: 303,
        name: 'Daily non-stop',
        detail: '5,000ກີບ/2ກີກ(ຫຼີ້ນຕໍ່ເນື່ອງ)/1ມື້',
        image: `${DOMAIN}/images/package303.png`,
        slug: makeSlugify('303-5,000ກີບ/2ກີກ(ຫຼີ້ນຕໍ່ເນື່ອງ)/1ມື້')
    },
    {
        id: 24,
        typePackage_Id: 2,
        catePackage_Id: 1,
        priority: 14,
        code: 301,
        name: 'Daily Hot',
        detail: '10,000ກີບ/5ກີກ/3ມື້',
        image: `${DOMAIN}/images/package301.png`,
        slug: makeSlugify('301-10,000ກີບ/5ກີກ/3ມື້')
    },
    {
        id: 25,
        typePackage_Id: 2,
        catePackage_Id: 1,
        priority: 13,
        code: 307,
        name: 'Daily Tiktok',
        detail: '2,500ກີບ/4ກີກ/1ມື້',
        image: imageUrl,
        slug: makeSlugify('307-2,500ກີບ/4ກີກ/1ມື້')
    },
    {
        id: 26,
        typePackage_Id: 2,
        catePackage_Id: 1,
        priority: 12,
        code: 315,
        name: 'Daily Youtube+Tiktok',
        detail: '3,000ກີບ/4ກີກ/1ມື້',
        image: imageUrl,
        slug: makeSlugify('315-3,000ກີບ/4ກີກ/1ມື້')
    },
    {
        id: 27,
        typePackage_Id: 2,
        catePackage_Id: 1,
        priority: 11,
        code: 312,
        name: 'Daily Youtube+Facebook+Tiktok',
        detail: '20,000ກີບ/7ກີກ/5ມື້',
        image: imageUrl,
        slug: makeSlugify('312-20,000ກີບ/7ກີກ/5ມື້')
    },
    // Weekly
    {
        id: 28,
        typePackage_Id: 2,
        catePackage_Id: 2,
        priority: 10,
        code: 25,
        name: 'Weekly Special Event',
        detail: '25,000ກີບ/25ກີກ/7ມື້',
        image: `${DOMAIN}/images/package25.png`,
        slug: makeSlugify('25-25,000ກີບ/25ກີກ/7ມື້-Weekly Special Event')
    },
    {
        id: 29,
        typePackage_Id: 2,
        catePackage_Id: 2,
        priority: 9,
        code: 308,
        name: 'Weekly Tiktok',
        detail: '15,000ກີບ/15ກີກ/7ມື້',
        image: `${DOMAIN}/images/package308.png`,
        slug: makeSlugify('308-15,000ກີບ/15ກີກ/7ມື້-Weekly Tiktok')
    },
    {
        id: 30,
        typePackage_Id: 2,
        catePackage_Id: 2,
        priority: 8,
        code: 313,
        name: 'Weekly Youtube+Facebook+Tiktok',
        detail: '55,000ກີບ/20ກີກ/15ມື້',
        image: imageUrl,
        slug: makeSlugify('313-55,000ກີບ/20ກີກ/15ມື້-Weekly Youtube+Facebook+Tiktok')
    },
    {
        id: 31,
        typePackage_Id: 2,
        catePackage_Id: 2,
        priority: 7,
        code: 310,
        name: 'Weekly Youtube+Tiktok',
        detail: '20,000ກີບ/7ກີກ/7ມື້',
        image: imageUrl,
        slug: makeSlugify('310-20,000ກີບ/7ກີກ/7ມື້-Weekly Youtube+Tiktok')
    },
    // Monthly
    {
        id: 32,
        typePackage_Id: 2,
        catePackage_Id: 3,
        priority: 6,
        code: 302,
        name: 'Monthly Package',
        detail: '50,000ກີບ/5ກີກ/30ມື້',
        image: imageUrl,
        slug: makeSlugify('302-50,000ກີບ/5ກີກ/30ມື້-Monthly Package')
    },
    {
        id: 33,
        typePackage_Id: 2,
        catePackage_Id: 3,
        priority: 5,
        code: 350,
        name: 'Monthly super hot',
        detail: '50,000ກີບ/40ກີກ(ຫຼີ້ນຕໍ່ເນື່ອງ)/30ມື້',
        image: `${DOMAIN}/images/package350.png`,
        slug: makeSlugify('350-50,000ກີບ/40ກີກ(ຫຼີ້ນຕໍ່ເນື່ອງ)/30ມື້-Monthly super hot')
    },
    {
        id: 34,
        typePackage_Id: 2,
        catePackage_Id: 3,
        priority: 4,
        code: 305,
        name: 'Monthly Premium',
        detail: '250,000ກີບ/60ກີກ(ຫຼີ້ນຕໍ່ເນື່ອງ)/250ນາທີ/30ມື້',
        image: imageUrl,
        slug: makeSlugify('305-250,000ກີບ/60ກີກ(ຫຼີ້ນຕໍ່ເນື່ອງ)/250ນາທີ/30ມື້-Monthly Premium')
    },
    {
        id: 35,
        typePackage_Id: 2,
        catePackage_Id: 3,
        priority: 3,
        code: 309,
        name: 'Monthly Tiktok',
        detail: '50,000ກີບ/30ກີກ/30ມື້',
        image: `${DOMAIN}/images/package309.png`,
        slug: makeSlugify('309-50,000ກີບ/30ກີກ/30ມື້-Monthly Tiktok')
    },
    {
        id: 36,
        typePackage_Id: 2,
        catePackage_Id: 3,
        priority: 2,
        code: 311,
        name: 'Monthly Youtube+Tiktok',
        detail: '65,000ກີບ/25ກີກ/30ມື້',
        image: imageUrl,
        slug: makeSlugify('311-65,000ກີບ/25ກີກ/30ມື້-Monthly Youtube+Tiktok')
    },
    {
        id: 37,
        typePackage_Id: 2,
        catePackage_Id: 3,
        priority: 1,
        code: 314,
        name: 'Monthly Youtube+Facebook+Tiktok',
        detail: '100,000ກີບ/45ກີກ/30ມື້',
        image: imageUrl,
        slug: makeSlugify('314-100,000ກີບ/45ກີກ/30ມື້-Monthly Youtube+Facebook+Tiktok')
    },
]

export const seedDataPackage_EN = [
    // {   // test
    //     id: 25,
    //     typePackage_Id: 1,
    //     priority: 14,
    //     code: 112,
    //     // en_name: '50,000₭/40 GB/30Days',
    //     name: '1,000K /2 GB / 1ຊົ່ວໂມງ',
    //     image: imageUrl,
    //     slug: makeSlugify('1,000K /2 GB / 1ຊົ່ວໂມງ')
    // },
    // Prepaid
    // Daily
    {
        package_Id: 1,
        languageId: 2,
        name: 'Daily special 2',
        detail: '5,000kip/5GB/3days',
        image: imageUrl,
        slug: makeSlugify('116-5,000kip/5GB/3days-Daily special 2'),
    },
    {
        package_Id: 2,
        languageId: 2,
        name: 'Daily Hot',
        detail: '10,000kip/5GB/3days',
        image: `${DOMAIN}/images/package103.png`,
        slug: makeSlugify('103-10,000kip/5GB/3days-Daily Hot')
    },
    {
        package_Id: 3,
        languageId: 2,
        name: 'Daily non-stop',
        detail: '5,000kip/2GB(Non-stop)/1days',
        image: imageUrl,
        slug: makeSlugify('107-5,000kip/2GB(Non-stop)/1days-Daily non-stop')
    },
    {
        package_Id: 4,
        languageId: 2,
        name: 'Daily non-stop 2',
        detail: '20,000kip/5GB(Non-stop)/4days',
        image: imageUrl,
        slug: makeSlugify('108-20,000kip/5GB(Non-stop)/4days-Daily non-stop 2')
    },
    {
        package_Id: 5,
        languageId: 2,
        name: 'Daily happy hour',
        detail: '1,000kip/2GB(Non-stop)/1Hour',
        image: `${DOMAIN}/images/package112.png`,
        slug: makeSlugify('112-1,000kip/2GB(Non-stop)/1Hour-Daily happy hour')
    },
    {
        package_Id: 6,
        languageId: 2,
        name: 'Daily Tiktok',
        detail: '2,500kip/4GB/1day',
        image: imageUrl,
        slug: makeSlugify('113-2,500kip/4GB/1day-Daily Tiktok')
    },
    {
        package_Id: 7,
        languageId: 2,
        name: 'Daily Youtube+Tiktok',
        detail: '3,000kip/4GB/1day',
        image: imageUrl,
        slug: makeSlugify('123-3,000kip/4GB/1day-Daily Youtube+Tiktok')
    },
    {
        package_Id: 8,
        languageId: 2,
        name: 'Daily Youtube+Facebook+Tiktok',
        detail: '20,000kip/7GB/5days',
        image: imageUrl,
        slug: makeSlugify('120-20,000kip/7GB/5days-Daily Youtube+Facebook+Tiktok')
    },
    // Weekly
    {
        package_Id: 9,
        languageId: 2,
        name: 'Weekly special 2',
        detail: '10,000kip/10GB/6days',
        image: imageUrl,
        slug: makeSlugify('117-10,000kip/10GB/6days-Weekly special 2')
    },
    {
        package_Id: 10,
        languageId: 2,
        name: 'Weekly special 3',
        detail: '10,000kip/2GB/7days',
        image: imageUrl,
        slug: makeSlugify('104-10,000kip/2GB/7days-Weekly special 3')
    },
    {
        package_Id: 11,
        languageId: 2,
        name: 'Weekly special day',
        detail: '25,000kip/25GB/7days',
        image: `${DOMAIN}/images/prepaid_package25.png`,
        slug: makeSlugify('25-25,000kip/25GB/7days-Weekly special day'),
    },
    {
        package_Id: 12,
        languageId: 2,
        name: 'Weekly Tiktok',
        detail: '15,000kip/15GB/7days',
        image: `${DOMAIN}/images/package114.png`,
        slug: makeSlugify('114-15,000kip/15GB/7days-Weekly Tiktok')
    },
    {
        package_Id: 13,
        languageId: 2,
        name: 'Weekly Youtube+Tiktok',
        detail: '20,000kip/7GB/7days',
        image: imageUrl,
        slug: makeSlugify('118-20,000kip/7GB/7days-Weekly Youtube+Tiktok')
    },
    {
        package_Id: 14,
        languageId: 2,
        name: 'Weekly Youtube+Facebook+Tiktok',
        detail: '55,000kip/20GB/15days',
        image: imageUrl,
        slug: makeSlugify('121-55,000kip/20GB/15days-Weekly Youtube+Facebook+Tiktok')
    },
    // Monthly
    {
        package_Id: 15,
        languageId: 2,
        name: 'Monthly Package1',
        detail: '10,000kip/500MB/30days',
        image: imageUrl,
        slug: makeSlugify('105-10,000kip/500MB/30days-Monthly Package1')
    },
    {
        package_Id: 16,
        languageId: 2,
        name: 'Monthly Package2',
        detail: '50,000kip/5GB/30days',
        image: imageUrl,
        slug: makeSlugify('106-50,000kip/5GB/30days-Monthly Package2')
    },
    {
        package_Id: 17,
        languageId: 2,
        name: 'Monthly non-stop',
        detail: '50,000kip/10GB(Non-stop)/10days',
        image: imageUrl,
        slug: makeSlugify('109-50,000kip/10GB(Non-stop)/10days-Monthly non-stop')
    },
    {
        package_Id: 18,
        languageId: 2,
        name: 'Monthly super hot',
        detail: '50,000kip/40GB(Non-stop)/30days',
        image: `${DOMAIN}/images/package150.png`,
        slug: makeSlugify('150-50,000kip/40GB(Non-stop)/30days-Monthly super hot')
    },
    {
        package_Id: 19,
        languageId: 2,
        name: 'Monthly Premium',
        detail: '250,000kip/60GB(Non-stop)/250Min/30days',
        image: imageUrl,
        slug: makeSlugify('111-250,000kip/60GB(Non-stop)/250Min/30days-Monthly Premium')
    },
    {
        package_Id: 20,
        languageId: 2,
        name: 'Monthly Tiktok',
        detail: '50,000kip/30GB/30days',
        image: imageUrl,
        slug: makeSlugify('115-50,000kip/30GB/30days-Monthly Tiktok')
    },
    {
        package_Id: 21,
        languageId: 2,
        name: 'Monthly Youtube+Tiktok',
        detail: '65,000kip/25GB/30days',
        image: imageUrl,
        slug: makeSlugify('119-65,000kip/25GB/30days-Monthly Youtube+Tiktok')
    },
    {
        package_Id: 22,
        languageId: 2,
        name: 'Monthly Youtube+Facebook+Tiktok',
        detail: '100,000kip/45GB/30days',
        image: imageUrl,
        slug: makeSlugify('122-100,000kip/45GB/30days-Monthly Youtube+Facebook+Tiktok')
    },
    // Postpaid
    // Daily
    {
        package_Id: 23,
        languageId: 2,
        name: 'Daily non-stop',
        detail: '5,000kip/2GB(Non-stop)/1days',
        image: `${DOMAIN}/images/package303.png`,
        slug: makeSlugify('303-5,000kip/2GB(Non-stop)/1days-Daily non-stop')
    },
    {
        package_Id: 24,
        languageId: 2,
        name: 'Daily Hot',
        detail: '10,000kip/5GB/3days',
        image: `${DOMAIN}/images/package301.png`,
        slug: makeSlugify('301-10,000kip/5GB/3days-Daily Hot')
    },
    {
        package_Id: 25,
        languageId: 2,
        name: 'Daily Tiktok',
        detail: '2,500kip/4GB/1day',
        image: imageUrl,
        slug: makeSlugify('307-2,500kip/4GB/1day-Daily Tiktok')
    },
    {
        package_Id: 26,
        languageId: 2,
        name: 'Daily Youtube+Tiktok',
        detail: '3,000kip/4GB/1day',
        image: imageUrl,
        slug: makeSlugify('315-3,000kip/4GB/1day-Daily Youtube+Tiktok')
    },
    {
        package_Id: 27,
        languageId: 2,
        name: 'Daily Youtube+Facebook+Tiktok',
        detail: '20,000kip/7GB/5days',
        image: imageUrl,
        slug: makeSlugify('312-20,000kip/7GB/5days-Daily Youtube+Facebook+Tiktok')
    },
    // Weekly
    {
        package_Id: 28,
        languageId: 2,
        name: 'Weekly Special Event',
        detail: '25,000kip/25GB/7days',
        image: `${DOMAIN}/images/package25.png`,
        slug: makeSlugify('25-25,000kip/25GB/7days-Weekly Special Event')
    },
    {
        package_Id: 29,
        languageId: 2,
        name: 'Weekly Tiktok',
        detail: '15,000kip/15GB/7days',
        image: `${DOMAIN}/images/package308.png`,
        slug: makeSlugify('308-15,000kip/15GB/7days-Weekly Tiktok')
    },
    {
        package_Id: 30,
        languageId: 2,
        name: 'Weekly Youtube+Facebook+Tiktok',
        detail: '55,000kip/20GB/15days',
        image: imageUrl,
        slug: makeSlugify('313-55,000kip/20GB/15days-Weekly Youtube+Facebook+Tiktok')
    },
    {
        package_Id: 31,
        languageId: 2,
        name: 'Weekly Youtube+Tiktok',
        detail: '20,000kip/7GB/7days',
        image: imageUrl,
        slug: makeSlugify('310-20,000kip/7GB/7days-Weekly Youtube+Tiktok')
    },
    // Monthly
    {
        package_Id: 32,
        languageId: 2,
        name: 'Monthly Package',
        detail: '50,000kip/5GB/30days',
        image: imageUrl,
        slug: makeSlugify('302-50,000kip/5GB/30days-Monthly Package')
    },
    {
        package_Id: 33,
        languageId: 2,
        name: 'Monthly super hot',
        detail: '50,000kip/40GB(Non-stop)/30days',
        image: `${DOMAIN}/images/package350.png`,
        slug: makeSlugify('350-50,000kip/40GB(Non-stop)/30days-Monthly super hot')
    },
    {
        package_Id: 34,
        languageId: 2,
        name: 'Monthly Premium',
        detail: '250,000kip/60GB(Non-stop)/250Min/30days',
        image: imageUrl,
        slug: makeSlugify('305-250,000kip/60GB(Non-stop)/250Min/30days-Monthly Premium')
    },
    {
        package_Id: 35,
        languageId: 2,
        name: 'Monthly Tiktok',
        detail: '50,000kip/30GB/30days',
        image: `${DOMAIN}/images/package309.png`,
        slug: makeSlugify('309-50,000kip/30GB/30days-Monthly Tiktok')
    },
    {
        package_Id: 36,
        languageId: 2,
        name: 'Monthly Youtube+Tiktok',
        detail: '65,000kip/25GB/30days',
        image: imageUrl,
        slug: makeSlugify('311-65,000kip/25GB/30days-Monthly Youtube+Tiktok')
    },
    {
        package_Id: 37,
        languageId: 2,
        name: 'Monthly Youtube+Facebook+Tiktok',
        detail: '100,000kip/45GB/30days',
        image: imageUrl,
        slug: makeSlugify('314-100,000kip/45GB/30days-Monthly Youtube+Facebook+Tiktok')
    },
]




// export const seedDataPackage_EN = [
//     {
//         package_Id: 25,
//         languageId: 2,
//         // code: 25,
//         name: '1,000₭/2 GB/1H',
//         // la_name: '25,000₭/25 GB/7ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('1,000₭/2 GB/1H')
//     },
//     {
//         package_Id: 1,
//         languageId: 2,
//         // code: 25,
//         name: '25,000₭/25 GB/7Day',
//         // la_name: '25,000₭/25 GB/7ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('25-25,000₭/25 GB/7Day')
//     },
//     {
//         package_Id: 2,
//         languageId: 2,
//         // code: 101,
//         name: '5,000₭/5 GB/5Days',
//         // la_name: '5,000₭/5 GB/5ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('101-5,000₭/5 GB/5Days')
//     },
//     {
//         package_Id: 3,
//         languageId: 2,
//         // code: 102,
//         name: '10,000₭/10 GB/10Days',
//         // la_name: '10,000₭/10 GB/10ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('102-10,000₭/10 GB/10Days')
//     },
//     {
//         package_Id: 4,
//         languageId: 2,
//         // code: 103,
//         name: '10,000₭/5 GB/3Days',
//         // la_name: '10,000₭/5 GB/3ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('103-10,000₭/5 GB/3Days')
//     },
//     {
//         package_Id: 5,
//         languageId: 2,
//         // code: 104,
//         name: '10,000₭/2 GB/7Days',
//         // la_name: '10,000₭/2 GB/7ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('104-10,000₭/2 GB/7Days')
//     },
//     {
//         package_Id: 6,
//         languageId: 2,
//         // code: 105,
//         name: '10,000₭/500 MB/30day',
//         // la_name: '10,000₭/500 MB/30ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('105-10,000₭/500 MB/30day')
//     },
//     {
//         package_Id: 7,
//         languageId: 2,
//         // code: 106,
//         name: '50,000₭/5 GB/30Day',
//         // la_name: '50,000₭/5 GB/30ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('106-50,000₭/5 GB/30Day')
//     },
//     {
//         package_Id: 8,
//         languageId: 2,
//         // code: 107,
//         name: '5,000₭/2 GB Non-stop/1Day',
//         // la_name: '5,000₭/2 GB ຫຼິ້ນຕໍ່ເນື່ອງ/1ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('107-5,000₭/2 GB Non-stop/1Day')
//     },
//     {
//         package_Id: 9,
//         languageId: 2,
//         // code: 108,
//         name: '20,000₭/5 GB Non-stop/4Day',
//         // la_name: '20,000₭/5 GB ຫຼິ້ນຕໍ່ເນື່ອງ/4ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('108-20,000₭/5 GB Non-stop/4Day')
//     },
//     {
//         package_Id: 10,
//         languageId: 2,
//         // code: 109,
//         name: '50,000₭/10 GB Non-stop/10Day',
//         // la_name: '50,000₭/10 GB ຫຼິ້ນຕໍ່ເນື່ອງ/10ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('109-50,000₭/10 GB Non-stop/10Day')
//     },
//     {
//         package_Id: 11,
//         languageId: 2,
//         // code: 116,
//         name: '5,000₭/5 GB/3Days',
//         // la_name: '5,000₭/5 GB/3ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('116-5,000₭/5 GB/3Days')
//     },
//     {
//         package_Id: 12,
//         languageId: 2,
//         // code: 117,
//         name: '10,000₭/10 GB/6Days',
//         // la_name: '10,000₭/10 GB/6ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('117-10,000₭/10 GB/6Days')
//     },
//     {
//         package_Id: 13,
//         languageId: 2,
//         // code: 150,
//         name: '50,000₭/40 GB/30Days',
//         // la_name: '50,000K /40 GB / 30ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('150-50,000₭/40 GB/30Days')
//     },
//     {
//         package_Id: 14,
//         languageId: 2,
//         // code: 201,
//         name: '5,000₭/2 GB/1Day',
//         // la_name: '5,000₭/2 GB/1ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('201-5,000₭/2 GB/1Day')
//     },
//     {
//         package_Id: 15,
//         languageId: 2,
//         // code: 202,
//         name: '10,000₭/3 GB/7Day',
//         // la_name: '10,000₭/3 GB/7ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('202-10,000₭/3 GB/7Day')
//     },
//     {
//         package_Id: 16,
//         languageId: 2,
//         // code: 203,
//         name: '50,000₭/10 GB/30Day',
//         // la_name: '50,000₭/10 GB/30ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('203-50,000₭/10 GB/30Day')
//     },
//     {
//         package_Id: 17,
//         languageId: 2,
//         // code: 204,
//         name: '10,000₭/5 GB/3Day',
//         // la_name: '10,000₭/5 GB/3ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('204-10,000₭/5 GB/3Day')
//     },
//     {
//         package_Id: 18,
//         languageId: 2,
//         // code: 205,
//         name: '150,000₭/30 GB/30Day',
//         // la_name: '150,000₭/30 GB/30ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('205-150,000₭/30 GB/30Day')
//     },
//     {
//         package_Id: 19,
//         languageId: 2,
//         // code: 301,
//         name: '10,000₭/5 GB/3Day',
//         // la_name: '10,000₭/5 GB/3ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('301-10,000₭/5 GB/3Day')
//     },
//     {
//         package_Id: 20,
//         languageId: 2,
//         // code: 302,
//         name: '50,000₭/5 GB/30Day',
//         // la_name: '50,000₭/5 GB/30ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('302-50,000₭/5 GB/30Day')
//     },
//     {
//         package_Id: 21,
//         languageId: 2,
//         // code: 303,
//         name: '5,000₭/2 GB/Non-stop',
//         // la_name: '5,000₭/2 GB/ຫຼິ້ນຕໍ່ເນື່ອງ',
//         image: imageUrl,
//         slug: makeSlugify('303-5,000₭/2 GB/Non-stop')
//     },
//     {
//         package_Id: 22,
//         languageId: 2,
//         // code: 304,
//         name: '150,000₭/Non-stop/30Day ',
//         // la_name: '150,000₭/ຫຼິ້ນຕໍ່ເນື່ອງ/30ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('304-150,000₭/Non-stop/30Day')
//     },
//     {
//         package_Id: 23,
//         languageId: 2,
//         // code: 305,
//         name: '250,000₭/60 GB/30Day',
//         // la_name: '250,000₭/60 GB/30ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('305-250,000₭/60 GB/30Day')
//     },
//     {
//         package_Id: 24,
//         languageId: 2,
//         // code: 350,
//         name: '50,000₭/40 GB/30Days',
//         // la_name: '50,000K /40 GB / 30ວັນ',
//         image: imageUrl,
//         slug: makeSlugify('350-50,000₭/40 GB/30Days')
//     },
// ]