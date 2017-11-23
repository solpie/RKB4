import { loadRes, imgToTex } from "./PixiEx";

class ImgLoader {
    _texMap = {}
    loadTex(url, callback, isCrossOrigin = true) {
        if (url.charAt(0) == '/')
            isCrossOrigin = false
        if (!this._texMap[url]) {
            loadRes(url, (img) => {
                this._texMap[url] = imgToTex(img)
                callback(this._texMap[url])
            }, isCrossOrigin);
        }
        else
            callback(this._texMap[url])
    }

    loadTexArr(urlArr, callback, isCrossOrigin = false) {
        let recur = () => {
            if (urlArr.length)
                this.loadTex(urlArr.pop(), _ => {
                    recur()
                }, isCrossOrigin)
            else
                callback()
        }
        recur()
    }

    getTex(url) {
        return this._texMap[url]
    }
}
export const imgLoader = window['imgLoader'] = new ImgLoader()