// ----------> seed banner <-----------
import { DOMAIN } from '../../constants/index';
let imgBannerUrl_1 = `${DOMAIN}/images/defaultBannerImage.jpg`;
let imgBannerUrl_2 = `${DOMAIN}/images/defaultBannerImg2.jpg`;

export const seedDataDefaultBanner = [
    {
        id: 1,
        banName: 'bannerdefualt1',
        order: 1,
        link: 'link1',
        image: imgBannerUrl_1,
        description: null,
    },
    {
        id: 2,
        banName: 'bannerdefualt2',
        order: 2,
        link: 'link2',
        image: imgBannerUrl_2,
        description: null,
    },
]

export const seedDataDefaultBanner_EN = [
    {
        bannerId: 1,
        languageId: 2,
        banName: 'bannerdefualt1',
        link: 'link1',
        image: imgBannerUrl_1,
        description: null,
    },
    {
        bannerId: 2,
        languageId: 2,
        banName: 'bannerdefualt2',
        link: 'link1',
        image: imgBannerUrl_2,
        description: null,
    },
]