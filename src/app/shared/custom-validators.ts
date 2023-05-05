import { FormControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { Observable } from "rxjs";
import { RegisterService } from '../pages/register/register.service';

import { isNullOrUndefined } from 'util';

export function DecimalNumberValidator(input: FormControl) {
    let numberReg: RegExp = new RegExp('^[0-9]+(\.[0-9]+)?$');
    let valid = true;
    if (input.value) {
        valid = numberReg.test(input.value);
    }
    return valid ? null : {
        invalidDecNumber: true
    };
}

export function EmailValidator(input: FormControl) {
    let emailReg: RegExp = new RegExp('^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$');
    let valid = true;
    if (input.value) {
        valid = emailReg.test(input.value);
    }
    return valid ? null : {
        invalidEmail: true
    };
}

export function DateValidator(input: FormControl) {
    let emailReg: RegExp = new RegExp('^(0[1-9]|1[0-2])\/(0[1-9]|1\\d|2\\d|3[01])\/(19|20)\\d{2}$'); //^((0|1)\\d{1})\/((0|1|2)\\d{1})\/((19|20)\\d{2}$)
    let valid = true;
    if (input.value) {
        valid = emailReg.test(input.value);
    }
    return valid ? null : {
        invalidDate: true
    };
}

// export function AlphaNumericValidator(input: FormControl) {
//     let emailReg: RegExp = new RegExp('^[a-zA-Z0-9]+$');
//     let valid = true;
//     if (input.value) {
//         valid = emailReg.test(input.value);
//     }
//     return valid ? null : {
//         invalidUsername: true
//     };
// }

export function ZipCodeValidator(input: FormControl) {
    let numberReg: RegExp = new RegExp('^[0-9]{5}(?:[-\s][0-9]{4})?$');
    let valid = true;
    if (input.value) {
        valid = numberReg.test(input.value);
    }
    return valid ? null : {
        invalidZipcode: true
    };
}

export function CharactersOnlyValidator(input: FormControl) {
    let numberReg: RegExp = new RegExp('[a-zA-z]+\s?[a-zA-Z]*$');
    let valid = true;
    if (input.value) {
        valid = numberReg.test(input.value);
    }
    return valid ? null : {
        invalidCharacterString: true
    };
}


export function CreditCardCodeValidator(input: FormControl) {
    let numberReg: RegExp = new RegExp('^[0-9]{3,4}$');
    let valid = true;
    if (input.value) {
        valid = numberReg.test(input.value);
    }
    return valid ? null : {
        invalidCode: true
    };
}

export function PhoneNumberValidator(input: FormControl) {
    let numberReg: RegExp = new RegExp('^\\(?(\\d{3})\\)?[-. ]?(\\d{3})[-. ]?(\\d{4})$');
    let valid = true;
    if (input.value) {
        valid = numberReg.test(input.value);
    }
    return valid ? null : {
        invalidPhone: true
    };
}

export function CardNumberValidator(input: FormControl) {
    let numberReg: RegExp = new RegExp('^\\d{13,16}|\\d{4}[- ]\\d{4}[- ]\\d{4}[- ]\\d{4}|\\d{4}[- ]\\d{5}[- ]\\d{4}?$');
    let valid = true;
    if (input.value) {
        valid = numberReg.test(input.value);
    }
    return valid ? null : {
        invalidCardNumber: true
    };
}

export function PasswordValidator(input: FormControl) {
    let numberReg: RegExp = new RegExp('(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9].{6,13})$');   
    let valid = true;
    if (input.value) {
        valid = numberReg.test(input.value);
    }
    return valid ? null : {
        invalidPassword: true
    };
}


export const MinDateValidator = (startDate: FormControl) => {

    return (control: FormControl) => {

        var endDate = control.value;
        if (startDate > endDate) {
            return {
                invalidEndDate: { valid: false }
            };
        }
        return null;

    };
};


export const DateRangeValidator = (startDate: FormControl) => {
    return (control: FormControl) => {
        if (control.value) {
            var endDate = control.value;
            if (startDate > endDate) {
                return {
                    invalidEndDate: { valid: false }
                };
            }
            return null;
        }
        return null;
    };
};


export function MatchPassword(AC: AbstractControl): object {
    let password = AC.get('NewPassword').value;
    let confirmPassword = AC.get('ConfirmPassword').value;
    if (password != confirmPassword) {
        AC.get('ConfirmPassword').setErrors({ MatchPassword: true })
    }
    else {
        return null
    }
}

export function MatchEmail(AC: AbstractControl): object {
    let email = AC.get('emailAddress').value;
    let confirmEmailAddress = AC.get('confirmEmailAddress').value;
    if (email != confirmEmailAddress) {
        AC.get('confirmEmailAddress').setErrors({ MatchEmail: true })
    }
    else {
        return null;
    }
}

export function WhitespaceTextValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
}

export function required(control: FormControl) {
    return (isNullOrUndefined(control.value) || (typeof control.value == 'string' && (control.value.trim() == ""))) ?
        { "required": true } :
        null;
}
