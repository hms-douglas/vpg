"use strict";

(() => {
    const VERSION = "1.0.1",
        PREFIX_CLASS = ".",
        CANVAS_IMAGE_TYPE = "image/png",
        TAG_A = "a",
        TAG_VIDEO = "video",
        TAG_CANVAS = "canvas",
        TAG_DIV = "div",
        STYLE_DISPLAY_NONE = "none",
        STYLE_DISPLAY_INLINE_BLOCK = "inline-block",
        CLASS_PAGE = "page",
        CLASS_POPUP = "popup",
        CLASS_SHOW = "show",
        CLASS_SHOW_IN = "show-in",
        CLASS_SHOW_OUT = "show-out",
        CLASS_CARD = "card",
        CLASS_PREVIEW = "preview",
        CLASS_PREVIEWS = "previews",
        CLASS_PREVIEW_FULL = "preview-full",
        CLASS_SELECTED = "selected",
        CLASS_BOTTOM_CREDITS = "bottom_credits",
        CLASS_SCROLLABLE = "scrollable",
        CLASS_BTN_SECONDARY = "btn--secondary",
        EVENT_CHANGE = "change",
        EVENT_CLICK = "click",
        EVENT_KEY_UP = "keyup",
        DATASET_INDEX = "index",
        DATASET_TIMESTAMP = "time",
        DATASET_NAME = "name",
        DATASET_SIZE = "size",
        DATASET_BTNS = "btns",
        DATASET_GRID = "grid",
        EL_INPUT_SELECT_FILES = document.getElementById("INPUT_FILE"),
        EL_CONTAINER_VIDEOS = document.getElementById("VIDEOS"),
        EL_LABEL_VERSION = document.getElementById("VERSION"),
        EL_BTN_NEXT = document.getElementById("BTN_NEXT"),
        EL_BTN_PREVIOUS = document.getElementById("BTN_PREVIOUS"),
        EL_BTN_DOWNLOAD = document.getElementById("BTN_DOWNLOAD"),
        EL_BTN_APPLY = document.getElementById("BTN_APPLY"),
        EL_BTN_APPLY_ALL = document.getElementById("BTN_APPLY_ALL"),
        EL_BTN_NEW = document.getElementById("BTN_NEW"),
        EL_CONTAINER_CARDS = document.getElementById("CARDS"),
        EL_LABEL_CARDS_POSITION = document.getElementById("POSITION"),
        EL_SET_LABEL_NAME = document.getElementById("S_L_NAME"),
        EL_SET_LABEL_SIZE = document.getElementById("S_L_SIZE"),
        EL_SET_LABEL_DURATION = document.getElementById("S_L_DURATION"),
        EL_SET_LABEL_RESOLUTION = document.getElementById("S_L_RESOLUTION"),
        EL_SET_GRID_ROWS = document.getElementById("S_G_ROWS"),
        EL_SET_GRID_COLUMNS = document.getElementById("S_G_COLUMNS"),
        EL_SET_GRID_SPACE = document.getElementById("S_G_SPACE"),
        EL_SET_DESIGN_BACK_C = document.getElementById("S_D_BACK_C"),
        EL_SET_DESIGN_SHADOW = document.getElementById("S_D_SHADOW"),  
        EL_SET_DESIGN_WATERMARK_A_C = document.getElementById("S_D_LOGO_C"),  
        EL_SET_DESIGN_ABOUT_C = document.getElementById("S_D_ABOUT_C"),
        EL_SET_DESIGN_ABOUT_S = document.getElementById("S_D_ABOUT_S"),      
        EL_SET_DESIGN_TIME_C = document.getElementById("S_D_TIME_C"),
        EL_SET_DESIGN_TIME_S = document.getElementById("S_D_TIME_S"),
        EL_SET_DESIGN_TIME_SD = document.getElementById("S_D_TIME_SD"),
        EL_SET_DESIGN_TIME_M = document.getElementById("S_D_TIME_M"),
        EL_NAVIGATION = document.getElementById("NAVIGATION"),
        EL_RES_WATERMARK = document.getElementById("WATERMARK"),
        RADIO_NAME_TIME_P = "t_pos",
        STORAGE_VERSION = "VPG_version",
        STORAGE_LABEL_NAME = "VPG_a",
        STORAGE_LABEL_SIZE = "VPG_b",
        STORAGE_LABEL_DURATION = "VPG_c",
        STORAGE_LABEL_RESOLUTION = "VPG_d",
        STORAGE_GRID_ROWS = "VPG_e",
        STORAGE_GRID_COLUMNS = "VPG_f",
        STORAGE_GRID_SPACE = "VPG_g",
        STORAGE_DESIGN_BACK_C = "VPG_h",
        STORAGE_DESIGN_ABOUT_C = "VPG_i",
        STORAGE_DESIGN_TIME_C = "VPG_j",
        STORAGE_DESIGN_TIME_P = "VPG_k",
        STORAGE_DESIGN_TIME_S = "VPG_l",
        STORAGE_DESIGN_TIME_SD = "VPG_m",
        STORAGE_DESIGN_TIME_M = "VPG_n",
        STORAGE_DESIGN_ABOUT_S = "VPG_o",
        STORAGE_DESIGN_SHADOW = "VPG_p",
        STORAGE_DESIGN_WATERMARK_AC = "VPG_q";

    window.onload = () => {
        App.initListeners();

        App.updateInfo();

        Settings.init();

        //App.registerServiceWorker();
    };

    class App {
        static updateInfo() {
            EL_LABEL_VERSION.innerHTML = "v" + VERSION;
        }

        static initListeners() {
            EL_INPUT_SELECT_FILES.addEventListener(EVENT_CHANGE, File.filesAdded);
        
            EL_BTN_NEXT.addEventListener(EVENT_CLICK, UI_Cards.goToNext);
            EL_BTN_PREVIOUS.addEventListener(EVENT_CLICK, UI_Cards.goToPrevious);
        
            EL_BTN_DOWNLOAD.addEventListener(EVENT_CLICK, Download.download);
        
            EL_BTN_APPLY.addEventListener(EVENT_CLICK, () => Settings.apply(false));
            EL_BTN_APPLY_ALL.addEventListener(EVENT_CLICK, () => Settings.apply(true));
        
            EL_BTN_NEW.addEventListener(EVENT_CLICK, () => Page.goTo(Page.SELECT_FILES));
        
            document.addEventListener(EVENT_KEY_UP, (e) => {
                if(Page.getCurrentEl().id === Page.MAIN && e.keyCode === 27) {
                    UI_Cards.unselectAllFromActive();
                }
            });
        
            document.addEventListener("contextmenu", (e) => e.preventDefault());
        
            document.querySelector(PREFIX_CLASS + CLASS_BOTTOM_CREDITS).addEventListener(EVENT_CLICK, () => {
                const scroller = Page.getCurrentEl().querySelector(PREFIX_CLASS + CLASS_SCROLLABLE);
                
                scroller.scroll({
                    behavior: "smooth",
                    top: scroller.scrollHeight
                });
            });
        }

        static registerServiceWorker() {
            if("serviceWorker" in navigator) {
            navigator.serviceWorker.register("sw.js");
            }
        }
    }

    class Utils {
        static getDataUrl(canvas) {
            return canvas.toDataURL(CANVAS_IMAGE_TYPE).replace(/^data:image\/(png|jpg);base64,/, "");
        }

        static getHeightForWidth(h, w, desiredW) {
            return h * (desiredW / w)
        }

        static getWidthForHeight(w, h, desiredH) {
            return w * (desiredH / h)
        }

        static formatTimestamp(secs, showMili) {
            let hours = Math.floor(secs / 3600),
                minutes = Math.floor((secs - (hours * 3600)) / 60),
                seconds = (secs - (hours * 3600) - (minutes * 60)).toFixed(showMili ? 2 : 0);

            return ((hours < 10) ? "0" + hours : hours) + ":"  + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds)
        }

        static getSizeLongestLanguage() {
            return Math.max(...[
                Settings.Language.name.length,
                Settings.Language.size.length,
                Settings.Language.duration.length,
                Settings.Language.resolution.length
            ]);
        }

        static formatString(s, l, c) {
            for(let i = s.length; i < l; i++) {
                s += c;
            }

            return s;
        }

        static formatSize(size) {
            if(size < 1024) {
                return size + " B";
            }
            
            const units = ["KiB", "MiB", "GiB", "TiP", "PiB"];

            let i = -1;

            do {
                size /= 1024;
                ++i;
            } while(Math.round(Math.abs(size) * 10) / 10 >= 1024 && i < units.length - 1);

            return String(size.toFixed(1)).replace(".0", "") + " " + units[i];
        }

        static removeExtension(s) {
            return s.split(".").slice(0, -1).join(".") || s;
        }

        static isMobile() {
            const userAgent = navigator.userAgent || window.opera || navigator.vendor;
            
            return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4)));     
        }
    }

    class Settings {
        static Language = class {
            static name;
            static size;
            static duration;
            static resolution;

            static _AMOUNT = 4;
        };

        static Grid = class {
            static rows;
            static columns;
            static space;

            static _COLUMN_WIDTH = 300;

            static getGridString() {
                return Settings.Grid.rows + "x" + Settings.Grid.columns;
            }
        };

        static Design = class {
            static backgroundColor;
            static showShadow;
            static showAboutColorOnWatermark;

            static _FONT_NAME = "Roboto Mono";

            static About = class {
                static color;
                static size;

                static _SPACE = 3;
                static _SPACE_CHARACTER = ".";
                static _DIVISOR_CHARACTER = ": ";
                static _MARGIN = 20;
                static _SPACE_LINE = 5;
            }
            
            static Timestamp = class {
                static color;
                static position;
                static size;
                static showShadow;
                static showMili;

                static _FONT_SPACE_BORDER_PREVIEW = 7;

                static getRadioTimestapPositionFromEl() {
                    return document.querySelector("input[name='" + RADIO_NAME_TIME_P + "']:checked").value;
                }
            
                static setElRadioTimestapPosition(value) {
                    return document.querySelector("input[name='" + RADIO_NAME_TIME_P + "'][value='" + value + "']").checked = true;
                }
            }
        };

        static init() {
            if(!(STORAGE_VERSION in localStorage)) {
                localStorage.setItem(STORAGE_VERSION, VERSION);

                localStorage.setItem(STORAGE_LABEL_NAME, "Name");
                localStorage.setItem(STORAGE_LABEL_SIZE, "Size");
                localStorage.setItem(STORAGE_LABEL_DURATION, "Duration");
                localStorage.setItem(STORAGE_LABEL_RESOLUTION, "Resolution");

                localStorage.setItem(STORAGE_GRID_ROWS, 5);
                localStorage.setItem(STORAGE_GRID_COLUMNS, 5);
                localStorage.setItem(STORAGE_GRID_SPACE, 6);

                localStorage.setItem(STORAGE_DESIGN_BACK_C, "#F5F5F5");
                localStorage.setItem(STORAGE_DESIGN_SHADOW, false);
                localStorage.setItem(STORAGE_DESIGN_WATERMARK_AC, false);

                localStorage.setItem(STORAGE_DESIGN_ABOUT_C, "#1C1C1C");
                localStorage.setItem(STORAGE_DESIGN_ABOUT_S, 18);

                localStorage.setItem(STORAGE_DESIGN_TIME_C, "#FFFFFF");
                localStorage.setItem(STORAGE_DESIGN_TIME_P, "BR");
                localStorage.setItem(STORAGE_DESIGN_TIME_S, 17);
                localStorage.setItem(STORAGE_DESIGN_TIME_SD, false);
                localStorage.setItem(STORAGE_DESIGN_TIME_M, false);
            }

            this._retrieve();

            this._show();
        }

        static apply(all) {
            localStorage.setItem(STORAGE_LABEL_NAME, EL_SET_LABEL_NAME.value);
            localStorage.setItem(STORAGE_LABEL_SIZE, EL_SET_LABEL_SIZE.value);
            localStorage.setItem(STORAGE_LABEL_DURATION, EL_SET_LABEL_DURATION.value);
            localStorage.setItem(STORAGE_LABEL_RESOLUTION, EL_SET_LABEL_RESOLUTION.value);

            localStorage.setItem(STORAGE_GRID_ROWS, EL_SET_GRID_ROWS.value);
            localStorage.setItem(STORAGE_GRID_COLUMNS, EL_SET_GRID_COLUMNS.value);
            localStorage.setItem(STORAGE_GRID_SPACE, EL_SET_GRID_SPACE.value);

            localStorage.setItem(STORAGE_DESIGN_BACK_C, EL_SET_DESIGN_BACK_C.value);
            localStorage.setItem(STORAGE_DESIGN_SHADOW, EL_SET_DESIGN_SHADOW.checked);
            localStorage.setItem(STORAGE_DESIGN_WATERMARK_AC, EL_SET_DESIGN_WATERMARK_A_C.checked);

            localStorage.setItem(STORAGE_DESIGN_ABOUT_C, EL_SET_DESIGN_ABOUT_C.value);
            localStorage.setItem(STORAGE_DESIGN_ABOUT_S, EL_SET_DESIGN_ABOUT_S.value);

            localStorage.setItem(STORAGE_DESIGN_TIME_C, EL_SET_DESIGN_TIME_C.value);
            localStorage.setItem(STORAGE_DESIGN_TIME_P, Settings.Design.Timestamp.getRadioTimestapPositionFromEl());
            localStorage.setItem(STORAGE_DESIGN_TIME_S, EL_SET_DESIGN_TIME_S.value);
            localStorage.setItem(STORAGE_DESIGN_TIME_SD, EL_SET_DESIGN_TIME_SD.checked);
            localStorage.setItem(STORAGE_DESIGN_TIME_M, EL_SET_DESIGN_TIME_M.checked);

            Settings._retrieve();

            Popup.show(Popup.LOADING);

            if(all) {
                Render.renderAll();
            } else {
                Render.renderCurrent();
            }
        }

        static _retrieve() {
            this.Language.name = localStorage.getItem(STORAGE_LABEL_NAME);
            this.Language.size = localStorage.getItem(STORAGE_LABEL_SIZE);
            this.Language.duration = localStorage.getItem(STORAGE_LABEL_DURATION);
            this.Language.resolution = localStorage.getItem(STORAGE_LABEL_RESOLUTION);
            
            this.Grid.rows = Number(localStorage.getItem(STORAGE_GRID_ROWS));
            this.Grid.columns = Number(localStorage.getItem(STORAGE_GRID_COLUMNS));
            this.Grid.space = Number(localStorage.getItem(STORAGE_GRID_SPACE));
            
            this.Design.backgroundColor = localStorage.getItem(STORAGE_DESIGN_BACK_C);
            this.Design.showShadow = localStorage.getItem(STORAGE_DESIGN_SHADOW) === "true";
            this.Design.showAboutColorOnWatermark = localStorage.getItem(STORAGE_DESIGN_WATERMARK_AC) === "true";

            this.Design.About.color = localStorage.getItem(STORAGE_DESIGN_ABOUT_C);
            this.Design.About.size = Number(localStorage.getItem(STORAGE_DESIGN_ABOUT_S));

            this.Design.Timestamp.color = localStorage.getItem(STORAGE_DESIGN_TIME_C);
            this.Design.Timestamp.position = localStorage.getItem(STORAGE_DESIGN_TIME_P);
            this.Design.Timestamp.size = Number(localStorage.getItem(STORAGE_DESIGN_TIME_S));
            this.Design.Timestamp.showShadow = localStorage.getItem(STORAGE_DESIGN_TIME_SD) === "true";
            this.Design.Timestamp.showMili = localStorage.getItem(STORAGE_DESIGN_TIME_M) === "true";
        }

        static _show() {
            EL_SET_LABEL_NAME.value = this.Language.name;
            EL_SET_LABEL_SIZE.value = this.Language.size;
            EL_SET_LABEL_DURATION.value = this.Language.duration;
            EL_SET_LABEL_RESOLUTION.value = this.Language.resolution;
            
            EL_SET_GRID_ROWS.value = this.Grid.rows;
            EL_SET_GRID_COLUMNS.value = this.Grid.columns;
            EL_SET_GRID_SPACE.value = this.Grid.space;
            
            EL_SET_DESIGN_BACK_C.value = this.Design.backgroundColor;
            EL_SET_DESIGN_SHADOW.checked = this.Design.showShadow;
            EL_SET_DESIGN_WATERMARK_A_C.checked = this.Design.showAboutColorOnWatermark;

            EL_SET_DESIGN_ABOUT_C.value = this.Design.About.color;
            EL_SET_DESIGN_ABOUT_S.value = this.Design.About.size;

            EL_SET_DESIGN_TIME_C.value = this.Design.Timestamp.color;
            EL_SET_DESIGN_TIME_S.value = this.Design.Timestamp.size;
            EL_SET_DESIGN_TIME_SD.checked = this.Design.Timestamp.showShadow;
            EL_SET_DESIGN_TIME_M.checked = this.Design.Timestamp.showMili;

            Settings.Design.Timestamp.setElRadioTimestapPosition(Settings.Design.Timestamp.position);
        }
    }

    class Download {
        static _PREFIX_FILE = "VPG";
        static _FILE_SPACE_SEPARATOR = "_";
        static _FILE_PREVIEW_NAME = "preview";
        static _FOLDER_PREVIEW_NAME = "Images";
        static _EXTENSION_IMAGE = ".png";
        static _EXTENSION_COMPRESSED_FILE = ".zip";

        static download() {
            if(!Popup.isShowing()) {
                Popup.show(Popup.LOADING);

                setTimeout(async function() {
                    if(Utils.isMobile() && File.videos.length > 1) {
                        Download._downloadMobile();
                    } else if(UI_Cards.getAllSelectedActive().length > 0) {
                        Download._downloadSelected();
                    } else {
                        Download._downloadPreviewOnly();
                    }
                    
                    setTimeout(() => Popup.hide(), 2000);
                }, 0);
            }
        }

        static async _downloadSelected() {
            const card = UI_Cards.getActive(),
                selecteds = UI_Cards.getAllSelectedActive(),
                zip = new JSZip(),
                name = Download._PREFIX_FILE + Download._FILE_SPACE_SEPARATOR  + Utils.removeExtension(File.videos[UI_Cards.getActiveIndex()].dataset[DATASET_NAME]);

            zip.file(name + Download._EXTENSION_IMAGE, Utils.getDataUrl(card.querySelector(PREFIX_CLASS + CLASS_PREVIEW)), {base64 : true});

            const folder = zip.folder(Download._FOLDER_PREVIEW_NAME);

            selecteds.forEach((canvas) => {
                folder.file(Download._PREFIX_FILE + Download._FILE_SPACE_SEPARATOR + Utils.formatTimestamp(canvas.dataset[DATASET_TIMESTAMP]).replaceAll(":", "-") + Download._EXTENSION_IMAGE, Utils.getDataUrl(canvas), {base64 : true});
            });
        
            const zipFile = await zip.generateAsync({type : "blob"});
            
            const a = document.createElement(TAG_A);
        
            a.download = name + Download._EXTENSION_COMPRESSED_FILE;
            a.href = URL.createObjectURL(zipFile);
            a.style.display = STYLE_DISPLAY_NONE;
        
            document.body.appendChild(a);
        
            a.click();
            a.remove();
        }

        static _downloadPreviewOnly() {
            const canvas = UI_Cards.getActive().querySelector(PREFIX_CLASS + CLASS_PREVIEW);

            const name = Download._PREFIX_FILE + Download._FILE_SPACE_SEPARATOR  + Utils.removeExtension(File.videos[UI_Cards.getActiveIndex()].dataset[DATASET_NAME]) + Download._EXTENSION_IMAGE;
        
            const a = document.createElement(TAG_A);

            a.download = name;
            a.href = canvas.toDataURL();
            a.style.display = STYLE_DISPLAY_NONE;

            document.body.appendChild(a);
        
            a.click();
            a.remove();
        }

        static async _downloadMobile() {
            const zip = new JSZip();

            UI_Cards.getAll().forEach((card, index) => {
                const selecteds = UI_Cards.getAllSelectedFrom(card),
                    name = Download._PREFIX_FILE + Download._FILE_SPACE_SEPARATOR + Utils.removeExtension(File.videos[index].dataset[DATASET_NAME]);

                if(selecteds.length > 0) {
                    const folderCard = zip.folder(name);

                    folderCard.file(name + Download._EXTENSION_IMAGE, Utils.getDataUrl(card.querySelector(PREFIX_CLASS + CLASS_PREVIEW)), {base64 : true});

                    const folderPreviews = folderCard.folder(Download._FOLDER_PREVIEW_NAME);

                    selecteds.forEach((selected) => {
                        folderPreviews.file(Download._PREFIX_FILE + Download._FILE_SPACE_SEPARATOR + Utils.formatTimestamp(selected.dataset[DATASET_TIMESTAMP]).replaceAll(":", "-") + Download._EXTENSION_IMAGE, Utils.getDataUrl(selected), {base64 : true});
                    });
                } else {
                    zip.file(name + Download._EXTENSION_IMAGE, Utils.getDataUrl(card.querySelector(PREFIX_CLASS + CLASS_PREVIEW)), {base64 : true});
                }
            });

            const zipFile = await zip.generateAsync({type : "blob"});
            
            const a = document.createElement(TAG_A);
        
            a.download = Download._PREFIX_FILE + Download._EXTENSION_COMPRESSED_FILE;
            a.href = URL.createObjectURL(zipFile);
            a.style.display = STYLE_DISPLAY_NONE;
        
            document.body.appendChild(a);
        
            a.click();
            a.remove();
        }
    }

    class UI_Cards {
        static getAll() {
            return EL_CONTAINER_CARDS.querySelectorAll(PREFIX_CLASS + CLASS_CARD);
        }

        static get(i) {
            return EL_CONTAINER_CARDS.querySelectorAll(PREFIX_CLASS + CLASS_CARD)[i];
        }

        static getActive() {
            return EL_CONTAINER_CARDS.querySelector(PREFIX_CLASS + CLASS_CARD + PREFIX_CLASS + CLASS_SHOW)
        }

        static getActiveIndex() {
            const active = UI_Cards.getActive();
            
            return active === null ? -1 : Number(UI_Cards.getActive().dataset[DATASET_INDEX]);
        }

        static getAllSelectedActive() {
            return UI_Cards.getAllSelectedFrom(UI_Cards.getActive());
        }

        static getAllSelectedFrom(card) {
            return card.querySelectorAll(PREFIX_CLASS + CLASS_SELECTED + " " + PREFIX_CLASS + CLASS_PREVIEW);
        }

        static refreshPositionIndicator() {
            EL_LABEL_CARDS_POSITION.innerHTML = (this.getActiveIndex() + 1) + "/" + this.getAll().length;
        }

        static goTo(index) {
            const el = this.get(index);

            el.scrollIntoView();

            const cards = this.getAll();

            cards.forEach((card) => card.classList.remove(CLASS_SHOW));

            el.classList.add(CLASS_SHOW);

            EL_LABEL_CARDS_POSITION.innerHTML = (index + 1) + "/" + cards.length
        }

        static goToNext() {
            let goToIndex = UI_Cards.getActiveIndex() + 1;

            UI_Cards.goTo(goToIndex  === UI_Cards.getAll().length ? 0 : goToIndex);
        }

        static goToPrevious() {
            const goToIndex = UI_Cards.getActiveIndex() - 1;

            UI_Cards.goTo(goToIndex < 0 ? (UI_Cards.getAll().length - 1) : goToIndex);
        }

        static showNavigation(b) {
            if(b) {
                EL_NAVIGATION.style.display = STYLE_DISPLAY_INLINE_BLOCK;
                EL_BTN_APPLY_ALL.style.display = STYLE_DISPLAY_INLINE_BLOCK;
        
                EL_BTN_APPLY_ALL.parentElement.dataset[DATASET_BTNS] = 2;

                EL_BTN_APPLY.classList.add(CLASS_BTN_SECONDARY);
            } else {
                EL_NAVIGATION.style.display = STYLE_DISPLAY_NONE;
                EL_BTN_APPLY_ALL.style.display = STYLE_DISPLAY_NONE;
        
                EL_BTN_APPLY_ALL.parentElement.dataset[DATASET_BTNS] = 1;

                EL_BTN_APPLY.classList.remove(CLASS_BTN_SECONDARY);
            }
        }

        static clear() {
            EL_CONTAINER_CARDS.innerHTML = "";
        }

        static add(card) {
            EL_CONTAINER_CARDS.appendChild(card);
        }

        static createEmptyCard(index) {
            const card = document.createElement(TAG_DIV);
                card.className = CLASS_CARD;
                card.dataset[DATASET_INDEX] = index;

            if(index === 0) {
                card.classList.add(CLASS_SHOW);
            }

            const previews = document.createElement(TAG_DIV);
                previews.className = CLASS_PREVIEWS;

            card.appendChild(UI_Cards.createEmptyFullPreview());
            card.appendChild(previews);

            return card;
        }

        static createPreviews(canvasPreview) {
            const previews = [];

            canvasPreview.forEach((canvas) => {
                const container = document.createElement(TAG_DIV);
                      container.addEventListener(EVENT_CLICK, () => container.classList.toggle(CLASS_SELECTED));

                container.appendChild(canvas);

                previews.push(container);
            })

            return previews;
        }

        static getPreviews() {
            return UI_Cards.getActive().querySelectorAll(PREFIX_CLASS + CLASS_PREVIEWS + " " + TAG_CANVAS);
        }

        static createEmptyFullPreview() {
            const canvas = document.createElement(TAG_CANVAS);
                  canvas.classList.add(CLASS_PREVIEW);
                  canvas.classList.add(CLASS_PREVIEW_FULL);

            return canvas;
        }

        static createFullPreview(canvasPreviews, index) {
            const previewHeight = Utils.getHeightForWidth(canvasPreviews[0].height, canvasPreviews[0].width, Settings.Grid._COLUMN_WIDTH);

            const aboutHeight = (Settings.Design.About._MARGIN * 2) + ((Settings.Design.About.size + Settings.Design.About._SPACE_LINE) * (Settings.Language._AMOUNT));

            const canvas = UI_Cards.createEmptyFullPreview();
                  canvas.width = ((Settings.Grid._COLUMN_WIDTH + Settings.Grid.space) * Settings.Grid.columns) + Settings.Grid.space;
                  canvas.height = ((previewHeight + Settings.Grid.space) * Settings.Grid.rows) + aboutHeight;
                  canvas.dataset[DATASET_GRID] = Settings.Grid.getGridString();

            const ctx = canvas.getContext("2d");

            ctx.fillStyle = Settings.Design.backgroundColor;
            
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = Settings.Design.About.size + "px " + Settings.Design._FONT_NAME;
            ctx.fillStyle = Settings.Design.About.color;
            ctx.textAlign = "left";
            ctx.textBaseline = "top";

            const logoHeight = aboutHeight - Settings.Design.About._MARGIN,
                  logoWidth = Utils.getWidthForHeight(EL_RES_WATERMARK.naturalWidth, EL_RES_WATERMARK.naturalHeight, logoHeight);

            if(Settings.Design.showAboutColorOnWatermark) {
                const canvasWatermark = document.createElement(TAG_CANVAS);
                    canvasWatermark.width = canvas.width;
                    canvasWatermark.height = canvas.height;

                const ctxWatermark = canvasWatermark.getContext("2d");

                ctxWatermark.fillStyle = Settings.Design.About.color;
                ctxWatermark.fillRect(0, 0, canvas.width, canvas.height);

                ctxWatermark.globalCompositeOperation = "destination-in";

                ctxWatermark.drawImage(
                    EL_RES_WATERMARK,
                    canvas.width - logoWidth - (Settings.Design.About._MARGIN / 2),
                    (Settings.Design.About._MARGIN / 2),
                    logoWidth,
                    logoHeight
                );

                ctx.drawImage(canvasWatermark, 0, 0);
            } else {
                ctx.drawImage(
                    EL_RES_WATERMARK,
                    canvas.width - logoWidth - (Settings.Design.About._MARGIN / 2),
                    (Settings.Design.About._MARGIN / 2),
                    logoWidth,
                    logoHeight
                );
            }

            const l = Utils.getSizeLongestLanguage() + Settings.Design.About._SPACE;

            let xAbout = Settings.Design.About._MARGIN, 
                yAbout = Settings.Design.About._MARGIN;

            const video = File.videos[index];

            ctx.fillText(
                Utils.formatString(Settings.Language.name, l, Settings.Design.About._SPACE_CHARACTER) + Settings.Design.About._DIVISOR_CHARACTER + video.dataset[DATASET_NAME]
                , xAbout, yAbout
            );

            yAbout += Settings.Design.About.size + Settings.Design.About._SPACE_LINE;

            ctx.fillText(
                Utils.formatString(Settings.Language.size, l, Settings.Design.About._SPACE_CHARACTER) + Settings.Design.About._DIVISOR_CHARACTER + video.dataset[DATASET_SIZE]
                , xAbout, yAbout
            );

            yAbout += Settings.Design.About.size + Settings.Design.About._SPACE_LINE;

            ctx.fillText(
                Utils.formatString(Settings.Language.resolution, l, Settings.Design.About._SPACE_CHARACTER) + Settings.Design.About._DIVISOR_CHARACTER + canvasPreviews[0].width + "x" + canvasPreviews[0].height
                , xAbout, yAbout
            );

            yAbout += Settings.Design.About.size + Settings.Design.About._SPACE_LINE;

            ctx.fillText(
                Utils.formatString(Settings.Language.duration, l, Settings.Design.About._SPACE_CHARACTER) + Settings.Design.About._DIVISOR_CHARACTER + Utils.formatTimestamp(video.duration)
                , xAbout, yAbout
            );

            yAbout += Settings.Design.About.size + Settings.Design.About._MARGIN - Settings.Grid.space;

            ctx.font = Settings.Design.Timestamp.size + "px " + Settings.Design._FONT_NAME;
            ctx.fillStyle = Settings.Design.Timestamp.color;

            let xTime,
                yTime;

            switch(Settings.Design.Timestamp.position[0]) {
                case "T":
                    yTime = Settings.Design.Timestamp._FONT_SPACE_BORDER_PREVIEW;
                    break;

                case "C":
                    ctx.textBaseline = "middle";
                    yTime = previewHeight / 2;
                    break;

                default:
                    ctx.textBaseline = "bottom";
                    yTime = previewHeight - Settings.Design.Timestamp._FONT_SPACE_BORDER_PREVIEW;
                    break;
            }

            switch(Settings.Design.Timestamp.position[1]) {
                case "L":
                    xTime = Settings.Design.Timestamp._FONT_SPACE_BORDER_PREVIEW;
                    break;

                case "C":
                    ctx.textAlign = "center";
                    xTime = Settings.Grid._COLUMN_WIDTH / 2;
                    break;

                default:
                    ctx.textAlign = "right";
                    xTime = Settings.Grid._COLUMN_WIDTH - Settings.Design.Timestamp._FONT_SPACE_BORDER_PREVIEW;
                    break;
            }

            let r = 1,
                c = 1;

            canvasPreviews.forEach((preview) => {
                let x = (Settings.Grid.space * c) + (Settings.Grid._COLUMN_WIDTH * (c - 1)),
                    y = (Settings.Grid.space * r) + (previewHeight * (r - 1)) + yAbout;

                ctx.save();

                if(Settings.Design.showShadow) {
                    ctx.shadowOffsetX = 1;
                    ctx.shadowOffsetY = 1;
                    ctx.shadowColor = "black";
                    ctx.shadowBlur = "2";
                }

                ctx.drawImage(preview, x, y, Settings.Grid._COLUMN_WIDTH, previewHeight);

                ctx.restore();

                const s = Utils.formatTimestamp(preview.dataset[DATASET_TIMESTAMP], Settings.Design.Timestamp.showMili);

                x += xTime;
                y += yTime;

                if(Settings.Design.Timestamp.showShadow) {
                    ctx.save();

                    ctx.fillStyle = "BLACK";

                    ctx.fillText(s, x + 1, y + 1);

                    ctx.restore();
                }

                ctx.fillText(s, x, y);

                if(++c > Settings.Grid.columns) {
                    c = 1;
                    r++;
                }
            });

            return canvas;
        }

        static unselectAllFromActive() {
            this.unselectAllFrom(UI_Cards.getActive());
        }

        static unselectAllFrom(card) {
            card.querySelectorAll(PREFIX_CLASS + CLASS_SELECTED).forEach((el) => el.classList.remove(CLASS_SELECTED));
        }

        static unselectAll() {
            UI_Cards.getAll().forEach((card) => UI_Cards.unselectAllFrom(card));
        }
    }

    class File {
        static _videosToLoad = 0;
        static _videosLoaded = 0;

        static videos = [];

        static filesAdded(e) {
            Popup.show(Popup.LOADING);

            File.clear();

            const files = [...e.target.files];

            File._videosToLoad = 0;
            File._videosLoaded = 0;
            File.videos = [];

            files.forEach((file) => {
                if(!file.type.includes("video")) {   
                    return;
                }

                const video = document.createElement(TAG_VIDEO);
                    video.dataset[DATASET_INDEX] = File._videosToLoad++;
                    video.dataset[DATASET_NAME] = file.name;
                    video.dataset[DATASET_SIZE] = Utils.formatSize(file.size);

                    video.src = URL.createObjectURL(file);
                    video.muted = true;
                    video.playsInline = true;
                    video.preload = "metadata";
                    video.oncanplay = File._onCanPlay;

                EL_CONTAINER_VIDEOS.appendChild(video);

                video.load()

                File.videos.push(video);
            });
        
            EL_INPUT_SELECT_FILES.value = "";

            if(File._videosToLoad === 0) {
                Popup.hide();
            } else {
                UI_Cards.showNavigation(File._videosToLoad > 1);
            }
        }

        static _onCanPlay() {
            this.play();
            this.pause();

            if(++File._videosLoaded == File._videosToLoad) {
                Render.renderAll();
            }
        }

        static clear() {
            EL_CONTAINER_VIDEOS.innerHTML = "";
        }
    }

    class Render {
        static amountToRender = 0;
        static amountRendered = 0;

        static renderAll() {
            Page.goTo(Page.MAIN, true);
            
            Popup.show(Popup.LOADING);

            let currentIndex = UI_Cards.getActiveIndex();

            if(currentIndex === -1) {
                currentIndex = 0;
            }

            UI_Cards.clear();

            Render.amountToRender = File.videos.length;
            Render.amountRendered = 0;

            File.videos.forEach((video, index) => {
                UI_Cards.add(UI_Cards.createEmptyCard(index));

                Render._render(index);
            });

            UI_Cards.goTo(currentIndex);
        }

        static renderCurrent() {
            Render.amountToRender = 1;
            Render.amountRendered = 0;

            Render._render(UI_Cards.getActiveIndex());
        }

        static async _render(index) {
            const card = UI_Cards.get(index),
                  previousCanvas = card.querySelector(PREFIX_CLASS + CLASS_PREVIEW_FULL);

            if(previousCanvas.dataset[DATASET_GRID] !== Settings.Grid.getGridString()) {
                const previewsContainer = card.querySelector(PREFIX_CLASS + CLASS_PREVIEWS);

                previewsContainer.innerHTML = "";
    
                const canvasPreviews = await Render._getNewPreviews(File.videos[index]);
    
                UI_Cards.createPreviews(canvasPreviews).forEach((preview) => previewsContainer.appendChild(preview));

                previousCanvas.replaceWith(UI_Cards.createFullPreview(canvasPreviews, index));
            } else {
                previousCanvas.replaceWith(UI_Cards.createFullPreview(UI_Cards.getPreviews(), index));
            }

            Render._renderingDone();
        }

        static async _getNewPreviews(video) {
            const amount = (Settings.Grid.rows * Settings.Grid.columns),
                  skipTime = (video.duration / amount) + ((video.duration / amount) / amount);

            const previews = [],
                w = video.videoWidth,
                h = video.videoHeight;

            let i = 0;

            video.currentTime = 0;

            await new Promise((res) => {
                const interval = setInterval(() => {
                    const canvas = document.createElement(TAG_CANVAS);
                          canvas.className = CLASS_PREVIEW;
                          canvas.width = w;
                          canvas.height = h;
                          canvas.dataset[DATASET_TIMESTAMP] = video.currentTime;
        
                    const ctx = canvas.getContext("2d");
        
                    ctx.drawImage(video, 0, 0, w, h);
                    
                    previews.push(canvas);
        
                    if(++i === amount) {
                        res();

                        clearInterval(interval);
                    }

                    video.currentTime += skipTime;
                }, 500);
            });

            return previews;
        }

        static _renderingDone() {
            if(++Render.amountRendered === Render.amountToRender) {
                UI_Cards.refreshPositionIndicator();

                Popup.hide();
            }
        }
    }

    class Page {
        static MAIN = "MAIN";
        static SELECT_FILES = "SELECT_FILES";

        static goTo(id, instantly = false) {
            Popup.hide();
        
            const currentPage = this.getCurrentEl();
        
            if(id !== currentPage.id) {
                const openingPage = document.getElementById(id);
        
                openingPage.classList.add(CLASS_SHOW_IN);
                currentPage.classList.add(CLASS_SHOW_OUT);
        
                setTimeout(() => {
                    currentPage.classList.remove(CLASS_SHOW);
        
                    openingPage.classList.add(CLASS_SHOW);
                    openingPage.classList.remove(CLASS_SHOW_IN);
                    
                    currentPage.classList.remove(CLASS_SHOW_OUT);
                }, instantly ? 0 : 260);
            }
        }
        
        static getCurrentEl() {
            return document.querySelector(PREFIX_CLASS + CLASS_PAGE + PREFIX_CLASS + CLASS_SHOW);
        }
    }

    class Popup {
        static LOADING = "LOADING";

        static getCurrentEl() {
            return document.querySelector(PREFIX_CLASS + CLASS_POPUP + PREFIX_CLASS + CLASS_SHOW) || null;
        }

        static isShowing() {
            return this.getCurrentEl() !== null;
        }

        static show(id) {
            this.hide();

            document.getElementById(id).classList.add(CLASS_SHOW);
        }

        static hide() {
            const popup = this.getCurrentEl();

            if(!popup) {
                return;
            }
                
            popup.classList.remove(CLASS_SHOW);
            
        }
    }
})();