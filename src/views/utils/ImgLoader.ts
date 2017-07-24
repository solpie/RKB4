import { loadRes, imgToTex } from "./PixiEx";

class ImgLoader {
    _texMap = {}
    loadTex(url, callback) {
        if (!this._texMap[url]) {
            loadRes(url, (img) => {
                this._texMap[url] = imgToTex(img)
                callback(this._texMap[url])
            }, true);
        }
        else
            callback(this._texMap[url])
    }
}
export const imgLoader = window['imgLoader'] = new ImgLoader()