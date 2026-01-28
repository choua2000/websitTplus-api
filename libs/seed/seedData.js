
export const seedPostTypes = [
    {
        id: 1,
        name: 'ໂປຣໂມຊັນ',
        is_active: true,
        slug: 'ໂປຣໂມຊນ'
    },
    {
        id: 2,
        name: 'ຂ່າວສານ',
        is_active: true,
        slug: 'ຂາວສານ'
    },
    {
        id: 3,
        name: 'ກິດຈະກຳ',
        is_active: true,
        slug: 'ກດຈະກາ'
    },
]

export const seedPostTypes_EN = [
    {
        postTypeId: 1,
        languageId: 2,
        name: 'Promotion',
        is_active: true,
        slug: 'promotion'
    },
    {
        postTypeId: 2,
        languageId: 2,
        name: 'News',
        is_active: true,
        slug: 'news'
    },
    {
        postTypeId: 3,
        languageId: 2,
        name: 'Activities',
        is_active: true,
        slug: 'activities'
    },
]

// ---------------> seed data new category <-----------------
export const seedNewCategory = [
    {
        id: 1,
        name: 'ວາລະສານ'
    },
    {
        id: 2,
        name: 'ກິລາ'
    },
    {
        id: 3,
        name: 'ເທດສະການ'
    },
]

export const seedNewCategory_EN = [
    {
        newsCategoryId: 1,
        languageId: 2,
        name: 'Magazine'
    },
    {
        newsCategoryId: 2,
        languageId: 2,
        name: 'Sports'
    },
    {
        newsCategoryId: 3,
        languageId: 2,
        name: 'Festivals'
    },
]

// ---------------> seed data sim types <-----------------
export const seedDataSimtypes = [
    {
        mainProduct: 1643918648,
        detail: 'Postpaid data SIM',
    },
    {
        mainProduct: 743051279,
        detail: 'Postpaid'
    },
    // {
    //     mainProduct: 138385902,
    //     detail: 'TPLUS T-SIM'
    // },
    // {
    //     mainProduct: 538384210,
    //     detail: 'Tplus staff'
    // },
    {
        mainProduct: 938366717,
        detail: 'Tplus_Basic'
    },
    {
        mainProduct: 1138386286,
        detail: 'Net SIM'
    },
    {
        mainProduct: 1838386062,
        detail: 'TPLUS Home'
    },
    {
        mainProduct: 1861267082,
        detail: 'E-Sport SIM'
    },
    {
        mainProduct: 1938385600,
        detail: 'SIM2Play'
    }, {
        mainProduct: 1172688790,
        detail: 'Dortmund SIM'
    },
]

// ---------------> seed data package <-----------------
import { makeSlugify } from '../utils/regex';
import { DOMAIN } from '../../constants/index';
let imageUrl = `${DOMAIN}/images/defaultPackage.jpg`;

export const seedDataPackage = [
    {   // test
        id: 25,
        typePackage_Id: 1,
        priority: 14,
        code: 112,
        // en_name: '50,000₭/40 GB/30Days',
        name: '1,000K /2 GB / 1ຊົ່ວໂມງ',
        image: imageUrl,
        slug: makeSlugify('1,000K /2 GB / 1ຊົ່ວໂມງ')
    },
    {
        id: 1,
        typePackage_Id: 1,
        priority: 13,
        code: 25,
        // en_name: '25,000₭/25 GB/7Day',
        name: '25,000₭/25 GB/7ວັນ',
        image: imageUrl,
        slug: makeSlugify('25-25,000₭/25 GB/7ວັນ'),
    },
    {
        id: 2,
        typePackage_Id: 1,
        priority: 12,
        code: 101,
        // en_name: '5,000₭/5 GB/5Days',
        name: '5,000₭/5 GB/5ວັນ',
        image: imageUrl,
        slug: makeSlugify('101-5,000₭/5 GB/5ວັນ')
    },
    {
        id: 3,
        typePackage_Id: 1,
        priority: 11,
        code: 102,
        // en_name: '10,000₭/10 GB/10Days',
        name: '10,000₭/10 GB/10ວັນ',
        image: imageUrl,
        slug: makeSlugify('102-10,000₭/10 GB/10ວັນ')
    },
    {
        id: 4,
        typePackage_Id: 1,
        priority: 10,
        code: 103,
        // en_name: '10,000₭/5 GB/3Days',
        name: '10,000₭/5 GB/3ວັນ',
        image: imageUrl,
        slug: makeSlugify('103-10,000₭/5 GB/3ວັນ')
    },
    {
        id: 5,
        typePackage_Id: 1,
        priority: 9,
        code: 104,
        // en_name: '10,000₭/2 GB/7Days',
        name: '10,000₭/2 GB/7ວັນ',
        image: imageUrl,
        slug: makeSlugify('104-10,000₭/2 GB/7ວັນ')
    },
    {
        id: 6,
        typePackage_Id: 1,
        priority: 8,
        code: 105,
        // en_name: '10,000₭/500 MB/30day',
        name: '10,000₭/500 MB/30ວັນ',
        image: imageUrl,
        slug: makeSlugify('105-10,000₭/500 MB/30ວັນ')
    },
    {
        id: 7,
        typePackage_Id: 1,
        priority: 7,
        code: 106,
        // en_name: '50,000₭/5 GB/30Day',
        name: '50,000₭/5 GB/30ວັນ',
        image: imageUrl,
        slug: makeSlugify('106-50,000₭/5 GB/30ວັນ')
    },
    {
        id: 8,
        typePackage_Id: 1,
        priority: 6,
        code: 107,
        // en_name: '5,000₭/2 GB Non-stop/1Day',
        name: '5,000₭/2 GB ຫຼິ້ນຕໍ່ເນື່ອງ/1ວັນ',
        image: imageUrl,
        slug: makeSlugify('107-5,000₭/2 GB ຫຼິ້ນຕໍ່ເນື່ອງ/1ວັນ')
    },
    {
        id: 9,
        typePackage_Id: 1,
        priority: 5,
        code: 108,
        // en_name: '20,000₭/5 GB Non-stop/4Day',
        name: '20,000₭/5 GB ຫຼິ້ນຕໍ່ເນື່ອງ/4ວັນ',
        image: imageUrl,
        slug: makeSlugify('108-20,000₭/5 GB ຫຼິ້ນຕໍ່ເນື່ອງ/4ວັນ')
    },
    {
        id: 10,
        typePackage_Id: 1,
        priority: 4,
        code: 109,
        // en_name: '50,000₭/10 GB Non-stop/10Day',
        name: '50,000₭/10 GB ຫຼິ້ນຕໍ່ເນື່ອງ/10ວັນ',
        image: imageUrl,
        slug: makeSlugify('109-50,000₭/10 GB ຫຼິ້ນຕໍ່ເນື່ອງ/10ວັນ')
    },
    {
        id: 11,
        typePackage_Id: 1,
        priority: 3,
        code: 116,
        // en_name: '5,000₭/5 GB/3Days',
        name: '5,000₭/5 GB/3ວັນ',
        image: imageUrl,
        slug: makeSlugify('116-5,000₭/5 GB/3ວັນ'),
    },
    {
        id: 12,
        typePackage_Id: 1,
        priority: 2,
        code: 117,
        // en_name: '10,000₭/10 GB/6Days',
        name: '10,000₭/10 GB/6ວັນ',
        image: imageUrl,
        slug: makeSlugify('117-10,000₭/10 GB/6ວັນ')
    },
    {
        id: 13,
        typePackage_Id: 1,
        priority: 1,
        code: 150,
        // en_name: '50,000₭/40 GB/30Days',
        name: '50,000K /40 GB / 30ວັນ',
        image: imageUrl,
        slug: makeSlugify('150-50,000K /40 GB / 30ວັນ')
    },
    {
        id: 14,
        typePackage_Id: 3,
        priority: 5,
        code: 201,
        // en_name: '5,000₭/2 GB/1Day',
        name: '5,000₭/2 GB/1ວັນ',
        image: imageUrl,
        slug: makeSlugify('201-5,000₭/2 GB/1ວັນ')
    },
    {
        id: 15,
        typePackage_Id: 3,
        priority: 4,
        code: 202,
        // en_name: '10,000₭/3 GB/7Day',
        name: '10,000₭/3 GB/7ວັນ',
        image: imageUrl,
        slug: makeSlugify('202-10,000₭/3 GB/7ວັນ')
    },
    {
        id: 16,
        typePackage_Id: 3,
        priority: 3,
        code: 203,
        // en_name: '50,000₭/10 GB/30Day',
        name: '50,000₭/10 GB/30ວັນ',
        image: imageUrl,
        slug: makeSlugify('203-50,000₭/10 GB/30ວັນ')
    },
    {
        id: 17,
        typePackage_Id: 3,
        priority: 2,
        code: 204,
        // en_name: '10,000₭/5 GB/3Day',
        name: '10,000₭/5 GB/3ວັນ',
        image: imageUrl,
        slug: makeSlugify('204-10,000₭/5 GB/3ວັນ')
    },
    {
        id: 18,
        typePackage_Id: 3,
        priority: 1,
        code: 205,
        // en_name: '150,000₭/30 GB/30Day',
        name: '150,000₭/30 GB/30ວັນ',
        image: imageUrl,
        slug: makeSlugify('205-150,000₭/30 GB/30ວັນ')
    },
    {
        id: 19,
        typePackage_Id: 2,
        priority: 6,
        code: 301,
        // en_name: '10,000₭/5 GB/3Day',
        name: '10,000₭/5 GB/3ວັນ',
        image: imageUrl,
        slug: makeSlugify('301-10,000₭/10 GB/3ວັນ')
    },
    {
        id: 20,
        typePackage_Id: 2,
        priority: 5,
        code: 302,
        // en_name: '50,000₭/5 GB/30Day',
        name: '50,000₭/5 GB/30ວັນ',
        image: imageUrl,
        slug: makeSlugify('302-50,000₭/5 GB/30ວັນ')
    },
    {
        id: 21,
        typePackage_Id: 2,
        priority: 4,
        code: 303,
        // en_name: '5,000₭/2 GB/Non-stop',
        name: '5,000₭/2 GB/ຫຼິ້ນຕໍ່ເນື່ອງ',
        image: imageUrl,
        slug: makeSlugify('303-5,000₭/2 GB/ຫຼິ້ນຕໍ່ເນື່ອງ')
    },
    {
        id: 22,
        typePackage_Id: 2,
        priority: 3,
        code: 304,
        // en_name: '150,000₭/Non-stop/30Day ',
        name: '150,000₭/ຫຼິ້ນຕໍ່ເນື່ອງ/30ວັນ',
        image: imageUrl,
        slug: makeSlugify('304-150,000₭/ຫຼິ້ນຕໍ່ເນື່ອງ/30ວັນ')
    },
    {
        id: 23,
        typePackage_Id: 2,
        priority: 2,
        code: 305,
        // en_name: '250,000₭/60 GB/30Day',
        name: '250,000₭/60 GB/30ວັນ',
        image: imageUrl,
        slug: makeSlugify('305-250,000₭/60 GB/30ວັນ')
    },
    {
        id: 24,
        typePackage_Id: 2,
        priority: 1,
        code: 350,
        // en_name: '50,000₭/40 GB/30Days',
        name: '50,000K /40 GB / 30ວັນ',
        image: imageUrl,
        slug: makeSlugify('350-50,000K /40 GB / 30ວັນ')
    },
]

export const seedDataPackage_EN = [
    {
        package_Id: 25,
        languageId: 2,
        // code: 25,
        name: '1,000₭/2 GB/1H',
        // la_name: '25,000₭/25 GB/7ວັນ',
        image: imageUrl,
        slug: makeSlugify('1,000₭/2 GB/1H')
    },
    {
        package_Id: 1,
        languageId: 2,
        // code: 25,
        name: '25,000₭/25 GB/7Day',
        // la_name: '25,000₭/25 GB/7ວັນ',
        image: imageUrl,
        slug: makeSlugify('25-25,000₭/25 GB/7Day')
    },
    {
        package_Id: 2,
        languageId: 2,
        // code: 101,
        name: '5,000₭/5 GB/5Days',
        // la_name: '5,000₭/5 GB/5ວັນ',
        image: imageUrl,
        slug: makeSlugify('101-5,000₭/5 GB/5Days')
    },
    {
        package_Id: 3,
        languageId: 2,
        // code: 102,
        name: '10,000₭/10 GB/10Days',
        // la_name: '10,000₭/10 GB/10ວັນ',
        image: imageUrl,
        slug: makeSlugify('102-10,000₭/10 GB/10Days')
    },
    {
        package_Id: 4,
        languageId: 2,
        // code: 103,
        name: '10,000₭/5 GB/3Days',
        // la_name: '10,000₭/5 GB/3ວັນ',
        image: imageUrl,
        slug: makeSlugify('103-10,000₭/5 GB/3Days')
    },
    {
        package_Id: 5,
        languageId: 2,
        // code: 104,
        name: '10,000₭/2 GB/7Days',
        // la_name: '10,000₭/2 GB/7ວັນ',
        image: imageUrl,
        slug: makeSlugify('104-10,000₭/2 GB/7Days')
    },
    {
        package_Id: 6,
        languageId: 2,
        // code: 105,
        name: '10,000₭/500 MB/30day',
        // la_name: '10,000₭/500 MB/30ວັນ',
        image: imageUrl,
        slug: makeSlugify('105-10,000₭/500 MB/30day')
    },
    {
        package_Id: 7,
        languageId: 2,
        // code: 106,
        name: '50,000₭/5 GB/30Day',
        // la_name: '50,000₭/5 GB/30ວັນ',
        image: imageUrl,
        slug: makeSlugify('106-50,000₭/5 GB/30Day')
    },
    {
        package_Id: 8,
        languageId: 2,
        // code: 107,
        name: '5,000₭/2 GB Non-stop/1Day',
        // la_name: '5,000₭/2 GB ຫຼິ້ນຕໍ່ເນື່ອງ/1ວັນ',
        image: imageUrl,
        slug: makeSlugify('107-5,000₭/2 GB Non-stop/1Day')
    },
    {
        package_Id: 9,
        languageId: 2,
        // code: 108,
        name: '20,000₭/5 GB Non-stop/4Day',
        // la_name: '20,000₭/5 GB ຫຼິ້ນຕໍ່ເນື່ອງ/4ວັນ',
        image: imageUrl,
        slug: makeSlugify('108-20,000₭/5 GB Non-stop/4Day')
    },
    {
        package_Id: 10,
        languageId: 2,
        // code: 109,
        name: '50,000₭/10 GB Non-stop/10Day',
        // la_name: '50,000₭/10 GB ຫຼິ້ນຕໍ່ເນື່ອງ/10ວັນ',
        image: imageUrl,
        slug: makeSlugify('109-50,000₭/10 GB Non-stop/10Day')
    },
    {
        package_Id: 11,
        languageId: 2,
        // code: 116,
        name: '5,000₭/5 GB/3Days',
        // la_name: '5,000₭/5 GB/3ວັນ',
        image: imageUrl,
        slug: makeSlugify('116-5,000₭/5 GB/3Days')
    },
    {
        package_Id: 12,
        languageId: 2,
        // code: 117,
        name: '10,000₭/10 GB/6Days',
        // la_name: '10,000₭/10 GB/6ວັນ',
        image: imageUrl,
        slug: makeSlugify('117-10,000₭/10 GB/6Days')
    },
    {
        package_Id: 13,
        languageId: 2,
        // code: 150,
        name: '50,000₭/40 GB/30Days',
        // la_name: '50,000K /40 GB / 30ວັນ',
        image: imageUrl,
        slug: makeSlugify('150-50,000₭/40 GB/30Days')
    },
    {
        package_Id: 14,
        languageId: 2,
        // code: 201,
        name: '5,000₭/2 GB/1Day',
        // la_name: '5,000₭/2 GB/1ວັນ',
        image: imageUrl,
        slug: makeSlugify('201-5,000₭/2 GB/1Day')
    },
    {
        package_Id: 15,
        languageId: 2,
        // code: 202,
        name: '10,000₭/3 GB/7Day',
        // la_name: '10,000₭/3 GB/7ວັນ',
        image: imageUrl,
        slug: makeSlugify('202-10,000₭/3 GB/7Day')
    },
    {
        package_Id: 16,
        languageId: 2,
        // code: 203,
        name: '50,000₭/10 GB/30Day',
        // la_name: '50,000₭/10 GB/30ວັນ',
        image: imageUrl,
        slug: makeSlugify('203-50,000₭/10 GB/30Day')
    },
    {
        package_Id: 17,
        languageId: 2,
        // code: 204,
        name: '10,000₭/5 GB/3Day',
        // la_name: '10,000₭/5 GB/3ວັນ',
        image: imageUrl,
        slug: makeSlugify('204-10,000₭/5 GB/3Day')
    },
    {
        package_Id: 18,
        languageId: 2,
        // code: 205,
        name: '150,000₭/30 GB/30Day',
        // la_name: '150,000₭/30 GB/30ວັນ',
        image: imageUrl,
        slug: makeSlugify('205-150,000₭/30 GB/30Day')
    },
    {
        package_Id: 19,
        languageId: 2,
        // code: 301,
        name: '10,000₭/5 GB/3Day',
        // la_name: '10,000₭/5 GB/3ວັນ',
        image: imageUrl,
        slug: makeSlugify('301-10,000₭/5 GB/3Day')
    },
    {
        package_Id: 20,
        languageId: 2,
        // code: 302,
        name: '50,000₭/5 GB/30Day',
        // la_name: '50,000₭/5 GB/30ວັນ',
        image: imageUrl,
        slug: makeSlugify('302-50,000₭/5 GB/30Day')
    },
    {
        package_Id: 21,
        languageId: 2,
        // code: 303,
        name: '5,000₭/2 GB/Non-stop',
        // la_name: '5,000₭/2 GB/ຫຼິ້ນຕໍ່ເນື່ອງ',
        image: imageUrl,
        slug: makeSlugify('303-5,000₭/2 GB/Non-stop')
    },
    {
        package_Id: 22,
        languageId: 2,
        // code: 304,
        name: '150,000₭/Non-stop/30Day ',
        // la_name: '150,000₭/ຫຼິ້ນຕໍ່ເນື່ອງ/30ວັນ',
        image: imageUrl,
        slug: makeSlugify('304-150,000₭/Non-stop/30Day')
    },
    {
        package_Id: 23,
        languageId: 2,
        // code: 305,
        name: '250,000₭/60 GB/30Day',
        // la_name: '250,000₭/60 GB/30ວັນ',
        image: imageUrl,
        slug: makeSlugify('305-250,000₭/60 GB/30Day')
    },
    {
        package_Id: 24,
        languageId: 2,
        // code: 350,
        name: '50,000₭/40 GB/30Days',
        // la_name: '50,000K /40 GB / 30ວັນ',
        image: imageUrl,
        slug: makeSlugify('350-50,000₭/40 GB/30Days')
    },
]


// -----------> seed data zone <-----------------
export const seedDataZone = [
    {
        id: 1,
        zoneName_la: 'ເຂດ I',
        zoneName_en: 'Zone I',
    },
    {
        id: 2,
        zoneName_la: 'ເຂດ II',
        zoneName_en: 'Zone II',
    }, {
        id: 3,
        zoneName_la: 'ເຂດ III',
        zoneName_en: 'Zone III',
    }, {
        id: 4,
        zoneName_la: 'ເຂດ IV',
        zoneName_en: 'Zone IV',
    }, {
        id: 5,
        zoneName_la: 'ເຂດ V',
        zoneName_en: 'Zone V',
    },
]

// -----------> seed data title contact <-----------------
export const seedData_TitleContact = [
    {
        id: 1,
        title: 'ບໍລິການ ອິນເຕີເນັດ 4G & 3G DATA package',
        description: null,
    },
    {
        id: 2,
        title: 'ການແກ້ໄຂບັນຫາ',
        description: null,
    },
    {
        id: 3,
        title: 'ພື້ນທີ່ສັນຍານ ຄວບຄຸມ',
        description: null,
    },
    {
        id: 4,
        title: 'ການໂທພາຍໃນ ແລະ ຕ່າງປະເທດ',
        description: null,
    },
    {
        id: 5,
        title: 'ຂໍ້ມູນທົ່ວໄປ',
        description: null,
    },
    {
        id: 6,
        title: 'ການຂື້ນທະບຽນເລກຫມາຍ',
        description: null,
    },
]

export const seedData_TitleContact_EN = [
    {
        id: 1,
        titleContact_Id: 1,
        languageId: 2,
        title: 'DATA 4G & 3G package service',
        description: null,
    },
    {
        id: 2,
        titleContact_Id: 2,
        languageId: 2,
        title: 'Truble shooting',
        description: null,
    },
    {
        id: 3,
        titleContact_Id: 3,
        languageId: 2,
        title: 'Coverage/ signal',
        description: null,
    },
    {
        id: 4,
        titleContact_Id: 4,
        languageId: 2,
        title: 'Voice & IDD',
        description: null,
    },
    {
        id: 5,
        titleContact_Id: 5,
        languageId: 2,
        title: 'Information',
        description: null,
    },
    {
        id: 6,
        titleContact_Id: 6,
        languageId: 2,
        title: 'SIM Card Registration',
        description: null,
    },
]

// -----------> seed data category package <-----------------
// export const seedDataCategoryPackage = [
//     {
//         id: 1,
//         cateName_package: 'ແພັກເກັດຫລັກ'
//     },
//     {
//         id: 2,
//         cateName_package: 'ແພັກເກັດຕາມເທດສະການ'
//     },
// ]

// export const seedDataCategoryPackage_EN = [
//     {
//         languageId: 2,
//         cateName_package: 'Main package'
//     },
//     {
//         catePackage_Id: 2,
//         languageId: 2,
//         cateName_package: 'Season package'
//     },
// ]

// -----------> seed data type package <-----------------
let imageTypePackage = `${DOMAIN}/images/defaultTypePackage.jpeg`;
export const seedDataTypePackage = [
    {
        id: 1,
        type_name: 'ຕື່ມເງິນ',
        image: imageTypePackage,
    },
    {
        id: 2,
        type_name: 'ລາຍເດືອນ',
        image: imageTypePackage,
    },
    // {
    //     id: 3,
    //     type_name: 'ຊີມເນັດ',
    //     image: imageTypePackage,
    // },
]

export const seedDataTypePackage_EN = [
    {
        typePackage_Id: 1,
        languageId: 2,
        type_name: 'Prepaid',
        image: imageTypePackage,
    },
    {
        typePackage_Id: 2,
        languageId: 2,
        type_name: 'Postpaid',
        image: imageTypePackage,
    },
    // {
    //     typePackage_Id: 3,
    //     languageId: 2,
    //     type_name: 'Net sim',
    //     image: imageTypePackage,
    // },
]