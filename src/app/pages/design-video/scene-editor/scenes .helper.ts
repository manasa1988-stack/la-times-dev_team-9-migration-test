import * as moment from 'moment';

const dateFormat = 'MMMM DD, YYYY';

export const Scene1Helper = {
    parse: (elements, {
        firstName,
        lastName,
        birthDate,
        deathDate,
        age,
        description,
        middleName,
        nickName,
    }) => {
        return elements.map(field => {
            if (field.id === 'Name') {
                let value = '';
                value = `${firstName}${middleName? ` ${middleName}` : ''}${nickName? ` '${nickName}'` : ''} ${lastName}`;

                field.value = value.substring(0, 80);
            }

            if (field.id === 'Dates') {
                if (!birthDate && !deathDate) {
                    field.value = '';
                } else if (birthDate && !deathDate) {
                    const bDay = moment(birthDate).format(dateFormat);
                    const value = `${bDay}`;
                    if(value)
                        field.value = value.substring(0, 40);
                } else if (!birthDate && deathDate) {
                    const dDay = moment(deathDate).format(dateFormat);
                    const value = `${dDay}`;
                    if(value)
                        field.value = value.substring(0, 40);
                } else {
                    const bDay = moment(birthDate).format(dateFormat);
                    const dDay = moment(deathDate).format(dateFormat);
                    const value = `${bDay}\r${dDay}`;
                    if(value)
                        field.value = value.substring(0, 40);
                }
            }

            if (field.id === 'Age') {
                const value = age;
                if(value !== null)
                    field.value = value.substring(0, 10);
            }

            if (field.id === 'smallText') {
                if(description !== null)
                    field.value = description.substring(0, 150);
            }

            return field;
        });
    }
};

export const Scene2Helper = {
    parse: (elements, {description, year}) => {
        return elements.map(field => {
            if (field.id === 'textBoxWhite') {
                if(description !== null)
                    field.value = description.substring(0, 150);
            }

            if (field.id === 'textBoxBlack') {
                if(year !== null)
                    field.value = year.substring(0, 4);
            }

            return field;
        });
    }
};

export const Scene3Helper = {
    parse: (elements, {description, date}) => {
        return elements.map(field => {
            if (field.id === 'mainText') {
                if(description !== null)
                    field.value = description.substring(0, 130);
            }

            if (field.id === 'boxText') {
                if(date !== null)
                    field.value = date.substring(0, 4);
            }

            return field;
        });
    }
};

export const Scene4Helper = {
    parse: (elements, {rightText, leftText}) => {
        return elements.map(field => {
            if (field.id === 'text_01') {
                if(leftText !== null)
                    field.value = leftText.substring(0, 230);
            }

            if (field.id === 'text_02') {
                if(rightText !== null)
                    field.value = rightText.substring(0, 230);
            }

            return field;
        });
    }
};

export const Scene5Helper = {
    parse: (elements, {text}) => {
        return elements.map(field => {
            if (field.id === 'text_01') {
                if(text !== null)
                    field.value = text.substring(0, 270);
            }

            return field;
        });
    }
};

export const Scene6Helper = {
    parse: (elements, {
        description_1,
        name_1,
        name_2,
        name_3,
        name_4,
        name_5,
        name_6,
    }) => {
        return elements.map(field => {
            if (field.id === 'text_01') {
                if(description_1 !== null)
                    field.value = description_1.substring(0, 280);
            }

            if (field.id === 'name_01') {
                if(name_1 !== null)
                    field.value = name_1.substring(0, 20);
            }

            if (field.id === 'name_02') {
                if(name_2 !== null)
                    field.value = name_2.substring(0, 20);
            }

            if (field.id === 'name_03') {
                if(name_3 !== null)
                    field.value = name_3.substring(0, 20);
            }

            if (field.id === 'name_04') {
                if(name_4 !== null)
                    field.value = name_4.substring(0, 20);
            }

            if (field.id === 'name_05') {
                if(name_5 !== null)
                    field.value = name_5.substring(0, 20);
            }

            if (field.id === 'name_06') {
                if(name_6 !== null)
                    field.value = name_6.substring(0, 20);
            }
            return field;
        });
    }
};

export const Scene7Helper = {
    parse: (elements, {text, year}) => {
        return elements.map(field => {
            if (field.id === 'text_01') {
                if(text !== null)
                    field.value = text.substring(0, 150);
            }

            if (field.id === 'boxText') {
                if(year !== null)
                    field.value = year.substring(0, 4);
            }

            return field;
        });
    }
};

export const Scene8Helper = {
    parse: (elements, {text, caption}) => {
        return elements.map(field => {
            if (field.id === 'textBoxWhite') {
                if(text !== null)
                    field.value = text.substring(0, 190);
            }

            if (field.id === 'textBoxBlack') {
                if(caption !== null)
                    field.value = caption.substring(0, 4);
            }

            return field;
        });
    }
};

export const Scene9Helper = {
    parse: (elements, {text}) => {
        return elements.map(field => {
            if (field.id === 'text_01') {
                if(text !== null)
                    field.value = text.substring(0, 450);
            }
            return field;
        });
    }
};

export const Scene10Helper = {
    parse: (elements, {text}) => {
        return elements.map(field => {
            if (field.id === 'text_01') {
                if(text !== null)
                    field.value = text.substring(0, 300);
            }

            return field;
        });
    }
};

export const ScenesValidator = {

};
