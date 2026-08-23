/*
    This file shows the small pop up messages the app uses.
    It wraps the iziToast library so every message looks the same, appearing in
    the top left corner and closing by itself after three seconds. There is one
    method for success messages and one for errors, which pulls readable text out
    of whatever error object it is given.
*/

import { errorExtractor } from "error-extractor";
import iziToast, { IziToastSettings } from "izitoast";
import "izitoast/dist/css/iziToast.css";
class Notify {

    private settings: IziToastSettings = {
        position: "topLeft",
        transitionIn: "fadeInRight",
        transitionOut: "fadeOutLeft",
        timeout: 3000
    };

    // Shows a green success message
    public success(message: string): void {
        this.settings.message = message;
        iziToast.success(this.settings,);
    }

    // Shows a red error message
    public error(err: any): void {
        this.settings.message = errorExtractor.getMessage(err); 
        iziToast.error(this.settings);
    }


}

// The shared notify object
export const notify = new Notify();
