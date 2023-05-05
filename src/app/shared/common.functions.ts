import { isNullOrUndefined } from "util";

export function yearsPopulator() {
    let years: number[] = [];
    for (let i = 0; i < 21; i++) {
        years.push(new Date().getFullYear() + i);
    }
    return years;
}

export function birthAndDeathyearsPopulator(startYear) {
    let years: number[] = [];
    for (let i = 0; i <= startYear; i++) {
        years.push(new Date().getFullYear() - i);
    }
    return years;
}

export function daysPopulator(month, year) {
    let days: number[] = [];
    let totalDays = new Date(year, month, 0).getDate();
    for (let i = 1; i <= totalDays; i++) {
        days.push(i);
    }
    return days;
}

export function getUpsellImageListArray(attribute, maxLength) {
    // console.log("attribute ", attribute);
    let upsellImageArray = [];
    let upsellImages;

    for (let i = 0; i < maxLength; i++) {
        upsellImageArray[i] = null;
    }

    if(!isNullOrUndefined(attribute.Value) && attribute.Value.length > 0)
    {
        upsellImages = attribute.Value.split(',');
    }    

    if (upsellImages && upsellImages.length > 0) {
        for (let i = 0; i < upsellImages.length; i++) {
            let upsellImageItemOriginal: string = Object.assign(upsellImages[i]);
            let upsellImageItem: string = upsellImages[i];

            if (upsellImageItem.length > 0) {
                upsellImageItem = upsellImageItem.indexOf('?') > 0 ? upsellImageItem.substring(0, upsellImageItem.indexOf('?')) : upsellImageItem;

                upsellImageItem = upsellImageItem.endsWith('/') ? upsellImageItem.slice(0, -1) : upsellImageItem;
                let currentIndex = parseInt(upsellImageItem[upsellImageItem.length - 1]);
                // console.log("currentIndex ", currentIndex);

                if (currentIndex >= 0)
                    upsellImageArray[currentIndex] = upsellImageItemOriginal;

            }

        }
    }

    return upsellImageArray;
}