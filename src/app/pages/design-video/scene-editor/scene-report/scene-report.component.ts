import { Component, Input } from '@angular/core';
import { LayoutIdentifiers } from '../../constants';
import isNil from 'lodash/isNil';

@Component({
    selector: 'scene-report',
    templateUrl: './scene-report.component.html',
    styleUrls: ['./scene-report.component.scss'],
})

export class SceneReportComponent {
    @Input() helper: any;

    public errorsCount = 0;
    public parsedErrors: any[] = [];

    _parseErrors(sceneHelper) {
        const infoErrors = Object.keys(sceneHelper._infoErrors).map(key => {
            if (sceneHelper.name === LayoutIdentifiers.LAT_SCENE_01_PERSON.name) {
                if (key === 'firstName') {
                    return {
                        valid: sceneHelper._infoErrors[key],
                        message: 'First Name is missing',
                    };
                }

                if (key === 'lastName') {
                    return {
                        valid: sceneHelper._infoErrors[key],
                        message: 'Last Name is missing',
                    };
                }
            }

            if (sceneHelper.name === LayoutIdentifiers.LAT_SCENE_03.name) {
                if (key === 'year') {
                    return {
                        valid: sceneHelper._infoErrors[key],
                        message: 'Year is missing',
                    };
                }
            }

            if (sceneHelper.name === LayoutIdentifiers.LAT_SCENE_02_EVENTS.name) {
                if (key === 'date') {
                    return {
                        valid: sceneHelper._infoErrors[key],
                        message: 'Year is missing',
                    };
                }
            }

            if (sceneHelper.name === LayoutIdentifiers.LAT_SCENE_04.name) {
                if (key === 'rightText') {
                    return {
                        valid: sceneHelper._infoErrors[key],
                        message: 'Right Text is missing',
                    };
                }

                if (key === 'leftText') {
                    return {
                        valid: sceneHelper._infoErrors[key],
                        message: 'Left Text is missing',
                    };
                }
            }

            if (sceneHelper.name === LayoutIdentifiers.LAT_SCENE_05.name) {
                if (key === 'text') {
                    return {
                        valid: sceneHelper._infoErrors[key],
                        message: 'Text is missing',
                    };
                }
            }

            if (sceneHelper.name === LayoutIdentifiers.LAT_SCENE_06.name) {
                if (key === 'description_1') {
                    return {
                        valid: sceneHelper._infoErrors[key],
                        message: 'Text Name is missing',
                    };
                }

                if (key === 'name_1') {
                    return {
                        valid: sceneHelper._infoErrors[key],
                        message: 'Name 1 is missing',
                    };
                }

                if (key === 'name_2') {
                    return {
                        valid: sceneHelper._infoErrors[key],
                        message: 'Name 2 is missing',
                    };
                }

                if (key === 'name_3') {
                    return {
                        valid: sceneHelper._infoErrors[key],
                        message: 'Name 3 is missing',
                    };
                }

                if (key === 'name_4') {
                    return {
                        valid: sceneHelper._infoErrors[key],
                        message: 'Name 4 is missing',
                    };
                }

                if (key === 'name_5') {
                    return {
                        valid: sceneHelper._infoErrors[key],
                        message: 'Name 5 is missing',
                    };
                }

                if (key === 'name_6') {
                    return {
                        valid: sceneHelper._infoErrors[key],
                        message: 'Name 6 is missing',
                    };
                }
            }

            if (sceneHelper.name === LayoutIdentifiers.LAT_SCENE_07.name) {
                if (key === 'text') {
                    return {
                        valid: sceneHelper._infoErrors[key],
                        message: 'Description is missing',
                    };
                }

                if (key === 'year') {
                    return {
                        valid: sceneHelper._infoErrors[key],
                        message: 'Year is missing',
                    };
                }
            }

            if (sceneHelper.name === LayoutIdentifiers.LAT_SCENE_08.name) {
                if (key === 'text') {
                    return {
                        valid: sceneHelper._infoErrors[key],
                        message: 'Text is missing',
                    };
                }

                if (key === 'caption') {
                    return {
                        valid: sceneHelper._infoErrors[key],
                        message: 'Caption is missing',
                    };
                }
            }

            if (sceneHelper.name === LayoutIdentifiers.LAT_SCENE_09.name) {
                if (key === 'text') {
                    return {
                        valid: sceneHelper._infoErrors[key],
                        message: 'Description is missing',
                    };
                }
            }

            if (sceneHelper.name === LayoutIdentifiers.LAT_SCENE_10.name) {
                if (key === 'text') {
                    return {
                        valid: sceneHelper._infoErrors[key],
                        message: 'Description is missing',
                    };
                }
            }
        });

        const mediaErrors = Object.keys(sceneHelper._mediaErrors).map(key => {
            if (key === 'mediaComp') {
                return {
                    valid: sceneHelper._mediaErrors[key],
                    message: 'Image is missing',
                };
            }

            if (key === 'mediaComp_01') {
                return {
                    valid: sceneHelper._mediaErrors[key],
                    message: 'Image 1 is missing',
                };
            }

            if (key === 'mediaComp_02') {
                return {
                    valid: sceneHelper._mediaErrors[key],
                    message: 'Image 2 is missing',
                };
            }

            if (key === 'mediaComp_03') {
                return {
                    valid: sceneHelper._mediaErrors[key],
                    message: 'Image 3 is missing',
                };
            }

            if (key === 'mediaComp_04') {
                return {
                    valid: sceneHelper._mediaErrors[key],
                    message: 'Image 4 is missing',
                };
            }

            if (key === 'mediaComp_05') {
                return {
                    valid: sceneHelper._mediaErrors[key],
                    message: 'Image 5 is missing',
                };
            }

            if (key === 'mediaComp_06') {
                return {
                    valid: sceneHelper._mediaErrors[key],
                    message: 'Image 6 is missing',
                };
            }
        });

        const errors = [...infoErrors, ...mediaErrors];
        return errors;
    }

    parseInfoError(error) {
        console.error(error);
    }

    parseMediaError(error) {
        console.error(error);
    }

    hasErrors() {
        return this.helper.some(([error, value]) => value);
    }

    parseError([error, value]) {
        if (error === 'firstName') {
            return 'First Name is missing';
        }

        if (error === 'lastName') {
            return 'Last Name is missing';
        }

        if (error === 'date') {
            return 'Year is missing';
        }

        if (error === 'rightText') {
            return 'Right Text is missing';
        }

        if (error === 'leftText') {
            return 'Left Text is missing';
        }

        if (error === 'description_1') {
            return 'Text is missing';
        }

        if (error === 'description') {
            return 'Text is missing';
        }

        if (error === 'name_1') {
            return 'Caption 1 is missing';
        }

        if (error === 'name_2') {
            return 'Caption 2 is missing';
        }

        if (error === 'name_3') {
            return 'Caption 3 is missing';
        }

        if (error === 'name_4') {
            return 'Caption 4 is missing';
        }

        if (error === 'name_5') {
            return 'Caption 5 is missing';
        }

        if (error === 'name_6') {
            return 'Caption 6 is missing';
        }

        if (error === 'year') {
            return 'Year is missing';
        }

        if (error === 'text') {
            return 'Text is missing';
        }

        if (error === 'caption') {
            return 'Year is missing';
        }

        if (error === 'mediaComp') {
            return 'Image is missing';
        }

        if (error === 'mediaComp_01') {
            return 'Image 1 is missing';
        }

        if (error === 'mediaComp_02') {
            return 'Image 2 is missing';
        }

        if (error === 'mediaComp_03') {
            return 'Image 3 is missing';
        }

        if (error === 'mediaComp_04') {
            return 'Image 4 is missing';
        }

        if (error === 'mediaComp_05') {
            return 'Image 5 is missing';
        }

        if (error === 'mediaComp_06') {
            return 'Image 6 is missing';
        }
    }
}
